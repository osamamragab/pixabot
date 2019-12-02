'use strict';

const config = require('../config');
const logger = require('../lib/logger');

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.telegram.token, { polling: true });

module.exports = (pic, picPath, caption) => {
  bot
    .sendPhoto(config.telegram.chat, picPath, { caption })
    .then(msg => logger('success', `(telegram#${pic.id}): https://t.me/${msg.chat.username}/${msg.message_id}`))
    .catch(err => logger('error', err));
};
