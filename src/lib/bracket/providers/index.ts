import type { Bracket } from "$lib/models/bracket";

export interface BracketDataProvider {
    getBracket(id: string): Promise<Bracket>;
    saveBracket(bracket: Bracket): Promise<Bracket>;
}

