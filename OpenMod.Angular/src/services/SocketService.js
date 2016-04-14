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
        var socket = this._socket;
        var rootScope = this._rootscope;

        socket.on(event, function() {
            var args = arguments;

            rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    }
    emit(event, data, callback) {
        var socket = this._socket;
        var rootScope = this._rootscope;

        socket.emit(event, data, function() {
            var args = arguments;

            rootScope.$apply(function() {
                if(callback) {
                    callback.apply(socket, args);
                }
            });
        });
    }
}