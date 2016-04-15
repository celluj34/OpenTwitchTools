export default class CssController {
    /*@ngInject;*/
    constructor(CssService) {
        //private fields
        this._cssService = CssService;

        //public properties
        this.theme = this.config.defaultTheme;
        this.loadingPromise = null;
    }
    get config() {
        return {
            defaultTheme: 'flatly'
        };
    }
    $onInit() {
        this._cssService.updateTheme((data) => this.setTheme(data));

        this.loadingPromise = this._cssService.getTheme((data) => this.setTheme(data));
    }
    setTheme(data) {
        data = data || {};

        this.theme = data.theme || this.config.defaultTheme;
    }
}