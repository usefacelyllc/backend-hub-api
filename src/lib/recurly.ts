import recurly from 'recurly';

if (!process.env.RECURLY_PRIVATE_KEY) {
  throw new Error('RECURLY_PRIVATE_KEY is not defined');
}

export const client = new recurly.Client(process.env.RECURLY_PRIVATE_KEY);
