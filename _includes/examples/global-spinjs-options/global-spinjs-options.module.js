var app = angular.module('{{include.module_name}}', [
    'bsLoadingOverlay',
    'bsLoadingOverlaySpinJs',
    'ui.bootstrap'
]).run(function(bsLoadingOverlayService) {
    bsLoadingOverlayService.setGlobalConfig({
        templateUrl: 'bsLoadingOverlaySpinJs'
    });

    bsLoadingOverlayService.setGlobalConfig({
        templateOptions: {
            radius: 8,
            width: 2,
            length: 4,
            lines: 5,
            color: 'purple'
        }
    });
});
