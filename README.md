# Forum
Make a forum as school project using javascript and PHP.  
I have added React to this project myself to learn a bit :D

## PHP Setup
Make a softlink from build to you'r webserver

## Setup
- Install [node.js](https://nodejs.org/en/)
- `npm i -g webpack webpack-cli yarn` (on linux you might need to add `sudo`)
- `yarn`
- `yarn build`

## To Do
- user
  - login
  - register
  - user settings
- message
  - message itself :heavy_check_mark:
  - message reactions
  - user icon 
  - react to the message
  - markdown support
  - add things to markdown
  - save fetches to indexedDB or local storage
  - scroll and load more data
- menu
  - make working links
- lists
  - messages :heavy_check_mark:
  - go to message if clicked 
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
