app.controller('{{include.controller_name}}', function($scope, $http, $sce, bsLoadingOverlayService) {
    $scope.randomText = $sce.trustAsHtml('Fetch result here');
    $scope.randomUser = {};

    $scope.fetchRandomText = function() {
        $http.get('http://hipsterjesus.com/api/')
            .success(function(data) {
                $scope.randomText = $sce.trustAsHtml(data.text);
            })
            .error(function() {
                $scope.randomText = $sce.trustAsHtml('Can not get the article');
            });
    };

    $scope.fetchRandomUser = function() {
        $http.get('https://randomuser.me/api/')
            .success(function(data) {
                $scope.randomUser = data.results[0];
            });
    };
});
