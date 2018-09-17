
let config = require('./protractor.conf.js').config;	

config.jasmineNodeOpts.defaultTimeoutInterval = 1000 * 60 * 60; // 1 hour timeout
config.specs = [
    // './src/filter.e2e-spec.ts', 
    // './src/news-section.e2e-spec.ts',
    './src/news.e2e-spec.ts',
    // './src/menu.e2e-spec.ts'
],
	
exports.config = config;