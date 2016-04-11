export default function routing($routeProvider, $locationProvider) {
    'ngInject';

    const viewPrefix = '/app/views/';

    $routeProvider
        .when('/', {
            templateUrl: `${viewPrefix}login.html`,
            controller: 'LoginController'
        })
        //.when('/chat', {
        //    templateUrl: `${viewPrefix}chat.html`,
        //    controller: 'ChatComponent'
        //})
        //.when('/commands', {
        //    templateUrl: `${viewPrefix}commands.html`,
        //    controller: 'CommandsComponent'
        //})
        //.when('/keywords', {
        //    templateUrl: `${viewPrefix}keywords.html`,
        //    controller: 'KeywordsComponent'
        //})
        //.when('/settings', {
        //    templateUrl: `${viewPrefix}settings.html`,
        //    controller: 'SettingsComponent'
        //})
        .otherwise('/');

    $locationProvider.html5Mode(true);
}