export default class LoginController {
    /*@ngInject;*/
    constructor(LoginService, $uibModal) {
        //private fields
        this._loginService = LoginService;
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
    //openModal() {
    }

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