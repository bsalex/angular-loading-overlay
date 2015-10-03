app.controller('WrapperFunctionController', function ($scope, $timeout, bsLoadingOverlayService) {
  $scope.showOverlay = function () {
    bsLoadingOverlayService.wrap(
      function () {
        return $timeout(angular.noop, 5000);
      }, {
        referenceId: 'wrapper-function'
      });
  }

});
