import IBsLoadingOverlayOptions from './loading-overlay.options';
import IBsLoadingOverlayHandler from './loading-overlay.handler';

export class BsLoadingOverlayService {
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $q: ng.IQService
    ) { }

    globalConfig: IBsLoadingOverlayOptions;
    activeOverlays: { [key: string]: boolean };

    start(options: IBsLoadingOverlayOptions) {
        options = options || {};
        this.activeOverlays[options.referenceId] = true;

        this.notifyOverlays(options.referenceId);
    }

    wrap(options: IBsLoadingOverlayOptions, promiseFunction: ng.IPromise<any> | (() => (ng.IPromise<any> | {}))): ng.IPromise<any> {
        let promise: () => (ng.IPromise<any> | {});

        if (typeof promiseFunction === 'function') {
            promise = <() => ng.IPromise<any>>promiseFunction;
        } else {
            promise = () => promiseFunction;
        }

        return this.$q.when(this.start(options))
            .then(promise)
            .finally(this.stop.bind(this, options));
    }

    createHandler(options: IBsLoadingOverlayOptions): IBsLoadingOverlayHandler {
        return {
            start: this.start.bind(null, options),
            stop: this.stop.bind(null, options),
            wrap: this.wrap.bind(null, options)
        };
    }

    notifyOverlays(referenceId: string) {
        this.$rootScope.$emit('bsLoadingOverlayUpdateEvent', {
            referenceId: referenceId
        });
    }

    stop(options: IBsLoadingOverlayOptions) {
        options = options || {};

        delete this.activeOverlays[options.referenceId];
        this.notifyOverlays(options.referenceId);
    }

    isActive(referenceId: string) {
        return this.activeOverlays[referenceId];
    }

    setGlobalConfig(options: IBsLoadingOverlayOptions) {
        angular.extend(this.globalConfig, options);
    }

    getGlobalConfig() {
        return this.globalConfig;
    }
}

const bsLoadingOverlayServiceFactory = ($rootScope: ng.IRootScopeService, $q: ng.IQService) => new BsLoadingOverlayService($rootScope, $q);
bsLoadingOverlayServiceFactory.$inject = ['$rootScope', '$q'];

export default bsLoadingOverlayServiceFactory;
