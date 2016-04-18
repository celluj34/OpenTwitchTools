export default class ChatController {
    /*@ngInject;*/
    constructor(ChatService/*, $state, $uibModal*/) {
        //private fields
        this._chatService = ChatService;
        //this._state = $state;
        //this._uibModal = $uibModal;

        //public properties
        this.message = null;
        this.loadingPromise = null;
    }
    get config() {
        return {
            brandPrefix: '#',
            inputPlaceholder: 'Send a message'
        };
    }
    get brand() {
        return this.config.brandPrefix + this.selectedChannel;
    }
    $onInit() {
        //this.loadingPromise = this._loginService.requestCredentials((data) => this.setCredentials(data));
    }
}