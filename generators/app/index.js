'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');
var packagejs = require(__dirname + '/../../package.json');
var fs = require('fs');
var semver = require('semver');

// Stores JHipster variables
var jhipsterVar = {moduleName: 'stormpath'};

// Stores JHipster functions
var jhipsterFunc = {};

var removeDirectory = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                removeDirectory(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports = yeoman.Base.extend({

    initializing: {
        compose: function (args) {
            this.composeWith('jhipster:modules',
                {
                    options: {
                        jhipsterVar: jhipsterVar,
                        jhipsterFunc: jhipsterFunc
                    }
                },
                this.options.testmode ? {local: require.resolve('generator-jhipster/generators/modules')} : null
            );

            if (args === 'default' || args === 'automated') {
                this.stormpathDefault = 'automated';
            }
        },
        displayLogo: function () {
            // Have Yeoman greet the user.
            this.log(chalk.blue("\n" +
                "                   `.-::::-.`               \n" +
                "               -/shddddddddddhs/-           \n" +
                "            `+hddddddddddddddhyso+`         \n" +
                "          `+hddddddddhyo/:.`      -s+`      \n" +
                "         -hddddddds/.           -sdddh-     \n" +
                "        -hddddddo`             /ddddddh-    \n" +
                "       `hdddddh-                /hdddddh`   \n" +
                "       +dddddd/      /shhs/      /dddddd/   \n" +
                "       sdddddd`     sdddddds     `dddddds   \n" +
                "       sdddddd`     sdddddds     `dddddds   \n" +
                "       /dddddd/      /shhs/      /dddddd/   \n" +
                "       `hdddddh/                -hdddddh`   \n" +
                "        -hdddddd/             .oddddddh-    \n" +
                "         -hddds-           ./sdddddddh-     \n" +
                "          `+s-      `.:/oyhddddddddh+`      \n" +
                "             `+osyhddddddddddddddh+`        \n" +
                "               -/shddddddddddhs/-           \n" +
                "                   `.-::::-.`               \n"));
            this.log('Welcome to the ' + chalk.blue('JHipster Stormpath') + ' generator! ' + chalk.yellow('v' + packagejs.version) + '\n');
            this.log(chalk.green('Please check your project into Git before you install Stormpath!'));
            this.log(chalk.green('That way, you can easily undo this installation using: git checkout .') + '\n');
            this.log(chalk.green('NOTE: ') + 'You need to have a Stormpath account for this module to work!');
            this.log('      Register at https://api.stormpath.com/register, generate API keys,');
            this.log('      and copy to ~/.stormpath/apiKey.properties.\n');
        },
        checkJHVersion: function () {
            var supportedJHVersion = packagejs.dependencies['generator-jhipster'];
            if (jhipsterVar.jhipsterVersion && !semver.satisfies(jhipsterVar.jhipsterVersion, supportedJHVersion)) {
                this.env.error(chalk.red.bold('ERROR!') + ' I support only JHipster versions greater than ${supportedJHVersion}...');
                this.env.error('If you want to use Stormpath with an older JHipster version, please contact support@stormpath.com.');
            }

            var security
        }
    },

    prompting: function () {
        var done = this.async();

        var prompts = [
            {
                type: 'confirm',
                name: 'installStormpath',
                message: 'Do you want to install Stormpath?',
                default: false
            }
        ];
        if (this.stormpathDefault === 'automated') {
            this.props = {installStormpath: true};
            done();
        } else {
            this.prompt(prompts, function (props) {
                this.props = props;
                // To access props later use this.props.someOption;

                done();
            }.bind(this));
        }
    },

    writing: {

        updateYeomanConfig: function () {
            this.config.set('authenticationType', jhipsterVar.moduleName);
        },

        setupGlobalVar: function () {
            this.baseName = jhipsterVar.baseName;
            this.capitalizedBaseName = _.upperFirst(this.baseName);
            this.packageName = jhipsterVar.packageName;
            this.angularAppName = jhipsterVar.angularAppName;
            this.applicationType = jhipsterVar.applicationType;
            this.websocket = jhipsterVar.websocket;
            this.devDatabaseType = jhipsterVar.devDatabaseType;
            this.enableTranslation = jhipsterVar.enableTranslation;
            this.jhiPrefix = jhipsterVar.jhiPrefix;
            this.jhiPrefixCapitalized = _.upperFirst(this.jhiPrefix);
            this.webappDir = jhipsterVar.webappDir;
            this.resourceTemplateDir = this.templatePath('src/main/resources/');
            this.javaTemplateDir = this.templatePath('src/main/java/package/');
            this.webTemplateDir = this.templatePath('src/main/webapp/');
            this.javaDir = jhipsterVar.javaDir;
            this.resourceDir = jhipsterVar.resourceDir;
            this.testDir = this.resourceDir + '../../test/';

            this.copyFiles = function (files) {
                files.forEach(function (file) {
                    jhipsterFunc.copyTemplate(file.from, file.to, file.type ? file.type : 'template', this, file.interpolate ? {'interpolate': file.interpolate} : undefined);
                }, this);
            };
        },

        writeTemplates: function () {
            this.installStormpath = this.props.installStormpath;

            if (!this.installStormpath) {
                return;
            } else {
                // check to see if this module has already been installed
                try {
                    fs.accessSync(this.webappDir + 'app/services/auth/activate.service.js', fs.F_OK);
                } catch (e) {
                    this.log('\n' + chalk.bold.red('Stormpath module has already been installed!'));
                    this.installStormpath = false;
                    return;
                }
            }
            if (jhipsterVar.authenticationType !== 'jwt') {
                this.log('\n' + chalk.bold.red('Stormpath can only be installed for JWT authentication.'));
                this.installStormpath = false;
                return;
            }

            // add dependencies
            if (jhipsterVar.buildTool === 'maven') {
                jhipsterFunc.addMavenDependency('com.stormpath.spring', 'stormpath-spring-security-webmvc-spring-boot-starter', '1.1.2');
            } else if (jhipsterVar.buildTool === 'gradle') {
                jhipsterFunc.addGradleDependency('compile', 'com.stormpath.spring', 'stormpath-spring-security-webmvc-spring-boot-starter', '1.1.2');
            }
            jhipsterFunc.addBowerDependency('stormpath-sdk-angularjs', '1.1.1');

            // Add additional paths to gulp/serve.js
            this.copyFiles([{from: this.templatePath('gulp/') + '_serve.js', to: 'gulp/serve.js'}]);

            // **** Start of Spring Boot Integration ***** //

            // add Stormpath properties to Spring Boot's configuration
            var stormpathProperties = fs.readFileSync(this.resourceTemplateDir + 'config/_application.yml', 'utf8');
            fs.appendFile(this.resourceDir + 'config/application.yml', stormpathProperties);

            if (jhipsterVar.hibernateCache === 'ehcache') {
                // add EhCache Config
                var ehcacheEntries = fs.readFileSync(this.resourceTemplateDir + '_ehcache.xml', 'utf8');
                var ehCacheLocation = this.resourceDir + 'ehcache.xml';
                jhipsterFunc.rewriteFile(ehCacheLocation, 'ehcache-add-entry', ehcacheEntries);

                // duplicate these changes in test EhCache Config
                jhipsterFunc.replaceContent(this.testDir + 'resources/ehcache.xml', "</ehcache>", '\n    ' + ehcacheEntries + '\n</ehcache>');
            }

            // make Stormpath log at WARN level
            jhipsterFunc.replaceContent(this.resourceDir + 'logback-spring.xml', '<logger name="javax.activation" level="WARN"/>', '<logger name="com.stormpath" level="WARN"/>\n    <logger name="javax.activation" level="WARN"/>');
            // Delete files no longer used
            var filesToDelete = [
                this.webappDir + 'app/account/activate',
                this.webappDir + 'app/account/password/password.controller.js',
                this.webappDir + 'app/account/password/password.state.js',
                this.webappDir + 'app/account/password/password.html',
                this.webappDir + 'app/account/reset',
                this.webappDir + 'app/account/settings',
                this.webappDir + 'app/admin/user-management',
                this.webappDir + 'app/services/auth/activate.service.js',
                this.webappDir + 'app/services/auth/auth.jwt.service.js',
                this.webappDir + 'app/services/auth/auth.service.js',
                this.webappDir + 'app/services/auth/password.service.js',
                this.webappDir + 'app/services/auth/password-reset-finish.service.js',
                this.webappDir + 'app/services/auth/password-reset-init.service.js',
                this.webappDir + 'app/services/auth/register.service.js'
            ];

            filesToDelete.forEach(function (path) {
                if (path.endsWith('.js') || path.endsWith('.html')) {
                    fs.unlinkSync(path);
                } else {
                    removeDirectory(path);
                }
            });
            // if websockets, remove AuthServiceProvider from tracker.service.js
            if (jhipsterVar.websocket) {
                jhipsterFunc.replaceContent(this.webappDir + 'app/admin/tracker/tracker.service.js', ", 'AuthServerProvider'", '');
                jhipsterFunc.replaceContent(this.webappDir + 'app/admin/tracker/tracker.service.js', ", AuthServerProvider", '');
                jhipsterFunc.replaceContent(this.webappDir + 'app/admin/tracker/tracker.service.js', "var authToken = AuthServerProvider.getToken();\n" +
                    "            if(authToken){\n" +
                    "                url += '?access_token=' + authToken;\n" +
                    "            }", '');
            }

            // remove auth.interceptor.js and auth-expired from http.config
            jhipsterFunc.replaceContent(this.webappDir + 'app/blocks/config/http.config.js', "        $httpProvider.interceptors.push('authExpiredInterceptor');\n", '');
            jhipsterFunc.replaceContent(this.webappDir + 'app/blocks/config/http.config.js', "        $httpProvider.interceptors.push('authInterceptor');\n", '');

            // delete auth.interceptor.js and auth-expired.interceptor.js
            fs.unlinkSync(this.webappDir + 'app/blocks/interceptor/auth.interceptor.js');
            fs.unlinkSync(this.webappDir + 'app/blocks/interceptor/auth-expired.interceptor.js');
            // modify state.handler.js to remove $state, $sessionStorage, Auth, Principal
            var tokensToReplace = ["'$state', ", "'$sessionStorage', ", "'Auth', ", "'Principal', ", "$state, ", "$sessionStorage, ", "Auth, ", "Principal, "];
            var stateHandlerFile = this.webappDir + 'app/blocks/handlers/state.handler.js';
            tokensToReplace.forEach(function (token) {
                jhipsterFunc.replaceContent(stateHandlerFile, token, '');
            });

            // remove check for identity resolved
            jhipsterFunc.replaceContent(this.webappDir + 'app/blocks/handlers/state.handler.js', '\n                if (Principal.isIdentityResolved()) {\n' +
                '                    Auth.authorize();\n                }\n\n', '');

            // change endpoint to /me in account.service.js
            jhipsterFunc.replaceContent(this.webappDir + 'app/services/auth/account.service.js', 'api/account', 'me');

            // add Stormpath modules to app.module.js
            jhipsterFunc.addAngularJsModule('stormpath');
            jhipsterFunc.addAngularJsModule('stormpath.templates');

            // add call to see if Stormpath user exists
            jhipsterFunc.replaceContent(this.webappDir + 'app/app.module.js', "['stateHandler'", "['stateHandler', '$user', '$stormpath'");
            jhipsterFunc.replaceContent(this.webappDir + 'app/app.module.js', "run(stateHandler", "run(stateHandler, $user, $stormpath");
            jhipsterFunc.replaceContent(this.webappDir + 'app/app.module.js', "stateHandler.initialize();\n", "stateHandler.initialize();\n" +
                "        // add ui-router config so stateChangeInterceptor is added\n" +
                "        // https://github.com/stormpath/generator-jhipster-stormpath/issues/12\n" +
                "        $stormpath.uiRouter({\n" +
                "            defaultPostLoginState: 'home',\n" +
                "            loginState: 'login'\n" +
                "        });\n" +
                "        // check to see if Stormpath user exists\n        $user.get();\n");

            // remove Auth from app.state.js
            jhipsterFunc.replaceContent(this.webappDir + 'app/app.state.js', "                authorize: ['Auth',\n" +
                "                    function (Auth) {\n" +
                "                        return Auth.authorize();\n" +
                "                    }\n" +
                "                ],\n", '');
            // for those app.state.js files that don't have a trailing comma
            jhipsterFunc.replaceContent(this.webappDir + 'app/app.state.js', "            resolve: {\n" +
                "                authorize: ['Auth',\n" +
                "                    function (Auth) {\n" +
                "                        return Auth.authorize();\n" +
                "                    }\n" +
                "                ]\n" +
                "            }\n", '');
            // copy templates from src/main/webapp
            var templates = [
                {from: this.javaTemplateDir + 'config/_SecurityConfiguration.java', to: this.javaDir + 'config/SecurityConfiguration.java'},
                {from: this.webTemplateDir + 'app/account/forgot-password/_forgot-password.html', to: this.webappDir + 'app/account/forgot-password/forgot-password.html'},
                {from: this.webTemplateDir + 'app/account/forgot-password/_forgot-password.state.js', to: this.webappDir + 'app/account/forgot-password/forgot-password.state.js'},
                {from: this.webTemplateDir + 'app/account/register/_register.controller.js', to: this.webappDir + 'app/account/register/register.controller.js'},
                {from: this.webTemplateDir + 'app/account/register/_register.html', to: this.webappDir + 'app/account/register/register.html'},
                {from: this.webTemplateDir + 'app/blocks/config/_stormpath.config.js', to: this.webappDir + 'app/blocks/config/stormpath.config.js'},
                {from: this.webTemplateDir + 'app/components/login/_login.controller.js', to: this.webappDir + 'app/components/login/login.controller.js'},
                {from: this.webTemplateDir + 'app/components/login/_login.html', to: this.webappDir + 'app/components/login/login.html'},
                {from: this.webTemplateDir + 'app/home/_home.controller.js', to: this.webappDir + 'app/home/home.controller.js'},
                {from: this.webTemplateDir + 'app/home/_home.html', to: this.webappDir + 'app/home/home.html'},
                {from: this.webTemplateDir + 'app/layouts/navbar/_navbar.controller.js', to: this.webappDir + 'app/layouts/navbar/navbar.controller.js'},
                {from: this.webTemplateDir + 'app/layouts/navbar/_navbar.html', to: this.webappDir + 'app/layouts/navbar/navbar.html'},
                {from: this.webTemplateDir + 'app/stormpath/_login.tpl.html', to: this.webappDir + 'app/stormpath/login.tpl.html'},
                {from: this.webTemplateDir + 'app/stormpath/_password-reset.tpl.html', to: this.webappDir + 'app/stormpath/password-reset.tpl.html'},
                {from: this.webTemplateDir + 'app/stormpath/_register.tpl.html', to: this.webappDir + 'app/stormpath/register.tpl.html'}
            ];

            this.copyFiles(templates);

            this.jsTestDir = this.testDir + 'javascript/';
            this.jsTestTemplateDir = this.templatePath('src/test/javascript/');

            // Delete tests no longer used
            var testsToDelete = [
                // unit tests
                this.jsTestDir + 'spec/app/account/activate',
                this.jsTestDir + 'spec/app/account/password/password.controller.spec.js',
                this.jsTestDir + 'spec/app/account/register',
                this.jsTestDir + 'spec/app/account/reset',
                this.jsTestDir + 'spec/app/account/settings',
                this.jsTestDir + 'spec/app/components',
                this.jsTestDir + 'spec/app/services/auth',
                this.jsTestDir + 'spec/app/services',
                // e2e tests
                this.jsTestDir + '/e2e/admin'
            ];

            testsToDelete.forEach(function (path) {
                if (path.endsWith('.js')) {
                    fs.unlinkSync(path);
                } else {
                    removeDirectory(path);
                }
            });

            // modify httpBackend.js to change account call path
            jhipsterFunc.replaceContent(this.jsTestDir + 'spec/helpers/httpBackend.js', 'api\\\/account', 'me');

            // add expectation to password-strength test that navbar.html will be loaded
            if (this.enableTranslation) {
                jhipsterFunc.replaceContent(this.jsTestDir + 'spec/app/account/password/password-strength-bar.directive.spec.js',
                    'beforeEach(mockI18nCalls);', 'beforeEach(mockI18nCalls);\n    beforeEach(mockScriptsCalls);');
            } else {
                jhipsterFunc.replaceContent(this.jsTestDir + 'spec/app/account/password/password-strength-bar.directive.spec.js',
                    'beforeEach(mockApiAccountCall);', 'beforeEach(mockApiAccountCall);\n    beforeEach(mockScriptsCalls);')
            }


            // replace account e2e test with one that just verifies the login form
            this.copyFiles([{from: this.jsTestTemplateDir + 'e2e/account/_account.js', to: this.jsTestDir + 'e2e/account/account.js'}]);
        }
    },

    install: function () {
        if (this.installStormpath && !(this.options['skip-install'])) {
            var injectDependenciesAndConstants = function () {
                this.spawnCommand('gulp', ['install']);
            };

            this.installDependencies({
                bower: true,
                npm: false,
                callback: injectDependenciesAndConstants.bind(this)
            });
        }
    },

    end: function () {
        if (this.installStormpath) {
            this.log('\n' + chalk.bold.green("Stormpath enabled. Running 'gulp install' to update dependencies...\n"));
        }
    }
});
