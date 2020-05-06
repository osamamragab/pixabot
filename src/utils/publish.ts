import twitter from '../lib/twitter';
import telegram from '../lib/telegram';
import instagram from '../lib/instagram';

export default async (buffer: Buffer, caption: string): Promise<void> => {
  await Promise.all([
    twitter(buffer, caption),
    telegram(buffer, caption),
    instagram(buffer, caption)
  ]);

  console.log('pushed to all');
};
