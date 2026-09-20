import * as migration_20260914_122041_initial from './20260914_122041_initial';
import * as migration_20260914_130322_add_media from './20260914_130322_add_media';
import * as migration_20260914_131310_add_targets_exercises from './20260914_131310_add_targets_exercises';
import * as migration_20260914_133630_add_programs from './20260914_133630_add_programs';
import * as migration_20260920_125221_feature_flags from './20260920_125221_feature_flags';

export const migrations = [
  {
    up: migration_20260914_122041_initial.up,
    down: migration_20260914_122041_initial.down,
    name: '20260914_122041_initial',
  },
  {
    up: migration_20260914_130322_add_media.up,
    down: migration_20260914_130322_add_media.down,
    name: '20260914_130322_add_media',
  },
  {
    up: migration_20260914_131310_add_targets_exercises.up,
    down: migration_20260914_131310_add_targets_exercises.down,
    name: '20260914_131310_add_targets_exercises',
  },
  {
    up: migration_20260914_133630_add_programs.up,
    down: migration_20260914_133630_add_programs.down,
    name: '20260914_133630_add_programs',
  },
  {
    up: migration_20260920_125221_feature_flags.up,
    down: migration_20260920_125221_feature_flags.down,
    name: '20260920_125221_feature_flags'
  },
];
