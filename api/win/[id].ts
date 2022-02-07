import fs from 'fs';
import path from 'path';

import type { VercelApiHandler } from '@vercel/node';

import { keccak256 } from 'ethereumjs-util';

import { allowCors } from '../cors';

import metadata from '../load_shuffled_metadata';

// load mnemonic from '../../.mnemonic'
// use web3 to sign
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';

const mnemonic = fs.readFileSync(path.join(__dirname, '../../.mnemonic'), 'utf8').trim();
const INFURA_KEY = process.env.INFURA_KEY;

const provider = new HDWalletProvider(mnemonic, `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`);

const web3 = new Web3(provider);

export const hashPokemon = pokemon => keccak256(Buffer.from(JSON.stringify(pokemon))).toString('hex');

// /api/buy/[id]?address=0xyouraddress

// after you win, we sign you three unknown items
// they are not revealed until minted
// you can only buy one of them, nonce becomes invalid after that

// v1 only signs everything we gave to it without any nonce
// v2 will check if the player has won, and will issue tokens only one-by-one using nonce

const handler: VercelApiHandler = async (request, response) => {
    const { id } = request.query;

    // find pokemon by data hash, ignore token id

    // https://vercel.com/docs/serverless-functions/edge-caching#stale-while-revalidate
    // Which tells our CDN: serve from cache, but update it, if requested after 2 seconds.
    response.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate')

    const tokenId = Number(id)
    const pokemon = metadata[tokenId];

    const hash = hashPokemon(pokemon);

    if (!pokemon) {
        response.status(404).send(`No pokemon found`);
        return;
    }

    const [ account ] = await web3.eth.getAccounts();
    const signature = await web3.eth.sign(hash, account);

    const json = JSON.stringify(pokemon);

    // // if tokenId not pokemon index, return 404
    // if (metadata[tokenId] !== pokemon) {
    //     console.log('Token id not pokemon index', tokenId, pokemon, metadata[tokenId]);
    //     response.status(404).send(`No pokemon found for token id ${tokenId}`);
    //     return;
    // }

    return response.status(200).json({
        pokemon,
        json,
        hash,
        signature,
        account,
    });
};

export default allowCors(handler);
