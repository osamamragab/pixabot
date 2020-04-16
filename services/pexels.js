const Pexels = require('pexels-api-wrapper');

const pexels = new Pexels(process.env.pexelsAPIKey);

module.exports = async () => {
  const pic = await pexels.getCuratedPhotos(
    1,
    Math.floor(Math.random() * 1000) + 1
  ).photos[0];

  return {
    id: pic.id,
    platform: 'Pexels',
    width: pic.width,
    height: pic.height,
    urls: {
      original: pic.src.original,
      medium: pic.src.medium,
      small: pic.small
    },
    author: {
      id: pic.photographer_id,
      name: pic.photographer
    }
  };
};
