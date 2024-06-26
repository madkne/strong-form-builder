import { info, success, clear, warning } from "@dat/lib/log";
import { InitCommand } from "./src/commands/init";
import { cli } from '@dat/lib/argvs';
import { GenerateDocumentsCommand } from "./src/commands/gen_docs";
import { JsonFactoryCommand } from "./src/commands/json-factory";
import { VERSION } from "./src/common";
 

export async function main(): Promise<number> {
   clear();
   info(`--------------- StrongFormBuilder - version ${VERSION} ---------------`);
   warning(`

   ╭━━━╮╭╮╱╱╱╱╱╱╱╱╱╱╱╭━━━╮╱╱╱╱╱╱╱╭━━╮╱╱╱╱╭╮╱╱╭╮
   ┃╭━╮┣╯╰╮╱╱╱╱╱╱╱╱╱╱┃╭━━╯╱╱╱╱╱╱╱┃╭╮┃╱╱╱╱┃┃╱╱┃┃
   ┃╰━━╋╮╭╋━┳━━┳━╮╭━━┫╰━━┳━━┳━┳╮╭┫╰╯╰┳╮╭┳┫┃╭━╯┣━━┳━╮
   ╰━━╮┃┃┃┃╭┫╭╮┃╭╮┫╭╮┃╭━━┫╭╮┃╭┫╰╯┃╭━╮┃┃┃┣┫┃┃╭╮┃┃━┫╭╯
   ┃╰━╯┃┃╰┫┃┃╰╯┃┃┃┃╰╯┃┃╱╱┃╰╯┃┃┃┃┃┃╰━╯┃╰╯┃┃╰┫╰╯┃┃━┫┃
   ╰━━━╯╰━┻╯╰━━┻╯╰┻━╮┣╯╱╱╰━━┻╯╰┻┻┻━━━┻━━┻┻━┻━━┻━━┻╯
   ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭━╯┃
   ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╰━━╯
   `);
   // =>load commands
   InitCommand
   GenerateDocumentsCommand
   JsonFactoryCommand

   await cli();

   return 0;
}  