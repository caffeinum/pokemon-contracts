import fs from 'fs';

import { hashPokemon } from './hash_pokemon.mjs';

const metadata = JSON.parse(fs.readFileSync('./_json_metadata/metadata.json', 'utf8'));

const hashed = metadata.map((pokemon, index) => {

    const hash = hashPokemon(pokemon);
    return {
        id: index,
        name: pokemon.name,
        image: pokemon.image,
        hash,
    };
})

// write to hashed.json
fs.writeFileSync('./_json_metadata/hashed.json', JSON.stringify(hashed, null, 2));



