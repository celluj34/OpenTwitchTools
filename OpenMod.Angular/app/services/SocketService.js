'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketService = function () {
    function SocketService($rootscope) {
        _classCallCheck(this, SocketService);

        //private fields
        this._rootscope = $rootscope;
        this._socket = io.connect();
    }

    _createClass(SocketService, [{
        key: 'apply',
        value: function apply(callback) {
            var _this = this,
                _arguments = arguments;

            this._rootscope.$apply(function () {
                callback.apply(_this._socket, _arguments);
            });
        }
    }, {
        key: 'on',
        value: function on(event, callback) {
            callback = this.apply(callback);

            this._socket.on(event, callback);
        }
    }, {
        key: 'emit',
        value: function emit(event, data, callback) {
            callback = this.apply(callback);

            this._socket.emit(event, data, callback);
        }
    }]);

    return SocketService;
}();

//SocketService.$inject = ['$rootscope'];

register('OpenMod.services').service('SocketService', SocketService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvY2tldFNlcnZpY2UuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFNO0FBQ0YsYUFERSxhQUNGLENBQVksVUFBWixFQUF3Qjs4QkFEdEIsZUFDc0I7OztBQUVwQixhQUFLLFVBQUwsR0FBa0IsVUFBbEIsQ0FGb0I7QUFHcEIsYUFBSyxPQUFMLEdBQWUsR0FBRyxPQUFILEVBQWYsQ0FIb0I7S0FBeEI7O2lCQURFOzs4QkFNSSxVQUFVOzs7O0FBQ1osaUJBQUssVUFBTCxDQUFnQixNQUFoQixDQUF1QixZQUFNO0FBQ3pCLHlCQUFTLEtBQVQsQ0FBZSxNQUFLLE9BQUwsWUFBZixFQUR5QjthQUFOLENBQXZCLENBRFk7Ozs7MkJBS2IsT0FBTyxVQUFVO0FBQ2hCLHVCQUFXLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBWCxDQURnQjs7QUFHaEIsaUJBQUssT0FBTCxDQUFhLEVBQWIsQ0FBZ0IsS0FBaEIsRUFBdUIsUUFBdkIsRUFIZ0I7Ozs7NkJBS2YsT0FBTyxNQUFNLFVBQVU7QUFDeEIsdUJBQVcsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFYLENBRHdCOztBQUd4QixpQkFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFsQixFQUF5QixJQUF6QixFQUErQixRQUEvQixFQUh3Qjs7OztXQWhCMUI7Ozs7O0FBeUJOLFNBQVMsa0JBQVQsRUFBNkIsT0FBN0IsQ0FBcUMsZUFBckMsRUFBc0QsYUFBdEQiLCJmaWxlIjoiU29ja2V0U2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNvY2tldFNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IoJHJvb3RzY29wZSkge1xyXG4gICAgICAgIC8vcHJpdmF0ZSBmaWVsZHNcclxuICAgICAgICB0aGlzLl9yb290c2NvcGUgPSAkcm9vdHNjb3BlO1xyXG4gICAgICAgIHRoaXMuX3NvY2tldCA9IGlvLmNvbm5lY3QoKTtcclxuICAgIH1cclxuICAgIGFwcGx5KGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5fcm9vdHNjb3BlLiRhcHBseSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMuX3NvY2tldCwgYXJndW1lbnRzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9uKGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrID0gdGhpcy5hcHBseShjYWxsYmFjayk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihldmVudCwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgZW1pdChldmVudCwgZGF0YSwgY2FsbGJhY2spIHtcclxuICAgICAgICBjYWxsYmFjayA9IHRoaXMuYXBwbHkoY2FsbGJhY2spO1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdChldmVudCwgZGF0YSwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcblxyXG4vL1NvY2tldFNlcnZpY2UuJGluamVjdCA9IFsnJHJvb3RzY29wZSddO1xyXG5cclxucmVnaXN0ZXIoJ09wZW5Nb2Quc2VydmljZXMnKS5zZXJ2aWNlKCdTb2NrZXRTZXJ2aWNlJywgU29ja2V0U2VydmljZSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
