export default class CssController {
    /*@ngInject;*/
    constructor(CssService) {
        //private fields
        this._cssService = CssService;

        //public properties
        this.theme = null;
        this.loadingPromise = null;
    }
    $onInit() {
        this.loadingPromise = this._cssService.getTheme((data) => this.setTheme(data));
    }
    setTheme(data) {
        data = data || {};

        this.theme = data.theme || 'flatly';
    }
    //updateTheme(data) {
    //    data = data || {};

    //    this.theme = data.theme || '';
    //}
}