interface IBsLoadingOverlayHandler {
    start: () => void;
    stop: () => void;
    wrap: (promiseFunction: ng.IPromise<any> | (() => (ng.IPromise<any> | {}))) => ng.IPromise<any>;
}

export default IBsLoadingOverlayHandler;
