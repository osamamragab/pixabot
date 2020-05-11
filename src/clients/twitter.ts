import Twit from 'twit';

interface TwitterUploadResponse {
  media_id: number;
  media_id_string: string;
  media_key: string;
  size: number;
  expires_after_secs: number;
  image: {
    image_type: string;
    w: number;
    h: number;
  };
}

interface TwitterUpdateResponse {
  id: number;
  id_str: string;
  text: string;
  source: string;
  user: {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
  };
}

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET
} = process.env;

const tw = new Twit({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
  strictSSL: true
});

export default async (buffer: Buffer, caption: string): Promise<void> => {
  tw.post(
    'media/upload',
    {
      media_data: buffer.toString('base64')
    },
    (err, { media_id_string: mediaId }: TwitterUploadResponse) => {
      if (err) {
        throw err;
      }

      tw.post(
        'statuses/update',
        {
          status: caption,
          media_ids: [mediaId]
        },
        (err, status: TwitterUpdateResponse) => {
          if (err) {
            throw err;
          }

          console.log(
            `(twitter): https://twitter.com/${status.user.screen_name}/status/${status.id_str}`
          );
        }
      );
    }
  );
};
