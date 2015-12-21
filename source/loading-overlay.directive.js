(function () {
  'use strict';

  angular
    .module('bsLoadingOverlay')
    .directive('bsLoadingOverlay', bsLoadingOverlay);

  bsLoadingOverlay.$inject = ['$compile', '$rootScope', '$templateRequest', '$q', '$timeout', 'bsLoadingOverlayService'];

  function bsLoadingOverlay($compile, $rootScope, $templateRequest, $q, $timeout, bsLoadingOverlayService) {
    var directive = {
      restrict: 'EA',
      link: link
    };

    return directive;

    function link(scope, $element, $attributes) {
      var overlayElement,
        referenceId,
        activeClass,
        templatePromise,
        delay,
        delayPromise;

      activate();

      function activate() {
        var globalConfig = bsLoadingOverlayService.getGlobalConfig();
        referenceId = $attributes.bsLoadingOverlayReferenceId || $attributes.bsLoadingOverlay;
        delay = +$attributes.bsLoadingOverlayDelay || globalConfig.delay;
        activeClass = $attributes.bsLoadingOverlayActiveClass || globalConfig.activeClass;
        var templateUrl = $attributes.bsLoadingOverlayTemplateUrl || globalConfig.templateUrl;

        if (templateUrl) {
          templatePromise = $templateRequest(templateUrl);
        } else {
          templatePromise = $q.when(false);
        }

        templatePromise.then(function (loadedTemplate) {
          overlayElement = $compile(loadedTemplate)(scope);
          overlayElement.isAttached = false;
          updateOverlayElement(referenceId);
        });

        var unsubscribe = $rootScope.$on('bsLoadingOverlayUpdateEvent', function (event, options) {
          if (options.referenceId === referenceId) {
            updateOverlayElement(referenceId);
          }
        });

        $element.on('$destroy', unsubscribe);
      }

      function updateOverlayElement(referenceId) {
        if (bsLoadingOverlayService.isActive(referenceId)) {
          if (!overlayElement.isAttached) {
            addOverlay();
          }
        } else {
          if (overlayElement.isAttached) {
            removeOverlay();
          }
        }
      }

      function addOverlay() {
        if (delay) {
          if (delayPromise) {
            $timeout.cancel(delayPromise);
          }
          delayPromise = $timeout(angular.noop, delay);
        } else {
          delayPromise = $q.when();
        }

        $element.append(overlayElement);
        overlayElement.isAttached = true;

        $element.addClass(activeClass);
      }

      function removeOverlay() {
        overlayElement.isAttached = false;

        delayPromise.then(function () {
          overlayElement.detach();

          $element.removeClass(activeClass);
        });
      }
    }
  }
})();
