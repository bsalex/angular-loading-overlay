import IBsLoadingOverlayOptions from './loading-overlay.options';
import {BsLoadingOverlayService} from './loading-overlay.service';

interface BsLoadingOverlayDirectiveAttributes extends ng.IAttributes {
    bsLoadingOverlayReferenceId: string;
    bsLoadingOverlay: string;
    bsLoadingOverlayDelay: number;
    bsLoadingOverlayActiveClass: string;
    bsLoadingOverlayTemplateUrl: string;
}

export default class BsLoadingOverlayDirective implements ng.IDirective {
    constructor(
        private $compile: ng.ICompileService,
        private $rootScope: ng.IRootScopeService,
        private $templateRequest: ng.ITemplateRequestService,
        private $q: ng.IQService,
        private $timeout: ng.ITimeoutService,
        private bsLoadingOverlayService: BsLoadingOverlayService
    ) { }

    restrict = 'EA';
    link: ng.IDirectiveLinkFn = (scope: ng.IScope, $element: ng.IAugmentedJQuery, $attributes: BsLoadingOverlayDirectiveAttributes) => {
        let overlayElement: ng.IAugmentedJQuery,
            referenceId: string,
            activeClass: string,
            templatePromise: ng.IPromise<string>,
            delay: number,
            delayPromise: ng.IPromise<void>;

        const activate = () => {
            const globalConfig = this.bsLoadingOverlayService.getGlobalConfig();
            referenceId = $attributes.bsLoadingOverlayReferenceId || $attributes.bsLoadingOverlay;
            delay = +$attributes.bsLoadingOverlayDelay || globalConfig.delay;
            activeClass = $attributes.bsLoadingOverlayActiveClass || globalConfig.activeClass;
            const templateUrl = $attributes.bsLoadingOverlayTemplateUrl || globalConfig.templateUrl;

            if (templateUrl) {
                templatePromise = this.$templateRequest(templateUrl);
            } else {
                templatePromise = this.$q.reject();
            }

            templatePromise.then((loadedTemplate: string) => {
                overlayElement = this.$compile(loadedTemplate)(scope);
                overlayElement.data('isAttached', false);
                updateOverlayElement(referenceId);
            }).catch(() => {
                updateOverlayElement(referenceId);
            });

            const unsubscribe = this.$rootScope.$on('bsLoadingOverlayUpdateEvent', (event: ng.IAngularEvent, options: IBsLoadingOverlayOptions) => {
                if (options.referenceId === referenceId) {
                    updateOverlayElement(referenceId);
                }
            });

            $element.on('$destroy', unsubscribe);
        };

        const updateOverlayElement = (referenceId: string) => {
            if (this.bsLoadingOverlayService.isActive(referenceId)) {
                addOverlay();
            } else {
                removeOverlay();
            }
        };

        const isOverlayAdded = () => !!delayPromise
        const addOverlay = () => {
            if (delay) {
                if (delayPromise) {
                    this.$timeout.cancel(delayPromise);
                }
                delayPromise = this.$timeout(angular.noop, delay);
            } else {
                delayPromise = this.$q.when();
            }

            if (overlayElement && !overlayElement.data('isAttached')) {
                $element.append(overlayElement);
                overlayElement.data('isAttached', true);
            }

            $element.addClass(activeClass);
        };

        const removeOverlay = () => {
            if (isOverlayAdded()) {
                delayPromise.then(() => {
                    if (overlayElement && overlayElement.data('isAttached')) {
                        overlayElement.data('isAttached', false);
                        overlayElement.detach();
                    }

                    $element.removeClass(activeClass);
                    delayPromise = undefined;
                });
            }
        };

        activate();
    }
}

export const BsLoadingOverlayDirectiveFactory: ng.IDirectiveFactory = (
    $compile: ng.ICompileService,
    $rootScope: ng.IRootScopeService,
    $templateRequest: ng.ITemplateRequestService,
    $q: ng.IQService,
    $timeout: ng.ITimeoutService,
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
