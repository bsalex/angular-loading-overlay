(function() {
  "use strict";

  angular.module("angularLoadingOverlay")
    .run(["$templateCache", function($templateCache) {
      var template = '<div class="loading-overlay" ng-hide="!showOverlay()"></div>';
      $templateCache.put("loadingOverlay.html", template);
    }]);
})();
