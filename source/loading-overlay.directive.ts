import IBsLoadingOverlayOptions from './loading-overlay.options';
import {BsLoadingOverlayService} from './loading-overlay.service';

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
    link: ng.IDirectiveLinkFn = (scope: ng.IScope, $element: ng.IAugmentedJQuery, $attributes: ng.IAttributes) => {
        let overlayElement: ng.IAugmentedJQuery,
            referenceId: string,
            activeClass: string,
            templatePromise: ng.IPromise<string>,
            delay: Number,
            delayPromise: ng.IPromise<void>;

        activate();

        function activate() {
            const globalConfig = this.bsLoadingOverlayService.getGlobalConfig();
            referenceId = this.$attributes.bsLoadingOverlayReferenceId || this.$attributes.bsLoadingOverlay;
            delay = +this.$attributes.bsLoadingOverlayDelay || globalConfig.delay;
            activeClass = this.$attributes.bsLoadingOverlayActiveClass || globalConfig.activeClass;
            const templateUrl = this.$attributes.bsLoadingOverlayTemplateUrl || globalConfig.templateUrl;

            if (templateUrl) {
                templatePromise = this.$templateRequest(templateUrl);
            } else {
                templatePromise = this.$q.when(false);
            }

            templatePromise.then(function(loadedTemplate: string) {
                overlayElement = this.$compile(loadedTemplate)(scope);
                overlayElement.data('isAttached', false);
                updateOverlayElement(referenceId);
            });

            const unsubscribe = this.$rootScope.$on('bsLoadingOverlayUpdateEvent', function(event: ng.IAngularEvent, options: IBsLoadingOverlayOptions) {
                if (options.referenceId === referenceId) {
                    updateOverlayElement(referenceId);
                }
            });

            $element.on('$destroy', unsubscribe);
        }

        function updateOverlayElement(referenceId: string) {
            if (overlayElement === undefined) {
                return false;
            }

            if (this.bsLoadingOverlayService.isActive(referenceId)) {
                if (!overlayElement.data('isAttached')) {
                    addOverlay();
                }
            } else {
                if (overlayElement.data('isAttached')) {
                    removeOverlay();
                }
            }
        }

        function addOverlay() {
            if (delay) {
                if (delayPromise) {
                    this.$timeout.cancel(delayPromise);
                }
                delayPromise = this.$timeout(angular.noop, delay);
            } else {
                delayPromise = this.$q.when();
            }

            $element.append(overlayElement);
            overlayElement.data('isAttached', true);

            $element.addClass(activeClass);
        }

        function removeOverlay() {
            overlayElement.data('isAttached', false);

            delayPromise.then(function() {
                overlayElement.detach();

                $element.removeClass(activeClass);
            });
        }
    }
}

export const BsLoadingOverlayDirectiveFactory: ng.IDirectiveFactory = (
    $compile: ng.ICompileService,
    $rootScope: ng.IRootScopeService,
    $templateRequest: ng.ITemplateRequestService,
    $q: ng.IQService,
    $timeout: ng.ITimeoutService,
    bsLoadingOverlayService: BsLoadingOverlayService
) => {

    return new BsLoadingOverlayDirective(
        $compile,
        $rootScope,
        $templateRequest,
        $q,
        $timeout,
        bsLoadingOverlayService
    );
};

BsLoadingOverlayDirectiveFactory.$inject = [
    '$compile',
    '$rootScope',
    '$templateRequest',
    '$q',
    '$timeout',
    'bsLoadingOverlayService'
];
