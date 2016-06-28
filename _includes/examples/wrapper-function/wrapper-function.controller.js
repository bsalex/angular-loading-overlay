app.controller('{{include.controller_name}}', function($scope, $timeout, bsLoadingOverlayService) {
    $scope.showOverlay = function() {
        bsLoadingOverlayService.wrap({},
            function() {
                return $timeout(angular.noop, 5000);
            });
    }
});
