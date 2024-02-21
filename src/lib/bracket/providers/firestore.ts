import { BracketStatus, type Bracket } from "$lib/models/bracket";
import { collection, doc, getDocs, increment, onSnapshot, query, updateDoc, where, type Firestore } from "firebase/firestore";
import type { BracketDataProvider } from ".";

export class FirestoreBracketDataProvider implements BracketDataProvider {

    #db: Firestore;

    constructor(db: Firestore) {
        this.#db = db;
    }

    /**
     * Get a realtime user's bracket by id
     * @param id 
     * @param uid 
     * @param onNext runs when the bracket changes
     * @returns an unsubscribe function to stop listening to the bracket
     */
    getBracketSubscription(id: string, uid: string, onNext: (data: Partial<Bracket>, id: string) => void): () => void {
        const path = `user-brackets/${uid}/brackets/${id}`;
        const docRef = doc(this.#db, path);
        return onSnapshot(docRef, (snapshot) => {
            onNext(snapshot.data() as Partial<Bracket>, snapshot.id);
        });
    }

    async saveBracket(update: Partial<Bracket>, id: string, uid: string): Promise<void> {
        const path = `user-brackets/${uid}/brackets/${id}`;
        const docRef = doc(this.#db, path);

        await updateDoc(docRef, update as Partial<Bracket>);
    }

    async getUserBracketsInProgress(userId: string): Promise<Bracket[]> {
        const path = `user-brackets/${userId}/brackets`;
        const colRef = collection(this.#db, path);
        const q = query(colRef, where("status", "==", BracketStatus.InProgress));
        const querySnapshot = await getDocs(q);
        console.log("querySnapshot", querySnapshot);
        const brackets: Bracket[] = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            brackets.push({ ...doc.data(), id: doc.id } as Bracket);
        });

        return brackets;
    }

    async incrementCompletedMatches(id: string, uid: string): Promise<void> {
        const path = `user-brackets/${uid}/brackets/${id}`;
        const docRef = doc(this.#db, path);
        await updateDoc(docRef, { numberOfCompletedMatches: increment(1) });
    }
}