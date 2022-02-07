import fs from 'fs';

import { hashPokemon } from './hash_pokemon.mjs';
import { shuffle } from './shuffle.mjs';

const dataDir = process.argv[2] || './data';

const _metadata = JSON.parse(fs.readFileSync(`${dataDir}/metadata.json`));

const metadata = shuffle(_metadata, process.env.SHUFFLE_SEED);

const hashed = metadata.map((pokemon, index) => {
    const hash = hashPokemon(pokemon);

    return {
        id: index,
        name: pokemon.name,
        image: pokemon.image,
        hash,
    };
})

// write the hashed data to a file
fs.writeFileSync(`${dataDir}/_metadata.json`, JSON.stringify(hashed, null, 2));

