import axios from 'axios';
import type { PixaPic } from '../utils/getPic';

interface PexelsAPIResponse {
  page: number;
  per_page: number;
  photos: PexelsAPIPhoto[];
  prev_page: string;
}

interface PexelsAPIPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

const { PEXELS_API_KEY } = process.env;

const curatedPhotoURL: string = 'https://api.pexels.com/v1/curated';

export default async (): Promise<PixaPic> => {
  const { data: pexelsData } = await axios.get<PexelsAPIResponse>(
    curatedPhotoURL,
    {
      headers: {
        Authorization: PEXELS_API_KEY
      },
      params: {
        per_page: 1,
        page: Math.floor(Math.random() * (6327 - 1 + 1) + 1)
      }
    }
  );

  const pic: PexelsAPIPhoto = pexelsData.photos[0];

  return {
    id: pic.id,
    width: pic.width,
    height: pic.height,
    platform: 'Pexels',
    urls: {
      original: pic.src.original,
      medium: pic.src.medium,
      small: pic.src.small
    },
    author: {
      id: pic.photographer_id,
      name: pic.photographer
    }
  };
};
