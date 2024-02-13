import type { Bracket } from "./bracket";

export interface CreateBracketPayload {
    competitors: string[];
    uid: string;
    name: string;
}

export interface CreateBracketResponse {
    message: string;
    count: number;
    bracket: Bracket;
}   