const unsplash = require('../services/unsplash');
const pexels = require('../services/pexels');

let lastFrom = '';

module.exports = async () => {
  switch (lastFrom) {
    case 'unsplash':
      lastFrom = 'pexels';
      return pexels();

    case 'pexels':
    default:
      lastFrom = 'unsplash';
      return unsplash();
  }
};
