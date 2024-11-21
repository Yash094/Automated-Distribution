import { createThirdwebClient, getContract, sendTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { distribute } from "thirdweb/extensions/split";
import { privateKeyToAccount, getWalletBalance } from "thirdweb/wallets";
import cron from "node-cron";
import "dotenv/config";

console.log(
  "Current Time " +
  new Date() +
  " LOG INFO: Script has a started and now will run everyday at midnight at distribute funds!"
);

// set chainid and contract addresss
const chainId = 43113;
const contractAddress = "CONTRACT_ADDRESS_GOES_HERE";


const client = createThirdwebClient({
  clientId: process.env.NODE_ENV_CLIENT_ID,
})
const account = privateKeyToAccount({
  client,
  privateKey: process.env.NODE_ENV_PRIVATE_KEY
})
const chain = defineChain(chainId) // ypur chain id goes here
async function Distribute() {
  const contract = getContract({
    client,
    chain,
    address: contractAddress
  })

  const balance = await getWalletBalance({ address: contract.address, client, chain })
  

  if (balance.displayValue.toString() > 0) {
    console.log(
      "Current Time" +
      new Date() +
      "\n LOG INFO: Contract has funds to distribute, function has been triggered\n"
    );
    const transaction = distribute({
      contract
    });

    let txResult = await sendTransaction({ transaction, account });


    console.log(txResult.transactionHash);
  } else {
    console.log(
      "Current Time" +
      new Date() +
      "\n LOG INFO: Contract is currently empty: No funds to distribute\n"
    );
  }
}

// schedule a cron job to run daily at mid night at check if the balance is more than 0 if yes distribute the funds
cron.schedule("0 0 0 * * *", async () => {
  await Distribute();
});
