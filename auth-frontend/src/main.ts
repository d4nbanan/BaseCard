// import { IntMaxClient } from 'intmax2-client-sdk';
// import { Buffer } from 'buffer';
//
// globalThis.Buffer = Buffer;
//
// const main = async () => {
//   const intMaxClient = await IntMaxClient.init({
//     environment: 'testnet', //  'mainnet' | 'devnet' | 'testnet'
//   });
//
//   console.log('1');
//   await intMaxClient.login();
//   console.log('2');
//   const address = intMaxClient.address;
//   const privateKey = await intMaxClient.getPrivateKey();
//
//   console.log(address);
//   console.log(privateKey);
//
//   console.log(await intMaxClient.fetchTokenBalances());
//
//   const message = '0x1234';
//   const signature = await intMaxClient.signMessage(message);
//
//   const isVerified = await intMaxClient.verifySignature(signature, message);
//   console.log(isVerified); // true
// };
//
// main();
// 1. Get projectId from https://cloud.reown.com
import { createAppKit } from '@reown/appkit';
import { AppKitNetwork, base } from '@reown/appkit/networks';
import { siweConfig } from './auth';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';


// 1. Get projectId from https://cloud.reown.com
const projectId = 'bee068f1ea9ab07f2e4a15ca7ed0e38d';

// 2. Create your application's metadata object
const metadata = {
  name: 'BaseCard',
  description: 'BaseCard description',
  url: 'http://localhost:5173/', // origin must match your domain & subdomain
  icons: [ 'https://avatars.githubusercontent.com/u/179229932' ],
};

// 3. Create a AppKit instance
const modal = createAppKit({
  adapters: [ new EthersAdapter() ],
  networks: [ base as AppKitNetwork ],
  
  metadata,
  projectId,
  features: {
    email: false,
    socials: [],
    emailShowWallets: false,
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  siweConfig,
});

modal.open();

// Trigger modal programaticaly
// Add this code inside `main.js` file at the end of the code file
// const openConnectModalBtn = document.getElementById('open-connect-modal');
// const openNetworkModalBtn = document.getElementById('open-network-modal');
//
// openConnectModalBtn.addEventListener('click', () => modal.open());
// openNetworkModalBtn.addEventListener('click', () =>
//   modal.open({ view: 'Networks' }),
// );
