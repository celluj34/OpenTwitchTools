//import angular from 'angular';

import LoginComponent from './components/LoginComponent';
import LoginService from './services/LoginService';
import SocketService from './services/SocketService';

angular.module('OpenMod', [])
    .controller('LoginComponent', LoginComponent)
    .service('LoginService', LoginService)
    .service('SocketService', SocketService);