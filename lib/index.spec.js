'use strict';

const test = require('ava').test;
const index = require('./');

const _ = require('lodash');
const request = require('co-supertest');
const koa = require('koa');

let koaApp;
let server;
let agent;

const specURL = 'some/test';

test.before('start server', t => {
	koaApp = koa().use(index({ path: '/swagger', statics: '../swagger-editor/dist', specFile: './api.yml', specURL, defaults: {useYamlBackend: false} }));
	server = koaApp.listen(3000);
	agent = request.agent(server);
});

test('throw errors for required/wrong options', t => {
	t.throws(() => index());
	t.throws(() => index({}));
	t.throws(() => index({ statics: '../nonexistingdirectory' }));
	t.throws(() => index({ statics: './index.js' })); // existing but no directory
	t.throws(() => index({ statics: '../swagger-editor' })); // existing directory but no valid config/default.json
	t.throws(() => index({ statics: '../swagger-editor/dist' })); // missing specFile
	t.notThrows(() => index({ statics: '../swagger-editor/dist', specFile: './api.yml' }));
});

test('use correct endpoint if no specURL is given', t => {
	let obj = { statics: '../swagger-editor/dist', specFile: './api.yml' };
	index(obj);
	t.is(obj.specURL, '/editor/spec');
});

test('rederict w/o trailing /', function* (t) {
	let result = yield agent
		.get('/swagger');
		
	t.is(result.status, 302);
});

test('provide correct swagger defaults', function* (t) {
	let res = yield agent
		.get('/swagger/config/defaults.json');

	t.is(res.status, 200);
	t.ok(_.isMatch(res.body, { useBackendForStorage: true, useYamlBackend: true, backendEndpoint: specURL }));
});

test.after.cb('stop server', t => {
	server.close(() => { t.end(); });
});
