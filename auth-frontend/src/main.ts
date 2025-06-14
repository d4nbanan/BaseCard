import { createAppKit } from '@reown/appkit';
import { AppKitNetwork, base } from '@reown/appkit/networks';
import { siweConfig } from './auth';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';

// 2. Create your application's metadata object
const metadata = {
  name: 'BaseCard',
  description: 'BaseCard description',
  url: 'http://localhost:5173/', // origin must match your domain & subdomain
  icons: [ 'https://avatars.githubusercontent.com/u/179229932' ],
};

const main = async () => {
  if(document.location.pathname !== '/verify') {
    return;
  }
  const modal = createAppKit({
    adapters: [ new EthersAdapter() ],
    networks: [ base as AppKitNetwork ],

    metadata,
    projectId: 'bee068f1ea9ab07f2e4a15ca7ed0e38d',
    features: {
      email: false,
      socials: [],
      emailShowWallets: false,
      analytics: true, // Optional - defaults to your Cloud configuration
    },
    siweConfig,
  });

  const params = new URLSearchParams(window.location.search);
  const paramValue = params.get('type');
  if(paramValue === 'auth') {
    modal.open();
  }

  modal.subscribeState(() => {
    const address = modal.getAddress();
    if(modal.getAddress()) {
      return document.location.href = `https://basecard.io/login?address=${address}`;
    }
  });
}

main();