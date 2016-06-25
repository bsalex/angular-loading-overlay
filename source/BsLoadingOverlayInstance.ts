export default class BsLoadingOverlayInstance {
    private delayPromise: ng.IPromise<void>;

    constructor(
        public referenceId: string,
        public delay: number,
        public activeClass: string,
        public $element: ng.IAugmentedJQuery,
        public overlayElement: ng.IAugmentedJQuery,
        private $timeout,
        private $q
    ) {}

    private isAdded() {
        return !!this.delayPromise;
    }

    public add() {
        if (this.delay) {
            if (this.delayPromise) {
                this.$timeout.cancel(this.delayPromise);
            }
            this.delayPromise = this.$timeout(angular.noop, this.delay);
        } else {
            this.delayPromise = this.$q.when();
        }

        if (this.overlayElement && !this.overlayElement.data('isAttached')) {
            this.$element.append(this.overlayElement);
            this.overlayElement.data('isAttached', true);
        }

        this.$element.addClass(this.activeClass);
    };

    public remove() {
        if (this.isAdded()) {
            this.delayPromise.then(() => {
                if (this.overlayElement && this.overlayElement.data('isAttached')) {
                    this.overlayElement.data('isAttached', false);
                    this.overlayElement.detach();
                }

                this.$element.removeClass(this.activeClass);
                this.delayPromise = undefined;
            });
        }
    };
}
