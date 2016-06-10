import IBsLoadingOverlayOptions from './IBsLoadingOverlayOptions';
import IBsLoadingOverlayHandler from './IBsLoadingOverlayHandler';

export class BsLoadingOverlayService {
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $q: ng.IQService
    ) { }

    globalConfig: IBsLoadingOverlayOptions = {};
    activeOverlays: { [key: string]: boolean } = {};

    start(options: IBsLoadingOverlayOptions = {}) {
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

const bsLoadingOverlayServiceFactory = ($rootScope: ng.IRootScopeService, $q: ng.IQService) => new BsLoadingOverlayService($rootScope, $q);
bsLoadingOverlayServiceFactory.$inject = ['$rootScope', '$q'];

export default bsLoadingOverlayServiceFactory;
