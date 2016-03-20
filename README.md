# koa-swagger-editor
[![Build Status](https://travis-ci.org/Cr4x/koa-swagger-editor.svg?branch=master)](https://travis-ci.org/Cr4x/koa-swagger-editor)

A backend service for swagger-editor, using koa.

## Table of Contents

- [Installation](#installation)
- [Quickstart](#quickstart)
- [API](#api)
- [Options](#options)

## Usage

### Installation

Add koa-swagger-editor to your project using npm and --save option:

```console
$ npm install koa-swagger-editor --save
```

```json
{
  "name": "awesome-package",
  "dependencies": {
    "koa-swagger-editor": "^1.0.0"
  }
}
```

#### Download swagger-editor

Download swagger-editor.zip from [here](https://github.com/swagger-api/swagger-editor#running-locally)


or use the following script in your package.json
```json
{
  "name": "awesome-package",
  "scripts": {
    "download": "if [ ! -d \"./swagger-editor\" ]; wget https://github.com/swagger-api/swagger-editor/releases/download/v2.9.9/swagger-editor.zip; unzip swagger-editor.zip -d swagger-editor; rm swagger-editor.zip; fi"
  },
  "dependencies": {
    "koa-swagger-editor": "^1.0.0"
  }
}
```
then run
```console
$ npm run download
```
which will download and extract the dist directory to swagger-editor/ (only if swagger-editor/ does not already exists).
In this case your `options.statics` is `<projectRoot>/swagger-editor/dist`
 

### Quickstart

```js
'use strict';

const koa = require('koa');
const swagger = require('koa-swagger-editor');

const server = koa()
	.use(swagger({
		statics: __dirname + '../swagger-editor/dist', // path to extracted swagger-editor.zip
		specFile: __dirname + '/simple.api.yml' // where we want to save our api specs
	}))
	.listen(3000);
	
console.log('Listening on 0.0.0.0:3000');

process
	.on('SIGINT', () => server.close())
	.on('SIGTERM', () => server.close());
```
Now simply head to http://localhost:3000, and start writing your API
### API

#### `require('koa-swagger-editor')(options)`
will return a [koa-mount](https://github.com/koajs/mount) middleware, which you can use like any other middleware with koa.use()

### Options
some options are required, so you cannot miss the options object. Optional options are surrounded by [] 

`options.statics`
The path to the swagger-editor directory, where index.html is located

`options.specFile`
The file path which is used to read/write our api specs

`[options.path='/']`
The url mount path, default is `'/'`

`[options.defaults={}]`
The options object for swagger-editor. Here you can override any settings from swagger-editor/config/defaults.json

`[options.defaults.useYamlBackend=true]`
Right now its hardcoded true and you are not able to change this, because swagger-editor has some problems with loading json into the editor

`[options.defaults.useBackendForStorage=true]` 
This is true by default, otherwise i would say you are using this extension without reason

`[options.specURL]`
The URL used by swagger-editor to read/write the specs. Default is the same as in swagger-editor/config/defaults.json:backendEndpoint