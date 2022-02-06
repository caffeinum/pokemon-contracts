const PokemonExtension = artifacts.require("PokemonExtension");

const ADMIN = '0xffE06cb4807917bd79382981f23d16A70C102c3B';

module.exports = function (deployer) {
  // https://polygonscan.com/address/0x8eb626335f2303adcd7c32c32ef4bd1e1b2957ec
  const NFT_ADDRESS = '0x8eb626335f2303AdCd7C32C32ef4BD1E1b2957EC';

  deployer.deploy(PokemonExtension, NFT_ADDRESS);

  const e = await PokemonExtension.deployed();

  const tx = await e.transferOwnership(ADMIN);

  console.log(tx.logs[0].args);

};
