'use strict';

//config.$inject = ['$routeProvider', '$locationProvider'];

//function config($routeProvider, $locationProvider) {
//    $routeProvider
//        .when('/', {
//            controller: 'HomeController',
//            templateUrl: 'home/home.view.html',
//            controllerAs: 'vm'
//        })
//        .when('/login', {
//            controller: 'LoginController',
//            templateUrl: 'login/login.view.html',
//            controllerAs: 'vm'
//        })
//        .when('/register', {
//            controller: 'RegisterController',
//            templateUrl: 'register/register.view.html',
//            controllerAs: 'vm'
//        })
//        .otherwise({redirectTo: '/login'});
//}

//run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

//function run($rootScope, $location, $cookieStore, $http) {
//    // keep user logged in after page refresh
//    $rootScope.globals = $cookieStore.get('globals') || {};
//    if($rootScope.globals.currentUser) {
//        $http.defaults.headers.common['Authorization'] = `Basic ${$rootScope.globals.currentUser.authdata}`;
//    }

//    $rootScope.$on('$locationChangeStart', function(event, next, current) {
//        // redirect to login page if not logged in and trying to access a restricted page
//        const restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
//        const loggedIn = $rootScope.globals.currentUser;
//        if(restrictedPage && !loggedIn) {
//            $location.path('/login');
//        }
//    });
//}

angular.module('OpenMod', [])
//.config(config)
//.run(run)
;

angular.module('OpenMod.services', []);
angular.module('OpenMod.components', ['OpenMod.services']);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9wZW5Nb2QuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQ0EsUUFBUSxNQUFSLENBQWUsU0FBZixFQUEwQixFQUExQjs7Ozs7QUFLQSxRQUFRLE1BQVIsQ0FBZSxrQkFBZixFQUFtQyxFQUFuQztBQUNBLFFBQVEsTUFBUixDQUFlLG9CQUFmLEVBQXFDLENBQUMsa0JBQUQsQ0FBckMiLCJmaWxlIjoiT3Blbk1vZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuLy9jb25maWcuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInXTtcclxuXHJcbi8vZnVuY3Rpb24gY29uZmlnKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xyXG4vLyAgICAkcm91dGVQcm92aWRlclxyXG4vLyAgICAgICAgLndoZW4oJy8nLCB7XHJcbi8vICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJyxcclxuLy8gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUvaG9tZS52aWV3Lmh0bWwnLFxyXG4vLyAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4vLyAgICAgICAgfSlcclxuLy8gICAgICAgIC53aGVuKCcvbG9naW4nLCB7XHJcbi8vICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ29udHJvbGxlcicsXHJcbi8vICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsb2dpbi9sb2dpbi52aWV3Lmh0bWwnLFxyXG4vLyAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4vLyAgICAgICAgfSlcclxuLy8gICAgICAgIC53aGVuKCcvcmVnaXN0ZXInLCB7XHJcbi8vICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlZ2lzdGVyQ29udHJvbGxlcicsXHJcbi8vICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdyZWdpc3Rlci9yZWdpc3Rlci52aWV3Lmh0bWwnLFxyXG4vLyAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4vLyAgICAgICAgfSlcclxuLy8gICAgICAgIC5vdGhlcndpc2Uoe3JlZGlyZWN0VG86ICcvbG9naW4nfSk7XHJcbi8vfVxyXG5cclxuLy9ydW4uJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnJGNvb2tpZVN0b3JlJywgJyRodHRwJ107XHJcblxyXG4vL2Z1bmN0aW9uIHJ1bigkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRjb29raWVTdG9yZSwgJGh0dHApIHtcclxuLy8gICAgLy8ga2VlcCB1c2VyIGxvZ2dlZCBpbiBhZnRlciBwYWdlIHJlZnJlc2hcclxuLy8gICAgJHJvb3RTY29wZS5nbG9iYWxzID0gJGNvb2tpZVN0b3JlLmdldCgnZ2xvYmFscycpIHx8IHt9O1xyXG4vLyAgICBpZigkcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXIpIHtcclxuLy8gICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBdXRob3JpemF0aW9uJ10gPSBgQmFzaWMgJHskcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXIuYXV0aGRhdGF9YDtcclxuLy8gICAgfVxyXG5cclxuLy8gICAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24oZXZlbnQsIG5leHQsIGN1cnJlbnQpIHtcclxuLy8gICAgICAgIC8vIHJlZGlyZWN0IHRvIGxvZ2luIHBhZ2UgaWYgbm90IGxvZ2dlZCBpbiBhbmQgdHJ5aW5nIHRvIGFjY2VzcyBhIHJlc3RyaWN0ZWQgcGFnZVxyXG4vLyAgICAgICAgY29uc3QgcmVzdHJpY3RlZFBhZ2UgPSAkLmluQXJyYXkoJGxvY2F0aW9uLnBhdGgoKSwgWycvbG9naW4nLCAnL3JlZ2lzdGVyJ10pID09PSAtMTtcclxuLy8gICAgICAgIGNvbnN0IGxvZ2dlZEluID0gJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyO1xyXG4vLyAgICAgICAgaWYocmVzdHJpY3RlZFBhZ2UgJiYgIWxvZ2dlZEluKSB7XHJcbi8vICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xyXG4vLyAgICAgICAgfVxyXG4vLyAgICB9KTtcclxuLy99XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnT3Blbk1vZCcsIFtdKVxyXG4gICAgLy8uY29uZmlnKGNvbmZpZylcclxuICAgIC8vLnJ1bihydW4pXHJcbjtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdPcGVuTW9kLnNlcnZpY2VzJywgW10pO1xyXG5hbmd1bGFyLm1vZHVsZSgnT3Blbk1vZC5jb21wb25lbnRzJywgWydPcGVuTW9kLnNlcnZpY2VzJ10pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
