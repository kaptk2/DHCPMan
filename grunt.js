module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		clean: {
			app: {
				src: ["build", "docs", "app/views/templates.html", 'test/unit/js']
			}
		},
		jade: {
			templates: {
				files: {
					'app/views/templates.html': ['app/components/**/*jade']
				}
			},
			pages: {
				files: {
					'app/views/pages.html': grunt.file.expand('app/pages/**/view.jade').sort() // Pages must be loaded in a certain order, enforce with init.d naming conventions.
				}
			},
			page: {
				files: {
					'build/index.html': 'app/views/page/index.jade'
				}
			}
		},
		livescript: {
			app: {
				files: {
					'build/scripts/app.js': 'app/scripts/ls/app.ls',
					'build/scripts/filters.js': 'app/scripts/ls/filters/*ls',
					'build/scripts/services.js': 'app/scripts/ls/services/*ls',
					'build/scripts/directives.js': 'app/scripts/ls/directives/*ls',
					'build/scripts/controllers.js': 'app/scripts/ls/controllers/*ls',
					'build/scripts/components.js': 'app/components/**/script.ls',
					'build/scripts/pages.js': 'app/pages/**/script.ls'
				},
				options: {
					bare: false
				}
			},
			dist: {
				files: {
					'build/dist/<%= pkg.name %>.js': 'build/dist/<%= pkg.name %>.ls'
				}
			},
			src: {
				files: {
					'lib/<%= pkg.name %>.js': ['src/*']
				}
			},
			test: {
				files: {
					'test/unit/js/components.js': ['app/components/**/test*ls'],
					'test/e2e/e2e.js': 'test/e2e/ls/**/*ls'
				},
				options: {
					bare: true
				}
			}
		},
		stylus: {
			app: {
				files: {
					'build/styles/<%= pkg.name %>.css': ['app/styles/styl/*styl', 'app/components/**/*styl', 'app/pages/**/*styl']
				}
			}
		},
		concat: {
			ls: {
				src: [
					'app/scripts/ls/app.ls',
					'app/scripts/ls/**/*ls',
					'app/components/**/*ls',
					'app/pages/**/*ls'
				],
				dest: 'build/dist/<%= pkg.name %>.ls'
			},
			unit: {
				src: ['test/unit/js/*'],
				dest: 'test/unit.js'
			}
		},
		copy: {
			app: {
				files: {
					'build/vendors/': 'components/**',
					'build/styles/img/': 'app/styles/img/**',
					'build/images/': 'app/images/**',
					'build/<%= pkg.name %>.json': 'app/<%= pkg.name %>.json'
				}
			}
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', 'build/dist/<%= pkg.name %>.js'],
				dest: 'build/dist/<%= pkg.name %>.min.js'
			}
		},
		mincss: {
			dist: {
				files: {
					'build/dist/<%= pkg.name %>.min.css': ['build/styles/<%= pkg.name %>.css']
				}
			}
		},
		qunit: {
			files: ['test/qunit/**/*.html']
		},
		watch: {
			app: {
				files: [
					"app/scripts/ls/**/*ls",
					"app/views/**/*",
					"test/**/*ls",
					"app/styles/styl/**/*",
					"app/components/**/*"
				],
				tasks: ["default"]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-livescript');

	grunt.registerTask('views', 'jade:templates jade:pages jade:page');
	grunt.registerTask('scripts', 'livescript:app concat:ls livescript:dist');
	grunt.registerTask('styles', 'stylus:app mincss:dist');
	grunt.registerTask('app', 'views scripts styles copy min');
	grunt.registerTask('server', 'livescript:src');
	grunt.registerTask('tests', 'livescript:test concat:unit');
	grunt.registerTask('default', 'clean app server tests');
};
