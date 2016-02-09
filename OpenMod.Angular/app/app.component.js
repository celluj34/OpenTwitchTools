(function(app) {
    app.AppComponent =
        ng.core.Component({
            selector: 'open-mod',
            template: '<h1>My First Angular 2-2 App</h1>'
        })
        .Class({
            constructor: function() {
            }
        });
})(window.app || (window.app = {}));