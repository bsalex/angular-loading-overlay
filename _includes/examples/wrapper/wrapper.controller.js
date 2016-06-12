app.controller('WrapperController', function ($scope, $timeout, bsLoadingOverlayService) {
  $scope.showOverlay = function () {
    bsLoadingOverlayService.wrap({
      referenceId: 'wrapper'
  }, $timeout(angular.noop, 5000));
  }

});
