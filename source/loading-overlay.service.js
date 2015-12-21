(function () {
  'use strict';

  angular
    .module('bsLoadingOverlay')
    .factory('bsLoadingOverlayService', bsLoadingOverlayServiceFactory);

  bsLoadingOverlayServiceFactory.$inject = ['$rootScope', '$q'];

  function bsLoadingOverlayServiceFactory($rootScope, $q) {
    var bsLoadingOverlayService = {
        start: start,
        stop: stop,
        isActive: isActive,
        createHandler: createHandler,
        wrap: wrap,
        setGlobalConfig: setGlobalConfig,
        getGlobalConfig: getGlobalConfig
      },
      activeOverlays = {},
      globalConfig = {};

    return bsLoadingOverlayService;

    function start(options) {
      options = options || {};
      activeOverlays[options.referenceId] = true;

      notifyOverlays(options.referenceId);
    }

    function wrap(promiseFunction, options) {
      var promise = promiseFunction;

      if (!angular.isFunction(promiseFunction)) {
        promise = function () {
          return promiseFunction;
        };
      }

      return $q.when(bsLoadingOverlayService.start(options))
        .then(promise)
        .finally(bsLoadingOverlayService.stop.bind(bsLoadingOverlayService, options));
    }

    function createHandler(options) {
      return {
        start: start.bind(null, options),
        stop: stop.bind(null, options),
        wrap: function (promiseFunction) {
          return wrap(promiseFunction, options);
        }
      };
    }

    function notifyOverlays(referenceId) {
      $rootScope.$emit('bsLoadingOverlayUpdateEvent', {
        referenceId: referenceId
      });
    }

    function stop(options) {
      options = options || {};

      delete activeOverlays[options.referenceId];
      notifyOverlays(options.referenceId);
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
  }
})();
