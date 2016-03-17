'use strict';

const koa = require('koa');
const router = require('koa-router');
const serve = require('koa-static');

exports.init = init;

/**
 * initializes koa-swagger-editor
 * @param {Object} options The options object
 * @returns {koa} koa The koa generator
 */
function* init(options) {
	
	options = options || {};
	options.path = options.path || '';

	if (!options.statics) {
		throw new Error('path to statics directory is required');
	}

	let koaRouter = router()
		.get('config/defaults.json', swaggerDefaults);

	return koa()
		.use(checkPath)
		.use(serve(options.statics))
		.use(koaRouter.routes());
		
	/* eslint-disable no-invalid-this */

	/**
	 * Serve default settings
	 * @param {Function} next The next generator in koa`s chain
	 * @returns {undefined}
	 */
	function* swaggerDefaults(next) {

		if (options.defaults) {
			Object.assign(this.body, options.defaults); 
		}
		
		yield next;
	}

	/**
	 * checkPath function redirect all swagger requests w/o trailing slash
	 * @param {Function} next The next generator in koa`s chain
	 * @returns {undefined}
	 */
	function* checkPath(next) {
		// koa statics use root url w/o trailing slash
		if (this.path === options.path) {
			this.path += '/';
		}

		yield next;
	}
	
	/* eslint-enable no-invalid-this */
}
