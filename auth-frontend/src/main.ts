import { createAppKit } from '@reown/appkit';
import { AppKitNetwork, base } from '@reown/appkit/networks';
import { siweConfig } from './auth';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';

const metadata = {
  name: 'BaseCard',
  description: 'BaseCard description',
  url: 'https://auth.basecard.io',
  icons: [ 'https://avatars.githubusercontent.com/u/179229932' ],
};

const main = async () => {
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

  modal.open();

  modal.subscribeState(() => {
    const address = modal.getAddress();
    if(modal.getAddress()) {
      return document.location.href = `https://basecard.io/login?address=${address}`;
    }
  });
}

main();