const PokemonExtension = artifacts.require("PokemonExtension");

const ADMIN = '0xffE06cb4807917bd79382981f23d16A70C102c3B';

module.exports = async function (deployer) {
  // https://polygonscan.com/address/0x8eb626335f2303adcd7c32c32ef4bd1e1b2957ec
  const NFT_ADDRESS = '0x082b3c4ee12471254c578dae7ad3a996c8840198';

  await deployer.deploy(PokemonExtension, NFT_ADDRESS);

  const e = await PokemonExtension.deployed();

  const tx = await e.transferOwnership(ADMIN);

  console.log(tx.logs[0].args);

  console.log('address', e.address);

};
