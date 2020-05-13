import axios, { AxiosRequestConfig } from 'axios';
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

const maxCuratedPhotosCount: number = 6296;

function getRandomPage(): number {
  return Math.floor(Math.random() * maxCuratedPhotosCount + 1);
}

const requestConfig: AxiosRequestConfig = {
  headers: {
    Authorization: PEXELS_API_KEY
  },
  params: {
    per_page: 1
  }
};

export default async (): Promise<PixaPic> => {
  requestConfig.params.page = getRandomPage();

  let { data } = await axios.get<PexelsAPIResponse>(
    curatedPhotoURL,
    requestConfig
  );

  while (data.photos.length === 0) {
    data = (await axios.get<PexelsAPIResponse>(data.prev_page, requestConfig))
      .data;
  }

  const pic: PexelsAPIPhoto = data.photos[0];

  return {
    id: pic.id,
    width: pic.width,
    height: pic.height,
    platform: 'Pexels',
    dl: pic.src.landscape,
    author: {
      id: pic.photographer_id,
      name: pic.photographer
    }
  };
};
