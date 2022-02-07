import type { VercelApiHandler } from '@vercel/node';

import { keccak256 } from 'ethereumjs-util';
import { allowCors } from '../cors';

import metadata from '../load_shuffled_metadata';

export const hashPokemon = pokemon => keccak256(Buffer.from(JSON.stringify(pokemon))).toString('hex');


// /api/token/[id]?data=0xhasheddata
const handler: VercelApiHandler = async (request, response) => {
    const { id, data } = request.query;

    // find pokemon by data hash, ignore token id

    const pokemon = metadata.find((pokemon) => {
        const hash = hashPokemon(pokemon);
        return hash === data;
    });

    // https://vercel.com/docs/serverless-functions/edge-caching#stale-while-revalidate
    // Which tells our CDN: serve from cache, but update it, if requested after 2 seconds.
    response.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate')

    const tokenId = Number(id)

    if (!!data && data !== '0x0000000000000000000000000000000000000000000000000000000000000000' && !pokemon) {
        response.status(404).send(`No pokemon found for hash ${data}`);
        return;
    }

    // // if tokenId not pokemon index, return 404
    // IGNORE FOR NOW
    if (!!data && data !== '0x0000000000000000000000000000000000000000000000000000000000000000' && metadata[tokenId] !== pokemon) {
        console.log('Token id not pokemon index', tokenId, pokemon, metadata[tokenId]);
        response.status(404).send(`No pokemon found for token id ${tokenId}`);
        return;
    }

    return response.status(200).json({
        name: 'Pokemon DAO',
        image: 'https://raw.githubusercontent.com/vercel/vercel/master/examples/api/public/pokemon.png',
        ...pokemon,
        ...metadata[tokenId],
        // // attributes: [
        // ]
    });
};

export default allowCors(handler);
