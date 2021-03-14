const Handlebars = require('handlebars');
const library = require('@fortawesome/fontawesome-svg-core').library;
const dom = require('@fortawesome/fontawesome-svg-core').dom;
const icon = require('@fortawesome/fontawesome-svg-core').icon;
const fas = require('@fortawesome/free-solid-svg-icons').fas;
const far = require('@fortawesome/free-solid-svg-icons').far;

library.add(fas);
library.add(far);
Handlebars.registerHelper('fontawesome-css', function () {
	return new Handlebars.SafeString(dom.css());
});

Handlebars.registerHelper('fontawesome-icon', function (args) {
	return new Handlebars.SafeString(
		icon({
			prefix: 'fas',
			iconName: args.hash.icon,
			prefix: 'far',
			iconName: args.hash.icon,
		}).html,
	);
});
