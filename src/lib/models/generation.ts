export interface GenerationDTO {
    name: string;
    id: number;
    pokemon_species: PokemonSpecies[];
}

export interface PokemonSpecies {
    name: string;
    id: number;
}