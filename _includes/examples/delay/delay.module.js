var app = angular.module('{{include.module_name}}', [
    'bsLoadingOverlay',
    'ui.bootstrap'
]).run(function(bsLoadingOverlayService) {
    bsLoadingOverlayService.setGlobalConfig({
        templateUrl: 'loading-overlay-template.html'
    });
});
