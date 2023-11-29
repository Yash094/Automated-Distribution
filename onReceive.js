import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import cron from "node-cron";
import "dotenv/config";



console.log(
    "Current Time " +
      new Date() +
      " LOG INFO: Script has a started and now will distribute funds everytime there is money sent to the spilt contract!"
  );
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
  contract.events.addEventListener("PaymentReceived", async (event) => {
    // Perform some logic when the event is emitted
    console.log(
      "Current Time " +
        new Date() +
        " LOG INFO: Contract has funds to distribute, function has been triggered"
    );
    const txResult = await contract.distribute();
    console.log(txResult);
  });

  // for token distribution use the distributeToken function
  // const txResult = await contract.distributeToken("{{token_contract_address}}");

  // console the result
}

// schedule a cron job to run daily at mid night at check if the balance is more than 0 if yes distribute the funds
cron.schedule("0 0 0 * * *", async () => {
  await Distribute();
});
