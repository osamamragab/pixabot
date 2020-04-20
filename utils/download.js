const fetch = require('node-fetch');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const path = require('path');
const {
  promises: { writeFile }
} = require('fs');

module.exports = async url => {
  // generate an id
  const id = Math.floor(Math.random() * 1000000000);

  // download image to path
  const dlPath = path.join(__dirname, '..', 'tmp', `pixahub-${id}.jpg`);

  // get file buffer from url
  const dataBuffer = await fetch(url).then(res => res.buffer());

  // minify file buffer
  const minifedBuffer = await imagemin.buffer(dataBuffer, {
    plugins: [imageminJpegtran()]
  });

  await writeFile(dlPath, minifedBuffer);

  return dlPath;
};
