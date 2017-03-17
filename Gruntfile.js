module.exports = function(grunt) {
  grunt.initConfig({
	// clean
	clean: {
		contents: ['dist/*']
	},
    // Copy all the files from src to dist
    copy: {
      dist: {
        cwd: 'src/lib',
        expand: true,
        src: '**',
        dest: 'dist/lib'
      }
    },
	//uglify JS
	    uglify: {
      js: {
        files: {
		  'dist/js/app.min.js': 'src/js/app.js',
      'dist/js/mapElementStyles.min.js': 'src/js/mapElementStyles.js',
		  'dist/js/radius.min.js': 'src/js/radius.js',
      'dist/js/menuslide.min.js': 'src/js/menuslide.js',
		  'dist/lib/infobubble.min.js': 'src/lib/infobubble.js',
		  'dist/lib/jquery.min.js': 'src/lib/jquery.js'
        }
      }
    },
    // Minify html files
    htmlmin: {
      options: {                                 // Target options
        removeComments: true,
        collapseWhitespace: true
      },
      dist: {
          files: {                                   // Dictionary of files
        'index.html': 'index_pretty.html'     // 'destination': 'source'
          }
      }
    },
	// Minify css files
	cssmin: {
		css: {
			files: {
				'dist/css/appstyles.min.css': 'src/css/appstyles.css'
			}	
		}
	},
	// watch the files
	watch: {
			files: ['src/**/*'],
			tasks: ['clean', 'copy','uglify', 'htmlmin','cssmin']
		}
	}
	)
  ;
  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default tasks.
  grunt.registerTask('default', ['clean', 'copy', 'uglify', 'htmlmin','cssmin','watch']);
};