import fs from 'fs';
import path from 'path';
import type { VercelApiHandler } from '@vercel/node';

import { allowCors } from '../_cors';

const metadata = JSON.parse(fs.readFileSync(path.join(__dirname, '../../_json_metadata/pokemon_metadata.json'), 'utf8'));

// /api/token/[id]?data=0xhasheddata
const handler: VercelApiHandler = async (request, response) => {
    const { id, data } = request.query;

    // https://vercel.com/docs/serverless-functions/edge-caching#stale-while-revalidate
    // Which tells our CDN: serve from cache, but update it, if requested after 2 seconds.
    response.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate')

    const tokenId = Number(id)

    return response.status(200).json({
        name: 'Pokemon DAO',
        image: 'https://raw.githubusercontent.com/vercel/vercel/master/examples/api/public/pokemon.png',
        token: metadata[tokenId],
        attributes: [
        ]
    });
};

export default allowCors(handler);
