import unsplash from '../services/unsplash';
import pexels from '../services/pexels';

export interface PixaPic {
  id: string | number;
  width: number;
  height: number;
  platform: 'Unsplash' | 'Pexels';
  dl: string;
  author: {
    id: string | number;
    name: string;
  };
}

const platforms: object = { unsplash, pexels };
const platFormsKeys: string[] = Object.keys(platforms);

let currentPlatform: string = '';

export default async (): Promise<PixaPic> => {
  const getFrom: string = currentPlatform || platFormsKeys[0];

  // set platform for the next time
  currentPlatform = platFormsKeys[platFormsKeys.indexOf(getFrom) + 1];

  return await platforms[getFrom]();
};
