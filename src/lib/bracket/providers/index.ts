import type { Bracket } from "$lib/models/bracket";

export interface BracketDataProvider {
    getBracketSubscription(id: string, uid: string, onNext: (data: Partial<Bracket>, id: string) => void): () => void;
    saveBracket(update: Partial<Bracket>, id: string, uid: string): Promise<void>;
    getUserBracketsInProgress(userId: string): Promise<Bracket[]>;
    incrementCompletedMatches(id: string, uid: string): Promise<void>;
}

