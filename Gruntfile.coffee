module.exports = (grunt) ->
  require('load-grunt-tasks') grunt

  grunt.initConfig
    clean:
      dist: "dist"

    uglify:
      dist:
        options:
          mangle: false
          beautify: true

        src: [
          "source/**/*module.js"
          "source/**/*.js"
          "!source/**/*spec.js"
        ]
        dest: "dist/angular-loading-overlay.js"

    jshint:
      options:
        jshintrc: true
      src: ["source/**/*.js"]

    watch:
      scripts:
        files: ["source/**/*.js"]
        tasks: ["uglify:dist"]

  grunt.registerTask "build", [
    "clean:dist"
    "uglify:dist"
  ]

  grunt.registerTask "check", [
    "jshint"
  ]
