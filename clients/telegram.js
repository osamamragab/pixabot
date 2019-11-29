const config = require('../config');
const logger = require('../lib/logger');

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.telegram.token, { polling: true });

module.exports = (pic, picPath, caption) => {
  bot
    .sendPhoto(config.telegram.channel, picPath, { caption })
    .then(msg => logger('success', `(telegram@${pic.id}): success!`))
    .catch(err => logger('error', err));
};
