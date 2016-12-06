/// <reference types="angular" />
/// <reference types="angular-mocks" />
import * as angular from 'angular';
import { BsLoadingOverlayService } from './BsLoadingOverlayService';
export default class BsLoadingOverlayDirective implements angular.IDirective {
    private $compile;
    private $rootScope;
    private $templateRequest;
    private $q;
    private $timeout;
    private bsLoadingOverlayService;
    constructor($compile: angular.ICompileService, $rootScope: angular.IRootScopeService, $templateRequest: angular.ITemplateRequestService, $q: angular.IQService, $timeout: angular.ITimeoutService, bsLoadingOverlayService: BsLoadingOverlayService);
    private updateOverlayElement(overlayInstance);
    restrict: string;
    link: angular.IDirectiveLinkFn;
}
export declare const BsLoadingOverlayDirectiveFactory: angular.IDirectiveFactory;
