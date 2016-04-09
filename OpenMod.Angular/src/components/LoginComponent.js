export default class LoginComponent {
    /*@ngInject;*/
    constructor(LoginService) {
        console.log('LoginComponent');

        //private fields
        this._loginService = LoginService;

        //public properties
        this.username = null;
        this.password = null;
        this.loadingPromise = null;
        this.loaded = false;
    }
    get config() {
        return {
            usernamePlaceholder: 'Username',
            passwordPlaceholder: 'OAuth Token'
        };
    }
    $onInit() {
        this.loadingPromise = this._loginService.requestCredentials((data) => this.setCredentials(data));
    }
    setCredentials(data) {
        data = data || {};

        this.username = data.username || '';
        this.password = data.password || '';
        this.loaded = true;
    }
}