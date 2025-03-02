const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
defaultConfig.module.rules.push({
	test: /\.json$/,
	type: 'json'
});
defaultConfig.plugins.push(
	new CopyWebpackPlugin({
		patterns: [{
			from: 'src/**/config.json',
			to({ context, absoluteFilename }) {
				let a = path.parse(absoluteFilename).dir.split(/(\/|\\)/);
				return `${a[a.length - 1]}/[name].php`;
			},
			transform(content, absoluteFilename) { // Function to convert JSON to PHP array syntax
				function jsonToPhpArray(obj) {
					const type = typeof obj;
					if (Array.isArray(obj)) { return `array(${obj.map(jsonToPhpArray).join(', ')})`; }
					else if (type === 'object') {
						const pairs = Object.keys(obj).map(key => `'${key}' => ${jsonToPhpArray(obj[key])}`);
						return `array(${pairs.join(', ')})`;
					}
					else if (type === 'string') { return `'${obj}'`; }
					else if (type === 'number' || type === 'boolean') { return obj; }
					else { return 'null'; }
				}
				const data = JSON.parse(content.toString());
				const php = `<?php\nif (!defined('ABSPATH')){exit;}\n return ${jsonToPhpArray(data)};`;
				return Buffer.from(php);
			},
			noErrorOnMissing: !!1
		} // Preserves the directory structure
		]
	})
);
defaultConfig.externals = {
	...defaultConfig?.externals,
	coreweb: { root: '../../includes/core.es.js' },
};
//console.log(defaultConfig);
module.exports = defaultConfig;
