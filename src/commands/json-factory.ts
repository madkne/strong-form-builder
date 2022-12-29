import { cliCommandItem, CliCommand, OnImplement, CommandArgvItem } from '@dat/lib/argvs';
import { CommandArgvName, CommandName, UIFrameWorkType } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { cwd, copyDirectory, shell } from '@dat/lib/os';
import { saveRenderFile } from '@dat/lib/template';
import { detectAngularSourcePath, UIFrameWorks, VERSION } from '../common';
import { select, boolean } from '@dat/lib/input';
import { info, success, error, warning } from '@dat/lib/log';

@cliCommandItem()
export class JsonFactoryCommand extends CliCommand<CommandName, CommandArgvName> implements OnImplement {
    cwd: string;
    templatesPath: string;
    source: string;
    sourceAppStrongFBPath: string;


    get name(): CommandName {
        return 'json-factory';
    }

    get description(): string {
        return "init strong form builder for your node.js servers as a form json factory";
    }

    get alias(): string {
        return 'j';
    }

    get argvs(): CommandArgvItem<CommandArgvName>[] {
        return [
            {
                name: 'path',
                description: 'specific path for your project',
                alias: 'p',
                type: 'string',
            },
            {
                name: 'name',
                description: 'name of module (default: @strongFB)',
                alias: 'n',
                defaultValue: '@strongFB',
                type: 'string',
            },
        ];
    }
    /********************************** */
    async init() {
        this.cwd = await cwd();
        this.templatesPath = path.join(this.cwd, 'data', 'templates');
        // =>if set path
        if (this.hasArgv('path')) {
            this.source = this.getArgv('path');
        }
        // =>check exist source
        if (!fs.existsSync(this.source)) {
            error(`not found such directory: ${this.source}`);
            return false;
        }
        // =>make directory of module
        this.sourceAppStrongFBPath = path.join(this.source, this.getArgv('name'));
        fs.mkdirSync(this.sourceAppStrongFBPath, { recursive: true });


        return true;
    }

    /********************************** */

    async implement(): Promise<boolean> {
        if (!await this.init()) return false;
        // =>copy template files
        info('copying template files ...');
        await this.copyTemplates();
        //--------------------------
        // =>create 'info.ts' file
        fs.writeFileSync(path.join(this.sourceAppStrongFBPath, 'info.ts'), `

        export const STRONGFB_VERSION = '${VERSION}';
        export const LAST_JSON_FACTORY_BUILT = '${new Date().toISOString()}';
        `);
        //--------------------------
        success(`added '${this.getArgv('name')}' module to your project!`);
        return true;
    }
    /********************************** */
    async copyTemplates() {
        // =>copy common files
        fs.mkdirSync(path.join(this.sourceAppStrongFBPath, 'common'), { recursive: true });
        let files = fs.readdirSync(path.join(this.templatesPath, 'common'), { withFileTypes: true });
        for (const f of files) {
            if (f.isFile()) {
                fs.copyFileSync(path.join(this.templatesPath, 'common', f.name), path.join(this.sourceAppStrongFBPath, 'common', f.name));
            }
        }
        // =>overwrite need common files 
        if (fs.existsSync(path.join(this.templatesPath, 'common', 'json'))) {
            let files = fs.readdirSync(path.join(this.templatesPath, 'common', 'json'), { withFileTypes: true });
            for (const f of files) {
                if (f.isFile()) {
                    fs.copyFileSync(path.join(this.templatesPath, 'common', 'json', f.name), path.join(this.sourceAppStrongFBPath, 'common', f.name));
                }
            }
        }
        // =>copy widgets file
        await this.copyWidgetsTemplates();
        // =>copy json required files
        if (fs.existsSync(path.join(this.templatesPath, 'json'))) {
            let dirs = fs.readdirSync(path.join(this.templatesPath, 'json'), { withFileTypes: true });
            for (const dir of dirs) {
                if (dir.isFile()) {
                    fs.copyFileSync(path.join(this.templatesPath, 'json', dir.name), path.join(this.sourceAppStrongFBPath, dir.name));
                }
            }
        }
    }
    /********************************** */
    async copyWidgetsTemplates() {
        const APP_WIDGET_PATH = path.join(this.sourceAppStrongFBPath, 'widgets');
        // =>create widgets dir
        fs.mkdirSync(APP_WIDGET_PATH, { recursive: true });
        // =>scan widgets templates
        const widgetsDirPath = path.join(this.templatesPath, 'widgets');
        let widgetsDirs = fs.readdirSync(widgetsDirPath, { withFileTypes: true });
        for (const widDir of widgetsDirs) {
            let widgetDirPath = path.join(this.templatesPath, 'widgets', widDir.name);
            let appWidgetDirPath = path.join(APP_WIDGET_PATH, widDir.name);
            // =>if widget exist
            if (widDir.isDirectory() && fs.existsSync(path.join(widgetDirPath, 'json'))) {
                // =>create widget dir folder
                fs.mkdirSync(appWidgetDirPath, { recursive: true });
                let widgetFiles = fs.readdirSync(widgetDirPath, { withFileTypes: true });
                for (const widFile of widgetFiles) {
                    if (widFile.name.indexOf('component.ts') > -1 || widFile.name.indexOf('component.html') > -1 || widFile.name.indexOf('component.scss') > -1) continue;
                    // =>if common files
                    if (widFile.isFile()) {
                        fs.copyFileSync(path.join(widgetDirPath, widFile.name), path.join(appWidgetDirPath, widFile.name));
                    }
                }
                // =>overwrite json files
                let widgetJsonFiles = fs.readdirSync(path.join(widgetDirPath, 'json'), { withFileTypes: true });
                for (const widFile of widgetJsonFiles) {
                    // =>if common files
                    if (widFile.isFile()) {
                        fs.copyFileSync(path.join(widgetDirPath, 'json', widFile.name), path.join(appWidgetDirPath, widFile.name));
                    }
                }
            }
        }
    }
}