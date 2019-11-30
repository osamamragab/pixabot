const fs = require('fs');
const path = require('path');

const config = require('../config');
const logger = require('../lib/logger');

const Unsplash = require('unsplash-js');

const fetch = require('node-fetch');
global.fetch = fetch;

const unsplash = new Unsplash.default(config.unsplash.auth);

let dataPath     = path.join(__dirname, '..', 'data');
let tmpPicsPath  = path.join(dataPath, 'tmp');
let dataPicsPath = path.join(dataPath, 'pics.json');

// sync because it should be created before anything
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);
if (!fs.existsSync(tmpPicsPath)) fs.mkdirSync(tmpPicsPath);
if (!fs.existsSync(dataPicsPath)) fs.writeFileSync(dataPicsPath, JSON.stringify({ used: [] }));

async function getPic() {
  let pic = await unsplash.photos.getRandomPhoto({
    featured: true,
    orientation: 'landscape',
    collections: config.unsplash.collectionIds
  }).then(Unsplash.toJson);

  if (!pic) return logger('error', 'unsplash api error');

  // description is necessary for filtering
  if (!pic.description) {
    logger('warning', `rejected ${pic.id} => it has no description`);
    return await getPic();
  }

  // filter
  let notAllowedWords = pic.description.match(/boy|girl|boys|girls|man|men|woman|women|model|sexy|bikini|lips|kiss|hug|hugging|rose|fashion|underwear|lingerie|sensual|dress|buddha|mosque|masjed|church|temple/gi);
  if (notAllowedWords) {
    logger('warning', `rejected (${pic.id}) => it matches '${notAllowedWords}'`);
    return await getPic();
  }

  let { used } = JSON.parse(fs.readFileSync(dataPicsPath));
  if (used.includes(pic.id)) {
    logger('warning', `rejected (${pic.id}) => used before`);
    return await getPic();
  }

  used.push(pic.id);
  logger('msg', `getting (${pic.id})`);

  let body = await fetch(pic.urls.regular).then(res => res.buffer());
  if (!body) {
    logger('warning', `empty body (${pic.id})`);
    return await getPic();
  }

  // set pic path
  let picPath = path.join(tmpPicsPath, `pic-${pic.id}.jpg`);

  // download pic to picPath
  fs.writeFileSync(picPath, body, 'binary');

  logger('msg', `(${pic.id}) downloaded successfully`);

  // submit downloading the photo
  await unsplash.photos.downloadPhoto(pic);

  // set pic id to the used pics
  fs.writeFile(dataPicsPath, JSON.stringify({ used }), err => err && logger('error', err));

  return { pic, picPath };
}

module.exports = getPic;
