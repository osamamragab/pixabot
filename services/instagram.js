const { IgApiClient } = require('instagram-private-api');
const {
  promises: { readFile }
} = require('fs');

const { instagramUsername, instagramPassword } = process.env;

const ig = new IgApiClient();

let loggedInUser;

module.exports = async (picPath, caption) => {
  if (!loggedInUser) {
    ig.state.generateDevice(instagramUsername);

    loggedInUser = await ig.account.login(instagramUsername, instagramPassword);

    console.log('(instagram) logged in successfully');
  }

  const mediaRepo = await ig.publish.photo({
    file: await readFile(picPath),
    caption
  });

  if (mediaRepo.status === 'ok') {
    console.log(
      `(instagram): https://www.instagram.com/p/${mediaRepo.media.code}`
    );
  } else {
    console.error('(instagram): faild to upload');
  }

  return mediaRepo;
};
