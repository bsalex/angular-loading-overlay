!function() {
    "use strict";
    angular.module("bsLoadingOverlay", []);
}(), function() {
    "use strict";
    function bsLoadingOverlay($compile, $rootScope, $templateRequest, $q, $timeout, bsLoadingOverlayService) {
        function link(scope, $element, $attributes) {
            function activate() {
                var globalConfig = bsLoadingOverlayService.getGlobalConfig();
                referenceId = $attributes.bsLoadingOverlayReferenceId || $attributes.bsLoadingOverlay, 
                delay = +$attributes.bsLoadingOverlayDelay || globalConfig.delay, activeClass = $attributes.bsLoadingOverlayActiveClass || globalConfig.activeClass;
                var templateUrl = $attributes.bsLoadingOverlayTemplateUrl || globalConfig.templateUrl;
                templatePromise = templateUrl ? $templateRequest(templateUrl) : $q.when(!1), templatePromise.then(function(loadedTemplate) {
                    overlayElement = $compile(loadedTemplate)(scope), overlayElement.isAttached = !1, 
                    updateOverlayElement(referenceId);
                });
                var unsubscribe = $rootScope.$on("bsLoadingOverlayUpdateEvent", function(event, options) {
                    options.referenceId === referenceId && updateOverlayElement(referenceId);
                });
                $element.on("$destroy", unsubscribe);
            }
            function updateOverlayElement(referenceId) {
                bsLoadingOverlayService.isActive(referenceId) ? overlayElement.isAttached || addOverlay() : overlayElement.isAttached && removeOverlay();
            }
            function addOverlay() {
                delay ? (delayPromise && $timeout.cancel(delayPromise), delayPromise = $timeout(angular.noop, delay)) : delayPromise = $q.when(), 
                $element.append(overlayElement), overlayElement.isAttached = !0, $element.addClass(activeClass);
            }
            function removeOverlay() {
                overlayElement.isAttached = !1, delayPromise.then(function() {
                    overlayElement.detach(), $element.removeClass(activeClass);
                });
            }
            var overlayElement, referenceId, activeClass, templatePromise, delay, delayPromise;
            activate();
        }
        var directive = {
            restrict: "EA",
            link: link
        };
        return directive;
    }
    angular.module("bsLoadingOverlay").directive("bsLoadingOverlay", bsLoadingOverlay), 
    bsLoadingOverlay.$inject = [ "$compile", "$rootScope", "$templateRequest", "$q", "$timeout", "bsLoadingOverlayService" ];
}(), function() {
    "use strict";
    function bsLoadingOverlayServiceFactory($rootScope, $q) {
        function start(options) {
            options = options || {}, activeOverlays[options.referenceId] = !0, notifyOverlays(options.referenceId);
        }
        function wrap(promiseFunction, options) {
            var promise = promiseFunction;
            return angular.isFunction(promiseFunction) || (promise = function() {
                return promiseFunction;
            }), $q.when(bsLoadingOverlayService.start(options)).then(promise)["finally"](bsLoadingOverlayService.stop.bind(bsLoadingOverlayService, options));
        }
        function createHandler(options) {
            return {
                start: start.bind(null, options),
                stop: stop.bind(null, options),
                wrap: function(promiseFunction) {
                    return wrap(promiseFunction, options);
                }
            };
        }
        function notifyOverlays(referenceId) {
            $rootScope.$emit("bsLoadingOverlayUpdateEvent", {
                referenceId: referenceId
            });
        }
        function stop(options) {
            options = options || {}, delete activeOverlays[options.referenceId], notifyOverlays(options.referenceId);
        }
        function isActive(referenceId) {
            return activeOverlays[referenceId];
        }
        function setGlobalConfig(options) {
            globalConfig = angular.extend(globalConfig, options);
        }
        function getGlobalConfig() {
            return globalConfig;
        }
        var bsLoadingOverlayService = {
            start: start,
            stop: stop,
            isActive: isActive,
            createHandler: createHandler,
            wrap: wrap,
            setGlobalConfig: setGlobalConfig,
            getGlobalConfig: getGlobalConfig
        }, activeOverlays = {}, globalConfig = {};
        return bsLoadingOverlayService;
    }
    angular.module("bsLoadingOverlay").factory("bsLoadingOverlayService", bsLoadingOverlayServiceFactory), 
    bsLoadingOverlayServiceFactory.$inject = [ "$rootScope", "$q" ];
}();