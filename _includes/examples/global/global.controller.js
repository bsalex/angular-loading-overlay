app.controller('GlobalController', function ($scope, bsLoadingOverlayService) {
  $scope.showOverlay = function () {
    bsLoadingOverlayService.start();
  };

  $scope.hideOverlay = function () {
    bsLoadingOverlayService.stop();
  }
});
