import IBsLoadingOverlayOptions from './IBsLoadingOverlayOptions';
import IBsLoadingOverlayHandler from './IBsLoadingOverlayHandler';
export declare class BsLoadingOverlayService {
    private $rootScope;
    private $q;
    constructor($rootScope: ng.IRootScopeService, $q: ng.IQService);
    globalConfig: IBsLoadingOverlayOptions;
    activeOverlays: {
        [key: string]: boolean;
    };
    start(options?: IBsLoadingOverlayOptions): void;
    wrap(options: IBsLoadingOverlayOptions, promiseFunction: ng.IPromise<any> | (() => (ng.IPromise<any> | {}))): ng.IPromise<any>;
    createHandler: (options: IBsLoadingOverlayOptions) => IBsLoadingOverlayHandler;
    notifyOverlays(referenceId: string): void;
    stop(options?: IBsLoadingOverlayOptions): void;
    isActive: (referenceId?: string) => boolean;
    setGlobalConfig: (options: IBsLoadingOverlayOptions) => any;
    getGlobalConfig: () => IBsLoadingOverlayOptions;
}
declare const bsLoadingOverlayServiceFactory: ($rootScope: ng.IRootScopeService, $q: ng.IQService) => BsLoadingOverlayService;
export default bsLoadingOverlayServiceFactory;
