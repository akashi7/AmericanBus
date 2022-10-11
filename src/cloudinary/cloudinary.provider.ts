import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'cloudinary',
  useFactory: () => {
    return v2.config({
      cloud_name: 'akashi',
      api_key: '311788717323835',
      api_secret: 'YZ22I0-FwDwkS0JJDhXVyQ4AFrQ',
    });
  },
};
