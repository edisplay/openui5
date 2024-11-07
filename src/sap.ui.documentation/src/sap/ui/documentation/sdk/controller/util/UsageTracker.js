/*!
 * ${copyright}
 */

/**
 * @class Utility class for tracking user navigation events and sending them to Adobe Analytics.
 */
sap.ui.define(
    ["sap/ui/base/Object", "sap/base/i18n/Localization", "./DocuInfo", "sap/base/Log"],
    function (BaseObject, Localization, DocuInfo, Log) {
        "use strict";

        var sSiteLanguage = Localization.getLanguageTag().language;
        const aNotFoundViews = ["sap.ui.documentation.sdk.view.NotFound", "sap.ui.documentation.sdk.view.SampleNotFound"];

        var PageInfo = function(oRouteConfig, oRouter, sURL, referrer) {
            sURL = sURL || window.location.href;
            referrer = referrer || document.referrer;
            const oURL = new URL(sURL),
                sSectionTitle = oRouter.getRouteTopLevelTitle(oRouteConfig);

            this.url = sURL;
            this.name = oURL.pathname + oURL.hash;
            this.section = sSectionTitle || "/";
            this.title = undefined;
            this.language = sSiteLanguage;
            this.country = "glo";
            this.referrer = document.referrer;
        };

        PageInfo.prototype.toObject = function() {
            var oResult = {};
            for (var prop in this) {
                if (this.hasOwnProperty(prop) && this[prop] !== undefined) {
                    oResult[prop] = this[prop];
                }
            }
            return oResult;
        };

        const SPECIAL_ROUTES = {
            "DOCUMENTATION_TOPIC": "topicId",
            "API_REFERENCE": "apiSpecialRoute",
            "GLOBAL_SEARCH": "search"
        };

        const STATIC_TITLE_FOR_ROUTE = {
            "code": "Source code for sample",
            "sample": "Sample",
            "experimental": "Experimental APIs",
            "deprecated": "Deprecated APIs",
            "since": "Index By Version",
            "news": "News",
            "releaseNotes": "Change Log",
            "ReleaseNotesLegacyRoute": "Change Log"
        };

        var UsageTracker = BaseObject.extend(
            "sap.ui.documentation.sdk.controller.util.UsageTracker",
            {
                constructor: function (oComponent) {
                    this._oComponent = oComponent;
                    this._oRouter = oComponent.getRouter();
                    this._oConfig = oComponent.getConfig();
                    this._oLastRouteParameters = null;

                    this._initRemoteServiceConnector();
                    this._listenForUserNavigations();

                    Localization.attachChange(this._onLanguageChange);
                },
                _initRemoteServiceConnector: function() {
                    window.adobeDataLayer = window.adobeDataLayer || [];
                    this._logSessionStarted();
                },
                _listenForUserNavigations: function() {
                    this._oRouter.attachRouteMatched(this._onRouteMatched, this);
                    this._oRouter.attachBypassed(this._onRouteNotFound, this);
                    this._oRouter.attachEvent("_navToWithoutHash", this._onNavToWithoutHash, this);
                },
                logRouteVisit: function(oEventParameters) {
                    if (!oEventParameters) {
                        return;
                    }
                    switch (oEventParameters.eventId) {
                        case "routeMatched": {
                            this._logRouteMatched(oEventParameters);
                            break;
                        }
                        case "bypassed": {
                            this._logRouteNotFound(oEventParameters);
                            break;
                        }
                        case "_navToWithoutHash": {
                            this._logNavToWithoutHash(oEventParameters);
                            break;
                        }
                    }
                },
                _onRouteMatched: function (oEvent) {
                    this._logRouteMatched(oEvent.getParameters());
                },
                _logRouteMatched: function(oEventParameters) {
                    if (this._areEqualRoutes(oEventParameters, this._oLastRouteParameters)) {
                        // sometimes the same route is matched multiple times
                        // (e.g. when route is loaded via both 'navTo' and 'linkClickHandler' of DocumentationRouter)
                        // so return to avoid logging the same page visit multiple times
                        // until the above issue is resolved
                        return;
                    }
                    if (this._isLegacyRoute(oEventParameters)) {
                        // do not log legacy routes as they are internally forwarded to new routes
                        return;
                    }
                    this._oLastRouteParameters = oEventParameters;
                    this._getPageInfoFromRoute(oEventParameters, function(oPageInfo) {
                        this._logPageVisit(oPageInfo);
                        this._publishLoggedInfo(true);
                    }.bind(this));
                },
                _onRouteNotFound: function (oEvent) {
                    this._logRouteNotFound(oEvent.getParameters());
                },
                _logRouteNotFound: function(oEventParameters) {
                    this._logPageNotFound(oEventParameters.hash);
                    this._publishLoggedInfo(true);
                },
                _onNavToWithoutHash: function (oEvent) {
                    this._logNavToWithoutHash(oEvent.getParameters());
                },
                _logNavToWithoutHash: function(oEventParameters) {
                    var sViewName = oEventParameters.viewName;
                    if (aNotFoundViews.includes(sViewName)) {
                        this._logPageDataNotFound();
                        this._publishLoggedInfo(true);
                    }
                },
                _areEqualRoutes: function(oRoute1Parameters, oRoute2Parameters) {
                    return oRoute1Parameters?.name === oRoute2Parameters?.name
                        && JSON.stringify(oRoute1Parameters?.arguments) === JSON.stringify(oRoute2Parameters?.arguments);
                },
                _isLegacyRoute: function(oRouteParameters) {
                    return oRouteParameters.name.toLowerCase().includes("legacy");
                },
                _getPageInfoFromRoute: function(oEventParameters, fnCallback) {
                    var oRouteConfig = oEventParameters.config,
                        oPageInfo = new PageInfo(oRouteConfig, this._oRouter);
                    this._getPageTitleFromRoute(oEventParameters, function(sPageTitle) {
                        oPageInfo.title = sPageTitle;
                        fnCallback(oPageInfo);
                    });
                },
                _getPageTitleFromRoute: function(oEventParameters, fnCallback) {
                    var sRoute = oEventParameters.name,
                        oArguments = oEventParameters.arguments,
                        sTitle;
                    if (sRoute === SPECIAL_ROUTES.DOCUMENTATION_TOPIC) {
                        var docuId = oArguments.id;
                        DocuInfo.getDocumentTitle(docuId, this._oConfig).then(fnCallback).catch(fnCallback);
                    } else if (sRoute === SPECIAL_ROUTES.API_REFERENCE) {
                        sTitle = this._oRouter._decodeSpecialRouteArguments(oArguments).id;
                        fnCallback(sTitle);
                    } else if (sRoute === SPECIAL_ROUTES.GLOBAL_SEARCH) {
                        sTitle = this._composeSearchPageTitleFromRoute(oEventParameters);
                        fnCallback(sTitle);
                    } else {
                        sTitle = this._composeDefaultPageTitleFromRoute(oEventParameters);
                        fnCallback(sTitle);
                    }
                },
                _composeSearchPageTitleFromRoute: function(oEventParameters) {
                    var sTitle = 'Global Search Resuls for "' + this._getAllStringValues(oEventParameters.arguments) + '"',
                        sCategory = oEventParameters.arguments["?options"]?.category,
                        sCategoryTitle = {
                            "apiref": "API Reference",
                            "entity": "Samples",
                            "topics": "Documentation",
                            "external": "External Resources"
                        }[sCategory];
                    return sCategoryTitle ? (sTitle + " in " + sCategoryTitle)  : sTitle;
                },
                _composeDefaultPageTitleFromRoute: function(oEventParameters) {
                    var aTitleParts = [],
                        sRouteTitle = this._getRouteTitle(oEventParameters),
                        sTitleFromArguments = this._getAllStringValues(oEventParameters.arguments).join(" ");

                    if (sRouteTitle) {
                        aTitleParts.push(sRouteTitle);
                    }
                    if (sTitleFromArguments) {
                        aTitleParts.push(sTitleFromArguments);
                    }
                    return aTitleParts.join(" ") || oEventParameters.name;
                },
                _getRouteTitle : function(oEventParameters) {
                    return STATIC_TITLE_FOR_ROUTE[oEventParameters.name]
                    || this._oRouter.getRouteTopLevelTitle(oEventParameters.config);
                },

                _getAllStringValues: function(oObject) {
                    return Object.values(oObject).filter(function(sValue) {
                        return typeof sValue === "string";
                    });
                },
                _logSessionStarted: function () {
                    window.adobeDataLayer.push({
                        event: "globalDL",
                        site: {
                            name: "sapui5"
                        },
                        'user': {
                            'loginStatus': 'no'
                        }
                    });
                },
                _logPageVisit: function (oPageInfo) {
                    window.adobeDataLayer.push({
                        event: "pageView",
                        page: oPageInfo.toObject()
                    });
                },
                /**
                 * Triggered when router does not find the route
                 */
                _logPageNotFound: function (sHash) {
                    window.adobeDataLayer.push({
                        event: "errorPage",
                        page: {
                            name: "notFound",
                            section: "errorPage"
                        },
                        error: {
                            type: 404,
                            pageUrl: window.location.href,
                            pageName: sHash,
                            description: "page not found"
                        }
                    });
                },
                /**
                 * Triggered when route found but subsequently page data is not found (after loading the page view)
                 */
                _logPageDataNotFound: function () {
                    var oPageInfo;
                    if (this._oLastRouteParameters) {
                        var oRouteConfig = this._oRouter.getRouteConfig(this._oLastRouteParameters.name);
                        oPageInfo = new PageInfo(oRouteConfig, this._oRouter);
                    } else {
                        var oURL = new URL(window.location.href);
                        oPageInfo = {
                            url: window.location.href,
                            name: oURL.pathname + oURL.hash,
                            section: "/"
                        };
                    }

                    window.adobeDataLayer.push({
                        event: "errorPage",
                        page: {
                            name: "notFound",
                            section: "errorPage"
                        },
                        error: {
                            type: 404,
                            pageUrl: oPageInfo.url,
                            pageName: oPageInfo.name,
                            pageSection: oPageInfo.section,
                            description: "page data not found"
                        }
                    });
                    this._oLastRouteParameters = null; // clear last route parameters after logging
                },
                _publishLoggedInfo: function (bIncrementPageCount) {
                    window.adobeDataLayer.push({
                        event: bIncrementPageCount
                            ? "stBeaconReady"
                            : "stlBeaconReady"
                    });
                },
                _onLanguageChange: function (oEvent) {
                    sSiteLanguage = Localization.getLanguageTag().language;
                },
                exit: function () {
                    this._oRouter.detachRouteMatched(this._onRouteMatched, this);
                    this._oRouter.detachBypassed(this._onRouteNotFound, this);
                    this._oRouter.detachEvent("_contentNotFound", this._onNavToWithoutHash, this);
                    Localization.detachChange(this._onLanguageChange);
                    this._oRouter = null;
                }
            }
        );

        return UsageTracker;
    }
);
