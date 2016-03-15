'use strict'

module.exports = {
	'rules': {
		'block-scoped-var': 2,
		'brace-style': [2, '1tbs', {'allowSingleLine': true}],
		'camelcase': 2,
		'comma-dangle': 2,
		'comma-style': 2,
		'consistent-this': [2, 'self'],
		'curly': 2,
		'dot-notation': 2,
		'eol-last': 2,
		'eqeqeq': 2,
		'indent': [2, 'tab', { 'SwitchCase': 1 }],
		'key-spacing': 2,
		'keyword-spacing': 2,
		'guard-for-in': 2,
		'linebreak-style': [2, 'unix'],
		'new-cap': [2, {'capIsNew': false}],
		'no-bitwise': 2,
		'no-caller': 2,
		'no-cond-assign': 2,
		'no-empty': 2,
		'no-eq-null': 2,
		'no-eval': 2,
		'no-invalid-this': 2,
		'no-iterator': 2,
		'no-loop-func': 2,
		'no-multi-spaces': 2,
		'no-multi-str': 2,
		'no-new': 2,
		'no-new-func': 2,
		'no-plusplus': 2,
		'no-proto': 2,
		'no-script-url': 2,
		'no-undef': 2,
		'no-unused-expressions': [2, {allowShortCircuit: true}],
		'no-unused-vars': [2, {'vars': 'all', 'args': 'none'}],
		'no-use-before-define': [2, 'nofunc'],
		'quotes': [2, 'single'],
		'require-jsdoc': 1,
		'spaced-comment': 2,
		'space-before-blocks': 2,
		'space-before-function-paren': [
			2,
			{
				'anonymous': 'always',
				'named': 'never'
			}
		],
		'space-infix-ops': 2,
		'space-in-parens': [2, 'never'],
		'semi': 2,
		'space-unary-ops': 2,
		'strict': [2, 'global'],
		'valid-jsdoc': 1,
		'wrap-iife': [2, 'inside']
	},
	'env': {
		'browser': false,
		'node': true,
        'es6': true
	}
};
