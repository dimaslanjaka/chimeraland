import * as gulp from 'gulp';
import { join } from 'upath';
import { hexoProject } from '../project';

const sourceFolder = join(__dirname, '../source');
const sourceOutputFolder = join(hexoProject, 'source/chimeraland');

export function copySource() {
  return gulp
    .src(['**/*.*'], { base: sourceFolder })
    .pipe(gulp.dest(sourceOutputFolder));
}

export default copySource;
