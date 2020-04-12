const { IgApiClient } = require('instagram-private-api');
const { promises: fs } = require('fs');

const { instagramUsername, instagramPassword } = process.env;

const ig = new IgApiClient();

ig.state.generateDevice(instagramUsername);

module.exports = async (picPath, caption) => {
  await ig.account.login(instagramUsername, instagramPassword);

  const mediaRepo = await ig.publish.photo({
    file: await fs.readFile(picPath),
    caption
  });

  console.log(
    `(instagram): https://www.instagram.com/p/${mediaRepo.upload_id}`
  );

  return mediaRepo;
};
