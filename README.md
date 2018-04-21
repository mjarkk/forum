# Forum
Make a forum as school project.  
build with [React](https://reactjs.org/) and [PHP](http://www.php.net/).  

## Webserver Setup
- go to: [/releases](https://github.com/mjarkk/forum/releases)
- Download the latest version and copy the fils to the webserver
- Make sure to chmod `666` or `777` all files to ensure file premissions

## Setup Dev
- Install [node.js](https://nodejs.org/en/)
- `npm i -g webpack webpack-cli yarn` (on **linux** and **macOS** you might need to add `sudo`)
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
- Make sure to chmod `666` or `777` all files to ensure file premissions

## Create release
- `npm i -g gulp gulp-cli`
- `gulp`
