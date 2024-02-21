import type { FetchFunction } from "./helpers";

export class PokeAPI {

    #fetch: FetchFunction;
    #baseUrl = "https://beta.pokeapi.co/graphql/v1beta";
    #headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    constructor(fetch: FetchFunction) {
        this.#fetch = fetch;
    }


    async query(query: string) {
        const response = await this.#fetch(this.#baseUrl, {
            method: 'POST',
            headers: this.#headers,
            body: JSON.stringify({ query })
        });

        const { data } = await response.json();
        return data;
    }

    getImageString(id: number) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    }
}