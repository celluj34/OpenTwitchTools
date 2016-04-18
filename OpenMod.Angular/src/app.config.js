export default function routing($stateProvider, $urlRouterProvider) {
    'ngInject';

    const viewPrefix = '/app/views/';

    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: `${viewPrefix}login.html`,
            controller: 'LoginController',
            controllerAs: 'login'
        })
        .state('chat', {
            url: '/chat',
            templateUrl: `${viewPrefix}chat.html`,
            controller: 'ChatController',
            controllerAs: 'chat'
        });

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

    $urlRouterProvider.otherwise('/');
}