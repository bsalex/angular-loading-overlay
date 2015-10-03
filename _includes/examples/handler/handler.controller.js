app.controller('HandlerController', function ($scope, bsLoadingOverlayService) {
  var overlayHandler = bsLoadingOverlayService.createHandler({
    referenceId: 'handler-overlay'
  });

  $scope.showOverlay = function () {
    overlayHandler.start();
  };

  $scope.hideOverlay = function () {
    overlayHandler.stop();
  }
});
