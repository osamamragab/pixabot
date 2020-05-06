import axios from 'axios';
import FormData from 'form-data';
import { TELEGRAM_TOKEN, TELEGRAM_CHAT } from '../utils/config';

interface TelegramAPIMessage {
  message_id: number;
  chat: {
    id: number;
    title: string;
    username: string;
    invite_link: string;
    type: 'private' | 'group' | 'supergroup' | 'channel';
  };
}

const sendPhotoURL: string = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`;

export default async (buffer: Buffer, caption: string): Promise<void> => {
  const form = new FormData();

  form.append('chat_id', TELEGRAM_CHAT);
  form.append('caption', caption);
  form.append('photo', buffer);

  const { data: msg } = await axios.post<TelegramAPIMessage>(
    sendPhotoURL,
    form,
    {
      headers: form.getHeaders()
    }
  );

  console.log(
    `(telegram): https://t.me/${msg.chat.username}/${msg.message_id}`
  );
};
