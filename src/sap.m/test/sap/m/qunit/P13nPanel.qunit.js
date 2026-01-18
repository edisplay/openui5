/*global QUnit */
sap.ui.define([
	"sap/m/P13nPanel",
	"sap/ui/core/mvc/XMLView"
], function (P13nPanel, XMLView) {
	"use strict";

	QUnit.module("sap.m.P13nPanel: Initialization via JS", {
		beforeEach: function () {
		},
		afterEach: function () {
		}
	});
	QUnit.test("Test", function (assert) {
		assert.ok(new P13nPanel(), "Note: currently it is allowed to create an abstract class");
	});

	QUnit.module("sap.m.P13nPanel: Initialization via XML", {
		beforeEach: function () {
		},
		afterEach: function () {
		}
	});
	QUnit.test("Test", function (assert) {
		var sXml = [
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m">',
			'	<m:P13nPanel/>',
			'</mvc:View>'
		].join('');
		return XMLView.create({
			definition: sXml
		}).then(function (oView) {
			assert.ok(oView);
			assert.ok(oView.getContent()[0], "Note: currently it is allowed to create an abstract class");
			assert.equal(oView.getContent()[0].getMetadata().getName(), "sap.m.P13nPanel");
		});
	});
});
