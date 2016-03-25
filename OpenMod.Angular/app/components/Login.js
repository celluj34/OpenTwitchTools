'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginComponent = function () {
    function LoginComponent() {
        _classCallCheck(this, LoginComponent);

        console.log("LoginComponent");
        //private fields
        //this._loginService = LoginService;

        //public properties
        this.username = null;
        this.password = null;
        //this.loadingPromise = null;
        this.loaded = false;
    }

    _createClass(LoginComponent, [{
        key: '$onInit',
        value: function $onInit() {
            //this.loadingPromise = this._loginService.requestCredentials((data) => this.setCredentials(data));
        }
    }, {
        key: 'setCredentials',
        value: function setCredentials(data) {
            data = data || {};

            this.username = data.username || '';
            this.password = data.password || '';
            this.loaded = true;
        }
    }, {
        key: 'config',
        get: function get() {
            return {
                usernamePlaceholder: 'Username',
                passwordPlaceholder: 'OAuth Token'
            };
        }
    }]);

    return LoginComponent;
}();

//LoginComponent.$inject = ['LoginService'];

//register('OpenMod.components').controller('LoginComponent', LoginComponent);

angular.module('OpenMod.components').component('login', {
    templateUrl: 'app/views/login.html',
    controller: LoginComponent,
    bindings: {
        username: '=',
        password: '=',
        loadingPromise: '=',
        loaded: '='
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvZ2luLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBTTtBQUNGLGFBREUsY0FDRixHQUFjOzhCQURaLGdCQUNZOztBQUNWLGdCQUFRLEdBQVIsQ0FBWSxnQkFBWjs7Ozs7QUFEVSxZQU1WLENBQUssUUFBTCxHQUFnQixJQUFoQixDQU5VO0FBT1YsYUFBSyxRQUFMLEdBQWdCLElBQWhCOztBQVBVLFlBU1YsQ0FBSyxNQUFMLEdBQWMsS0FBZCxDQVRVO0tBQWQ7O2lCQURFOztrQ0FrQlE7Ozs7O3VDQUdLLE1BQU07QUFDakIsbUJBQU8sUUFBUSxFQUFSLENBRFU7O0FBR2pCLGlCQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLElBQWlCLEVBQWpCLENBSEM7QUFJakIsaUJBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsSUFBaUIsRUFBakIsQ0FKQztBQUtqQixpQkFBSyxNQUFMLEdBQWMsSUFBZCxDQUxpQjs7Ozs0QkFUUjtBQUNULG1CQUFPO0FBQ0gscUNBQXFCLFVBQXJCO0FBQ0EscUNBQXFCLGFBQXJCO2FBRkosQ0FEUzs7OztXQVpYOzs7Ozs7O0FBa0NOLFFBQVEsTUFBUixDQUFlLG9CQUFmLEVBQXFDLFNBQXJDLENBQStDLE9BQS9DLEVBQXdEO0FBQ3BELGlCQUFhLHNCQUFiO0FBQ0EsZ0JBQVksY0FBWjtBQUNBLGNBQVU7QUFDTixrQkFBVSxHQUFWO0FBQ0Esa0JBQVUsR0FBVjtBQUNBLHdCQUFnQixHQUFoQjtBQUNBLGdCQUFRLEdBQVI7S0FKSjtDQUhKIiwiZmlsZSI6IkxvZ2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTG9naW5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2dpbkNvbXBvbmVudFwiKTtcclxuICAgICAgICAvL3ByaXZhdGUgZmllbGRzXHJcbiAgICAgICAgLy90aGlzLl9sb2dpblNlcnZpY2UgPSBMb2dpblNlcnZpY2U7XHJcblxyXG4gICAgICAgIC8vcHVibGljIHByb3BlcnRpZXNcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkID0gbnVsbDtcclxuICAgICAgICAvL3RoaXMubG9hZGluZ1Byb21pc2UgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBnZXQgY29uZmlnKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lUGxhY2Vob2xkZXI6ICdVc2VybmFtZScsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkUGxhY2Vob2xkZXI6ICdPQXV0aCBUb2tlbidcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgJG9uSW5pdCgpIHtcclxuICAgICAgICAvL3RoaXMubG9hZGluZ1Byb21pc2UgPSB0aGlzLl9sb2dpblNlcnZpY2UucmVxdWVzdENyZWRlbnRpYWxzKChkYXRhKSA9PiB0aGlzLnNldENyZWRlbnRpYWxzKGRhdGEpKTtcclxuICAgIH1cclxuICAgIHNldENyZWRlbnRpYWxzKGRhdGEpIHtcclxuICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcclxuXHJcbiAgICAgICAgdGhpcy51c2VybmFtZSA9IGRhdGEudXNlcm5hbWUgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IGRhdGEucGFzc3dvcmQgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vL0xvZ2luQ29tcG9uZW50LiRpbmplY3QgPSBbJ0xvZ2luU2VydmljZSddO1xyXG5cclxuLy9yZWdpc3RlcignT3Blbk1vZC5jb21wb25lbnRzJykuY29udHJvbGxlcignTG9naW5Db21wb25lbnQnLCBMb2dpbkNvbXBvbmVudCk7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnT3Blbk1vZC5jb21wb25lbnRzJykuY29tcG9uZW50KCdsb2dpbicsIHtcclxuICAgIHRlbXBsYXRlVXJsOiAnYXBwL3ZpZXdzL2xvZ2luLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogTG9naW5Db21wb25lbnQsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIHVzZXJuYW1lOiAnPScsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICc9JyxcclxuICAgICAgICBsb2FkaW5nUHJvbWlzZTogJz0nLFxyXG4gICAgICAgIGxvYWRlZDogJz0nXHJcbiAgICB9XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
