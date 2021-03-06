﻿var AjaxRequestTypes;
var AjaxDataTypes;
var CurrentLoginStatus;

var NotificationTypes = {
    Success: "success",
    Error: "error",
    Flash: "flash"
};

var notifications = {};

//SET APPLICATION COOKIES
$.cookie('siteLastOpened') !== undefined && $.cookie('siteLastOpened') !== null ? $.cookie('siteFirstLoad',false) : $.cookie('siteFirstLoad',true);
var currentTime = new Date()
$.cookie('siteLastOpened', currentTime, { path: '/' });

//intial geoBase Setters
GeoAppBase.loggedinLandingPage = MainApplication.LandingPage;
GeoAppBase.views = {};
GeoAppBase.models = {};

GeoAppBase.commands.setHandler("StartMainApp", function () {
    window[ApplicationName].start();
    Backbone.history.start();
    if (GeoAppBase.getHashTag() !== "") {
        window[ApplicationName].router.navigate(GeoAppBase.getHashTag(), true);
    } else {
        window[ApplicationName].router.navigate(GeoAppBase.loggedinLandingPage, { trigger: true });
    }	
    GeoAppBase.commands.removeHandler("StartMainApp");
});

//generic modal
GeoAppBase.GenericModalInterface = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, GeoAppBaseTemplates.GenericModalInterfaceTemplate);
    },
    templateHelpers: function () {
        return {
            modalTitle: this.modalTitle,
			genericModalContents: this.contentTemplate,
            modalOKText: this.okText !== undefined ? this.okText : "OK",
            modalCancelText: this.cancelText !== undefined ? this.cancelText : "Cancel",
            okDisplay: this.okText !== undefined ? "inline" : "none",
            cancelDisplay: this.cancelText !== undefined ? "inline" : "none"
        };
    },
    initialize: function (options) {
        this.modalTitle = options.modalTitle;
        this.contentTemplate = options.contentTemplate;
        this.okText = options.okText;
        this.okCallback = options.okCallback;
        this.cancelText = options.cancelText;
        this.cancelCallback = options.cancelCallback;
        $(window[ApplicationName].modalRegion.el).one('shown', function () {
            $('input:text:visible:first').focus();
        });
    },
    events: {
        "click #btnOk": "_okCallback",
        "click #btnCancel": "_cancelCallback",
        "click #btnAbandonModal": "_cancelCallback"
    },
    _okCallback: function () {
        this.okCallback !== undefined ? this.okCallback() : null;
    },
    _cancelCallback: function () {
        this.cancelCallback !== undefined ? this.cancelCallback() : null;
    }
});


GeoAppBase.on("start", function () {
	GeoAppBase.execute("StartMainApp");
});

$(document).ready(function() {
    GeoAppBase.start();
});