import { keccak256 } from 'ethereumjs-util';

export const hashPokemon = pokemon => keccak256(Buffer.from(JSON.stringify(pokemon))).toString('hex');
