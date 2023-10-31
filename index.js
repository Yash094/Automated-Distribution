import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import cron from "node-cron";
import "dotenv/config";

// initiate thirdwebSdk from privatekey
const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.NODE_ENV_PRIVATE_KEY,
  "mumbai",
  {
    clientId: process.env.NODE_ENV_CLIENT_ID, // Use client id if using on the client side, get it from dashboard settings
    secretKey: process.env.NODE_ENV_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings
  }
);

async function Distribute() {
  // get the spilt contract using the getContract function from the sdk
  const contract = await sdk.getContract(
    process.env.NODE_ENV_CONTRACT_ADDRESS,
    "split"
  );

  // check the balance to can check if the spilt contract has any matic in it
  const balance = await contract.balanceOf(process.env.NODE_ENV_WALLET_ADDRESS);

  // for token distribution use the balanceOfToken function to check for the balance of token share
  // const balance = await contract.balanceOfToken("{{recipient_address}}");

  if (balance.toString() > 0) {
    // use contract.distribute to sent out funds if wallet has a share greater than 0
    console.log(
      "Current Time" +
        new Date() +
        " LOG INFO: Contract has funds to distribute, function has been triggered"
    );
    const txResult = await contract.distribute();

    // for token distribution use the distributeToken function
    // const txResult = await contract.distributeToken("{{token_contract_address}}");

    // console the result
    console.log(txResult);
  } else {
    console.log(
      "Current Time" +
        new Date() +
        " LOG INFO: Contract is currently empty: No funds to distribute"
    );
  }
}

// schedule a cron job to run daily at mid night at check if the balance is more than 0 if yes distribute the funds
cron.schedule("0 0 0 * * *", async () => {
  await Distribute();
});
