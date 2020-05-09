import './utils/config';
import getPic, { PixaPic } from './utils/getPic';
import download from './utils/download';
import publish from './utils/publish';

async function main(): Promise<void> {
  try {
    const pic: PixaPic = await getPic();
    const buffer: Buffer = await download(pic.urls.medium);
    const caption: string = `by: ${pic.author.name.trim()} on #${pic.platform}`;

    console.log(`(${pic.id}) downloaded successfully`);

    await publish(buffer, caption);

    console.log('published to all clients');
  } catch (err) {
    console.error(err.stack || err.message);
  }
}

main();
setInterval(main, 24 * 60 * 60 * 1000);
