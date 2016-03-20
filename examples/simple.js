'use strict';

const koa = require('koa');
const swagger = require('koa-swagger-editor');

const server = koa()
	.use(swagger({
		statics: __dirname + '/../swagger-editor/dist',
		specFile: __dirname + '/simple.api.yml'
	}))
	.listen(3000);
	
console.log('Listening on 0.0.0.0:3000');

process
	.on('SIGINT', () => server.close())
	.on('SIGTERM', () => server.close());
