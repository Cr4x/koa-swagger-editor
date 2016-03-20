'use strict';

const koa = require('koa');
const swagger = require('koa-swagger-editor');

const server = koa()
	.use(swagger({
		statics: __dirname + '/../swagger-editor/dist',
		specFile: __dirname + '/multi1.api.yml',
		path: '/internal'
	}))
	.use(swagger({
		statics: __dirname + '/../swagger-editor/dist',
		specFile: __dirname + '/multi2.api.yml',
		path: '/external',
		defaults: {
			exampleFiles: []
		}
	}))
	.listen(3000);
	
console.log('Listening on 0.0.0.0:3000');

process
	.on('SIGINT', () => server.close())
	.on('SIGTERM', () => server.close());
