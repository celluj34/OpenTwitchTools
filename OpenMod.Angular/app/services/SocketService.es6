class SocketService {
    constructor($rootscope) {
        this._rootscope = $rootscope;
        this._socket = io.connect();
    }
    getLoginCredentials(callback) {
        const socket = this.socket;
        const rootscope = this._socket;

        socket.emit('get-credentials', function() {
            var args = arguments;
            rootscope.$apply(function() {
                if(callback) {
                    callback.apply(socket, args);
                }
            });
        });
    }
}

angular.module('OpenMod').service('socketService', SocketService);