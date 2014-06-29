
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        dirs: {
            js:     'src/main',
            build:  'dist',
            coverage:  'bin/coverage'
        },

        pkg: grunt.file.readJSON('package.json'),

        banner: '/*\n' +
         ' * <%= pkg.title %> v<%= pkg.version %>\n' +
         ' * <%= pkg.author.url %> <<%= pkg.author.email %>>\n' +
         ' * Copyright (c) <%= grunt.template.today(\'yyyy\') %> <%= pkg.author.name %>\n' +
         ' */\n',

        jshint: {
            options: {
                jshintrc: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            source: {
                src: ['src/**/*.js']
            },
            jasmine: {
                src: ['spec/**/*.js']
            }
        },
        uglify: {
            options: {
                mangle: false,
                banner: '<%= banner %>'
            },
            dist: {
              files: {
                  '<%= dirs.build %>/again.min.js': '<%= dirs.js %>/again.js'
              }
            }
        },
        jasmine: {
            js: {
                src: 'src/**/*.js',
                options: {
                    display: 'full',
                    summary: true,
                    specs: 'spec/*Spec.js',
                    helpers: 'spec/*Helper.js'
                }
            },
            coverage: {
                src: ['src/**/*.js'],
                options: {
                    specs: ['spec/*Spec.js'],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: '<%= dirs.coverage %>/coverage.json',
                        report: [{
                                type: 'html',
                                options: {
                                    dir: '<%= dirs.coverage %>/html'
                                }
                            }, {
                                type: 'cobertura',
                                options: {
                                    dir: '<%= dirs.coverage %>/cobertura'
                                }
                            }, {
                                type: 'lcov',
                                options: {
                                    dir: '<%= dirs.coverage %>/lcov'
                                }
                            }, {
                                type: 'text-summary'
                            }
                        ]
                    }
                }
            }
        },
        coveralls: {
            options: {
                force:true
            },
            target: {
                src: '<%= dirs.coverage %>/lcov/lcov.info'
            }
        },
        notify: {
            js: {
                options: {
                    title: 'Javascript - <%= pkg.title %>',
                    message: 'Minified and validated with success!'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask( 'test', [ 'jasmine', 'coveralls']);
    grunt.registerTask( 'default', [ 'jshint', 'test', 'uglify', 'notify:js' ]);

};