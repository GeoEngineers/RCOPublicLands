module.exports = function(grunt) {

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    // Configure a mochaTest task
    mochaTest: {
		options: {
			timeout:  10000,
		},
		test: {
			src: [
				'scripts/appServer/lib/models/test/*.js',
				'scripts/appServer/lib/test/*.js',
				'scripts/demoServer/src/models/test/*.js',
				'scripts/demoServer/src/test/*.js',
			]
		}
    }
  });

  grunt.registerTask('default', 'mochaTest');

};