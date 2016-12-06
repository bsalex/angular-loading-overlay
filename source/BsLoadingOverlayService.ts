import * as angular from 'angular';
import IBsLoadingOverlayOptions from './IBsLoadingOverlayOptions';
import IBsLoadingOverlayHandler from './IBsLoadingOverlayHandler';

export class BsLoadingOverlayService {
    constructor(
        private $rootScope: angular.IRootScopeService,
        private $q: angular.IQService
    ) { }

    globalConfig: IBsLoadingOverlayOptions = {};
    activeOverlays: { [key: string]: boolean } = {};

    start(options: IBsLoadingOverlayOptions = {}) {
        this.activeOverlays[options.referenceId] = true;
        this.notifyOverlays(options.referenceId);
    }

    wrap(options: IBsLoadingOverlayOptions, promiseFunction: angular.IPromise<any> | (() => (angular.IPromise<any> | {}))): angular.IPromise<any> {
        let promise: () => (angular.IPromise<any> | {});

        if (typeof promiseFunction === 'function') {
            promise = <() => angular.IPromise<any>>promiseFunction;
        } else {
            promise = () => promiseFunction;
        }

        return this.$q.when(this.start(options))
            .then(promise)
            .finally(this.stop.bind(this, options));
    }

    createHandler = (options: IBsLoadingOverlayOptions): IBsLoadingOverlayHandler => ({
        start: this.start.bind(this, options),
        stop: this.stop.bind(this, options),
        wrap: this.wrap.bind(this, options)
    })

    notifyOverlays(referenceId: string) {
        this.$rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId: referenceId
        });
    }

    stop(options: IBsLoadingOverlayOptions = {}) {
        delete this.activeOverlays[options.referenceId];
        this.notifyOverlays(options.referenceId);
    }

    isActive = (referenceId: string = undefined) => this.activeOverlays[referenceId];
    setGlobalConfig = (options: IBsLoadingOverlayOptions) => angular.extend(this.globalConfig, options);
    getGlobalConfig = () => this.globalConfig;
}

const bsLoadingOverlayServiceFactory = ($rootScope: angular.IRootScopeService, $q: angular.IQService) => new BsLoadingOverlayService($rootScope, $q);
bsLoadingOverlayServiceFactory.$inject = ['$rootScope', '$q'];

export default bsLoadingOverlayServiceFactory;
