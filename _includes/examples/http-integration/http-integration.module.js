var app = angular.module('{{include.module_name}}', [
    'bsLoadingOverlay',
    'bsLoadingOverlayHttpInterceptor',
    'ui.bootstrap'
])
.factory('allHttpInterceptor', function(bsLoadingOverlayHttpInterceptorFactoryFactory) {
    return bsLoadingOverlayHttpInterceptorFactoryFactory();
})
.config(function($httpProvider) {
    $httpProvider.interceptors.push('allHttpInterceptor');
}).run(function(bsLoadingOverlayService) {
    bsLoadingOverlayService.setGlobalConfig({
        templateUrl: 'loading-overlay-template.html'
    });
});
