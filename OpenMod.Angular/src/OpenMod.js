//angular (duh)
import angular from 'angular';

// src classes
import LoginComponent from './components/LoginComponent';
import LoginService from './services/LoginService';
import SocketService from './services/SocketService';

angular.module('OpenMod', [])
    .service('SocketService', SocketService)
    .service('LoginService', LoginService)
    .controller('LoginComponent', LoginComponent);