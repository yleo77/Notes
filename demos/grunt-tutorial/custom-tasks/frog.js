
module.exports = function(grunt) {

  grunt.registerTask('frog', 'custom task - frog', function(color) {
    color = color || 'green';
    console.log('the %s frog said guagua', color);
  });
};
