const fs = require('fs');
const path = require('path');

const config = require('../config');
const logger = require('../lib/logger');

const Unsplash = require('unsplash-js');
const fetch = require('node-fetch');
global.fetch = fetch;

const unsplash = new Unsplash.default(config.unsplash);

let tmpPath = path.join(__dirname, '..', 'data');

if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath);

const Pic = {};

Pic.get = async id => await unsplash.photos.getPhoto(id).then(Unsplash.toJson);

Pic.random = async () => {
  let pic = await unsplash.photos.getRandomPhoto({ orientation: 'landscape' }).then(Unsplash.toJson);
  if (!pic) return logger('error', 'unsplash api error');
  return pic;
};

Pic.download = async pic => {
  pic = pic || await Pic.random();
  if (!pic) return logger('error', 'unsplash api error');


  // filter
  if (pic.description && pic.description.match(/boy|girl|man|woman|men|women|human|face|model|people|sexy|bikini|lips|kiss|rose|fashion|underwear|lingerie|sensual|dress/gi)) pic = await Pic.random();

  let body = await fetch(pic.urls.regular).then(res => res.buffer());
  if (!body) return logger('error', `empty body, id: ${pic.id}, url: ${pic.urls}}`);

  await unsplash.photos.downloadPhoto(pic);

  let picPath = path.join(tmpPath, `pic-${pic.id}.jpg`);

  fs.writeFileSync(picPath, body, 'binary');

  return { pic, picPath };
};

module.exports = Pic;
