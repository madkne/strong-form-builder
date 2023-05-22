import * as fs from 'fs';
import * as path from 'path';
import { cwd } from '@dat/lib/os';
import { select } from '@dat/lib/input';
import { error } from '@dat/lib/log';
import { UIFrameWorkType } from './types';


export const VERSION = '0.144';

export async function detectAngularSourcePath() {
    let cwdir = await cwd();
    let angularDirs = _detectAngularSourcePath([
        cwdir,
        path.join(cwdir, '..'),
    ]);
    // =>if not any detected
    if (angularDirs.length === 0) {
        error('no any angular sources detected!');
        return undefined;
    }
    // => if just one dir detected
    if (angularDirs.length === 1) return angularDirs[0];
    // =>select one angular dir
    let selectedDir = await select('Select an Angular Source', angularDirs);
    return selectedDir;
}
function _detectAngularSourcePath(scanDirs: string[]) {
    let filename = 'angular.json';
    let sourcePaths = [];
    // =>scan dirs
    for (const scanDir of scanDirs) {
        if (fs.existsSync(path.join(scanDir, filename))) {
            sourcePaths.push(scanDir);
            continue;
        }
        let dirs = fs.readdirSync(scanDir, { withFileTypes: true });
        for (const dir of dirs) {
            if (!dir.isDirectory()) continue;
            if (fs.existsSync(path.join(scanDir, dir.name, filename))) {
                sourcePaths.push(path.join(scanDir, dir.name));
            }
        }
    }
    return sourcePaths;
}

export const UIFrameWorks: UIFrameWorkType[] = ['nebular', 'material'];