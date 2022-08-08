import { info, success, clear } from "@dat/lib/log";
import { InitCommand } from "./src/commands/init";
import { cli } from '@dat/lib/argvs';

const VERSION = '0.37';
export async function main(): Promise<number> {
   clear();
   info(`--------------- StrongFormBuilder - version ${VERSION} ---------------`);
   success(`
                                                                              
      _____ _                   _____               _____     _ _   _         
     |   __| |_ ___ ___ ___ ___|   __|___ ___ _____| __  |_ _|_| |_| |___ ___ 
     |__   |  _|  _| . |   | . |   __| . |  _|     | __ -| | | | | . | -_|  _|
     |_____|_| |_| |___|_|_|_  |__|  |___|_| |_|_|_|_____|___|_|_|___|___|_|  
                           |___|                                              
   
   `);
   // =>load commands
   InitCommand


   await cli();

   return 0;
}