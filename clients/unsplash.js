'use strict';

const Unsplash = require('unsplash-js');
const fetch = require('node-fetch');
const config = require('../config');
const logger = require('../lib/logger');
const fs = require('fs');
const path = require('path');

global.fetch = fetch;

const unsplash = new Unsplash.default(config.unsplash.auth);

const dataPath = path.join(__dirname, '..', 'data');
const tmpPicsPath = path.join(dataPath, 'tmp');
const dataPicsPath = path.join(dataPath, 'pics.json');

// sync because it should be created before anything
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);
if (!fs.existsSync(tmpPicsPath)) fs.mkdirSync(tmpPicsPath);
if (!fs.existsSync(dataPicsPath)) fs.writeFileSync(dataPicsPath, JSON.stringify({ used: [] }));

async function getPic() {
  try {
    const pic = await unsplash.photos
      .getRandomPhoto({
        featured: true,
        orientation: 'landscape',
        collections: config.unsplash.collectionIds
      })
      .then(Unsplash.toJson);

    // description is necessary for filtering
    if (!pic.description) {
      logger('rejected', `${pic.id} => it has no description`);
      return await getPic();
    }

    // filter
    const picDscrptnMatch = pic.description.match(
      /boy|girl|man|men|woman|women|model|sexy|panties|naked|swimsuit|bikini|lip|kiss|hug|rose|fashion|underwear|lingerie|sensual|dress/gi
    );
    if (picDscrptnMatch) {
      logger('rejected', `(${pic.id}) => it matches '${picDscrptnMatch}' - '${pic.description}'`);
      return await getPic();
    } else {
      logger('passed', `(${pic.id}) => '${pic.description}'`);
    }

    // check if used before
    const { used } = JSON.parse(fs.readFileSync(dataPicsPath));
    if (used.includes(pic.id)) {
      logger('rejected', `(${pic.id}) => used before`);
      return await getPic();
    } else {
      used.push(pic.id);
      logger('msg', `processing (${pic.id})`);
    }

    // get the body
    const picBuffer = await fetch(pic.urls.regular).then(res => res.buffer());

    // set pic path
    const picPath = path.join(tmpPicsPath, `pic-${pic.id}.jpg`);

    // download pic to picPath
    fs.writeFileSync(picPath, picBuffer, 'binary');

    logger('msg', `(${pic.id}) downloaded successfully`);

    // set pic id to the used pics
    fs.writeFile(dataPicsPath, JSON.stringify({ used }), err => err && logger('error', err));

    return { pic, picPath };
  } catch (err) {
    logger('error', err);
  }
}

module.exports = getPic;
