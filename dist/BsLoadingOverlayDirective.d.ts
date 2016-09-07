import { BsLoadingOverlayService } from './BsLoadingOverlayService';
export default class BsLoadingOverlayDirective implements ng.IDirective {
    private $compile;
    private $rootScope;
    private $templateRequest;
    private $q;
    private $timeout;
    private bsLoadingOverlayService;
    constructor($compile: ng.ICompileService, $rootScope: ng.IRootScopeService, $templateRequest: ng.ITemplateRequestService, $q: ng.IQService, $timeout: ng.ITimeoutService, bsLoadingOverlayService: BsLoadingOverlayService);
    private updateOverlayElement(overlayInstance);
    restrict: string;
    link: ng.IDirectiveLinkFn;
}
export declare const BsLoadingOverlayDirectiveFactory: ng.IDirectiveFactory;
