'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginService = function () {
    function LoginService(SocketService) {
        _classCallCheck(this, LoginService);

        console.log("LoginService");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvZ2luU2VydmljZS5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQU07QUFDRixhQURFLFlBQ0YsQ0FBWSxhQUFaLEVBQTJCOzhCQUR6QixjQUN5Qjs7QUFDdkIsZ0JBQVEsR0FBUixDQUFZLGNBQVo7O0FBRHVCLFlBR3ZCLENBQUssY0FBTCxHQUFzQixhQUF0QixDQUh1QjtLQUEzQjs7aUJBREU7OzJDQU1pQixVQUFVO0FBQ3pCLGlCQUFLLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBeUIscUJBQXpCLEVBQWdELElBQWhELEVBQXNELFFBQXRELEVBRHlCOzs7OzBDQUdYLE1BQU0sVUFBVTtBQUM5QixpQkFBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLG9CQUF6QixFQUErQyxJQUEvQyxFQUFxRCxRQUFyRCxFQUQ4Qjs7OztXQVRoQzs7Ozs7QUFnQk4sU0FBUyxrQkFBVCxFQUE2QixPQUE3QixDQUFxQyxjQUFyQyxFQUFxRCxZQUFyRCIsImZpbGUiOiJMb2dpblNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBMb2dpblNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IoU29ja2V0U2VydmljZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTG9naW5TZXJ2aWNlXCIpO1xyXG4gICAgICAgIC8vcHJpdmF0ZSBmaWVsZHNcclxuICAgICAgICB0aGlzLl9zb2NrZXRTZXJ2aWNlID0gU29ja2V0U2VydmljZTtcclxuICAgIH1cclxuICAgIHJlcXVlc3RDcmVkZW50aWFscyhjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuX3NvY2tldFNlcnZpY2UuZW1pdCgncmVxdWVzdC1jcmVkZW50aWFscycsIG51bGwsIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHN1Ym1pdENyZWRlbnRpYWxzKGRhdGEsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0U2VydmljZS5lbWl0KCdzdWJtaXQtY3JlZGVudGlhbHMnLCBkYXRhLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vTG9naW5TZXJ2aWNlLiRpbmplY3QgPSBbJ1NvY2tldFNlcnZpY2UnXTtcclxuXHJcbnJlZ2lzdGVyKCdPcGVuTW9kLnNlcnZpY2VzJykuc2VydmljZSgnTG9naW5TZXJ2aWNlJywgTG9naW5TZXJ2aWNlKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
