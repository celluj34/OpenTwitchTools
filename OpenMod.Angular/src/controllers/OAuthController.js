export default class OAuthController {
    /*@ngInject;*/
    constructor($sce, $uibModalInstance) {
        //private fields
        this._sce = $sce;
        this._uibModalInstance = $uibModalInstance;

        //public properties
        this.loading = true;
    }
    get config() {
        return {
            title: 'Generate oauth token',
            footer: 'In order to log in, you must generate an oauth token. This is required. Please use the "Connect with Twitch" button above to generate your token. Copy that token and paste it into the password field on the previous form.',
            close: 'Close',
            tokenAuthUrl: this._sce.trustAsResourceUrl('https://twitchapps.com/tmi/')
        };
    }
    $onInit() {
        this.loading = false;
    }
    close() {
        this._uibModalInstance.close();
    }
}