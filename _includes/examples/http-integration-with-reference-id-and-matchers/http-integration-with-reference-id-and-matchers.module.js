var app = angular.module('{{include.module_name}}', [
    'bsLoadingOverlay',
    'bsLoadingOverlayHttpInterceptor',
    'ui.bootstrap'
])
.factory('randomTextInterceptor', function(bsLoadingOverlayHttpInterceptorFactoryFactory) {
    return bsLoadingOverlayHttpInterceptorFactoryFactory({
        referenceId: 'random-text-spinner',
        requestsMatcher: function (requestConfig) {
            return requestConfig.url.indexOf('hipsterjesus') !== -1;
        }
    });
})
.factory('randomUserInterceptor', function(bsLoadingOverlayHttpInterceptorFactoryFactory) {
    return bsLoadingOverlayHttpInterceptorFactoryFactory({
        referenceId: 'random-user-spinner',
        requestsMatcher: function (requestConfig) {
            return requestConfig.url.indexOf('randomuser') !== -1;
        }
    });
})
.config(function($httpProvider) {
    $httpProvider.interceptors.push('randomTextInterceptor');
    $httpProvider.interceptors.push('randomUserInterceptor');
}).run(function(bsLoadingOverlayService) {
    bsLoadingOverlayService.setGlobalConfig({
        templateUrl: 'loading-overlay-template.html'
    });
});
