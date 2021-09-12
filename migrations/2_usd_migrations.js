const Migrations = artifacts.require("Migrations");
const USDTokenMock = artifacts.require("USDTokenMock");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Migrations, {from: accounts[0]});
  await deployer.deploy(USDTokenMock);

  const tokenMock = await USDTokenMock.deployed()
  // Mint 1,000 Dai Tokens for the deployer
  await tokenMock.mint(
    '0xA693EF241a5fc138E8C79B539401ec3aE6aA2A56',
    '2000000000000000000000'
  )
};