app.controller('{{include.controller_name}}', function($scope, $http, $sce, bsLoadingOverlayService) {
    $scope.vm = vm = {};
    vm.randomText = $sce.trustAsHtml('Fetch result here');
    vm.randomUser = {};

    $scope.fetchRandomText = function() {
        $http.get('http://hipsterjesus.com/api/')
            .success(function(data) {
                vm.randomText = $sce.trustAsHtml(data.text);
            })
            .error(function() {
                vm.randomText = $sce.trustAsHtml('Can not get the article');
            });
    };

    $scope.fetchRandomUser = function() {
        $http.get('https://randomuser.me/api/')
            .success(function(data) {
                vm.randomUser = data.results[0];
            });
    };
});
