app.controller('{{include.controller_name}}', function($scope, $http, $sce, bsLoadingOverlayService) {
    $scope.result = $sce.trustAsHtml('Fetch result here');
    $scope.fetchRandomText = function() {
        $http.get('http://hipsterjesus.com/api/')
            .success(function(data) {
                $scope.result = $sce.trustAsHtml(data.text);
            })
            .error(function() {
                $scope.result = 'Can not get the article';
            });
    };
});
