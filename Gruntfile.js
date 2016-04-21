module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.initConfig({
        watch: {
            'app': {
                'files': [
                    './**/*.{html,js,css}',
                    '!bower_components'
                ],
                'cwd': 'app',
                'options': { 'livereload': '<%= connect.options.livereload %>' }
            },
            'bower': {
                'files': ['bower.json'],
                'tasks': ['wiredep']
            }
        },
        wiredep: { 'app': { 'src': ['app/*.html'] } },
        connect: {
            'options': {
                'port': 3000,
                'livereload': 4586,
                'open': true,
                'base': ['app'],
                'hostname': 'localhost'
            },
            'app': {}
        }
    });
    grunt.registerTask('default', [
        'connect',
        'watch'
    ]);
};
