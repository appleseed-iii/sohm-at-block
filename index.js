// import { fetchData } from './query';
const { ethers } = require("ethers");
const EthDater = require("ethereum-block-by-date");
require("dotenv").config()

async function main() {
  // something like:
  // node index.js "2022-01-27T16:12:00+00:00"
  // const dateString = "2022-01-27T16:12:00+00:00"
  const dateString = process.argv.slice(2);
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  const dater = new EthDater(
      provider // Ethers provider, required.
  );
  let block = await dater.getDate(
    dateString, // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
    true, // Block after, optional. Search for the nearest block before or after the given date. By default true.
    false // Refresh boundaries, optional. Recheck the latest block before request. By default false.
  );
  const blockNumber = block.block
  
  const abi = [
    // Read-Only Functions
    "function index() public view returns (uint)"
  ];
  // using sOHM since it's been around...
  // const sohm = "0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f";
  
  const stakingAddress = "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a";
  const staking = new ethers.Contract(stakingAddress, abi, provider);

  const indexAtBlock = await staking.index({ blockTag: blockNumber })
  const formattedIndex = ethers.utils.formatUnits(indexAtBlock, 9)

  // OUTPUTS
  console.log("block", blockNumber, dateString)
  console.log("index", indexAtBlock)
  console.log("USE THIS", formattedIndex)
}

main();