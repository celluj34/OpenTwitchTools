class SocketService {
    constructor($rootscope) {
        console.log('SocketService');
        //private fields
        this._rootscope = $rootscope;
        this._socket = io.connect();
    }
    apply(callback) {
        this._rootscope.$apply(() => {
            callback.apply(this._socket, arguments);
        });
    }
    on(event, callback) {
        callback = this.apply(callback);

        this._socket.on(event, callback);
    }
    emit(event, data, callback) {
        callback = this.apply(callback);

        this._socket.emit(event, data, callback);
    }
}

//SocketService.$inject = ['$rootscope'];

register('OpenMod.services').service('SocketService', SocketService);