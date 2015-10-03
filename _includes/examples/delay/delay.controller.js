app.controller('DelayController', function ($scope, bsLoadingOverlayService) {
  $scope.showOverlay = function () {
    bsLoadingOverlayService.start({
      referenceId: 'delay'
    });
  };

  $scope.hideOverlay = function () {
    bsLoadingOverlayService.stop({
      referenceId: 'delay'
    });
  }
});
