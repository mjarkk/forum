# Forum
Make a forum as school project

## PHP Setup
Make a softlink from build to you'r webserver

## Dev Setup
- Install [node.js](https://nodejs.org/en/)
- `npm i -g webpack webpack-cli yarn` (on linux you might need to add `sudo`)
- `yarn`
- `yarn build`

## What is what?
- DIR `build`: this folder contains all files that a webserver can use
- DIR `dynamic`: this folder contains files that need to be compiled by webpack
- FILE `.eslintrc.json`: ESlint config
- FILE `.gitignore`: Files to ignore by git
- FILE `LICENSE`: the license
- FILE `package-lock.json`: The package lock file created by npm
- FILE `package.json`: Contains the packages and scripts for webpack
- FILE `webpack.config.js`: The webpack config
- FILE `yarn.lock`: The package lock file created by yarn

## Maybe?
- Add docker setup file