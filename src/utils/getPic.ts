import unsplash from '../services/unsplash';
import pexels from '../services/pexels';

export interface PixaPic {
  id: string | number;
  width: number;
  height: number;
  platform: 'Unsplash' | 'Pexels';
  urls: {
    original: string;
    medium: string;
    small: string;
  };
  author: {
    id: string | number;
    name: string;
  };
}

// list of platforms (Pics APIs)
export const platforms: string[] = ['unsplash', 'pexels'];

export default async (): Promise<PixaPic> => {
  const getFrom: string = process.env.PIC_PLATFORM || platforms[0];

  // set platform for the next time
  process.env.PIC_PLATFORM = platforms[platforms.indexOf(getFrom) + 1];

  switch (getFrom) {
    case 'unsplash':
      return await unsplash();

    case 'pexels':
    default:
      return await pexels();
  }
};
