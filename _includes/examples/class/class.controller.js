app.controller('ClassController', function ($scope, bsLoadingOverlayService) {
  $scope.showOverlay = function () {
    bsLoadingOverlayService.start({
      referenceId: 'class'
    });
  };

  $scope.hideOverlay = function () {
    bsLoadingOverlayService.stop({
      referenceId: 'class'
    });
  }
});
