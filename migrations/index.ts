import * as migration_20260914_122041_initial from './20260914_122041_initial';

export const migrations = [
  {
    up: migration_20260914_122041_initial.up,
    down: migration_20260914_122041_initial.down,
    name: '20260914_122041_initial'
  },
];
