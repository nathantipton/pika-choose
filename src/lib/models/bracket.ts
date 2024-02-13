
export interface Bracket {
    id: string | null;
    competitors: string[];
    matches: Match[];
    status: BracketStatus;
    numberOfRounds: number;
    numberOfMatches: number;
    name: string;
};

export interface Match {
    id: string;
    slug: string;
    competitor1: string | null;
    competitor2: string | null;
    winner: string | null;
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
    id: string | null;
    name: string;
    photoUrl: string;
    seed?: number;
}