// This Gruntfile is based upon the article at: https://www.tomspencer.dev/blog/2015/12/17/creating-a-demo-page-for-your-npm-module/
'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      demo: ['build']
    },
    copy: {
      demo: {
        files: {
          'build/index.html': ['demo/index.html']
        }
      }
    },
    browserify: {
      options: {
        alias: {
          'diffex': './lib/index.js'
        }
      },
      demo: {
        files: {
          'build/index.js': ['demo/index.js']
        },
        options: {
          watch: true
        }
      }
    },
    // Optional, build demo for remote deployment on github pages.
    buildcontrol: {
      options: {
        dir: 'build',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built live demo from commit %sourceCommit%'
      },
      demo: {
        options: {
          // Update the remote to point to your github repo
          remote: 'git@github.com:jjlake/MutationStack.git',
          branch: 'gh-pages',
        }
      }
    },
    connect: {
      dev: {
        options: {
          base: 'build',
          hostname: 'localhost',
          port: 3000,
          livereload: true
        }
      }
    },
    watch: {
      dev: {
        files: 'build/index.js',
        options: {
          livereload: true
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('build', ['clean', 'copy', 'browserify']);
  grunt.registerTask('serve', ['build', 'connect', 'watch']);
  grunt.registerTask('deploy', ['build', 'buildcontrol']); // for remote deployment ONLY
  grunt.registerTask('default', ['serve']);
};
