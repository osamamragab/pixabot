import {
  IgApiClient,
  MediaRepositoryConfigureResponseRootObject,
  AccountRepositoryLoginResponseLogged_in_user
} from 'instagram-private-api';
import { INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD } from '../utils/config';

const ig: IgApiClient = new IgApiClient();

ig.state.generateDevice(INSTAGRAM_USERNAME);

let loggedInUser: AccountRepositoryLoginResponseLogged_in_user;

export default async (buffer: Buffer, caption: string): Promise<void> => {
  if (!loggedInUser) {
    loggedInUser = await ig.account.login(
      INSTAGRAM_USERNAME,
      INSTAGRAM_PASSWORD
    );

    console.log('(instagram) logged in successfully');
  }

  const mediaRepo: MediaRepositoryConfigureResponseRootObject = await ig.publish.photo(
    {
      file: buffer,
      caption
    }
  );

  if (mediaRepo.status === 'ok') {
    console.log(
      `(instagram): https://www.instagram.com/p/${mediaRepo.media.code}`
    );
  } else {
    console.error('(instagram): faild to upload');
  }
};
