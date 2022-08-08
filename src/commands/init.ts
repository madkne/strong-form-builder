import { cliCommandItem, CliCommand, OnImplement } from '@dat/lib/argvs';
import { CommandArgvName, CommandName, UIFrameWorkType } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { cwd, copyDirectory, shell } from '@dat/lib/os';
import { saveRenderFile } from '@dat/lib/template';
import { detectAngularSourcePath, UIFrameWorks } from '../common';
import { select, boolean } from '@dat/lib/input';
import { info, success } from '@dat/lib/log';

@cliCommandItem()
export class InitCommand extends CliCommand<CommandName, CommandArgvName> implements OnImplement {
    cwd: string;
    templatesPath: string;
    samplesPath: string;
    source: string;
    uiFramework: UIFrameWorkType;
    sourceAppStrongFBPath: string;


    get name(): CommandName {
        return 'init';
    }

    get description(): string {
        return "init strong form builder for your angular project";
    }

    get alias(): string {
        return 'i';
    }
    /********************************** */
    async init() {
        this.cwd = await cwd();
        this.templatesPath = path.join(this.cwd, 'data', 'templates');
        this.samplesPath = path.join(this.cwd, 'data', 'samples');

        // =>detect angular source on parent directory
        if (!(this.source = await detectAngularSourcePath())) return false;
        this.sourceAppStrongFBPath = path.join(this.source, 'src', 'app', 'StrongFB');
        // =>get type ui framework used
        this.uiFramework = await select('Select UI framework used', UIFrameWorks) as any;

        return true;
    }

    /********************************** */

    async implement(): Promise<boolean> {
        if (!await this.init()) return false;
        // =>copy template files
        info('copying template files ...');
        await this.copyTemplates();
        //--------------------------
        info('configuring angular project ...');
        await this.configProject();
        //--------------------------
        info('adding required packages to project ...');
        await this.addRequiredPackages();
        //--------------------------
        success(`add 'StrongFBModule' to 'app.module.ts' file`);
        // =>add sample, if want
        // if (await boolean('Do you want to load a sample?', true)) {
        //     await this.addSample();
        // }
        return true;
    }
    /********************************** */

