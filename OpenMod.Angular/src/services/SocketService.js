export default class SocketService {
    /*@ngInject;*/
    constructor($rootScope) {
        //private fields
        this._rootscope = $rootScope;
        this._socket = io.connect();
    }

    //http://briantford.com/blog/angular-socket-io
    apply(callback) {
        this._rootscope.$apply(() => {
            callback.apply(this._socket, arguments);
        });
    }
    on(event, callback) {
        //socket.on(eventName, function () {
        //    var args = arguments;
        //    $rootScope.$apply(function () {
        //        callback.apply(socket, args);
        //    });
        //});

        this._socket.on(event, () => {
            var args = arguments;
            this._rootscope.$apply(() => {
                callback.apply(this._socket, args);
            });
        });

        //callback = this.apply(callback);

        //this._socket.on(event, callback);
    }
    emit(event, data, callback) {
        //socket.emit(eventName, data, function () {
        //    var args = arguments;
        //    $rootScope.$apply(function () {
        //        if (callback) {
        //            callback.apply(socket, args);
        //        }
        //    });
        //});

        this._socket.emit(event, data, () => {
            var args = arguments;
            this._rootscope.$apply(() => {
                if(callback) {
                    callback.apply(this._socket, args);
                }
            });
        });

        //callback = this.apply(callback);

        //this._socket.emit(event, data, callback);
    }
}