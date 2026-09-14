import * as migration_20260914_122041_initial from './20260914_122041_initial';
import * as migration_20260914_130322_add_media from './20260914_130322_add_media';

export const migrations = [
  {
    up: migration_20260914_122041_initial.up,
    down: migration_20260914_122041_initial.down,
    name: '20260914_122041_initial',
  },
  {
    up: migration_20260914_130322_add_media.up,
    down: migration_20260914_130322_add_media.down,
    name: '20260914_130322_add_media'
  },
];
