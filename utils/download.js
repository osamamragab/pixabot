const fetch = require('node-fetch');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const genid = require('./genid');
const path = require('path');
const { promises: fs } = require('fs');

module.exports = async url => {
  const dlPath = path.join('..', 'data', `${genid()}.jpg`);

  // get file buffer from url
  const fileBuffer = await fetch(url).then(res => res.buffer());

  // minify file buffer
  const buffer = await imagemin.buffer(fileBuffer, {
    plugins: [imageminJpegtran()]
  });

  // download the file to dlPath
  await fs.writeFile(dlPath, buffer, 'binary');

  return dlPath;
};
