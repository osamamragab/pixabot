import axios from 'axios';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';

export default async (url: string): Promise<Buffer> => {
  const { data: buffer } = await axios.get<Buffer>(url, {
    responseType: 'arraybuffer'
  });

  const minifedBuffer: Buffer = await imagemin.buffer(buffer, {
    plugins: [imageminJpegtran()]
  });

  return minifedBuffer;
};
