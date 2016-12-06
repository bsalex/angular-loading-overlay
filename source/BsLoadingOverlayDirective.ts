import * as angular from 'angular';
import IBsLoadingOverlayOptions from './IBsLoadingOverlayOptions';
import BsLoadingOverlayInstance from './BsLoadingOverlayInstance';
import {BsLoadingOverlayService} from './BsLoadingOverlayService';

interface BsLoadingOverlayDirectiveAttributes extends angular.IAttributes {
    bsLoadingOverlayReferenceId: string;
    bsLoadingOverlay: string;
    bsLoadingOverlayDelay: number;
    bsLoadingOverlayActiveClass: string;
    bsLoadingOverlayTemplateUrl: string;
    bsLoadingOverlayTemplateOptions: any;
}

interface BsLoadingOverlayDirectiveScope extends angular.IScope {
    bsLoadingOverlayTemplateOptions: any;
}

export default class BsLoadingOverlayDirective implements angular.IDirective {
    constructor(
        private $compile: angular.ICompileService,
        private $rootScope: angular.IRootScopeService,
        private $templateRequest: angular.ITemplateRequestService,
        private $q: angular.IQService,
        private $timeout: angular.ITimeoutService,
        private bsLoadingOverlayService: BsLoadingOverlayService
    ) {}

    private updateOverlayElement(overlayInstance: BsLoadingOverlayInstance) {
        if (this.bsLoadingOverlayService.isActive(overlayInstance.referenceId)) {
            overlayInstance.add();
        } else {
            overlayInstance.remove();
        }
    };

    restrict = 'EA';
    link: angular.IDirectiveLinkFn = (scope: BsLoadingOverlayDirectiveScope, $element: angular.IAugmentedJQuery, $attributes: BsLoadingOverlayDirectiveAttributes) => {
        let templatePromise: angular.IPromise<string>;
        let overlayElementScope: BsLoadingOverlayDirectiveScope;
        const globalConfig = this.bsLoadingOverlayService.getGlobalConfig();
        const templateUrl = $attributes.bsLoadingOverlayTemplateUrl || globalConfig.templateUrl;
        const templateOptions = scope.$eval($attributes.bsLoadingOverlayTemplateOptions) || globalConfig.templateOptions;

        let overlayElement = null;

        if (templateUrl) {
            templatePromise = this.$templateRequest(templateUrl);
        } else {
            templatePromise = this.$q.reject();
        }

        templatePromise.then((loadedTemplate: string) => {
            overlayElementScope = <BsLoadingOverlayDirectiveScope> scope.$new();
            overlayElementScope.bsLoadingOverlayTemplateOptions = templateOptions;
            overlayElement = this.$compile(loadedTemplate)(overlayElementScope);
            overlayElement.data('isAttached', false);
        }).finally(() => {
            const overlayInstance = new BsLoadingOverlayInstance(
                $attributes.bsLoadingOverlayReferenceId || ($attributes.bsLoadingOverlay === '' ? undefined : $attributes.bsLoadingOverlay),
                +$attributes.bsLoadingOverlayDelay || globalConfig.delay,
                $attributes.bsLoadingOverlayActiveClass || globalConfig.activeClass,
                $element,
                overlayElement,
                this.$timeout,
                this.$q
            );

            const unsubscribe = this.$rootScope.$on(
                'bsLoadingOverlayUpdateEvent',
                (event: angular.IAngularEvent, options: IBsLoadingOverlayOptions) => {
                    if (options.referenceId === overlayInstance.referenceId) {
                        this.updateOverlayElement(overlayInstance);
                    }
                }
            );

            $element.on('$destroy', () => {
                overlayElementScope.$destroy();
                unsubscribe();
            });
            this.updateOverlayElement(overlayInstance);
        });
    }
}

export const BsLoadingOverlayDirectiveFactory: angular.IDirectiveFactory = (
    $compile: angular.ICompileService,
    $rootScope: angular.IRootScopeService,
    $templateRequest: angular.ITemplateRequestService,
    $q: angular.IQService,
    $timeout: angular.ITimeoutService,
    bsLoadingOverlayService: BsLoadingOverlayService
) => (
    new BsLoadingOverlayDirective(
        $compile,
        $rootScope,
        $templateRequest,
        $q,
        $timeout,
        bsLoadingOverlayService
    )
);

BsLoadingOverlayDirectiveFactory.$inject = [
    '$compile',
    '$rootScope',
    '$templateRequest',
    '$q',
    '$timeout',
    'bsLoadingOverlayService'
];
