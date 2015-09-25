module.exports = (grunt) ->
  require('load-grunt-tasks') grunt

  grunt.initConfig
    clean:
      dist: "dist"

    uglify:
      dist:
        src: [
          "source/js/module.js"
          "source/**/*.js"
          "!source/**/*spec.js"
        ]
        dest: "dist/angular-loading-overlay.js"


    less:
      dev:
        files:
          "source/css/styles.css": "source/less/styles.less"
      dist:
        options:
          compress: true
        files:
          "dist/angular-loading-overlay.css": "source/less/styles.less"

    jshint:
      options:
        jshintrc: true
      src: ["source/**/*.js"]

    watch:
      scripts:
        files: ["source/**/*.js"]
        tasks: ["uglify:dist"]
      less:
        files: ["source/**/*.less"]
        tasks: ["less:dev"]

  grunt.registerTask "build", [
    "clean:dist"
    "uglify:dist"
  ]

  grunt.registerTask "check", [
    "jshint"
  ]
