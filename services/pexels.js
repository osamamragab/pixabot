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
};
