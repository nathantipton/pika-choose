import { AuthStatus } from "$lib/models/auth";
import { writable } from "svelte/store";

export const authStatus = writable<AuthStatus>(AuthStatus.NotInitialized);