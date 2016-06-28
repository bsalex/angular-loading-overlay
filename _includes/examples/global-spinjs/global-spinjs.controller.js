app.controller('{{include.controller_name}}', function($scope, bsLoadingOverlayService) {
    $scope.showOverlay = function() {
        bsLoadingOverlayService.start();
    };

    $scope.hideOverlay = function() {
        bsLoadingOverlayService.stop();
    }
});
