import TelegramBot from 'node-telegram-bot-api';

const { TELEGRAM_TOKEN, TELEGRAM_CHAT } = process.env;

const tg = new TelegramBot(TELEGRAM_TOKEN, {
  polling: true
});

export default async (buffer: Buffer, caption: string): Promise<void> => {
  const msg = await tg.sendPhoto(TELEGRAM_CHAT, buffer, {
    caption
  });

  console.log(
    `(telegram): https://t.me/${msg.chat.username}/${msg.message_id}`
  );
};
