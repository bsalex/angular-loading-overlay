var app = angular.module('{{include.module_name}}', [
    'bsLoadingOverlay',
    'bsLoadingOverlaySpinJs',
    'ui.bootstrap'
]).run(function(bsLoadingOverlayService) {
    bsLoadingOverlayService.setGlobalConfig({
        templateUrl: 'bsLoadingOverlaySpinJs'
    });
});
