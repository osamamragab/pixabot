import twitter from '../clients/twitter';
import telegram from '../clients/telegram';
import instagram from '../clients/instagram';

export default async (buffer: Buffer, caption: string): Promise<void> => {
  await Promise.all([
    twitter(buffer, caption),
    telegram(buffer, caption),
    instagram(buffer, caption)
  ]);

  console.log('pushed to all');
};
