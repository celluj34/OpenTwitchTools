export default class SocketService {
    /*@ngInject;*/
    constructor($rootScope) {
        //private fields
        this._rootscope = $rootScope;
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