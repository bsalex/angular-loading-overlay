export default class BsLoadingOverlayInstance {
    referenceId: string;
    delay: number;
    activeClass: string;
    $element: ng.IAugmentedJQuery;
    overlayElement: ng.IAugmentedJQuery;
    private $timeout;
    private $q;
    private delayPromise;
    constructor(referenceId: string, delay: number, activeClass: string, $element: ng.IAugmentedJQuery, overlayElement: ng.IAugmentedJQuery, $timeout: any, $q: any);
    private isAdded();
    add(): void;
    remove(): void;
}