    async copyTemplates() {

        // =>copy common files
        await copyDirectory(path.join(this.templatesPath, 'common'), path.join(this.sourceAppStrongFBPath, 'common'));
        // =>copy forms files
        await copyDirectory(path.join(this.templatesPath, 'forms'), path.join(this.sourceAppStrongFBPath, 'forms'));
        // =>copy services file
        await copyDirectory(path.join(this.templatesPath, 'services'), path.join(this.sourceAppStrongFBPath, 'services'));
        // =>copy widgets file
        await this.copyWidgetsTemplates();
        // =>copy shared module by ui framework
        if (fs.existsSync(path.join(this.templatesPath, this.uiFramework))) {
            let dirs = fs.readdirSync(path.join(this.templatesPath, this.uiFramework), { withFileTypes: true });
            for (const dir of dirs) {
                if (dir.isFile()) {
                    fs.copyFileSync(path.join(this.templatesPath, this.uiFramework, dir.name), path.join(this.sourceAppStrongFBPath, dir.name));
                }
            }
        }
        // =>copy strongfb.module file
        fs.copyFileSync(path.join(this.templatesPath, 'StrongFB.module.ts'), path.join(this.sourceAppStrongFBPath, 'StrongFB.module.ts'));
    }
    /********************************** */
    async copyWidgetsTemplates() {
        const APP_WIDGET_PATH = path.join(this.sourceAppStrongFBPath, 'widgets');
        // =>create widgets dir
        fs.mkdirSync(APP_WIDGET_PATH, { recursive: true });
        // =>scan widgets templates
        let widgetsDirs = fs.readdirSync(path.join(this.templatesPath, 'widgets'), { withFileTypes: true });
        for (const widDir of widgetsDirs) {
            let widgetDirPath = path.join(this.templatesPath, 'widgets', widDir.name);
            let appWidgetDirPath = path.join(APP_WIDGET_PATH, widDir.name);
            // =>if widget
            if (widDir.isDirectory()) {
                fs.mkdirSync(appWidgetDirPath, { recursive: true });
                let widgetFiles = fs.readdirSync(widgetDirPath, { withFileTypes: true });
                for (const widFile of widgetFiles) {
                    // =>if common files
                    if (widFile.isFile()) {
                        fs.copyFileSync(path.join(widgetDirPath, widFile.name), path.join(appWidgetDirPath, widFile.name));
                    }
                }
                // =>add custom files by ui framework
                if (fs.existsSync(path.join(widgetDirPath, this.uiFramework))) {
                    let widgetCustomFiles = fs.readdirSync(path.join(widgetDirPath, this.uiFramework), { withFileTypes: true });
                    for (const widFile of widgetCustomFiles) {
                        // =>if custom files
                        if (widFile.isFile()) {
                            fs.copyFileSync(path.join(widgetDirPath, this.uiFramework, widFile.name), path.join(appWidgetDirPath, widFile.name));
                        }
                    }
                }
            }
            // =>copy files (etc readme)
            else {
                fs.copyFileSync(widgetDirPath, path.join(this.sourceAppStrongFBPath, 'widgets', widDir.name));
            }
        }
        // await copyDirectory(path.join(this.templatesPath, 'widgets', this.uiFramework), path.join(this.sourceAppStrongFBPath, 'widgets'));
        // fs.copyFileSync(path.join(this.templatesPath, 'widgets', 'README.md'), path.join(this.sourceAppStrongFBPath, 'widgets', 'README.md'));
    }
    /********************************** */
    async configProject() {
        // =>add properties to tsconfig of project
        let projectTsConfig = fs.readFileSync(path.join(this.source, 'tsconfig.json')).toString();
        if (projectTsConfig.startsWith('/*')) {
            let lines = projectTsConfig.split('\n');
            lines.shift();
            projectTsConfig = lines.join('\n');
        }
        projectTsConfig = JSON.parse(projectTsConfig);
        projectTsConfig['compilerOptions']['experimentalDecorators'] = true;
        projectTsConfig['compilerOptions']['strict'] = false;
        // =>save tsconfig
        fs.writeFileSync(path.join(this.source, 'tsconfig.json'), JSON.stringify(projectTsConfig, null, 2));
    }
    /********************************** */
    async addRequiredPackages() {
        let packages = { 'notiflix': '^3.2.5' };
        let exists = true;
        // =>read package.json of project
        let projectPackageJson = JSON.parse(fs.readFileSync(path.join(this.source, 'package.json')).toString());
        // =>check exist all packages before
        for (const pack of Object.keys(packages)) {
            if (!projectPackageJson['dependencies'][pack] && !projectPackageJson['devDependencies'][pack]) {
                exists = false;
                // =>if not exist, add it
                projectPackageJson['dependencies'][pack] = packages[pack];
            }
        }
        // =>save package.json
        fs.writeFileSync(path.join(this.source, 'package.json'), JSON.stringify(projectPackageJson, null, 2));
        // =>if not exist any packages, reinstall npm
        if (!exists) {
            await shell(`npm i`, this.source);
        }
    }
    /********************************** */

    async addSample() {
        // =>get all samples
        let dirs = fs.readdirSync(this.samplesPath, { withFileTypes: true });
        let samples = [];
        for (const dir of dirs) {
            if (!dir.isDirectory()) continue;
            samples.push(dir.name);
        }
        let sampleName = await select('Select a sample to add', samples);
        // =>copy forms
        if (fs.existsSync(path.join(this.samplesPath, sampleName, 'forms'))) {
            await copyDirectory(path.join(this.samplesPath, sampleName, 'forms'), path.join(this.sourceAppStrongFBPath, 'forms'));
        }
        // =>copy components
        if (fs.existsSync(path.join(this.samplesPath, sampleName, 'components'))) {
            await copyDirectory(path.join(this.samplesPath, sampleName, 'components'), path.join(this.sourceAppStrongFBPath, '..', 'components'));
        }
        // =>shoe readme.md file in terminal
        if (fs.existsSync(path.join(this.samplesPath, sampleName, 'README.md'))) {
            info(fs.readFileSync(path.join(this.samplesPath, sampleName, 'README.md')).toString());
        }
        success(`Added '${sampleName}' sample to your Angular project.`);



    }

}