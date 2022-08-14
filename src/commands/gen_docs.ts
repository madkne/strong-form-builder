import { cliCommandItem, CliCommand, OnImplement } from '@dat/lib/argvs';
import { CommandArgvName, CommandName, UIFrameWorkType } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { cwd, copyDirectory, shell } from '@dat/lib/os';
import { saveRenderFile } from '@dat/lib/template';
import { detectAngularSourcePath, UIFrameWorks } from '../common';
import { select, boolean } from '@dat/lib/input';
import { info, success } from '@dat/lib/log';
// import * as TypeDoc from 'typedoc'
// import * as TJS from "typescript-json-schema";


/**
 * This is a simplistic solution until we implement proper DocNode rendering APIs.
 */
export class Formatter {
    public static renderDocNode(docNode: DocNode): string {
        let result: string = '';
        if (docNode) {
            if (docNode instanceof DocExcerpt) {
                result += docNode.content.toString();
            }
            for (const childNode of docNode.getChildNodes()) {
                result += Formatter.renderDocNode(childNode);
            }
        }
        return result;
    }

    public static renderDocNodes(docNodes: ReadonlyArray<DocNode>): string {
        let result: string = '';
        for (const docNode of docNodes) {
            result += Formatter.renderDocNode(docNode);
        }
        return result;
    }
}

@cliCommandItem()
export class GenerateDocumentsCommand extends CliCommand<CommandName, CommandArgvName> implements OnImplement {
    cwd: string;
    templatesPath: string;
    samplesPath: string;
    source: string;
    uiFramework: UIFrameWorkType;
    sourceAppStrongFBPath: string;


    get name(): CommandName {
        return 'generate-documents';
    }

    get description(): string {
        return "generate widgets and other ts files documentation and add them to main documentation";
    }

    get alias(): string {
        return 'gd';
    }

    /********************************** */

    async implement(): Promise<boolean> {
        let current = await cwd();

        // const program = TJS.getProgramFromFiles(
        //     [
        //         // path.resolve('src', 'document', 'interfaces.ts'),
        //         // path.resolve('src', 'types.ts'),
        //         // path.resolve('src', 'interfaces.ts'),
        //         // path.resolve('src', 'models', 'models.ts'),
        //         // path.resolve('src', 'apis', 'public', 'interfaces.ts'),
        //         current, 'data/templates/widgets/table/table-header.ts'
        //     ],
        //     {
        //         strictNullChecks: true,
        //     },
        // );

        // // optionally pass argument to schema generator
        // const settings: TJS.PartialArgs = {
        //     required: true,
        //     defaultProps: true,
        //     ignoreErrors: true,
        //     strictNullChecks: false,

        // };

        // // We can either get the schema for one file and one type...
        // // const schema = TJS.generateSchema(program, "WorkflowState", settings);
        // const generator = TJS.buildGenerator(program, settings);
        // // all symbols
        // const symbols = generator.getMainFileSymbols(program)
        // fs.mkdirSync(path.join(current, 'docjson'), { recursive: true })
        // for (const sym of symbols) {
        //     try {
        //         let res = generator.getSchemaForSymbols([sym]);
        //         fs.writeFileSync(path.join(current, 'docjson', sym + '.json'), JSON.stringify(res, null, 2))
        //     } catch (e) { }
        // }
        // var parse = require('json-schema-to-markdown')
        // var schema = generator.getSchemaForSymbols(['StrongFBTableWidget'])// An object that is a valid JSON Schema
        // var markdown = parse(schema)
        // fs.writeFileSync(current + '/sample2.md', markdown);

        // let yy = new tt.Generator()
        // let uu = yy.generateMarkdown([{ title: 'hello', schema }])
        // fs.writeFileSync(current + '/sample.md', uu[0].output);
        // console.log('res:', symbols, res)

        // const app = new TypeDoc.Application();


        return true;
    }
    /********************************** */


}