'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginService = function () {
    function LoginService(SocketService) {
        _classCallCheck(this, LoginService);

        //private fields
        this._socketService = SocketService;
    }

    _createClass(LoginService, [{
        key: 'requestCredentials',
        value: function requestCredentials(callback) {
            this._socketService.emit('request-credentials', null, callback);
        }
    }, {
        key: 'submitCredentials',
        value: function submitCredentials(data, callback) {
            this._socketService.emit('submit-credentials', data, callback);
        }
    }]);

    return LoginService;
}();

//LoginService.$inject = ['SocketService'];

register('OpenMod.services').service('LoginService', LoginService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvZ2luU2VydmljZS5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQU07QUFDRixhQURFLFlBQ0YsQ0FBWSxhQUFaLEVBQTJCOzhCQUR6QixjQUN5Qjs7O0FBRXZCLGFBQUssY0FBTCxHQUFzQixhQUF0QixDQUZ1QjtLQUEzQjs7aUJBREU7OzJDQUtpQixVQUFVO0FBQ3pCLGlCQUFLLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBeUIscUJBQXpCLEVBQWdELElBQWhELEVBQXNELFFBQXRELEVBRHlCOzs7OzBDQUdYLE1BQU0sVUFBVTtBQUM5QixpQkFBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLG9CQUF6QixFQUErQyxJQUEvQyxFQUFxRCxRQUFyRCxFQUQ4Qjs7OztXQVJoQzs7Ozs7QUFlTixTQUFTLGtCQUFULEVBQTZCLE9BQTdCLENBQXFDLGNBQXJDLEVBQXFELFlBQXJEIiwiZmlsZSI6IkxvZ2luU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIExvZ2luU2VydmljZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihTb2NrZXRTZXJ2aWNlKSB7XHJcbiAgICAgICAgLy9wcml2YXRlIGZpZWxkc1xyXG4gICAgICAgIHRoaXMuX3NvY2tldFNlcnZpY2UgPSBTb2NrZXRTZXJ2aWNlO1xyXG4gICAgfVxyXG4gICAgcmVxdWVzdENyZWRlbnRpYWxzKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0U2VydmljZS5lbWl0KCdyZXF1ZXN0LWNyZWRlbnRpYWxzJywgbnVsbCwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgc3VibWl0Q3JlZGVudGlhbHMoZGF0YSwgY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLl9zb2NrZXRTZXJ2aWNlLmVtaXQoJ3N1Ym1pdC1jcmVkZW50aWFscycsIGRhdGEsIGNhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG5cclxuLy9Mb2dpblNlcnZpY2UuJGluamVjdCA9IFsnU29ja2V0U2VydmljZSddO1xyXG5cclxucmVnaXN0ZXIoJ09wZW5Nb2Quc2VydmljZXMnKS5zZXJ2aWNlKCdMb2dpblNlcnZpY2UnLCBMb2dpblNlcnZpY2UpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
