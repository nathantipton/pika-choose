import type { Bracket } from "$lib/models/bracket";
import type { BracketDataProvider } from ".";

export class FirestoreBracketDataProvider implements BracketDataProvider {
    getBracket(id: string): Promise<Bracket> {
        throw new Error("Method not implemented.");
    }
    saveBracket(bracket: Bracket): Promise<Bracket> {
        throw new Error("Method not implemented.");
    }
}