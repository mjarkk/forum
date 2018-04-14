# Forum
Make a forum as school project.  
build with [React](https://reactjs.org/) and [PHP](http://www.php.net/).  

## Webserver Setup
- go to: [/releases](https://github.com/mjarkk/forum/releases)
- Download the latest version and copy the fils to the webserver

## Setup Dev
- Install [node.js](https://nodejs.org/en/)
- `npm i -g webpack webpack-cli yarn` (on linux and macOS you might need to add `sudo`)
- `yarn`
- `yarn dev` (this will start a live reload server and watches the files)
- Add a SQL database 
- Add to the nginx virtual server config:  
```BASH
location ~ (\.env) { 
  return 404;
}
```  
- Or in case of an apache server move the .htaccess to the root of your webserver
- Make a softlink from `build` to you'r webserver or just copy the folder after the build has completed

## Tests
Currently I have no goal with the test file  
It will probebly be used in the build progress to test the build

## To Do
- user
  - ~~login process~~ :heavy_check_mark:
  - ~~login style~~ :heavy_check_mark:
  - ~~register style~~ :heavy_check_mark:
  - ~~register process~~ :heavy_check_mark:
  - ~~user settings~~ :heavy_check_mark:
  - ~~set user proviel picture~~ :heavy_check_mark:
- message
  - ~~message itself~~ :heavy_check_mark:
  - ~~add reactions to messages~~ :heavy_check_mark:
  - ~~user icon~~ :heavy_check_mark:
  - ~~markdown support~~ :heavy_check_mark:
- menu
  - ~~make working links~~ :heavy_check_mark:
- lists
  - ~~messages~~ :heavy_check_mark:
  - ~~go to message if clicked~~ :heavy_check_mark:
  - ~~sub lists~~ :heavy_check_mark:
  - ~~go to sub list when clicked~~ :heavy_check_mark:
- PWA
  - service worker
  - manifest
  - a wrapper around fetch that re-fetches automaticly when it fails or gets the data from the cache if it's available
  - a good score in lighthouse chrome dev tool -> Audits 
  - save fetches to indexedDB or local storage
- Build & Tests
  - ~~Add test setup~~ :heavy_check_mark:
  - ~~Add suport for making a release package~~ :heavy_check_mark:
  - ~~Run `yarn build`~~ :heavy_check_mark:
  - Check if the build was correct (maybe using docker and chrome headless also maybe inside of docker for easy access)
  - A lot of tests in the testing part
  - ~~Compress the package inside a zip file~~ :heavy_check_mark:
