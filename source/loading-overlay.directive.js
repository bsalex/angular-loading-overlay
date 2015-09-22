(function() {
  "use strict";

  angular.module("angularLoadingOverlay")
    .directive("loadingOverlay", ["$templateCache", "$compile",
      function($templateCache, $compile) {
        return {
          restrict: "A",
          transclude: true,
          scope: {
            loadingOverlay: "@?"
          },
          link: function(scope, element, attributes, controller, transclude) {
            scope.showOverlay = function() {
              var ids = scope.loadingOverlay.split(","),
                result = false;

              if (scope.$parent.isLoadingOverlay !== undefined) {
                for (var i = 0; i < ids.length; i++) {
                  if (scope.$parent.isLoadingOverlay(ids[i].trim() || undefined)) {
                    result = true;
                    break;
                  }
                }
              }

              return result;
            };

            element.append($compile($templateCache.get("loadingOverlay.html"))(scope));
            transclude(function(clone) {
              element.append(clone);
            });
          }
        };
      }
    ]);
})();
