/// <reference types="angular" />
import * as angular from 'angular';
import IBsLoadingOverlayOptions from './IBsLoadingOverlayOptions';
import IBsLoadingOverlayHandler from './IBsLoadingOverlayHandler';
export declare class BsLoadingOverlayService {
    private $rootScope;
    private $q;
    constructor($rootScope: angular.IRootScopeService, $q: angular.IQService);
    globalConfig: IBsLoadingOverlayOptions;
    activeOverlays: {
        [key: string]: boolean;
    };
    start(options?: IBsLoadingOverlayOptions): void;
    wrap(options: IBsLoadingOverlayOptions, promiseFunction: angular.IPromise<any> | (() => (angular.IPromise<any> | {}))): angular.IPromise<any>;
    createHandler: (options: IBsLoadingOverlayOptions) => IBsLoadingOverlayHandler;
    notifyOverlays(referenceId: string): void;
    stop(options?: IBsLoadingOverlayOptions): void;
    isActive: (referenceId?: string) => boolean;
    setGlobalConfig: (options: IBsLoadingOverlayOptions) => any;
    getGlobalConfig: () => IBsLoadingOverlayOptions;
}
declare const bsLoadingOverlayServiceFactory: ($rootScope: angular.IRootScopeService, $q: angular.IQService) => BsLoadingOverlayService;
export default bsLoadingOverlayServiceFactory;
