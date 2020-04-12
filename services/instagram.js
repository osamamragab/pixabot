const { IgApiClient } = require('instagram-private-api');
const { promises: fs } = require('fs');

const { instagramUsername, instagramPassword } = process.env;

const ig = new IgApiClient();

let loggedInUser;

module.exports = async (picPath, caption) => {
  if (!loggedInUser) {
    ig.state.generateDevice(instagramUsername);

    loggedInUser = await ig.account.login(instagramUsername, instagramPassword);

    console.log('instagram logged in successfully');
  }

  const mediaRepo = await ig.publish.photo({
    file: await fs.readFile(picPath),
    caption
  });

  console.log(
    `(instagram): https://www.instagram.com/p/${mediaRepo.media.code}`
  );

  return mediaRepo;
};
