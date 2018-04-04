# Forum
Make a forum as school project build with [React](https://reactjs.org/) and [PHP](http://www.php.net/).  

## Setup
- Install [node.js](https://nodejs.org/en/)
- `npm i -g webpack webpack-cli yarn` (on linux and macOS you might need to add `sudo`)
- `yarn`
- Add a SQL database 
- now follow `Setup Build` or `Setup Dev` depending on your situation

## Setup Build
- `yarn build`
- Copy the `build` folder to your webserver  

## Setup Dev
- `yarn dev` (this will start a live reload server and watches the files)
- Add to the nginx virtual server config:  
```BASH
location ~ (\.env) { 
  return 404;
}
```  
- Or in case of an apache server move the .htaccess to the root of your webserver
- Make a softlink from `build` to you'r webserver or just copy the folder after the build has completed

## Tests
NOTE: I'm still learning to write good tests that are effective and don't need a lot / noting of preparation  
For now you still need to do some preparation and I haven't written a lot of them  
Follow the steps under here to run the steps  
- [x] Install [ava](https://github.com/avajs/ava#usage) as a global npm package
- [x] `yarn dev` and don't stop it until the tests are dun
- [x] The DB data from the setup is not removed (Welkom post, created users, ...)
- [x] Make sure you have `build/api/.env` with the credentials of the SQLdatabase
- `yarn test`
- Follow the hint that output of `yarn test` shows if it doesn't show the hint the `.env` file is wrong
- Go back to the terminal where the test was running and wait until it's dune

## To Do
- user
  - ~~login process~~ :heavy_check_mark:
  - ~~login style~~ :heavy_check_mark:
  - ~~register style~~ :heavy_check_mark:
  - ~~register process~~ :heavy_check_mark:
  - user settings
  - set user proviel picture
- message
  - ~~message itself~~ :heavy_check_mark:
  - ~~add reactions to messages~~ :heavy_check_mark:
  - user icon
  - quote message in reaction
  - ~~markdown support~~ :heavy_check_mark:
  - add things to markdown
  - scroll and load more data
- menu
  - make working links
- lists
  - ~~messages~~ :heavy_check_mark:
  - ~~go to message if clicked~~ :heavy_check_mark:
  - sub lists
  - go to sub list it clicked
  - message user icon
  - save fetches to indexedDB or local storage
- PWA
  - service worker
  - manifest
  - a wrapper around fetch that re-fetches automaticly when it fails or gets the data from the cache if it's available
  - a good score in lighthouse chrome dev tool -> Audits 
  - save fetches to indexedDB or local storage
