module BsLoadingOverlay {
    export interface IBsLoadingOverlayHandler {
        start: () => void
        stop: () => void
        wrap: (promiseFunction: ng.IPromise<any> | (() => (ng.IPromise<any> | {}))) => ng.IPromise<any>
    }
}
