app.controller('WrapperFunctionController', function ($scope, $timeout, bsLoadingOverlayService) {
  $scope.showOverlay = function () {
    bsLoadingOverlayService.wrap({
        referenceId: 'wrapper-function'
      },
      function () {
        return $timeout(angular.noop, 5000);
      });
  }

});
