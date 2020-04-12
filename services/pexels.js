const Pexels = require('pexels-api-wrapper');
const fetch = require('node-fetch');

const pexels = new Pexels(process.env.pexelsAPIKey);

module.exports = async () => {
  const pic = await pexels.getCuratedPhotos(
    1,
    Math.floor(Math.random() * 1000) + 1
  ).photos[0];

  return {
    id: pic.id,
    width: pic.width,
    height: pic.height,
    url: pic.url,
    urls: pic.src,
    author: {
      id: pic.photographer_id,
      name: pic.photographer,
      profile: pic.photographer_url
    }
  };

  /*
    // get the author's social media links
    const profileHTML = await fetch(pic.photographer_url, {
      headers: {
        Authorization: process.env.pexelsAPIKey
      }
    }).then(res => res.text());
    return profileHTML;
    const matchTwitterURL = profileHTML.match(
      /data-track-action=\'profile\'\s*data-track-label=\'twitter-link\'\s*href=\'(.+?)\'/i
    );
    const matchInstagramURL = profileHTML.match(
      /data-track-action=\'profile\'\s*data-track-label=\'instagram-link\'\s*href=\'(.+?)\'/i
    );
    const matchWebsiteURL = profileHTML.match(
      /data-track-action=\'user-website\'\s*data-track-label=\'(.+?)\'\s*href=\'(.+?)\'/i
    );

    data.author.twitter = Array.isArray(matchTwitterURL)
      ? matchTwitterURL[1]
      : null;

    data.author.instagram = Array.isArray(matchInstagramURL)
      ? matchInstagramURL[1]
      : null;

    data.author.website = Array.isArray(matchWebsiteURL)
      ? matchWebsiteURL[1]
      : null;
  */
};
