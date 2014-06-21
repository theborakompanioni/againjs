
module.exports = function(grunt) {
    'use strict';

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        // Define Directory
        dirs: {
            js:     'src/main',
            build:  'dist'
        },

        pkg: grunt.file.readJSON('package.json'),

        banner: '/*\n' +
         ' * <%= pkg.title %> v<%= pkg.version %>\n' +
         ' * <%= pkg.author.url %> <%= pkg.author.email %>\n' +
         ' * Copyright (c) <%= grunt.template.today(\'yyyy\') %> <%= pkg.author.name %>\n' +
         ' */\n',

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
            }
        },

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

        notify: {
            js: {
                options: {
                    title: 'Javascript - <%= pkg.title %>',
                    message: 'Minified and validated with success!'
                }
            }
        }
});


    // Register Taks
    // --------------------------

    // Observe changes, concatenate, minify and validate files
    grunt.registerTask( 'test', [ 'jasmine']);
    grunt.registerTask( 'default', [ 'jshint', 'test', 'uglify', 'notify:js' ]);

};