MainApplication.SlideRegion = Backbone.Marionette.Region.extend({
    el: "#FooterNavSlideOut",
    constructor: function () {
        _.bindAll(this, 'getEl', 'slideOut', 'slideIn');
        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
        this.on("show", this.slideOut, this);
		this.slideOpen = false;
    },
    getEl: function (selector) {
        var $el = $(selector);
        $el.on("hidden", this.close);
        return $el;
    },
    slideOut: function (view) {
		if(view && view.openMinimized !== undefined && view.openMinimized===true){
			this.slideIn();
		}else{
			$('#FooterNavSlideOut').animate({"height":"150px"});
			this.slideOpen = true;
		}
    },
    slideIn: function (view) {
		$('#FooterNavSlideOut').animate({"height":"30px"});
		this.slideOpen = false;
    }
});

MainApplication.PaneRegion = Backbone.Marionette.Region.extend({
    el: "#SummaryPaneSlideOut",
    constructor: function () {
        _.bindAll(this, 'getEl', 'slideOut', 'slideIn');
        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
        this.on("show", this.slideOut, this);
		this.slideOpen = false;
    },
    getEl: function (selector) {
        var $el = $(selector);
        $el.on("hidden", this.close);
        return $el;
    },
    slideOut: function (view) {
		//fix for first time display
		//$("#SummaryPaneSlideOut").css("display","block");
		this.slideOpen = true;
    },
    slideIn: function () {
		this.slideOpen = false;	
    }
});
//$("#SummaryPaneSlideOut").css("display","none");


MainApplication.ModalRegion = Backbone.Marionette.Region.extend({
    el: "#localModalBlock",
    constructor: function () {
        _.bindAll(this, 'getEl', 'showModal', 'hideModal', 'lockModal', 'unlockModal');
        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
        this.on("show", this.showModal, this);
    },
    getEl: function (selector) {
        var $el = $(selector);
        $el.on("hidden", this.close);
        return $el;
    },
    showModal: function (view) {
        view.on("close", this.hideModal, this);
        $("#localModalBlock").css("display","block");
		//this.$el.modal('show');
		this.$el.modal({ backdrop: "static", show: true });
    },
    hideModal: function () {
		//this.unlockModal();
        this.$el.modal('hide');
    },	
    //requires custom lock function in bootstrap
    lockModal: function() {
        //this.$el.modal('lock');
    },
    unlockModal: function() {
        //this.$el.modal('unlock');
    }
});

MainApplication.addRegions({
    titleRegion: "#ApplicationSection",
    mainRegion: "#ApplicationContainer",
	footerRegion: "#FooterNavContainer",
	headerRegion: "#HeaderNavContainer",
	slideRegion: MainApplication.SlideRegion,
    modalRegion: MainApplication.ModalRegion,
	paneRegion: MainApplication.PaneRegion
});