import axios from 'axios';
import type { PixaPic } from '../utils/getPic';

interface UnsplashAPI {
  id: string;
  width: number;
  height: number;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    id: string;
    name: string;
    links: {
      html: string;
    };
  };
}

const { UNSPLASH_ACCESS_KEY } = process.env;

const randomPhotoURL: string = 'https://api.unsplash.com/photos/random';

export default async (): Promise<PixaPic> => {
  const { data: pic } = await axios.get<UnsplashAPI>(randomPhotoURL, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
    },
    params: {
      featured: true
    }
  });

  return {
    id: pic.id,
    width: pic.width,
    height: pic.height,
    platform: 'Unsplash',
    urls: {
      original: pic.urls.full,
      medium: pic.urls.regular,
      small: pic.urls.small
    },
    author: {
      id: pic.user.id,
      name: pic.user.name
    }
  };
};
