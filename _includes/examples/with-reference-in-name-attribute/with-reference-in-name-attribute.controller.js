app.controller('WithReferenceInNameAttributeController', function ($scope, bsLoadingOverlayService) {
  $scope.showOverlay = function (referenceId) {
    bsLoadingOverlayService.start({
      referenceId: referenceId
    });
  };

  $scope.hideOverlay = function (referenceId) {
    bsLoadingOverlayService.stop({
      referenceId: referenceId
    });
  }
});
