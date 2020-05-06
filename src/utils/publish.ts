import twitter from '../lib/twitter';
import telegram from '../lib/telegram';
import instagram from '../lib/instagram';

export default async (buffer: Buffer, caption: string): Promise<void> => {
  await twitter(buffer, caption);
  await telegram(buffer, caption);
  await instagram(buffer, caption);

  console.log('pushed to all');
};
