import { cliCommandItem, CliCommand, OnImplement, CommandArgvItem } from '@dat/lib/argvs';
import { CommandArgvName, CommandName, UIFrameWorkType } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { cwd, copyDirectory, shell } from '@dat/lib/os';
import { saveRenderFile } from '@dat/lib/template';
import { detectAngularSourcePath, UIFrameWorks } from '../common';
import { select, boolean } from '@dat/lib/input';
import { info, success, error, warning } from '@dat/lib/log';
import * as TEM from '@dat/lib/template';

@cliCommandItem()
export class InitCommand extends CliCommand<CommandName, CommandArgvName> implements OnImplement {
    cwd: string;
    templatesPath: string;
    samplesPath: string;
    source: string;
    uiFramework: UIFrameWorkType;
    sourceAppStrongFBPath: string;
    projectPackageJson: {
        name: string;
        version: string;
        dependencies: object;
        devDependencies: object;
        languages?: string[];
        uiFramework?: UIFrameWorkType;
    };
    loadedWidgets: { name: string; path: string; }[] = [];


    get name(): CommandName {
        return 'init';
    }

    get description(): string {
        return "init strong form builder for your angular project";
    }

    get alias(): string {
        return 'i';
    }

    get argvs(): CommandArgvItem<CommandArgvName>[] {
        return [
            {
                name: 'path',
                description: 'specific path for your angular project',
                alias: 'p',
                type: 'string',
            }
        ];
    }
    /********************************** */
    async init() {
        this.cwd = await cwd();
        this.templatesPath = path.join(this.cwd, 'data', 'templates');
        this.samplesPath = path.join(this.cwd, 'data', 'samples');
        // =>if set path
        if (this.hasArgv('path')) {
            this.source = this.getArgv('path');
        }
        // =>detect angular source on parent directory, if not set path
        else {
            if (!(this.source = await detectAngularSourcePath())) return false;
        }
        // =>check exist source
        if (!fs.existsSync(this.source)) {
            error(`not found such directory: ${this.source}`);
            return false;
        }
        this.sourceAppStrongFBPath = path.join(this.source, 'src', 'app', 'StrongFB');
        fs.mkdirSync(this.sourceAppStrongFBPath, { recursive: true });
        // =>read package.json of project
        this.projectPackageJson = JSON.parse(fs.readFileSync(path.join(this.source, 'package.json')).toString());
        warning(`Angular Project : ${this.projectPackageJson.name} - version ${this.projectPackageJson.version}`);
        // =>get type ui framework used, if not
        if (this.projectPackageJson.uiFramework && UIFrameWorks.includes(this.projectPackageJson.uiFramework)) {
            this.uiFramework = this.projectPackageJson.uiFramework;
        } else {
            this.uiFramework = await select('Select UI framework used', UIFrameWorks) as any;
            this.projectPackageJson.uiFramework = this.uiFramework;
        }

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
        fs.mkdirSync(path.join(this.sourceAppStrongFBPath, 'common', 'helpers'), { recursive: true });
        // =>copy common files
        let files = fs.readdirSync(path.join(this.templatesPath, 'common'), { withFileTypes: true });
        for (const f of files) {
            if (f.isFile()) {
                fs.copyFileSync(path.join(this.templatesPath, 'common', f.name), path.join(this.sourceAppStrongFBPath, 'common', f.name));
            }
        }
        // =>copy forms files
        await copyDirectory(path.join(this.templatesPath, 'forms'), path.join(this.sourceAppStrongFBPath, 'forms'));
        // =>copy services file
        await copyDirectory(path.join(this.templatesPath, 'services'), path.join(this.sourceAppStrongFBPath, 'services'));
        // =>copy locales file
        await copyDirectory(path.join(this.templatesPath, 'locales'), path.join(this.sourceAppStrongFBPath, 'locales'));
        // =>copy pipes file
        await copyDirectory(path.join(this.templatesPath, 'pipes'), path.join(this.sourceAppStrongFBPath, 'pipes'));
        // =>copy assets file
        fs.mkdirSync(path.join(this.source, 'src', 'assets', 'StrongFB'), { recursive: true });
        await copyDirectory(path.join(this.templatesPath, 'assets'), path.join(this.source, 'src', 'assets', 'StrongFB'));
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
        // =>compile & copy common helper files
        let helperFiles = fs.readdirSync(path.join(this.templatesPath, 'common', 'helpers'), { withFileTypes: true });

        for (const f of helperFiles) {
            if (!f.isFile()) continue;
            await TEM.saveRenderFile(path.join(this.templatesPath, 'common', 'helpers', f.name), path.join(this.sourceAppStrongFBPath, 'common', 'helpers'), {
                data: {
                    loadedWidgets: this.loadedWidgets.map(i => i.name),
                }
            });
        }
        // =>build strongfb.module file
        // fs.copyFileSync(path.join(this.templatesPath, 'StrongFB.module.ts'), path.join(this.sourceAppStrongFBPath, 'StrongFB.module.ts'));
        await this.buildStrongFBModuleFile(path.join(this.sourceAppStrongFBPath, 'StrongFB.module.ts'));
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
            // =>if widget
            if (widDir.isDirectory()) {
                // =>check exist on current ui framework
                if (!fs.existsSync(path.join(widgetDirPath, '.nocustom')) && !fs.existsSync(path.join(widgetDirPath, this.uiFramework))) {
                    continue;
                }
                // =>create widget dir folder
                fs.mkdirSync(appWidgetDirPath, { recursive: true });
                let widgetFiles = fs.readdirSync(widgetDirPath, { withFileTypes: true });
                // =>add loaded widget
                this.loadedWidgets.push({
                    name: widDir.name,
                    path: widgetDirPath,
                });
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
        try {
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
            projectTsConfig['angularCompilerOptions']['strictTemplates'] = false;
            // =>save tsconfig
            fs.writeFileSync(path.join(this.source, 'tsconfig.json'), JSON.stringify(projectTsConfig, null, 2));

            // =>add properties to tsconfig.app of project
            if (fs.existsSync(path.join(this.source, 'tsconfig.app.json'))) {
                let projectTsConfigApp = fs.readFileSync(path.join(this.source, 'tsconfig.app.json')).toString();
                if (projectTsConfigApp.startsWith('/*')) {
                    let lines = projectTsConfigApp.split('\n');
                    lines.shift();
                    projectTsConfigApp = lines.join('\n');
                }
                projectTsConfigApp = JSON.parse(projectTsConfigApp);
                if (!projectTsConfigApp['include'].includes("src/app/StrongFB/**/*.ts")) {
                    projectTsConfigApp['include'].push("src/app/StrongFB/**/*.ts");
                }
                // =>save tsconfig
                fs.writeFileSync(path.join(this.source, 'tsconfig.app.json'), JSON.stringify(projectTsConfigApp, null, 2));
            }
        } catch (e) {
            error(e);
        }
    }
    /********************************** */
    async addRequiredPackages() {
        let packages = {
            'notiflix': '^3.2.5',
            // '@toast-ui/editor': '^3.1.1'
        };
        let exists = true;

        // =>choose language, if not
        if (!this.projectPackageJson.languages) {
            let selectLangOption = await select('choose project language', ['en', 'fa', 'all'], 'en');
            let langs = [selectLangOption];
            if (selectLangOption === 'all') {
                langs = ['en', 'fa'];
            }
            if (langs.includes('fa')) {
                packages['jalali-moment'] = '^3.3.11';
            }
            if (langs.includes('en')) {
                packages['moment'] = '^2.29.3';
            }
            // =>save languages
            this.projectPackageJson.languages = langs;
        }
        // =>check exist all packages before
        for (const pack of Object.keys(packages)) {
            if (!this.projectPackageJson.dependencies[pack] && !this.projectPackageJson.devDependencies[pack]) {
                exists = false;
                // =>if not exist, add it
                this.projectPackageJson.dependencies[pack] = packages[pack];
            }
        }
        // console.log('packs:', packages, exists);
        // =>save package.json
        fs.writeFileSync(path.join(this.source, 'package.json'), JSON.stringify(this.projectPackageJson, null, 2));
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
    /********************************** */
    async buildStrongFBModuleFile(filePath: string) {
        let declarations = [];
        let widgetImports = [];
        // =>iterate widgets
        for (const widget of this.loadedWidgets) {
            // =>find component class file
            let componentClassFilePath = path.join(widget.path, widget.name + '.component.ts');
            if (!fs.existsSync(componentClassFilePath)) {
                componentClassFilePath = path.join(widget.path, this.uiFramework, widget.name + '.component.ts');
            }
            // =>extract widget class
            let res = fs.readFileSync(componentClassFilePath).toString().matchAll(/export\s+class\s+[\w\d]+/g);
            if (!res) continue;
            while (true) {
                let match = res.next().value;
                if (!match) break;
                let widgetClassName = match[0].replace(/export\s+class\s+/g, '').trim();
                // =>create widget import
                widgetImports.push(`import { ${widgetClassName} } from "./widgets/${widget.name}/${widget.name}.component";
                            `)
                // =>add declarations
                declarations.push(widgetClassName);
            }
        }
        // =>write to file
        fs.writeFileSync(filePath, `
            import { CommonModule } from "@angular/common";
            import { HttpClientModule } from "@angular/common/http";
            import { NgModule } from "@angular/core";
            import { FormsModule } from "@angular/forms";
            import { SanitizerUrlPipe } from "./pipes/SanitizerUrlPipe.pipe";
            import { StrongFBSharedModule } from "./StrongFB-shared.module";


            ${widgetImports.join('\n')}

            @NgModule({
                declarations: [
                    SanitizerUrlPipe,

                   ${declarations.join(',\n')}
                ],
                imports: [
                    StrongFBSharedModule,
                    CommonModule,
                    FormsModule,
                    HttpClientModule,
                ],
                providers: [],
                exports: [
                    ${declarations.join(',\n')}
                ],
            })
            export class StrongFBModule { }

            /************************************/
            /**GENERATED*BY*STRONG*FORM*BUILDER**/
            /************************************/

                    `);
    }

}