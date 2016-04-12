//angular libraries
import angular from 'angular';
import route from 'angular-route';
import uiBootstrap from 'angular-ui-bootstrap';

// src classes
import LoginController from './controllers/LoginController';
import CssController from './controllers/CssController';
import LoginService from './services/LoginService';
import CssService from './services/CssService';
import SocketService from './services/SocketService';

// other things
import routing from './app.config';

angular.module('OpenMod', ['ngRoute', 'ui.bootstrap'])
    .config(['$routeProvider', '$locationProvider', routing])
    .service('SocketService', SocketService)
    .service('LoginService', LoginService)
    .service('CssService', CssService)
    .controller('LoginController', LoginController)
    .controller('CssController', CssController);