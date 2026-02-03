sap.ui.define(function() {

	"use strict";
	return {
		name: "TestSuite for sap.ui.core: GTP testcase CORE/CORE",
		defaults: {
			loader:{
				paths:{
					"testdata/core": "test-resources/sap/ui/core/qunit/"
				}
			},
			qunit: {
				versions : {
					"2.18" : {
						module : "test-resources/sap/ui/core/qunit/thirdparty/qunit-2.18",
						css : "test-resources/sap/ui/core/qunit/thirdparty/qunit-2.18.css"
					}
				},
				version: 2
			},
			sinon: {
				// the tests in this suite use the sinon-qunit-bridge also for sinon 1
				versions: {
					1: {
						bridge: "sap/ui/qunit/sinon-qunit-bridge"
					},
					"14.0" : {
						module : "test-resources/sap/ui/core/qunit/thirdparty/sinon-14.0",
						bridge : "sap/ui/qunit/sinon-qunit-bridge"
					}
				},
				version: 4
			}
		},
		tests: {
			baseuri: {
				title: "sap.ui.thirdparty.baseuri",
				bootCore: false
			},
			ContextMenuSupport: {
				title: "sap.ui.core.ContextMenuSupport"
			},
			JSON: {
				title: "sap.ui.core: JSON Native Support",
				ui5: {
					libs: "sap.m"
				}
			},
			/**
			 * @deprecated As of version 1.120, as QUnit 1.x is no longer supported in UI5 2.0
			 */
			QUnit: {
				title: "sap.ui.core: General QUnit 1 checks",
				qunit: {
					version: 1
				}
			},
			QUnit2: {
				title: "QUnit tests: General QUnit 2 checks"
			},
			QUnit2NestedModules: {
				title: "sap.ui.core: QUnit 2 nested modules",
				sinon: {
					// FIXME: Doesn't work with nested modules
					qunitBridge: false
				}
			},
			SinonJS: {
				title: "sap.ui.thirdparty.sinon: Support",
				ui5: {
					libs: "sap.m"
				},
				sinon: {
					version: 1, // sinon 1 itself is tested
					qunitBridge: true
				}
			},
			/**
			 * @deprecated As of version 1.120, as QUnit 1.x is no longer supported in UI5 2.0
			 */
			Sinon1QUnit1Bridge: {
				qunit: 1,
				sinon: 1,
				module: "test-resources/sap/ui/core/qunit/internal/SinonQunitBridge.qunit"
			},
			Sinon1QUnit2Bridge: {
				qunit: 2,
				sinon: 1,
				module: "test-resources/sap/ui/core/qunit/internal/SinonQunitBridge.qunit"
			},
			/**
			 * @deprecated As of version 1.120, as QUnit 1.x is no longer supported in UI5 2.0
			 */
			Sinon4QUnit1Bridge: {
				qunit: 1,
				sinon: 4,
				module: "test-resources/sap/ui/core/qunit/internal/SinonQunitBridge.qunit"
			},
			Sinon4QUnit2Bridge: {
				qunit: 2,
				sinon: 4,
				module: "test-resources/sap/ui/core/qunit/internal/SinonQunitBridge.qunit"
			},
			"Sinon14.0QUnit2.18Bridge": {
				qunit: {
					version: "2.18"
				},
				sinon: {
					version: "14.0"
				},
				module: "test-resources/sap/ui/core/qunit/internal/SinonQunitBridge.qunit"
			},
			Hyphenation: {
				title: "sap.ui.core.hyphenation.Hyphenation"
			}
		}
	};
});
