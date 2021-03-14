const withOffline = require('next-offline');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const withTM = require('next-transpile-modules')(['@fullcalendar']);
const { nextI18NextRewrites } = require('next-i18next/rewrites');
const localeSubpaths = {
	vi: 'vi',
	en: 'en',
};
module.exports = withOffline(
	withCSS(
		withSass(
			withTM({
				target: process.env.NEXT_TARGET || 'serverless',
				workboxOpts: {
					swDest: 'static/service-worker.js',
					runtimeCaching: [
						{
							urlPattern: /[.](png|jpg|ico|css)/,
							handler: 'CacheFirst',
							options: {
								cacheName: 'assets-cache',
								cacheableResponse: {
									statuses: [0, 200],
								},
							},
						},
						{
							urlPattern: /^https:\/\/code\.getmdl\.io.*/,
							handler: 'CacheFirst',
							options: {
								cacheName: 'lib-cache',
							},
						},
						{
							urlPattern: /^http.*/,
							handler: 'NetworkFirst',
							options: {
								cacheName: 'http-cache',
							},
						},
					],
				},

				rewrites: async () => nextI18NextRewrites(localeSubpaths),
				publicRuntimeConfig: {
					localeSubpaths,
				},
				trailingSlash: true,
				shallowRender: true,
			}),
		),
	),
);
