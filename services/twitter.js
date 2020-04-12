const Twit = require('twit');

const twBot = new Twit({
  consumer_key: process.env.twitterConsumerKey,
  consumer_secret: process.env.twitterConsumerSecret,
  access_token: process.env.twitterAccessToken,
  access_token_secret: process.env.twitterAccessTokenSecret,
  timeout_ms: 60 * 1000,
  strictSSL: true
});

module.exports = (picPath, caption) => {
  return new Promise((resolve, reject) => {
    twBot.postMediaChunked({ file_path: picPath }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      twBot.post(
        'statuses/update',
        {
          status: caption,
          media_ids: [data.media_id_string]
        },
        (err, statusData) => {
          if (err) {
            reject(err);
            return;
          }

          console.log(
            `(twitter): https://twitter.com/${statusData.user.screen_name}/status/${statusData.id_str}`
          );

          resolve(statusData);
        }
      );
    });
  });
};
