const { IgApiClient } = require('instagram-private-api');

const { instagramUsername, instagramPassword } = process.env;

const ig = new IgApiClient();

ig.state.generateDevice(instagramUsername);

(async () => {
  await ig.simulate.preLoginFlow();

  await ig.account.login(instagramUsername, instagramPassword);

  process.nextTick(async () => {
    await ig.simulate.postLoginFlow();
  });
})();

module.exports = async (picPath, caption) => {
  const mediaRepo = await ig.publish.photo({
    file: picPath,
    caption
  });

  console.log(
    `(instagram): https://www.instagram.com/p/${mediaRepo.upload_id}`
  );

  return mediaRepo;
};
