/// <reference types="angular" />
import * as angular from 'angular';
interface IBsLoadingOverlayHandler {
    start: () => void;
    stop: () => void;
    wrap: (promiseFunction: angular.IPromise<any> | (() => (angular.IPromise<any> | {}))) => angular.IPromise<any>;
}
export default IBsLoadingOverlayHandler;
