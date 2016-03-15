﻿class LoginComponent {
    constructor(LoginService) {
        //private fields
        this._loginService = LoginService;

        //public properties
        this.username = null;
        this.password = null;
        this.loadingPromise = null;
        this.loaded = false;

        //call manually until new router exists
        this.activate();
    }
    get config() {
        return {
            usernamePlaceholder: 'Username',
            passwordPlaceholder: 'OAuth Token'
        };
    }
    activate() {
        this.loadingPromise = this._loginService.requestCredentials((data) => this.setCredentials(data));
    }
    setCredentials(data) {
        data = data || {};

        this.username = data.username || '';
        this.password = data.password || '';
        this.loaded = true;
    }
}

//LoginComponent.$inject = ['LoginService'];

register('OpenMod.components').controller('LoginComponent', LoginComponent);