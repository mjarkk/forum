# Forum
Make a forum as school project build with [React](https://reactjs.org/) and [PHP](http://www.php.net/).  

## Setup
- Install [node.js](https://nodejs.org/en/)
- `npm i -g webpack webpack-cli yarn` (on linux and macOS you might need to add `sudo`)
- `yarn`
- `yarn build`
- Add a SQL database
- now follow `Setup Build` or `Setup Dev`

## Setup Build
- Change `build/api/env.php` to your database info  
- Copy the `build` folder to your webserver  

## Setup Dev
- Add to the nginx virtual server config:  
```BASH
location ~ (\.env) { 
  return 404;
}
```  
- Or in case of an apache server move the .htaccess to the root of your webserver  
- Create: `build/api/.env`  
- With This data:  
```JSON
{
  "SQLpassword": "password",
  "SQLusername": "username",
  "SQLserver": "localhost",
  "SQLdatabaseName": "forum"
}
```  
- Make a softlink from `build` to you'r webserver  

## To Do
- user
  - login process
  - ~~login style~~ :heavy_check_mark:
  - register style
  - register process
  - user settings
  - set user proviel picture
- message
  - ~~message itself~~ :heavy_check_mark:
  - add reactions to messages
  - user icon
  - react to the message
  - ~~markdown support~~ :heavy_check_mark:
  - add things to markdown
  - save fetches to indexedDB or local storage
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

## Maybe?
- Add docker setup file