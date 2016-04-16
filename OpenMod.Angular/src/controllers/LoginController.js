export default class LoginController {
    /*@ngInject;*/
    constructor(LoginService, $state, $uibModal) {
        //private fields
        this._loginService = LoginService;
        this._state = $state;
        this._uibModal = $uibModal;

        //public properties
        this.username = null;
        this.password = null;
        this.remember = null;
        this.errors = [];
        this.loadingPromise = null;
        this.loaded = false;
    }
    get config() {
        return {
            usernamePlaceholder: 'Username (required)',
            usernameLabel: 'Username',
            passwordPlaceholder: 'OAuth Token (required)',
            passwordLabel: 'OAuth Token',
            rememberLabel: 'Remember?',
            submitLabel: 'Submit',
            oauthButtonLabel: 'Get OAuth Token'
        };
    }
    $onInit() {
        this.loadingPromise = this._loginService.requestCredentials((data) => this.setCredentials(data));
    }
    setCredentials(data) {
        data = data || {};

        this.username = data.username || '';
        this.password = data.password || '';
        this.remember = data.remember || false;
        this.loaded = true;
    }
    submitCredentials() {
        this.errors.splice(0, this.errors.length);

        const data = {
            username: this.username,
            password: this.password,
            remember: this.remember
        };

        this._loginService.submitCredentials(data, (result) => this.loginSuccessful(result));
    }
    loginSuccessful(result) {
        if(result.isValid) {
            alert('go to chat');
            //this._state.go('chat');
        }
        else {
            this.errors.push(result.error);
        }
    }
    closeAlert(index) {
        this.errors.splice(index, 1);
    }
    openModal() {
        //I don't like all of this configuration here. Can it be moved to app.config.js (routing)?
        this._uibModal.open({
            templateUrl: 'app/views/oauth.html',
            controller: 'OAuthController',
            controllerAs: 'oauth',
            size: 'lg',
            keyboard : false,
        });
    }
}