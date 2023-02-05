/*global describe,it,element,by,takeScreenshot,expect,browser,protractor*/

describe("sap.m.PopoverWithinArea", function () {
	"use strict";

	browser.testrunner.currentSuite.meta.controlName = 'sap.m.Popover';

	var bPhone = null;
	var _resolvePopover = function () {
		return bPhone ? "__dialog1" : "overflowing-popover";
	};

	it("Should enable withinAreaMode", function () {
		//click over a button that hides the caret when a popover is opened from an input
		element(by.id("customWithin")).click();
		expect(takeScreenshot()).toLookAs("customWithin");
	});

	it("Should load test page", function () {
		browser.executeScript(function () {
			return sap.ui.Device.system.phone;
		}).then(function (response) {
			bPhone = response;
		});

		//click over a button that hides the caret when a popover is opened from an input
		element(by.id("customCssButton")).click();
		expect(takeScreenshot()).toLookAs("initial");
	});

	it("Should open Popover Right", function () {
		element(by.id("btn1")).click();

		expect(takeScreenshot()).toLookAs("popover-right");
	});

	it("Should open Popover Bottom", function () {
		element(by.id("btn0")).click();

		expect(takeScreenshot()).toLookAs("popover-bottom");
	});

	it("Should open Popover Top", function () {
		element(by.id("btn3")).click();

		expect(takeScreenshot()).toLookAs("popover-top");
	});

	it("Should open Popover Left", function () {
		element(by.id("btn2")).click();

		expect(takeScreenshot()).toLookAs("popover-left");
	});

	it("Should open Popover Vertical", function () {
		element(by.id("btn4")).click();

		expect(takeScreenshot()).toLookAs("popover-vertical");
	});

	it("Should open Popover with header and footer", function () {
		element(by.id("with-h-with-f")).click();

		expect(takeScreenshot(element(by.id("pop1")))).toLookAs("popover-header-footer");
	});

	it("Should open Popover without header and with footer", function () {
		element(by.id("no-h-with-f")).click();

		expect(takeScreenshot(element(by.id("pop1")))).toLookAs("popover-footer");
	});

	it("Should open Popover Horizontal", function () {
		element(by.id("btn6")).click();
		expect(takeScreenshot()).toLookAs("popover-horizontal");
	});

	it("Should open Popover with header and no footer", function () {
		element(by.id("with-h-no-f")).click();

		expect(takeScreenshot(element(by.id("pop1")))).toLookAs("popover-header");
	});

	it("Should open Popover without header and footer", function () {
		element(by.id("no-h-no-f")).click();
		element(by.id("__item0-__list0-0")).click(); // Remove the focus from input

		expect(takeScreenshot(element(by.id("pop1")))).toLookAs("popover-no-header-footer");
	});

	it("Should open Popover with checkboxes and check one of them", function () {
		element(by.id("btn15")).click();
		element(by.id("popover12CheckBox1")).click();
		expect(takeScreenshot()).toLookAs("popover-with-checkboxes");
	});

	// This test will open Dialog on mobile devices and Popover on desktops.
	// This will make it harder to determine how to close it so it can be left last
	it("Should open an overflowing popover which should be displayed with a visible scrollbar", function () {
		element(by.id("overflowing-popover-arrow")).click();
		expect(takeScreenshot(element(by.id(_resolvePopover())))).toLookAs("overflowing-popover");
	});

	it("Should dismiss only the inner popover with ESC when there's a case with nested Popovers", function () {
		element(by.id("btn10")).click();
		element(by.id("selectInPopover-arrow")).click();

		expect(takeScreenshot()).toLookAs("popover-nested-popovers");

		browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

		expect(takeScreenshot()).toLookAs("nested-popovers-inner-closed");
	});

	it("Should close only the nested popover when the parent is clicked", function () {
		element(by.id("btn16")).click();
		element(by.id("nestedBtn")).click();

		expect(takeScreenshot()).toLookAs("nested-popover-click");

		element(by.id("defocus")).click();

		expect(takeScreenshot()).toLookAs("inner-popover-closed-click");
	});
});