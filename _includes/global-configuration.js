angular.module('app', [
  'bsLoadingOverlay'
]).run(function (bsLoadingOverlayService) {
  bsLoadingOverlayService.setGlobalConfig({
    delay: 0, // Minimal delay to hide loading overlay in ms.
    activeClass: undefined, // Class that is added to the element where bs-loading-overlay is applied when the overlay is active.
    templateUrl: undefined // Template url for overlay element. If not specified - no overlay element is created.
  });
});