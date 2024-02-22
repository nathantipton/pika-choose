import { PUBLIC_DOMAIN, PUBLIC_STATIC_FIREBASE_CONFIG } from "$env/static/public";
import { derived, writable, type Readable } from "svelte/store";

import { browser } from "$app/environment";
import { invalidateAll } from "$app/navigation";
import { AuthStatus } from "$lib/models/auth";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import type { User } from "firebase/auth";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import { Timestamp, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = JSON.parse(PUBLIC_STATIC_FIREBASE_CONFIG);

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
export const authStatus = writable<AuthStatus>(AuthStatus.NotInitialized);
export const authUpdated = derived(authStatus, ($authStatus) => $authStatus !== AuthStatus.NotInitialized);
export const analytics = browser ? getAnalytics() : null;

export const magicLinkActionCodeSettings = {
    url: `${PUBLIC_DOMAIN}/sign-in/magic-link`,
    handleCodeInApp: true
};

export interface UserData {
    displayName: string;
    photoURL: string;
    username: string;
}

export async function setToken(token: string) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ token }),
    };

    await fetch('/api/token', options);

}


export function docStore<T>(
    path: string,
) {
    let unsubscribe: () => void;

    const docRef = doc(firestore, path);

    const { subscribe } = writable<T | null>(null, (set) => {
        unsubscribe = onSnapshot(docRef, (snapshot) => {
            set((snapshot.data() as T) ?? null);
        });

        return () => unsubscribe();
    });

    return {
        subscribe,
        ref: docRef,
        id: docRef.id,
    };
}



function userStore() {
    let unsubscribe: () => void;

    if (!auth || !globalThis.window) {
        console.warn('Auth is not initialized or not in browser');
        const { subscribe } = writable<User | null>(null);
        return {
            subscribe,
        }
    }

    const { subscribe } = writable(auth?.currentUser ?? null, (set) => {

        unsubscribe = onIdTokenChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                await setToken(token);
                authStatus.set(AuthStatus.Authenticated);

            } else {
                await setToken('');
                authStatus.set(AuthStatus.Unauthenticated);
            }
            await invalidateAll();
            set(user);

        });

        return () => unsubscribe();
    });

    return {
        subscribe,
    };
}

export const user = userStore();

export const userData: Readable<UserData | null> = derived(user, ($user, set) => {
    if ($user) {
        return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null);
    }
});


export interface BaseFirestoreDocument {
    id?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    createdBy?: string;
    updatedBy?: string;
}