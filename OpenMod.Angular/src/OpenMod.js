//angular libraries
import angular from 'angular';
import route from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';

//controllers
import LoginController from './controllers/LoginController';
import CssController from './controllers/CssController';
import OAuthController from './controllers/OAuthController';
import ChatController from './controllers/ChatController';

//services
import LoginService from './services/LoginService';
import CssService from './services/CssService';
import ChatService from './services/ChatService';
import SocketService from './services/SocketService';

// other things
import routing from './app.config';

angular.module('OpenMod', ['ui.router', 'ui.bootstrap'])
    .config(['$stateProvider', '$urlRouterProvider', routing])
    .service('SocketService', SocketService)
    .service('LoginService', LoginService)
    .service('CssService', CssService)
    .service('ChatService', ChatService)
    .controller('LoginController', LoginController)
    .controller('CssController', CssController)
    .controller('ChatController', ChatController)
    .controller('OAuthController', OAuthController);