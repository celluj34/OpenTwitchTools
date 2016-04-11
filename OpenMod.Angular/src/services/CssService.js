export default class CssService {
    /*@ngInject;*/
    constructor(SocketService) {
        //private fields
        this._socketService = SocketService;
    }
    getTheme(callback) {
        //this._socketService.emit('get-theme', null, callback);
        callback({theme: 'cosmo'});
    }
}