import * as gulp from 'gulp';
import { join } from 'upath';
import { hexoProject } from '../project';
import fs from 'fs-extra';

const sourceFolder = join(__dirname, '../source');
const sourceOutputFolder = join(hexoProject, 'source/chimeraland');

export function copySource() {
  return fs.copySync(sourceFolder, sourceOutputFolder, { overwrite: true });
}

if (require.main === module) copySource();

export default copySource;
