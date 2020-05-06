import './utils/config';
import getPic, { PixaPic } from './utils/getPic';
import download from './utils/download';
import publish from './utils/publish';

// wrap everything
async function main(): Promise<void> {
  try {
    // get the random pic
    const pic: PixaPic = await getPic();

    // download pic as buffer
    const picBuffer: Buffer = await download(pic.urls.medium);

    console.log(`(${pic.id}) downloaded successfully`);

    // set caption
    const caption: string = `by: ${pic.author.name.trim()} on #${pic.platform}`;

    // publish the pic to all platforms
    await publish(picBuffer, caption);

    console.log(`(${pic.id}) was removed`);
  } catch (err) {
    console.error(err.stack || err.message);
  }
}

// first run
main();

// run every day
setInterval(main, 24 * 60 * 60 * 1000);
