'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketService = function () {
    function SocketService($rootscope) {
        _classCallCheck(this, SocketService);

        console.log("SocketService");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvY2tldFNlcnZpY2UuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFNO0FBQ0YsYUFERSxhQUNGLENBQVksVUFBWixFQUF3Qjs4QkFEdEIsZUFDc0I7O0FBQ3BCLGdCQUFRLEdBQVIsQ0FBWSxlQUFaOztBQURvQixZQUdwQixDQUFLLFVBQUwsR0FBa0IsVUFBbEIsQ0FIb0I7QUFJcEIsYUFBSyxPQUFMLEdBQWUsR0FBRyxPQUFILEVBQWYsQ0FKb0I7S0FBeEI7O2lCQURFOzs4QkFPSSxVQUFVOzs7O0FBQ1osaUJBQUssVUFBTCxDQUFnQixNQUFoQixDQUF1QixZQUFNO0FBQ3pCLHlCQUFTLEtBQVQsQ0FBZSxNQUFLLE9BQUwsWUFBZixFQUR5QjthQUFOLENBQXZCLENBRFk7Ozs7MkJBS2IsT0FBTyxVQUFVO0FBQ2hCLHVCQUFXLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBWCxDQURnQjs7QUFHaEIsaUJBQUssT0FBTCxDQUFhLEVBQWIsQ0FBZ0IsS0FBaEIsRUFBdUIsUUFBdkIsRUFIZ0I7Ozs7NkJBS2YsT0FBTyxNQUFNLFVBQVU7QUFDeEIsdUJBQVcsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFYLENBRHdCOztBQUd4QixpQkFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFsQixFQUF5QixJQUF6QixFQUErQixRQUEvQixFQUh3Qjs7OztXQWpCMUI7Ozs7O0FBMEJOLFNBQVMsa0JBQVQsRUFBNkIsT0FBN0IsQ0FBcUMsZUFBckMsRUFBc0QsYUFBdEQiLCJmaWxlIjoiU29ja2V0U2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNvY2tldFNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IoJHJvb3RzY29wZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU29ja2V0U2VydmljZVwiKTtcclxuICAgICAgICAvL3ByaXZhdGUgZmllbGRzXHJcbiAgICAgICAgdGhpcy5fcm9vdHNjb3BlID0gJHJvb3RzY29wZTtcclxuICAgICAgICB0aGlzLl9zb2NrZXQgPSBpby5jb25uZWN0KCk7XHJcbiAgICB9XHJcbiAgICBhcHBseShjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuX3Jvb3RzY29wZS4kYXBwbHkoKCkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLl9zb2NrZXQsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBvbihldmVudCwgY2FsbGJhY2spIHtcclxuICAgICAgICBjYWxsYmFjayA9IHRoaXMuYXBwbHkoY2FsbGJhY2spO1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQub24oZXZlbnQsIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIGVtaXQoZXZlbnQsIGRhdGEsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbGJhY2sgPSB0aGlzLmFwcGx5KGNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoZXZlbnQsIGRhdGEsIGNhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG5cclxuLy9Tb2NrZXRTZXJ2aWNlLiRpbmplY3QgPSBbJyRyb290c2NvcGUnXTtcclxuXHJcbnJlZ2lzdGVyKCdPcGVuTW9kLnNlcnZpY2VzJykuc2VydmljZSgnU29ja2V0U2VydmljZScsIFNvY2tldFNlcnZpY2UpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
