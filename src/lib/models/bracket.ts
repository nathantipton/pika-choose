
export interface Bracket {
    id: string | null;
    competitors: Competitor[];
    matches: { [key: string]: Match };
    status: BracketStatus;
    numberOfRounds: number;
    numberOfMatches: number;
    numberOfCompletedMatches: number;
    name: string;
    currentMatchId: string | null;
    winner: string | null;
};

export interface Match {
    id: string;
    slug: string;
    competitor1: string | number | null;
    competitor2: string | number | null;
    winner: string | number | null;
    isBye: boolean;
    round: number;
    match: number;
    status: MatchStatus;
    nextMatchId: string | null;
    winnerGoesTo: string | null;
    isFinal: boolean;
};

export enum BracketStatus {
    NotStarted,
    InProgress,
    Complete
};

export enum MatchStatus {
    NotStarted,
    InProgress,
    Complete
};

export interface Competitor {
    id: number | null;
    name: string;
    photoUrl: string;
    seed?: number;
}