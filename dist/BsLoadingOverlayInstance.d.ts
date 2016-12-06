/// <reference types="angular" />
import * as angular from 'angular';
export default class BsLoadingOverlayInstance {
    referenceId: string;
    delay: number;
    activeClass: string;
    $element: angular.IAugmentedJQuery;
    overlayElement: angular.IAugmentedJQuery;
    private $timeout;
    private $q;
    private delayPromise;
    constructor(referenceId: string, delay: number, activeClass: string, $element: angular.IAugmentedJQuery, overlayElement: angular.IAugmentedJQuery, $timeout: any, $q: any);
    private isAdded();
    add(): void;
    remove(): void;
}
