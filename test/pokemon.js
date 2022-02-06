const pokemon = artifacts.require("pokemon");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("pokemon", function (/* accounts */) {
  it("should assert true", async function () {
    await pokemon.deployed();
    return assert.isTrue(true);
  });
});
