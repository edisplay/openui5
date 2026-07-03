/*global QUnit */

sap.ui.define([
	"sap/ui/table/AnalyticalColumnMenu",
	"sap/ui/table/ColumnMenu",
	"sap/ui/table/utils/TableUtils"
], function(
	AnalyticalColumnMenu,
	ColumnMenu,
	TableUtils
) {
	"use strict";

	/**
	 * @deprecated As of version 1.117
	 */
	QUnit.module("_addMenuItems", {
		beforeEach: function() {
			this.oMenu = new AnalyticalColumnMenu();
			// Stub base implementation to isolate the AnalyticalColumnMenu extension.
			this.oParentAddMenuItemsStub = this.stub(ColumnMenu.prototype, "_addMenuItems");
			this.stub(this.oMenu, "_getTable").returns(null);
		},
		afterEach: function() {
			this.oMenu.destroy();
		}
	});

	QUnit.test("Calls parent implementation and adds sum item when a column is set", function(assert) {
		const oAddSumStub = this.stub(this.oMenu, "_addSumMenuItem");
		this.stub(this.oMenu, "_getColumn").returns({});

		this.oMenu._addMenuItems();

		assert.ok(this.oParentAddMenuItemsStub.calledOnce, "ColumnMenu#_addMenuItems delegated to parent");
		assert.ok(this.oParentAddMenuItemsStub.calledOn(this.oMenu), "Parent implementation called with correct 'this'");
		assert.ok(oAddSumStub.calledOnce, "_addSumMenuItem is called when a column exists");
	});

	QUnit.test("Skips sum item when no column is set", function(assert) {
		const oAddSumStub = this.stub(this.oMenu, "_addSumMenuItem");
		this.stub(this.oMenu, "_getColumn").returns(null);

		this.oMenu._addMenuItems();

		assert.ok(this.oParentAddMenuItemsStub.calledOnce, "Parent implementation still called");
		assert.ok(oAddSumStub.notCalled, "_addSumMenuItem skipped when column is missing");
	});

	/**
	 * @deprecated As of version 1.117
	 */
	QUnit.module("_addGroupMenuItem", {
		beforeEach: function() {
			this.oMenu = new AnalyticalColumnMenu();
			this.oColumn = {
				isGroupableByMenu: this.stub().returns(true),
				getGrouped: this.stub().returns(false),
				getShowIfGrouped: this.stub().returns(false),
				_setGrouped: this.stub()
			};
			this.oTable = {
				getDomRef: this.stub()
			};
			this.stub(this.oMenu, "_getColumn").returns(this.oColumn);
			this.stub(this.oMenu, "_getTable").returns(this.oTable);
		},
		afterEach: function() {
			this.oMenu.destroy();
		}
	});

	QUnit.test("Skips creation when column is not groupable", function(assert) {
		this.oColumn.isGroupableByMenu.returns(false);

		this.oMenu._addGroupMenuItem();

		assert.strictEqual(this.oMenu.getItems().length, 0, "No menu item added when column is not groupable");
		assert.notOk(this.oMenu._oGroupIcon, "No group icon reference stored on the menu");
	});

	QUnit.test("Creates group item with 'accept' icon when column is already grouped", function(assert) {
		this.oColumn.getGrouped.returns(true);

		this.oMenu._addGroupMenuItem();

		assert.strictEqual(this.oMenu.getItems().length, 1, "One menu item added");
		assert.strictEqual(this.oMenu._oGroupIcon, this.oMenu.getItems()[0], "Created item stored as _oGroupIcon");
		assert.strictEqual(this.oMenu._oGroupIcon.getIcon(), "sap-icon://accept", "Grouped column shows 'accept' icon");
	});

	QUnit.test("Creates item without icon when column is not grouped", function(assert) {
		this.oMenu._addGroupMenuItem();

		assert.strictEqual(this.oMenu._oGroupIcon.getIcon(), "", "No icon when column is not grouped");
	});

	QUnit.test("Select handler groups column and focuses NoData element when no data is visible", function(assert) {
		const oNoDataDomRef = document.createElement("div");
		oNoDataDomRef.tabIndex = -1;
		document.body.appendChild(oNoDataDomRef);
		this.oTable.getDomRef.withArgs("noDataCnt").returns(oNoDataDomRef);
		this.stub(TableUtils, "isNoDataVisible").returns(true);
		const oFocusSpy = this.spy(oNoDataDomRef, "focus");

		this.oMenu._addGroupMenuItem();
		this.oMenu._oGroupIcon.fireSelect();

		assert.ok(this.oColumn._setGrouped.calledOnceWithExactly(true), "Column grouped to true");
		assert.ok(oFocusSpy.calledOnce, "noDataCnt DOM element focused");
		assert.strictEqual(this.oMenu._oGroupIcon.getIcon(), "sap-icon://accept", "Icon updated to 'accept' after grouping");

		document.body.removeChild(oNoDataDomRef);
	});

	QUnit.test("Select handler focuses 'rowsel0' when data is visible", function(assert) {
		const oRowSelDomRef = document.createElement("div");
		oRowSelDomRef.tabIndex = -1;
		document.body.appendChild(oRowSelDomRef);
		this.oTable.getDomRef.withArgs("rowsel0").returns(oRowSelDomRef);
		this.stub(TableUtils, "isNoDataVisible").returns(false);
		const oFocusSpy = this.spy(oRowSelDomRef, "focus");

		this.oMenu._addGroupMenuItem();
		this.oMenu._oGroupIcon.fireSelect();

		assert.ok(oFocusSpy.calledOnce, "rowsel0 DOM element focused");

		document.body.removeChild(oRowSelDomRef);
	});

	QUnit.test("Select handler tolerates missing DOM reference", function(assert) {
		this.oTable.getDomRef.returns(null);
		this.stub(TableUtils, "isNoDataVisible").returns(false);

		this.oMenu._addGroupMenuItem();
		this.oMenu._oGroupIcon.fireSelect();

		assert.ok(this.oColumn._setGrouped.calledOnceWithExactly(true), "Column still grouped even when no DOM ref available");
	});

	QUnit.test("Select handler ungroups column and resets icon without focusing DOM", function(assert) {
		this.oColumn.getGrouped.returns(true);
		const oIsNoDataVisibleStub = this.stub(TableUtils, "isNoDataVisible");
		const oDomRefStub = this.oTable.getDomRef;

		this.oMenu._addGroupMenuItem();
		this.oMenu._oGroupIcon.fireSelect();

		assert.ok(this.oColumn._setGrouped.calledOnceWithExactly(false), "Column ungrouped");
		assert.strictEqual(this.oMenu._oGroupIcon.getIcon(), "", "Icon reset when column is ungrouped");
		assert.ok(oIsNoDataVisibleStub.notCalled, "Focus branch not entered when ungrouping");
		assert.ok(oDomRefStub.notCalled, "Table DOM not queried when ungrouping");
	});

	QUnit.test("Select handler does not focus when grouped column has showIfGrouped enabled", function(assert) {
		this.oColumn.getShowIfGrouped.returns(true);
		const oIsNoDataVisibleStub = this.stub(TableUtils, "isNoDataVisible");

		this.oMenu._addGroupMenuItem();
		this.oMenu._oGroupIcon.fireSelect();

		assert.ok(this.oColumn._setGrouped.calledOnceWithExactly(true), "Column grouped to true");
		assert.ok(oIsNoDataVisibleStub.notCalled, "Focus branch skipped when showIfGrouped is true");
	});

	/**
	 * @deprecated As of version 1.117
	 */
	QUnit.module("_addSumMenuItem", {
		beforeEach: function() {
			this.oMenu = new AnalyticalColumnMenu();
			this.oColumn = {
				_isAggregatableByMenu: this.stub().returns(true),
				getSummed: this.stub().returns(false),
				setSummed: this.stub()
			};
			this.stub(this.oMenu, "_getColumn").returns(this.oColumn);
			this.stub(this.oMenu, "_getTable").returns(null);
		},
		afterEach: function() {
			this.oMenu.destroy();
		}
	});

	QUnit.test("Skips creation when column is not aggregatable", function(assert) {
		this.oColumn._isAggregatableByMenu.returns(false);

		this.oMenu._addSumMenuItem();

		assert.strictEqual(this.oMenu.getItems().length, 0, "No menu item added when column is not aggregatable");
		assert.notOk(this.oMenu._oSumItem, "No sum item reference stored on the menu");
	});

	QUnit.test("Creates sum item with 'accept' icon when column is already summed", function(assert) {
		this.oColumn.getSummed.returns(true);

		this.oMenu._addSumMenuItem();

		assert.strictEqual(this.oMenu.getItems().length, 1, "One menu item added");
		assert.strictEqual(this.oMenu._oSumItem, this.oMenu.getItems()[0], "Created item stored as _oSumItem");
		assert.strictEqual(this.oMenu._oSumItem.getIcon(), "sap-icon://accept", "Summed column shows 'accept' icon");
	});

	QUnit.test("Creates sum item without icon when column is not summed", function(assert) {
		this.oMenu._addSumMenuItem();

		assert.strictEqual(this.oMenu._oSumItem.getIcon(), "", "No icon when column is not summed");
	});

	QUnit.test("Select handler toggles summed state and icon", function(assert) {
		this.oMenu._addSumMenuItem();

		// Column reports summed=false - selecting the item should enable summing.
		this.oMenu._oSumItem.fireSelect();
		assert.ok(this.oColumn.setSummed.calledOnceWithExactly(true), "setSummed(true) called when column was not summed");
		assert.strictEqual(this.oMenu._oSumItem.getIcon(), "sap-icon://accept", "Icon updated to 'accept' after summing");

		// Now simulate the column being summed - selecting should turn summing off.
		this.oColumn.getSummed.returns(true);
		this.oColumn.setSummed.resetHistory();
		this.oMenu._oSumItem.fireSelect();
		assert.ok(this.oColumn.setSummed.calledOnceWithExactly(false), "setSummed(false) called when column was summed");
		assert.strictEqual(this.oMenu._oSumItem.getIcon(), "", "Icon cleared after un-summing");
	});

	/**
	 * @deprecated As of version 1.117
	 */
	QUnit.module("open", {
		beforeEach: function() {
			this.oMenu = new AnalyticalColumnMenu();
			this.oColumn = {
				getSummed: this.stub().returns(true),
				getGrouped: this.stub().returns(true)
			};
			this.stub(this.oMenu, "_getColumn").returns(this.oColumn);
			this.stub(this.oMenu, "_getTable").returns(null);
			this.oParentOpenStub = this.stub(ColumnMenu.prototype, "open");
		},
		afterEach: function() {
			this.oMenu.destroy();
		}
	});

	QUnit.test("Forwards call to parent and refreshes existing sum/group icons based on column state", function(assert) {
		const MenuItem = sap.ui.require("sap/ui/unified/MenuItem");
		this.oMenu._oSumItem = new MenuItem();
		this.oMenu._oGroupIcon = new MenuItem();

		this.oMenu.open("param1", "param2");

		assert.ok(this.oParentOpenStub.calledOnce, "Parent open() called once");
		assert.deepEqual(Array.from(this.oParentOpenStub.firstCall.args), ["param1", "param2"], "Arguments forwarded to parent");
		assert.strictEqual(this.oMenu._oSumItem.getIcon(), "sap-icon://accept", "Sum item icon reflects summed state");
		assert.strictEqual(this.oMenu._oGroupIcon.getIcon(), "sap-icon://accept", "Group icon reflects grouped state");

		// Toggle column state - icons should be cleared on next open.
		this.oColumn.getSummed.returns(false);
		this.oColumn.getGrouped.returns(false);
		this.oMenu.open();
		assert.strictEqual(this.oMenu._oSumItem.getIcon(), "", "Sum item icon cleared when column is no longer summed");
		assert.strictEqual(this.oMenu._oGroupIcon.getIcon(), "", "Group icon cleared when column is no longer grouped");
	});

	QUnit.test("Does not fail when sum/group icons are absent", function(assert) {
		this.oMenu.open();

		assert.ok(this.oParentOpenStub.calledOnce, "Parent open() still called");
		assert.notOk(this.oMenu._oSumItem, "No sum item created");
		assert.notOk(this.oMenu._oGroupIcon, "No group icon created");
	});
});