import type { Bracket } from "./bracket";

export interface CreateBracketPayload<T> {
    competitors: T[];
    uid: string;
    name: string;
}

export interface CreateBracketResponse {
    message: string;
    count: number;
    bracket: Bracket;
}   