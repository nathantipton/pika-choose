import { BracketStatus, MatchStatus, type Bracket, type Competitor, type Match } from "$lib/models/bracket";
import { writable } from "svelte/store";
import type { BracketDataProvider } from "./providers";

export class BracketService {
    private _bracket: Bracket | null = null;
    bracketStore = writable<Bracket | null>(null);
    #data: BracketDataProvider;
    #uid: string;
    #bracketId: string;
    #unsubscribe: () => void;

    constructor(data: BracketDataProvider, uid: string, bracketId: string) {
        this.#data = data;
        this.#uid = uid;
        this.#bracketId = bracketId;

        this.#unsubscribe = data.getBracketSubscription(bracketId, uid, (data, id) => {
            this._bracket = { ...data, id } as Bracket;
            this.bracketStore.set(this._bracket);
            console.log("Bracket updated", this._bracket)
        });
    }

    get bracket() {
        return this._bracket;
    }

    unsubscribe() {
        this.#unsubscribe();
    }

    async beginBracket() {
        await this.#data.saveBracket({ status: BracketStatus.InProgress }, this.#bracketId, this.#uid);
    }

    getCompetitorById(id: string): Competitor | null {
        return this._bracket?.competitors.find(c => c.id?.toString() === id) ?? null;
    }

    async setMatchWinner(match: Match, winner: string) {
        if (!this._bracket) {
            return;
        }

        const updatedMatches = { ...this._bracket.matches };
        const updatedMatch = { ...match, winner, status: MatchStatus.Complete };
        updatedMatches[match.id] = updatedMatch;

        if (match.isFinal) {
            await this.#data.saveBracket({ matches: updatedMatches, winner, status: BracketStatus.Complete }, this.#bracketId, this.#uid);
            return;
        }

        // Move the winner to the winner goes to match
        if (!match.winnerGoesTo) return;
        const winnerGoesToMatch = updatedMatches[match.winnerGoesTo];
        if (winnerGoesToMatch.competitor1 === null) {
            winnerGoesToMatch.competitor1 = winner;
        } else if (winnerGoesToMatch.competitor2 === null) {
            winnerGoesToMatch.competitor2 = winner;
        }

        // Update the brackets current match id with the next match id if it exists and the match is not complete
        let nextMatchId: string | null = null;
        while (nextMatchId === null) {
            if (!match?.nextMatchId) break;
            const nextMatch: Match = updatedMatches[match.nextMatchId];
            if (nextMatch && nextMatch.status !== MatchStatus.Complete) {
                nextMatchId = nextMatch.id;
            } else {
                ``;
                match = nextMatch;
            }
        }
        this._bracket.currentMatchId = nextMatchId;

        await this.#data.saveBracket({ matches: updatedMatches, currentMatchId: nextMatchId, status: this._bracket.status }, this.#bracketId, this.#uid);
        await this.#data.incrementCompletedMatches(this.#bracketId, this.#uid);
    }

}


// bracket creation logic
// TODO: clean up this function

export const createBracket = async (competitors: Competitor[], name: string): Promise<Bracket> => {
    const matches: Match[] = [];

    const totalTeams = competitors.length;
    const rounds = Math.ceil(Math.log2(totalTeams));
    const totalMatches = Math.pow(2, rounds) - 1;
    const maxTeams = Math.pow(2, rounds);

    // If the number of teams is not a power of 2, add byes to the teams array in the form of nulls.
    const teamsForBracket = reorderTeamsForMatchups(
        competitors.map(c => c.id?.toString() || null).concat(Array(maxTeams - totalTeams).fill(null)),
        rounds
    );

    // Variables to keep track of the current round and the number of matches in the current round.
    let currentRound = 1;
    let matchesInCurrentRound = Math.pow(2, rounds - currentRound);
    let matchCounter = 0; // Counter for matches to know when to transition to the next round.

    for (let i = 0; i < totalMatches; i++) {
        // Increment round number and reset counter when the current round's match count is exceeded.
        if (matchCounter === matchesInCurrentRound) {
            currentRound++;
            matchesInCurrentRound = Math.pow(2, rounds - currentRound);
            matchCounter = 0; // Reset match counter for the new round.
        }

        let competitor1 = null;
        let competitor2 = null;
        // If first round, assign competitors to matches.
        if (currentRound === 1) {
            competitor1 = teamsForBracket[i * 2] || null;
            competitor2 = teamsForBracket[i * 2 + 1] || null;
        }

        const isFinal = i === totalMatches - 1;

        const match: Match = {
            id: `match-${i + 1}`,
            competitor1,
            competitor2,
            winner: null,
            round: currentRound,
            match: matchCounter + 1,
            status: 0,
            nextMatchId: isFinal ? null : `match-${i + 2}`,
            winnerGoesTo: null,
            isBye: (competitor1 === null || competitor2 === null) && currentRound === 1 ? true : false,
            slug: `round-${currentRound}-match-${matchCounter + 1}`,
            isFinal
        };
        matches.push(match);
        matchCounter++;
    }

    mapWinnersToNextMatch(matches);

    handleByes(matches);

    const bracket: Bracket = {
        id: null,
        name: name,
        competitors: competitors,
        status: 0,
        matches: matchesArrayToObject(matches),
        numberOfRounds: rounds,
        numberOfMatches: competitors.length - 1,
        numberOfCompletedMatches: 0,
        currentMatchId: getCurrentMatchId(matches),
        winner: null
    };

    return bracket;
};

