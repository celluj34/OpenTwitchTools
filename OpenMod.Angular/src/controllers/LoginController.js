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
        this.remember = data.remember || false;
        this.loaded = true;
    }
    submitCredentials() {
        const data = {
            username: this.username,
            password: this.password,
            remember: this.remember
        };

        this._loginService.submitCredentials(data, () => this.loginSuccessful());
    }
    loginSuccessful() {
        console.log('loginSuccessful()');
        //this._state.go('chat');
    }

    //openModal() {
    //    this._uibModal.open({
    //        animation: true,
    //        templateUrl: 'myModalContent.html',
    //        controller: 'ModalInstanceCtrl',
    //        size: size,
    //        resolve: {
    //            items: function () {
    //                return $scope.items;
    //            }
    //        }
    //    });
    //}
}