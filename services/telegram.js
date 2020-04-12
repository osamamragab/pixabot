const TelegramBot = require('node-telegram-bot-api');

const tgBot = new TelegramBot(process.env.telegramToken);

module.exports = async (picPath, caption) => {
  const tgMsg = await tgBot.sendPhoto(process.env.telegramChat, picPath, {
    caption
  });

  console.log(
    `(telegram): https://t.me/${tgMsg.chat.username}/${tgMsg.message_id}`
  );

  return tgMsg;
};
