# Forum
Make a forum as school project using javascript and PHP.  
I have added React to this project myself to learn a bit :D

## Setup
- Make a softlink from build to you'r webserver
- Install [node.js](https://nodejs.org/en/)
- `npm i -g webpack webpack-cli yarn` (on linux you might need to add `sudo`)
- `yarn`
- `yarn build`

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
- login with google
