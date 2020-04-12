const Unsplash = require('unsplash-js');

// for unsplash
global.fetch = require('node-fetch');

const unsplash = new Unsplash.default({
  accessKey: process.env.unsplashAccessKey,
  secretKey: process.env.unsplashSecretKey
});

module.exports = async () => {
  const pic = await unsplash.photos
    .getRandomPhoto({ featured: true, orientation: 'landscape' })
    .then(Unsplash.toJson);

  return {
    id: pic.id,
    width: pic.width,
    height: pic.height,
    urls: {
      original: pic.urls.full,
      medium: pic.urls.regular,
      small: pic.urls.small
    },
    author: {
      id: pic.user.id,
      name: pic.user.name
    }
  };
};
