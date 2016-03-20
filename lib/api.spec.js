'use strict';

const test = require('ava').test;
const index = require('./');

const fs = require('fs');
const request = require('co-supertest');
const koa = require('koa');
const tempfile = require('tempfile');

let koaApp;
let server;
let agent;

const path = '/swagger';
const specURL = '/some/test';
const specFile = tempfile('.yml');
let testContent = 'saved content';

test.before('start server', t => {
	fs.writeFileSync(specFile, testContent, { encoding: 'utf8' });
	
	koaApp = koa().use(index({ path, statics: '../swagger-editor/dist', specFile, specURL }));
	server = koaApp.listen(3001);
	agent = request.agent(server);
});

test('content must be yaml for saving', function* (t) {
	let result = yield agent
		.put(path + specURL)
		.set('Content-type', 'application/json');

	t.is(result.status, 400);
});

test('save correctly', function* (t) {
	testContent = 'saved content from request';
	let result = yield agent
		.put(path + specURL)
		.set('Content-type', 'application/yaml')
		.send(testContent);
		
	t.is(result.status, 200);
	let fileContent = fs.readFileSync(specFile, { encoding: 'utf8' });
	
	t.is(fileContent, testContent);
});

test('request must accept yaml', function* (t) {
	let result = yield agent
		.get(path + specURL)
		.set('Accept', 'application/json');

	t.is(result.status, 400);
});

test('load correctly', function* (t) {
	let result = yield agent
		.get(path + specURL)
		.set('Accept', 'application/yaml');

	t.is(result.status, 200);
	t.is(result.text, testContent);
});

test.after('response is 500 on error', function* (t) {
	
	fs.chmodSync(specFile, 0);
	
	let result = yield agent
		.get(path + specURL)
		.set('Accept', 'application/yaml');
	
	t.is(result.status, 500);

	result = yield agent
		.put(path + specURL)
		.set('Content-type', 'application/yaml')
		.send('anything');
		
	t.is(result.status, 500);

	fs.chmodSync(specFile, '664');
});

test.after.cb('stop server', t => {
	server.close(() => { t.end(); });
});
