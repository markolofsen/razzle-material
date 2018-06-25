const path = require('path');
const fs = require('fs');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
	modify(config, {target, dev}) {
		const appConfig = Object.assign({}, config);
		const isServer = target !== 'web';


		const postCssLoader = {
			loader: 'postcss-loader',
			options: {
				ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
				sourceMap: dev,
				plugins: () => [autoprefixer({
						browsers: [
							'>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9' // React doesn't support IE8 anyway
						]
					})]
			}
		};


		// Import Resolving
		// ====================
		// Allow absolute paths in imports, e.g. import Button from 'components/Button'
		appConfig.resolve.modules.push('src', 'src/js', 'src/css', 'src/images');

		// ESLint
		// ====================
		// appConfig.module.rules.push({
		// 	enforce: 'pre',
		// 	test: /\.js$/,
		// 	exclude: /node_modules/,
		// 	use: [
		// 		{
		// 			loader: 'eslint-loader',
		// 			options: {
		// 				emitWarning: true,
		// 				configFile: '.eslintrc.js',
		// 				quiet: true
		// 			}
		// 		}
		// 	]
		// });

		// Babel
		// ====================
		appConfig.module.rules.push({
			test: /\.js$/,
			exclude: /node_modules/,
			use: [
				{
					loader: 'babel-loader',
					options: {
						presets: ['razzle/babel'],
						plugins: ['transform-react-jsx', 'transform-decorators-legacy']
					}
				}
			]
		});

		// SCSS Modules
		// ====================
		// Options for PostCSS as we reference these options twice
		// Adds vendor prefixing to support IE9 and above
		const postCSSLoaderOptions = {
			ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
			sourceMap: true,
			plugins: () => [
				require('postcss-flexbugs-fixes'),
				autoprefixer({flexbox: 'no-2009'})
			]
		};

		appConfig.module.rules.push({
			test: /.scss$/,
			// Handle scss imports on the server

			use: isServer
				? ['css-loader', 'sass-loader']
				: // For development, include source map
				dev
					? [
						'style-loader', {
							loader: 'css-loader',
							options: {
								sourceMap: true,
								modules: true,
								localIdentName: '[name]__[local]___[hash:base64:5]'
							}
						},
						postCssLoader, {
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
					: // For production, extract CSS
					ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									importLoaders: 1,
									modules: true
								}
							},
							postCssLoader,
							'sass-loader'
						]
					})
		});

		// if (dev) {
		// 	appConfig.module.rules.push({
		// 		test: /\.scss$/,
		// 		use: isServer
		// 			? [
		// 				'isomorphic-style-loader', {
		// 					loader: require.resolve('css-loader'),
		// 					options: {
		// 						importLoaders: 1,
		// 						modules: true,
		// 						sourceMap: true,
		// 						localIdentName: '[name]__[local]--[hash:base64:5]'
		// 					}
		// 				}, {
		// 					loader: require.resolve('sass-loader'),
		// 					options: {
		// 						sourceMap: true
		// 					}
		// 				}
		// 			]
		// 			: [
		// 				require.resolve('style-loader'), {
		// 					loader: require.resolve('css-loader'),
		// 					options: {
		// 						importLoaders: 1,
		// 						modules: true,
		// 						localIdentName: '[name]__[local]--[hash:base64:5]',
		// 						sourceMap: true
		// 					}
		// 				}, {
		// 					loader: require.resolve('postcss-loader'),
		// 					options: postCSSLoaderOptions
		// 				}, {
		// 					loader: require.resolve('sass-loader'),
		// 					options: {
		// 						sourceMap: true
		// 					}
		// 				}
		// 			]
		// 	});
		// } else if (!dev && !isServer) {
		// 	appConfig.module.rules.push({
		// 		test: /\.scss$/,
		// 		use: ExtractTextPlugin.extract({
		// 			fallback: {
		// 				loader: require.resolve('style-loader'),
		// 				options: {
		// 					hmr: false
		// 				}
		// 			},
		// 			use: [
		// 				{
		// 					loader: require.resolve('css-loader'),
		// 					options: {
		// 						importLoaders: 1,
		// 						minimize: true,
		// 						sourceMap: true,
		// 						modules: true,
		// 						localIdentName: '[name]__[local]--[hash:base64:5]'
		// 					}
		// 				}, {
		// 					loader: require.resolve('postcss-loader'),
		// 					options: postCSSLoaderOptions
		// 				}, {
		// 					loader: require.resolve('sass-loader'),
		// 					options: {
		// 						sourceMap: true
		// 					}
		// 				}
		// 			]
		// 		})
		// 	});
		//
		// 	appConfig.plugins.push(new ExtractTextPlugin('static/css/[name].[contenthash:8].css'));
		// } else if (!dev && isServer) {
		// 	appConfig.module.rules.push({
		// 		test: /\.scss$/,
		// 		use: [
		// 			'isomorphic-style-loader', {
		// 				loader: require.resolve('css-loader'),
		// 				options: {
		// 					importLoaders: 1,
		// 					minimize: true,
		// 					sourceMap: true,
		// 					modules: true,
		// 					localIdentName: '[name]__[local]--[hash:base64:5]'
		// 				}
		// 			}, {
		// 				loader: require.resolve('sass-loader'),
		// 				options: {
		// 					sourceMap: true
		// 				}
		// 			}
		// 		]
		// 	});
		// }

		// SVG Sprite
		// ====================
		// appConfig.module.rules[2].exclude.push(resolveApp('src/images/sprite'));
		// appConfig.module.rules.push({
		// 	test: /\.svg$/,
		// 	include: [resolveApp('src/images/sprite')],
		// 	use: [
		// 		{
		// 			loader: require.resolve('svg-sprite-loader'),
		// 			options: {
		// 				symbolId: '[name]_[hash]',
		// 				esModule: false
		// 			}
		// 		}
		// 	]
		// });

		return appConfig;
	}
};

// const autoprefixer = require('autoprefixer');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
//
// module.exports = {
// 	modify: (baseConfig, {target, dev}) => {
// 		const appConfig = Object.assign({}, baseConfig);
// 		const isServer = target !== 'web';
//
// 		const postCssLoader = {
// 			loader: 'postcss-loader',
// 			options: {
// 				ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
// 				sourceMap: dev,
// 				plugins: () => [autoprefixer({
// 						browsers: [
// 							'>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9' // React doesn't support IE8 anyway
// 						]
// 					})]
// 			}
// 		};
//
// 		appConfig.module.rules.push({
// 			test: /.scss$/,
// 			// Handle scss imports on the server
//
// 			use: isServer
// 				? ['css-loader', 'sass-loader']
// 				: // For development, include source map
// 				dev
// 					? [
// 						'style-loader', {
// 							loader: 'css-loader',
// 							options: {
// 								sourceMap: true,
// 								modules: true,
// 								localIdentName: '[name]__[local]___[hash:base64:5]'
// 							}
// 						},
// 						postCssLoader, {
// 							loader: 'sass-loader',
// 							options: {
// 								sourceMap: true
// 							}
// 						}
// 					]
// 					: // For production, extract CSS
// 					ExtractTextPlugin.extract({
// 						fallback: 'style-loader',
// 						use: [
// 							{
// 								loader: 'css-loader',
// 								options: {
// 									importLoaders: 1,
// 									modules: true
// 								}
// 							},
// 							postCssLoader,
// 							'sass-loader'
// 						]
// 					})
// 		});
//
// 		if (!isServer && !dev) {
// 			appConfig.plugins.push(new ExtractTextPlugin('static/css/[name].[contenthash:8].css'));
// 		}
//
// 		return appConfig;
// 	}
// };
