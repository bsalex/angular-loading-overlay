app.controller('WrapperController', function ($scope, $timeout, bsLoadingOverlayService) {
  $scope.showOverlay = function () {
    bsLoadingOverlayService.wrap($timeout(angular.noop, 5000), {
      referenceId: 'wrapper'
    });
  }

});
