'use strict';

const fs = require('fs');
const path = require('path');
const koa = require('koa');
const router = require('koa-router');
const serve = require('koa-static');
const mount = require('koa-mount');

module.exports = init;

/**
 * initializes koa-swagger-editor
 * @param {Object} options The options object
 * @param {String} options.statics The path to the swagger-editor directory, to serve them as statics
 * @param {String} options.specFile The file path we'll use to read or write our api specs
 * @param {String} options.path The url mount path
 * @param {Object} [options.defaults] The options object for swagger-editor. Here you can override any settings from swagger-editor/config/defaults.json
 * @param {boolean} [options.defaults.useYamlBackend=true] Right now its hardcoded true and you are not able to change this, because swagger-editor has some problems with json
 * @param {boolean} [options.defaults.useBackendForStorage=true] This true by default, otherwise i guess you are using this module without reason
 * @param {String} [options.specURL] The URL used by swagger-editor to read/write the specs. Default is the same as in swagger-editor/config/defaults.json:backendEndpoint
 * @returns {any} koa-mount The koa generator
 */
function init(options) {

	options = options || {};
	options.path = options.path || '/';

	if (!options.statics) {
		throw new Error('path to statics directory is required');
	}

	if (!options.specFile) {
		throw new Error('filepath for spec is required');
	}

	const staticStat = fs.statSync(options.statics);

	if (!staticStat || !staticStat.isDirectory()) {
		throw new Error('cannot read/access statics directory: ' + options.statics);
	}

	let configDefaults = {};

	try {
		configDefaults = JSON.parse(fs.readFileSync(path.resolve(options.statics + '/config/defaults.json')));
	} catch (e) {
		throw new Error('cannot read/access config defaults.json');
	}
	
	// If not, this module would make no sense
	configDefaults.useBackendForStorage = true;

	if (!options.specURL) {
		options.specURL = configDefaults.backendEndpoint;
	} else {
		configDefaults.backendEndpoint = options.specURL;
	}
	
	if (!options.defaults || options.defaults.useYamlBackend !== false) {
		configDefaults.useYamlBackend = true;
	}

	let apiRoute = require('./api')(options);

	let koaRouter = router()
		.get('/config/defaults.json', swaggerDefaults);

	let koaApp = koa()
		.use(checkPath)
		.use(serve(options.statics, { defer: true }))
		.use(koaRouter.routes())
		.use(apiRoute.routes());

	return mount(options.path, koaApp);

	/**
	 * Serve swagger default settings with current options.defaults
	 * @param {Function} next The next generator in koa`s chain
	 * @returns {any} anything returned by next or undefined
	 * @this koa
	 */
	function* swaggerDefaults(next) {

		this.body = Object.assign({}, configDefaults);

		if (options.defaults) {
			Object.assign(this.body, options.defaults);
		}
		
		// right now swagger-editor fails with json, use yaml only
		this.body.useYamlBackend = true;

		return yield next;
	}

	/**
	 * checkPath function redirect all swagger requests w/o trailing slash
	 * @param {Function} next The next generator in koa`s chain
	 * @returns {any} anything returned by next or undefined
	 * @this koa
	 */
	function* checkPath(next) {
		
		// koa statics use root url w/o trailing slash
		if (this.originalUrl === options.path && this.originalUrl[options.path.length - 1] !== '/') {
			this.redirect(this.originalUrl + '/');
		}

		return yield next;
	}
}
