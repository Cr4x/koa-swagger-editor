'use strict';

const _ = require('lodash');
const fs = require('fs');
const router = require('koa-router');
const parse = require('co-body');

module.exports = api;

/**
 * @param {Object} options The options object
 * @returns {Object} koa router object
 */
function api(options) {

	let specURL = options.specURL[0] === '/' ? options.specURL : '/' + options.specURL;

	return router()
		.get(specURL, loadSpec)
		.put(specURL, saveSpec);
		
	/**
	 * Load swagger specs from file
	 * @param {Function} next The next generator in koa`s chain\
	 * @returns {any} anything returned by next or undefined
	 * @this koa
	 */
	function* loadSpec(next) {

		if (!_.some(this.accepts(), e => e === 'application/yaml')) {
			this.status = 400;
			return yield next;
		}

		try {
			this.body = fs.readFileSync(options.specFile);
			this.status = 200;
			this.type = 'application/yaml';
		} catch (error) {
			this.status = 500;
		}

		return yield next;
	}

	/**
	 * Save swagger specs to file
	 * @param {Function} next The next generator in koa`s chain\
	 * @returns {any} anything returned by next or undefined
	 * @this koa
	 */
	function* saveSpec(next) {
		
		// right now swagger-editor fails with json, use yaml only
		if (this.request.type !== 'application/yaml') {
			this.status = 400;
			return yield next;
		}

		let body = yield parse.text(this);

		try {
			fs.writeFileSync(options.specFile, body);
			this.status = 200;
			this.type = this.request.type;
		} catch (error) {
			this.status = 500;
		}

		return yield next;
	}
};
