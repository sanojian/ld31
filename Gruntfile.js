var path = require('path');

module.exports = function(grunt) {

	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration.
	grunt.initConfig({
		watch: {
			scripts: {
				files: [
					'js/*.js'
				],
				tasks: ['jshint','concat']
			}
		},
		jshint: {
			options: {
				evil: true
			},
			all: ['js/*.js']
		},
		concat: {
			basic_and_extras: {
				files: {
					'includes/ld31.js': ['js/*.js']
				}
			}
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-ssh');
	grunt.registerTask('dev', [
		'watch'
	]);
	grunt.registerTask('build', ['jshint', 'concat']);
	grunt.registerTask('default', ['build'], ['dev']);

};
