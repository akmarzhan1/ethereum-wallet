const Migrations = artifacts.require("Migrations");
const DaiTokenMock = artifacts.require("DaiTokenMock");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Migrations, {from: accounts[0]});
  await deployer.deploy(DaiTokenMock);

  const tokenMock = await DaiTokenMock.deployed()
  // Mint 1,000 Dai Tokens for the deployer
  await tokenMock.mint(
    '0xA693EF241a5fc138E8C79B539401ec3aE6aA2A56',
    '1000000000000000000000'
  )
};