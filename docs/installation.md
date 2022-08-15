# Installation

we can use DAT (@dat-tool) for developing StrongFB. so you must first install it on your system.

## Install & Use

- install node 12 or higher version
- install DAT by `npm install -g dat-tool`
- go to `strong_form_builder` folder
- type `npm install` to install node types
- then, type `dat m `, if you want to develop script

## integrate with your Angular project

1. for integrate with your project, just need to clone **StrongFB** repository (`master` branch) on your project directory or parent directory of it.

2. and then type `dat p i`. if you have some angular project in one directory and **strongFB** cloned on the directory, so detect all of them and you must to choose which angular project!

?> if detect just one angular project, in default no gives you any question for choose.

3. after it, you must to choose which UI framework, used in your project. (like `nebular`)

4. finally add some directories in your projects, change your `tsconfig.json` file and install need dependencies (before add in `package.json` file)

5. and DONE!

?> for update your **StrongFB** of project, just need to repeat these steps!