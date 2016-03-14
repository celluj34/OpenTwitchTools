'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginComponent = function () {
    function LoginComponent(LoginService) {
        _classCallCheck(this, LoginComponent);

        //private fields
        this._loginService = LoginService;

        //public properties
        this.username = null;
        this.password = null;
        this.loadingPromise = null;
        this.loaded = false;

        //call manually until new router exists
        this.activate();
    }

    _createClass(LoginComponent, [{
        key: 'activate',
        value: function activate() {
            var _this = this;

            this.loadingPromise = this._loginService.requestCredentials(function (data) {
                return _this.setCredentials(data);
            });
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

register('OpenMod.components').controller('LoginComponent', LoginComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvZ2luLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBTTtBQUNGLGFBREUsY0FDRixDQUFZLFlBQVosRUFBMEI7OEJBRHhCLGdCQUN3Qjs7O0FBRXRCLGFBQUssYUFBTCxHQUFxQixZQUFyQjs7O0FBRnNCLFlBS3RCLENBQUssUUFBTCxHQUFnQixJQUFoQixDQUxzQjtBQU10QixhQUFLLFFBQUwsR0FBZ0IsSUFBaEIsQ0FOc0I7QUFPdEIsYUFBSyxjQUFMLEdBQXNCLElBQXRCLENBUHNCO0FBUXRCLGFBQUssTUFBTCxHQUFjLEtBQWQ7OztBQVJzQixZQVd0QixDQUFLLFFBQUwsR0FYc0I7S0FBMUI7O2lCQURFOzttQ0FvQlM7OztBQUNQLGlCQUFLLGNBQUwsR0FBc0IsS0FBSyxhQUFMLENBQW1CLGtCQUFuQixDQUFzQyxVQUFDLElBQUQ7dUJBQVUsTUFBSyxjQUFMLENBQW9CLElBQXBCO2FBQVYsQ0FBNUQsQ0FETzs7Ozt1Q0FHSSxNQUFNO0FBQ2pCLG1CQUFPLFFBQVEsRUFBUixDQURVOztBQUdqQixpQkFBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxJQUFpQixFQUFqQixDQUhDO0FBSWpCLGlCQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLElBQWlCLEVBQWpCLENBSkM7QUFLakIsaUJBQUssTUFBTCxHQUFjLElBQWQsQ0FMaUI7Ozs7NEJBVFI7QUFDVCxtQkFBTztBQUNILHFDQUFxQixVQUFyQjtBQUNBLHFDQUFxQixhQUFyQjthQUZKLENBRFM7Ozs7V0FkWDs7Ozs7QUFrQ04sU0FBUyxvQkFBVCxFQUErQixVQUEvQixDQUEwQyxnQkFBMUMsRUFBNEQsY0FBNUQiLCJmaWxlIjoiTG9naW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBMb2dpbkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihMb2dpblNlcnZpY2UpIHtcclxuICAgICAgICAvL3ByaXZhdGUgZmllbGRzXHJcbiAgICAgICAgdGhpcy5fbG9naW5TZXJ2aWNlID0gTG9naW5TZXJ2aWNlO1xyXG5cclxuICAgICAgICAvL3B1YmxpYyBwcm9wZXJ0aWVzXHJcbiAgICAgICAgdGhpcy51c2VybmFtZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nUHJvbWlzZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9jYWxsIG1hbnVhbGx5IHVudGlsIG5ldyByb3V0ZXIgZXhpc3RzXHJcbiAgICAgICAgdGhpcy5hY3RpdmF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNvbmZpZygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB1c2VybmFtZVBsYWNlaG9sZGVyOiAnVXNlcm5hbWUnLFxyXG4gICAgICAgICAgICBwYXNzd29yZFBsYWNlaG9sZGVyOiAnT0F1dGggVG9rZW4nXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGFjdGl2YXRlKCkge1xyXG4gICAgICAgIHRoaXMubG9hZGluZ1Byb21pc2UgPSB0aGlzLl9sb2dpblNlcnZpY2UucmVxdWVzdENyZWRlbnRpYWxzKChkYXRhKSA9PiB0aGlzLnNldENyZWRlbnRpYWxzKGRhdGEpKTtcclxuICAgIH1cclxuICAgIHNldENyZWRlbnRpYWxzKGRhdGEpIHtcclxuICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcclxuXHJcbiAgICAgICAgdGhpcy51c2VybmFtZSA9IGRhdGEudXNlcm5hbWUgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IGRhdGEucGFzc3dvcmQgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vL0xvZ2luQ29tcG9uZW50LiRpbmplY3QgPSBbJ0xvZ2luU2VydmljZSddO1xyXG5cclxucmVnaXN0ZXIoJ09wZW5Nb2QuY29tcG9uZW50cycpLmNvbnRyb2xsZXIoJ0xvZ2luQ29tcG9uZW50JywgTG9naW5Db21wb25lbnQpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
