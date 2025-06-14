import {
  createSIWEConfig,
  formatMessage,
  type SIWECreateMessageArgs,
  type SIWESession,
  type SIWEVerifyMessageArgs,
} from '@reown/appkit-siwe';

const BASE_URL = 'https://api.basecard.io';

/* Function that returns the user's session - this should come from your SIWE backend */
async function getSession() {
  const res = await fetch(BASE_URL + '/auth', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data = (await res.json()) as Record<string, any>;

  const isValidData =
    typeof data === 'object' &&3
    typeof data.address === 'string'

  return isValidData ? (data as SIWESession) : null;
}

/* Use your SIWE server to verify if the message and the signature are valid */
const verifyMessage = async ({ message, signature }: SIWEVerifyMessageArgs) => {
  try {
    const response = await fetch(BASE_URL + '/auth/verify', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ message, signature }),
      credentials: 'include',
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as Record<string, unknown>;
    return !!result;
  } catch {
    return false;
  }
};

// Check the full example for signOut and getNonce functions ...

/* Create a SIWE configuration object */
export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: window.location.host,
    uri: window.location.origin,
    chains: [8453],
    statement: 'Please sign with your account (BaseCARD)',
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),

  getNonce: async () => {
    const response = await fetch(BASE_URL + '/auth/nonce');

    return response.text();
  },
  getSession,
  verifyMessage,
  signOut: async () => {
    //Example
    // Implement your Sign out function

    return true;
  },
});