function matchesArrayToObject(matches: Match[]): { [key: string]: Match } {
    const matchesObject: { [key: string]: Match } = {};
    for (let match of matches) {
        matchesObject[match.id] = match;
    }
    return matchesObject;
}

function reorderTeamsForMatchups(
    teams: (string | null)[],
    levels: number,
    counter: number = 1
): (string | null)[] {
    // Base case: If the list cannot be meaningfully split further or counter exceeds levels.
    if (teams.length <= 1 || counter > levels) {
        return teams;
    }

    // Split the teams into two groups alternately, including handling nulls.
    const splitResult = split(teams);
    const leftHalf = splitResult[0];
    const rightHalf = splitResult[1];

    // Recursively split and arrange each half, taking care to pass nulls through the recursion.
    const arrangedLeft = reorderTeamsForMatchups(leftHalf, levels, counter + 1);
    const arrangedRight = reorderTeamsForMatchups(rightHalf, levels, counter + 1);

    // Interleave the two halves to ensure high vs. low matchups, including handling nulls correctly.
    const combinedTeams =
        counter === levels
            ? interleave(arrangedLeft, arrangedRight.reverse())
            : [...arrangedLeft, ...arrangedRight];

    // Return the combined teams array directly without additional flattening,
    // since the structure should already be flat based on the recursive logic.
    return combinedTeams;
}

function split(teams: (string | null)[]): (string | null)[][] {
    let result: (string | null)[][] = [[], []];
    let counter = 1;
    let arrayIndex = 0;

    for (let i = 0; i < teams.length; i++) {
        result[arrayIndex].push(teams[i]);
        counter++;
        if (counter === 2) {
            counter = 0;
            arrayIndex = arrayIndex === 0 ? 1 : 0;
        }
    }

    return result;
}

function interleave(left: (string | null)[], right: (string | null)[]): (string | null)[] {
    const result: (string | null)[] = [];
    const maxLength = Math.max(left.length, right.length);

    for (let i = 0; i < maxLength; i++) {
        if (i < left.length) {
            result.push(left[i]);
        }
        if (i < right.length) {
            result.push(right[i]);
        }
    }

    return result;
}

function mapWinnersToNextMatch(matches: Match[]) {
    for (let match of matches) {
        if (match.isFinal) {
            continue;
        }
        const nextMatch = matches.find(m => m.round === match.round + 1 && m.match === Math.ceil(match.match / 2));
        if (nextMatch) {
            match.winnerGoesTo = nextMatch.id;
        }
    }
}

function handleByes(matches: Match[]) {

    for (let match of matches) {
        if (match.isBye) {
            match.winner = match.competitor1 ? match.competitor1 : match.competitor2;
            match.status = MatchStatus.Complete;

            const winnerGoesToMatch = matches.find(m => m.id === match.winnerGoesTo);

            if (winnerGoesToMatch) {
                if (winnerGoesToMatch.competitor1 === null) {
                    winnerGoesToMatch.competitor1 = match.winner;
                } else {
                    winnerGoesToMatch.competitor2 = match.winner;
                }
            }
        }
    }

}

function getCurrentMatchId(matches: Match[]): string | null {
    return matches.find(m => m.status === MatchStatus.NotStarted)?.id ?? null;
}