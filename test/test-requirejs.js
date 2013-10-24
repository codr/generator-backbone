/*global describe:true, beforeEach:true, it:true */
'use strict';
var path    = require('path');
var helpers = require('yeoman-generator').test;
var assert  = require('assert');

describe('Backbone generator with RequireJS', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, './temp'), function (err) {
      if (err) {
        return done(err);
      }
      this.backbone = {};
      this.backbone.app = helpers.createGenerator('backbone:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'mocha:app'
        ]
      ]);
      this.backbone.app.options['skip-install'] = true;

      helpers.mockPrompt(this.backbone.app, {
        features: ['compassBootstrap'],
        includeRequireJS: true
      });

      done();
    }.bind(this));

  });

  describe('creates expected files', function (done) {
    it('with compassBootstrap', function (done) {
      var expected = [
        ['bower.json', /("name": "temp")(|.|\n)*(requirejs)/],
        ['package.json', /"name": "temp"/],
        'Gruntfile.js',
        'app/404.html',
        'app/favicon.ico',
        'app/robots.txt',
        ['app/index.html', /(Bootstrap)(|.|\n)*(RequireJS)/i],
        'app/.htaccess',
        'app/styles/main.scss',
        '.gitignore',
        '.gitattributes',
        '.bowerrc',
        '.jshintrc',
        '.editorconfig',
        'Gruntfile.js',
        'package.json',
        'app/scripts/vendor/bootstrap.js',
        ['app/scripts/main.js', /bootstrap/]
      ];

      this.backbone.app.run({}, function () {
        helpers.assertFiles(expected);
        done();
      });

    });

    it('without compassBootstrap', function (done) {
      var expected = [
        ['bower.json', /("name": "temp")(|.|\n)*(requirejs)/],
        ['package.json', /"name": "temp"/],
        ['Gruntfile.js', /requirejs/],
        'app/404.html',
        'app/favicon.ico',
        'app/robots.txt',
        ['app/index.html', /(RequireJS)/i],
        'app/.htaccess',
        '.gitignore',
        '.gitattributes',
        '.bowerrc',
        '.jshintrc',
        '.editorconfig',
        'Gruntfile.js',
        'package.json'
      ];

      helpers.mockPrompt(this.backbone.app, {
        features: [],
        includeRequireJS: true
      });

      this.backbone.app.run({}, function () {
        helpers.assertFiles(expected);
        done();
      });
    });
  });

  describe('creates backbone model', function () {
    it('with default options', function (done) {
      var model = helpers.createGenerator('backbone:model', ['../../model'], ['foo']);

      this.backbone.app.run({}, function () {
        model.run([], function () {
          helpers.assertFiles([
            ['app/scripts/models/foo.js', /var FooModel = Backbone.Model.extend\(\{/]
          ]);
        });

        done();
      });
    });

    it('with coffee option', function (done) {
      var model = helpers.createGenerator('backbone:model', ['../../model'], ['foo']);

      model.options.coffee = true;

      this.backbone.app.run({}, function () {
        model.run([], function () {
          helpers.assertFiles([
            ['app/scripts/models/foo.coffee', /var FooModel = Backbone.Model.extend\(\{/]
          ]);
        });
        done();
      });
    });
  });

  describe('creates backbone collection', function () {
    it('with default options', function (done) {
      var collection = helpers.createGenerator('backbone:collection', ['../../collection'], ['foo']);

      this.backbone.app.run({}, function () {
        collection.run([], function () {
          helpers.assertFiles([
            ['app/scripts/collections/foo.js', /var FooCollection = Backbone.Collection.extend\(\{/]
          ]);
        });

        done();
      });
    });
  });

  describe('creates backbone router', function () {
    it('with default options', function (done) {
      var router = helpers.createGenerator('backbone:router', ['../../router'], ['foo']);

      this.backbone.app.run({}, function () {
        router.run([], function () {
          helpers.assertFiles([
            ['app/scripts/routes/foo.js', /var FooRouter = Backbone.Router.extend\(\{/]
          ]);
        });

        done();
      });
    });
  });

  describe('creates backbone view', function () {
    it('with default options', function (done) {
      var view = helpers.createGenerator('backbone:view', ['../../view'], ['foo']);

      this.backbone.app.run({}, function () {
        view.run([], function () {
          helpers.assertFiles([
            ['app/scripts/views/foo.js', /var FooView = Backbone.View.extend\(\{(.|\n)*app\/scripts\/templates\/foo.ejs/],
            'app/scripts/templates/foo.ejs'
          ]);
        });
        done();
      });
    });
  });

  describe('coffeeScript files', function () {
    it('will be included on build', function (done) {
      var model = helpers.createGenerator('backbone:model', ['../../model'], ['foo']);

      model.options.coffee = true;

      this.backbone.app.run({}, function () {
        model.run([], function () {
          helpers.assertFiles([
            ['app/scripts/models/foo.coffee', /var FooModel = Backbone.Model.extend\(\{/]
          ]);
        });
        done();
      });
    });
  });

});
