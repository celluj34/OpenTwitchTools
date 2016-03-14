class LoginService {
    constructor(SocketService) {
        //private fields
        this._socketService = SocketService;
    }
    requestCredentials(callback) {
        this._socketService.emit('request-credentials', null, callback);
    }
    submitCredentials(data, callback) {
        this._socketService.emit('submit-credentials', data, callback);
    }
}

//LoginService.$inject = ['SocketService'];

register('OpenMod.services').service('LoginService', LoginService);