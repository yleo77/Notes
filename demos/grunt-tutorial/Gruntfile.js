module.exports = function(grunt) {

  // 项目配置和任务配置
  // 每个任务以 该任务的名称为key 作为 initConfig 的参数对象的属性配置.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // 利用 *grunt.loadNpmTasks* 来加载插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadTasks('./custom-tasks');
  // 通过 *grunt.registerTask* 来注册任务名
  // 当第一个参数为 default 时，命令行可以直接以 *grunt* 的形式来来启动该任务
  // 第二个参数为所要执行的任务数组.
  grunt.registerTask('default', ['uglify']);

};
