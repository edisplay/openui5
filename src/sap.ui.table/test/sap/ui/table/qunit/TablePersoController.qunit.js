/*global QUnit, sinon */

sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/table/qunit/TableQUnitUtils",
	"sap/ui/table/TablePersoController",
	"sap/ui/table/library",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/table/Table",
	"sap/ui/table/Column",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/jquery",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/base/Log"
], function(Element, TableQUnitUtils, TablePersoController, tableLibrary, qutils, Table, Column, JSONModel, jQuery, nextUIUpdate, Log) {
	"use strict";

	const ResetAllMode = tableLibrary.ResetAllMode;

	let oController = null;
	let oTable = null;

	async function createController(mControllerSettings, mTableSettings) {
		// init settings
		mControllerSettings = mControllerSettings || {};
		mTableSettings = mTableSettings || {};

		// table data
		const oData = {
			items: [
				{name: "Michelle", color: "orange", number: 3.14},
				{name: "Joseph", color: "blue", number: 1.618},
				{name: "David", color: "green", number: 0}
			],
			cols: ["Name", "Color", "Number"]
		};

		// Table settings
		/**
		 * @deprecated As of Version 1.117
		 */
		mTableSettings.showColumnVisibilityMenu = true;
		mTableSettings.columns = jQuery.map(oData.cols, function(colname) {
			const oAggregations = {
				label: new TableQUnitUtils.TestControl({text: colname}),
				visible: colname === "Color" ? false : true, // Color column should be invisible by default
				template: new TableQUnitUtils.TestControl({
					text: {
						path: colname.toLowerCase()
					}
				})
			};
			if (colname !== "Number") {
				oAggregations.multiLabels = [
					new TableQUnitUtils.TestControl({text: "First level header"}),
					new TableQUnitUtils.TestControl({text: colname + " - Second level header"})
				];
			}
			return new Column(colname, oAggregations);
		});

		// Controller settings
		oTable = new Table("table", mTableSettings);
		oTable.setModel(new JSONModel(oData));
		oTable.bindRows("/items");
		oTable.placeAt("qunit-fixture");
		await nextUIUpdate();

		mControllerSettings.table = oTable;

		oController = new TablePersoController(mControllerSettings);
	}

	function destroyController() {
		if (oTable) {
			oTable.destroy();
			oTable = null;
		}
		if (oController) {
			oController.destroy();
			oController = null;
		}
	}

	QUnit.module("Basic checks", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("autoSave", async function(assert) {
		assert.expect(5);
		let getPersDataCalls = 0;
		let setPersDataCalls = 0;

		await createController({
			persoService: {
				getPersData: function() {
					getPersDataCalls++;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve();
					return oDeferred.promise();
				},
				setPersData: function() {
					setPersDataCalls++;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve();
					return oDeferred.promise();
				},
				delPersData: function() {
					assert.ok(false, "delPersData should not get called.");
				}
			}
		});

		assert.equal(getPersDataCalls, 1, "getPersData of service should be called 1 time.");
		assert.equal(setPersDataCalls, 0, "setPersData of service should be called 0 times.");
		assert.equal(oController.getAutoSave(), true, "autoSave is true by default.");

		oController.setAutoSave(false);
		oController.setAutoSave(true);

		assert.equal(getPersDataCalls, 1, "getPersData of service should be called 1 time.");
		assert.equal(setPersDataCalls, 1, "setPersData of service should be called 1 time.");
	});

	QUnit.test("persoService unsupported value", async function(assert) {
		assert.expect(3);
		await createController();

		try {
			oController.setPersoService(123);
		} catch (ex) {
			assert.equal(ex.message,
				"Value of property \"persoService\" needs to be null/undefined or an object that has the methods " +
				"\"getPersData\", \"setPersData\" and \"delPersData\".",
				"setPersoService with string should throw an error");
		}

		try {
			oController.setPersoService("abc");
		} catch (ex) {
			assert.equal(ex.message,
				"Value of property \"persoService\" needs to be null/undefined or an object that has the methods " +
				"\"getPersData\", \"setPersData\" and \"delPersData\".",
				"setPersoService with string should throw an error");
		}

		try {
			oController.setPersoService({
				setPersData: function() {
				}
			});
		} catch (ex) {
			assert.equal(ex.message,
				"Value of property \"persoService\" needs to be null/undefined or an object that has the methods "
				+ "\"getPersData\", \"setPersData\" and \"delPersData\".",
				"setPersoService: object should contain all required methods");
		}
	});

	QUnit.test("persoService / table", async function(assert) {
		assert.expect(1);
		let getPersDataCalls = 0;

		await createController({
			persoService: {
				getPersData: function() {
					getPersDataCalls++;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve();
					return oDeferred.promise();
				},
				setPersData: function() {
					assert.ok(false, "setPersData should not get called.");
				},
				delPersData: function() {
					assert.ok(false, "delPersData should not get called.");
				}
			}
		});

		const oService = oController.getPersoService();

		oController.setPersoService(null);
		oController.setTable(null);

		oController.setTable(oTable);
		oController.setPersoService(oService);

		oController.setTable(null);
		oController.setPersoService(null);

		assert.equal(getPersDataCalls, 2, "getPersData of service should be called 2 times.");
	});

	QUnit.module("Personalization integration", {
		afterEach: function() {
			destroyController();
		}
	});

	/**
	 * @deprecated As of version 1.117
	 */
	QUnit.test("Column visibility (autoSave)", async function(assert) {
		assert.expect(16);
		const done = assert.async();
		let getPersDataCalls = 0;

		await createController({
			persoService: {
				getPersData: function() {
					getPersDataCalls++;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve(this.oBundle);
					return oDeferred.promise();
				},
				setPersData: function(oBundle) {
					assert.deepEqual(oBundle, {
						_persoSchemaVersion: "1.0",
						aColumns: [
							{
								id: oTable.getId() + "-Name",
								order: 0,
								visible: true,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							},
							{
								id: oTable.getId() + "-Color",
								order: 1,
								visible: false,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							},
							{
								id: oTable.getId() + "-Number",
								order: 2,
								visible: false,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							}
						]
					}, "setPersData should receive the correct data");

					this.oBundle = oBundle;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve();
					return oDeferred.promise();
				},
				delPersData: function() {
					delete this.oBundle;
				}
			}
		});

		assert.equal(getPersDataCalls, 1, "getPersData of service should be called 1 time.");

		const oNumberColumn = Element.getElementById("Number");
		const oColorColumn = Element.getElementById("Color");
		const oNameColumn = Element.getElementById("Name");

		assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
		assert.equal(oColorColumn.getVisible(), false, "Color column should be invisible.");
		assert.equal(oNumberColumn.getVisible(), true, "Number column should be invisible.");

		oNameColumn.attachEventOnce("columnMenuOpen", function() {
			TableQUnitUtils.wait(0).then(function() {
				const oNameMenu = oNameColumn.getMenu();
				const sVisibilityMenuItemId = oNameMenu.getId() + "-column-visibilty";
				const aSubmenuItems = oTable._oColumnVisibilityMenuItem.getSubmenu().getItems();
				qutils.triggerMouseEvent(sVisibilityMenuItemId, "click");
				qutils.triggerMouseEvent(aSubmenuItems[2].$(), "click");

				// delay execution to wait for visibility change
				setTimeout(function() {

					assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
					assert.equal(oColorColumn.getVisible(), false, "Color column should be invisible.");
					assert.equal(oNumberColumn.getVisible(), false, "Number column should be invisible.");

					// refreshing the data should lead to the same visiblility states
					oController.refresh();

					assert.equal(getPersDataCalls, 2, "getPersData of service should be called 2 times.");

					assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
					assert.equal(oColorColumn.getVisible(), false, "Color column should be invisible.");
					assert.equal(oNumberColumn.getVisible(), false, "Number column should be invisible.");

					// clearing and refreshing the data should put the columns in the initial state (time when the table was set as association)
					oController.getPersoService().delPersData();
					oController.refresh();

					assert.equal(getPersDataCalls, 3, "getPersData of service should be called 3 times.");

					assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
					assert.equal(oColorColumn.getVisible(), false, "Color column should be invisible.");
					assert.equal(oNumberColumn.getVisible(), true, "Number column should be invisible.");

					done();
				}, 0);
			});
		});

		oNameColumn._openHeaderMenu(oNameColumn.getDomRef());
	});

	/**
	 * @deprecated As of version 1.117
	 */
	QUnit.test("Column visibility (no autoSave)", async function(assert) {
		assert.expect(19);
		const done = assert.async();
		let getPersDataCalls = 0;

		await createController({
			autoSave: false,
			persoService: {
				getPersData: function() {
					getPersDataCalls++;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve(this.oBundle);
					return oDeferred.promise();
				},
				setPersData: function(oBundle) {
					assert.deepEqual(oBundle, {
						_persoSchemaVersion: "1.0",
						aColumns: [
							{
								id: oTable.getId() + "-Name",
								order: 0,
								visible: true,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							},
							{
								id: oTable.getId() + "-Color",
								order: 1,
								visible: true,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							},
							{
								id: oTable.getId() + "-Number",
								order: 2,
								visible: true,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							}
						]
					}, "setPersData should receive the correct data");

					this.oBundle = oBundle;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve();
					return oDeferred.promise();
				},
				delPersData: function() {
					delete this.oBundle;
				}
			}
		});

		assert.equal(getPersDataCalls, 1, "getPersData of service should be called 1 time.");

		const oNumberColumn = Element.getElementById("Number");
		const oColorColumn = Element.getElementById("Color");
		const oNameColumn = Element.getElementById("Name");

		assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
		assert.equal(oColorColumn.getVisible(), false, "Color column should be invisible.");
		assert.equal(oNumberColumn.getVisible(), true, "Number column should be invisible.");

		oNameColumn.attachEventOnce("columnMenuOpen", function() {
			TableQUnitUtils.wait(0).then(function() {
				const oNameMenu = oNameColumn.getMenu();
				const sVisibilityMenuItemId = oNameMenu.getId() + "-column-visibilty";

				const aSubmenuItems = oTable._oColumnVisibilityMenuItem.getSubmenu().getItems();
				qutils.triggerMouseEvent(sVisibilityMenuItemId, "click");
				qutils.triggerMouseEvent(aSubmenuItems[2].$(), "click");

				// delay execution to wait for visibility change
				setTimeout(function() {

					assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
					assert.equal(oColorColumn.getVisible(), false, "Color column should be invisible.");
					assert.equal(oNumberColumn.getVisible(), false, "Number column should be invisible.");

					// refreshing the data should bring back the old state as nothing has been saved
					oController.refresh();

					assert.equal(getPersDataCalls, 2, "getPersData of service should be called 2 times.");

					assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
					assert.equal(oColorColumn.getVisible(), false, "Color column should be invisible.");
					assert.equal(oNumberColumn.getVisible(), true, "Number column should be visible again.");

					// modifications via API should also work when manually triggering save
					oColorColumn.setVisible(true);
					oController.savePersonalizations();

					assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
					assert.equal(oColorColumn.getVisible(), true, "Color column should be visible again.");
					assert.equal(oNumberColumn.getVisible(), true, "Number column should be visible.");

					// clearing and refreshing the data should put the columns in the initial state (time when the table was set as association)
					oController.getPersoService().delPersData();
					oController.refresh();

					assert.equal(getPersDataCalls, 3, "getPersData of service should be called 3 times.");

					assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
					assert.equal(oColorColumn.getVisible(), false, "Color column should be invisible.");
					assert.equal(oNumberColumn.getVisible(), true, "Number column should be visible.");

					done();
				}, 0);
			});
		});

		oNameColumn._openHeaderMenu(oNameColumn.getDomRef());
	});

	QUnit.test("Manual table changes via API", async function(assert) {
		assert.expect(11);
		let getPersDataCalls = 0;

		await createController({
			persoService: {
				getPersData: function() {
					getPersDataCalls++;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve(this.oBundle);
					return oDeferred.promise();
				},
				setPersData: function(oBundle) {
					assert.deepEqual(oBundle, {
						_persoSchemaVersion: "1.0",
						aColumns: [
							{
								id: oTable.getId() + "-Number",
								order: 0,
								visible: true,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							},
							{
								id: oTable.getId() + "-Name",
								order: 1,
								visible: true,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							},
							{
								id: oTable.getId() + "-Color",
								order: 2,
								visible: true,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							}

						]
					}, "setPersData should receive the correct data");

					this.oBundle = oBundle;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve();
					return oDeferred.promise();
				},
				delPersData: function() {
					delete this.oBundle;
				}
			}
		});

		assert.equal(getPersDataCalls, 1, "getPersData of service should be called 1 time.");

		const oNumberColumn = Element.getElementById("Number");
		const oColorColumn = Element.getElementById("Color");
		const oNameColumn = Element.getElementById("Name");

		assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
		assert.equal(oColorColumn.getVisible(), false, "Color column should be invisible.");
		assert.equal(oNumberColumn.getVisible(), true, "Number column should be invisible.");

		oTable.removeColumn(oNumberColumn);
		oTable.insertColumn(oNumberColumn, 0);

		oTable.removeColumn(oNameColumn);
		oTable.insertColumn(oNameColumn, 1);

		oTable.removeColumn(oColorColumn);
		oTable.insertColumn(oColorColumn, 2);

		oColorColumn.setVisible(true);

		// manual save is needed (even with autoSave turned on)
		oController.savePersonalizations();

		assert.equal(oTable.indexOfColumn(oNumberColumn), 0, "Number column should be on index 0.");
		assert.equal(oTable.indexOfColumn(oNameColumn), 1, "Name column should be on index 1.");
		assert.equal(oTable.indexOfColumn(oColorColumn), 2, "Color column should be on index 2.");

		oController.refresh();

		assert.equal(oTable.indexOfColumn(oNumberColumn), 0, "Number column should be on index 0.");
		assert.equal(oTable.indexOfColumn(oNameColumn), 1, "Name column should be on index 1.");
		assert.equal(oTable.indexOfColumn(oColorColumn), 2, "Color column should be on index 2.");
	});

	QUnit.test("Column multiLabels", async function(assert) {
		await createController();

		const oTablePersoData = oController._getCurrentTablePersoData(true);
		assert.equal(oTablePersoData.aColumns[0].text, "Name - Second level header", "Name column has the correct label in TablePersoDialog");
		assert.equal(oTablePersoData.aColumns[1].text, "Color - Second level header", "Color column has the correct label in TablePersoDialog");
		assert.equal(oTablePersoData.aColumns[2].text, "Number", "Number column has the correct label in TablePersoDialog");
	});

	QUnit.module("Personalization via CustomDataKey", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("CustomDataKey", async function(assert) {
		assert.expect(11);
		let getPersDataCalls = 0;

		await createController({
			persoService: {
				getPersData: function() {
					getPersDataCalls++;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve(this.oBundle);
					return oDeferred.promise();
				},
				setPersData: function(oBundle) {
					assert.deepEqual(oBundle, {
						_persoSchemaVersion: "1.0",
						aColumns: [
							{
								id: "P13N_" + oTable.getId() + "-P13N_Number",
								order: 0,
								visible: true,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							},
							{
								id: "P13N_" + oTable.getId() + "-P13N_Name",
								order: 1,
								visible: true,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							},
							{
								id: "P13N_" + oTable.getId() + "-P13N_Color",
								order: 2,
								visible: true,
								width: "",
								sorted: false,
								sortOrder: "None", /*filtered: false, filterValue: "",*/
								grouped: false
							}

						]
					}, "setPersData should receive the correct data");

					this.oBundle = oBundle;
					const oDeferred = jQuery.Deferred();
					oDeferred.resolve();
					return oDeferred.promise();
				},
				delPersData: function() {
					delete this.oBundle;
				}
			}
		});

		// set the persoKey custom data property
		oTable.data("persoKey", "P13N_" + oTable.getId());
		const aColumns = oTable.getColumns();
		for (let i = 0, l = aColumns.length; i < l; i++) {
			aColumns[i].data("persoKey", "P13N_" + aColumns[i].getId());
		}

		assert.equal(getPersDataCalls, 1, "getPersData of service should be called 1 time.");

		const oNumberColumn = Element.getElementById("Number");
		const oColorColumn = Element.getElementById("Color");
		const oNameColumn = Element.getElementById("Name");

		assert.equal(oNameColumn.getVisible(), true, "Name column should be visible.");
		assert.equal(oColorColumn.getVisible(), false, "Color column should be invisible.");
		assert.equal(oNumberColumn.getVisible(), true, "Number column should be invisible.");

		oTable.removeColumn(oNumberColumn);
		oTable.insertColumn(oNumberColumn, 0);

		oTable.removeColumn(oNameColumn);
		oTable.insertColumn(oNameColumn, 1);

		oTable.removeColumn(oColorColumn);
		oTable.insertColumn(oColorColumn, 2);

		oColorColumn.setVisible(true);

		// manual save is needed (even with autoSave turned on)
		oController.savePersonalizations();

		assert.equal(oTable.indexOfColumn(oNumberColumn), 0, "Number column should be on index 0.");
		assert.equal(oTable.indexOfColumn(oNameColumn), 1, "Name column should be on index 1.");
		assert.equal(oTable.indexOfColumn(oColorColumn), 2, "Color column should be on index 2.");

		oController.refresh();

		assert.equal(oTable.indexOfColumn(oNumberColumn), 0, "Number column should be on index 0.");
		assert.equal(oTable.indexOfColumn(oNameColumn), 1, "Name column should be on index 1.");
		assert.equal(oTable.indexOfColumn(oColorColumn), 2, "Color column should be on index 2.");
	});

	function jqResolved(vValue) {
		return jQuery.Deferred().resolve(vValue).promise();
	}

	function jqRejected(vReason) {
		return jQuery.Deferred().reject(vReason).promise();
	}

	function createResolvingService() {
		return {
			getPersData() {
				return jqResolved(this.oBundle);
			},
			setPersData(oBundle) {
				this.oBundle = oBundle;
				return jqResolved();
			},
			delPersData() {
				delete this.oBundle;
				return jqResolved();
			}
		};
	}

	function createRejectingService() {
		return {
			getPersData() {
				return jqRejected();
			},
			setPersData() {
				return jqRejected();
			},
			delPersData() {
				return jqRejected();
			}
		};
	}

	QUnit.module("ResetAllMode", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("setResetAllMode can only be set once - subsequent calls are ignored and log warning", async function(assert) {
		await createController();
		const oLogWarningSpy = this.spy(Log, "warning");

		assert.equal(oController.getResetAllMode(), ResetAllMode.Default, "Default value is 'Default'.");

		oController.setResetAllMode(ResetAllMode.ServiceDefault);
		assert.equal(oController.getResetAllMode(), ResetAllMode.ServiceDefault, "First call sets the value.");
		assert.equal(oLogWarningSpy.callCount, 0, "No warning logged on first call.");

		oController.setResetAllMode(ResetAllMode.ServiceReset);
		assert.equal(oController.getResetAllMode(), ResetAllMode.ServiceDefault, "Second call is ignored.");
		assert.equal(oLogWarningSpy.callCount, 1, "Warning logged on second call.");
		assert.ok(oLogWarningSpy.calledWith("resetAllMode of the TablePersoController can only be set once."),
			"Warning has the expected message.");
	});

	QUnit.test("setTable: with non-Default ResetAllMode does not capture initial perso data", async function(assert) {
		await createController();

		// Detach table, switch ResetAllMode, re-attach.
		oController.setTable(null);
		oController.setResetAllMode(ResetAllMode.ServiceDefault);

		oController.setTable(oTable);
		assert.strictEqual(oController._oInitialPersoData, null,
			"Initial perso data is NOT captured when ResetAllMode is not 'Default'.");
	});

	QUnit.test("refresh: ResetAllMode 'ServiceDefault' updates initial perso data after refresh", async function(assert) {
		// Build the controller manually so we can configure ResetAllMode in the constructor
		// (resetAllMode can only be set once — must be in the constructor).
		await createController();
		oController.destroy();

		oController = new TablePersoController({
			table: oTable,
			persoService: createResolvingService(),
			resetAllMode: ResetAllMode.ServiceDefault
		});

		// In ServiceDefault mode, setTable does NOT capture initial data;
		// it is only captured after a successful refresh.
		await oController.refresh();
		assert.ok(oController._oInitialPersoData, "Initial perso data is captured after refresh in 'ServiceDefault' mode.");
		assert.ok(Array.isArray(oController._oInitialPersoData.aColumns), "Initial perso data has aColumns array.");
	});

	QUnit.module("Service availability and error handling", {
		afterEach: function() {
			destroyController();
		}
	});

	// Awaits a jQuery promise expected to reject and asserts that rejection happened.
	async function assertRejects(assert, oPromise, sMessage) {
		try {
			await oPromise;
			assert.ok(false, sMessage + " (expected rejection, but promise resolved)");
		} catch (e) {
			assert.ok(true, sMessage);
		}
	}

	QUnit.test("refresh: without persoService rejects promise and logs error", async function(assert) {
		await createController();
		const oLogErrorSpy = this.spy(Log, "error");

		const oPromise = oController.refresh();
		assert.ok(oPromise, "refresh returned a promise.");

		await assertRejects(assert, oPromise, "Promise was rejected because no service is set.");
		assert.ok(oLogErrorSpy.calledWith("The Personalization Service is not available!"),
			"Error logged about missing service.");
	});

	QUnit.test("refresh: getPersData rejection logs error", async function(assert) {
		await createController({
			persoService: createRejectingService()
		});

		const oLogErrorSpy = this.spy(Log, "error");
		await assertRejects(assert, oController.refresh(), "refresh promise rejected.");
		assert.ok(oLogErrorSpy.calledWith("Problem reading persisted personalization data."),
			"Error logged about reading problem.");
	});

	QUnit.test("savePersonalizations: without persoService rejects promise and logs error", async function(assert) {
		await createController();
		const oLogErrorSpy = this.spy(Log, "error");

		const oPromise = oController.savePersonalizations();
		assert.ok(oPromise, "savePersonalizations returned a promise.");

		await assertRejects(assert, oPromise, "Promise was rejected because no service is set.");
		assert.ok(oLogErrorSpy.calledWith("The Personalization Service is not available!"),
			"Error logged about missing service.");
	});

	QUnit.test("savePersonalizations: setPersData rejection logs error", async function(assert) {
		await createController({
			persoService: createRejectingService()
		});

		const oLogErrorSpy = this.spy(Log, "error");
		await assertRejects(assert, oController.savePersonalizations(), "savePersonalizations promise rejected.");
		assert.ok(oLogErrorSpy.calledWith("Problem persisting personalization data."),
			"Error logged about persisting problem.");
	});

	QUnit.test("refresh: falls back to initial perso data when service returns no aColumns", async function(assert) {
		const oService = {
			getPersData() {
				// resolve without aColumns - should fall back to initial perso data
				return jqResolved({someOtherProp: 1});
			},
			setPersData() {
				return jqResolved();
			},
			delPersData() {
				return jqResolved();
			}
		};
		await createController({
			persoService: oService
		});

		const oNameColumn = Element.getElementById("Name");
		oNameColumn.setVisible(false);

		await oController.refresh();
		// initial data has Name visible=true, after refresh fallback should restore that
		assert.equal(oNameColumn.getVisible(), true, "Name column visibility restored to initial state.");
	});

	QUnit.module("setPersoService", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("setPersoService: setting same service does NOT trigger refresh", async function(assert) {
		const oService = createResolvingService();
		let getPersDataCalls = 0;
		const oOriginalGet = oService.getPersData;
		oService.getPersData = function() {
			getPersDataCalls++;
			return oOriginalGet.apply(this, arguments);
		};

		await createController({persoService: oService});
		assert.equal(getPersDataCalls, 1, "getPersData called once on initial controller creation.");

		oController.setPersoService(oService);
		assert.equal(getPersDataCalls, 1, "getPersData NOT called again when same service is set.");
	});

	QUnit.test("setPersoService: with autoSave=false and existing service does NOT refresh", async function(assert) {
		const oService1 = createResolvingService();
		const oService2 = createResolvingService();
		let getPersDataCalls2 = 0;
		const oOriginalGet = oService2.getPersData;
		oService2.getPersData = function() {
			getPersDataCalls2++;
			return oOriginalGet.apply(this, arguments);
		};

		await createController({autoSave: false, persoService: oService1});

		oController.setPersoService(oService2);
		assert.equal(getPersDataCalls2, 0,
			"getPersData of new service NOT called - autoSave is false and a previous service existed.");
	});

	QUnit.test("setPersoService: setting null service does not throw", async function(assert) {
		await createController({persoService: createResolvingService()});

		oController.setPersoService(null);
		assert.notOk(oController.getPersoService(), "Service is no longer set.");
	});

	QUnit.module("setCustomDataKey", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("setCustomDataKey: same value does NOT trigger save", async function(assert) {
		const oService = createResolvingService();
		await createController({persoService: oService});
		const oSetSpy = this.spy(oService, "setPersData");

		oController.setCustomDataKey(oController.getCustomDataKey());
		assert.equal(oSetSpy.callCount, 0, "setPersData NOT called when value did not change.");
	});

	QUnit.test("setCustomDataKey: different value with autoSave triggers save", async function(assert) {
		const oService = createResolvingService();
		await createController({persoService: oService});
		const oSetSpy = this.spy(oService, "setPersData");

		oController.setCustomDataKey("newPersoKey");
		assert.equal(oSetSpy.callCount, 1, "setPersData called once after key change with autoSave=true.");
	});

	QUnit.test("setCustomDataKey: different value with autoSave=false does NOT trigger save", async function(assert) {
		const oService = createResolvingService();
		await createController({autoSave: false, persoService: oService});
		const oSetSpy = this.spy(oService, "setPersData");

		oController.setCustomDataKey("newPersoKey");
		assert.equal(oSetSpy.callCount, 0, "setPersData NOT called when autoSave is false.");
	});

	QUnit.test("setCustomDataKey: refreshes initial perso data when ResetAllMode is 'Default' and table is set", async function(assert) {
		await createController();
		const oInitialBefore = oController._oInitialPersoData;

		oController.setCustomDataKey("anotherKey");
		assert.notStrictEqual(oController._oInitialPersoData, oInitialBefore,
			"Initial perso data is recomputed after customDataKey change.");
	});

	QUnit.module("_adjustTable", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("_adjustTable: returns early when table is null", async function(assert) {
		await createController();
		oController.setTable(null);
		// Should not throw
		oController._adjustTable({aColumns: []});
		assert.ok(true, "No error thrown when table is null.");
	});

	QUnit.test("_adjustTable: returns early when data is null/undefined", async function(assert) {
		await createController();
		oController._adjustTable(null);
		oController._adjustTable(undefined);
		oController._adjustTable({});
		assert.ok(true, "No error thrown when data is invalid.");
	});

	QUnit.test("_adjustTable: ignores unknown column ids in service data", async function(assert) {
		await createController();
		const oNameColumn = Element.getElementById("Name");
		const sExistingPersoKey = oController._getColumnPersoKey(oNameColumn);
		oNameColumn.setVisible(true);

		oController._adjustTable({
			aColumns: [
				{id: "totally-unknown-id", order: 0, visible: false},
				{id: sExistingPersoKey, order: 0, visible: false}
			]
		});

		assert.equal(oNameColumn.getVisible(), false, "Existing column was updated.");
	});

	QUnit.test("_adjustTable: invokes table._onPersoApplied if defined", async function(assert) {
		await createController();
		const oOnPersoAppliedSpy = this.spy(oTable, "_onPersoApplied");

		oController._adjustTable({aColumns: []});

		assert.ok(oOnPersoAppliedSpy.calledOnce, "_onPersoApplied was called on the table.");
	});

	QUnit.test("_adjustTable: catches errors when applying invalid property values", async function(assert) {
		await createController();
		const oNameColumn = Element.getElementById("Name");
		const sPersoKey = oController._getColumnPersoKey(oNameColumn);
		const oLogErrorSpy = this.spy(Log, "error");

		// Stub setProperty on this column to throw to trigger the catch branch.
		// Name column is currently visible=true, we pass visible=false to ensure setProperty is invoked.
		const oSetPropertyStub = this.stub(oNameColumn, "setProperty").throws(new Error("invalid value"));

		oController._adjustTable({
			aColumns: [
				{id: sPersoKey, order: 0, visible: false}
			]
		});

		assert.ok(oSetPropertyStub.called, "setProperty was attempted.");
		assert.ok(oLogErrorSpy.calledWithMatch(/failed to apply the value/),
			"Error was logged for the failed property assignment.");
	});

	QUnit.test("_adjustTable: skips setProperty when current value equals new value", async function(assert) {
		await createController();
		const oNameColumn = Element.getElementById("Name");
		const sPersoKey = oController._getColumnPersoKey(oNameColumn);
		oNameColumn.setVisible(true);
		const oSetPropertySpy = this.spy(oNameColumn, "setProperty");

		oController._adjustTable({
			aColumns: [
				{id: sPersoKey, order: 0, visible: true}
			]
		});

		// setProperty should NOT have been called for "visible" since value already matches
		const bSetVisibleCalled = oSetPropertySpy.getCalls().some(function(call) {
			return call.args[0] === "visible";
		});
		assert.notOk(bSetVisibleCalled, "setProperty('visible', ...) skipped because value unchanged.");
	});

	QUnit.module("_tableEventHandler / autosave coalescing", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("_tableEventHandler: does NOT save when autoSave is false", async function(assert) {
		const oService = createResolvingService();
		await createController({autoSave: false, persoService: oService});
		const oSetSpy = this.spy(oService, "setPersData");

		oController._tableEventHandler({});
		assert.strictEqual(oController._iTriggerSaveTimeout, undefined,
			"No timeout scheduled when autoSave is false.");
		assert.equal(oSetSpy.callCount, 0, "setPersData not called.");
	});

	QUnit.test("_tableEventHandler: coalesces multiple events into one save call", async function(assert) {
		const oService = createResolvingService();
		await createController({persoService: oService});
		const oSetSpy = this.spy(oService, "setPersData");

		// fire 3 events in a row
		oController._tableEventHandler({});
		oController._tableEventHandler({});
		oController._tableEventHandler({});

		assert.ok(oController._iTriggerSaveTimeout, "Timeout scheduled after first event.");

		await new Promise((resolve) => { setTimeout(resolve, 10); });

		assert.equal(oSetSpy.callCount, 1, "setPersData called only once despite multiple events.");
		assert.strictEqual(oController._iTriggerSaveTimeout, null, "Timeout reset after save fires.");
	});

	QUnit.module("_getPersoKey", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("_getPersoKey: warns when control has a generated id and no custom data", async function(assert) {
		await createController();
		const oLogWarningSpy = this.spy(Log, "warning");

		// Create a column with a generated (auto) id - no explicit id
		const oAutoColumn = new Column({
			label: new TableQUnitUtils.TestControl({text: "Auto"}),
			template: new TableQUnitUtils.TestControl({text: "x"})
		});
		oTable.addColumn(oAutoColumn);

		const sKey = oController._getPersoKey(oAutoColumn);
		assert.equal(sKey, oAutoColumn.getId(), "Falls back to control id.");
		assert.ok(oLogWarningSpy.calledWithMatch(/Generated IDs should not be used/),
			"Warning logged about using generated ids.");
	});

	QUnit.test("_getPersoKey: uses custom data value when provided (no warning)", async function(assert) {
		await createController();
		const oLogWarningSpy = this.spy(Log, "warning");
		const oNameColumn = Element.getElementById("Name");

		oNameColumn.data("persoKey", "MyExplicitKey");
		const sKey = oController._getPersoKey(oNameColumn);
		assert.equal(sKey, "MyExplicitKey", "Custom data value is used.");
		assert.notOk(oLogWarningSpy.called, "No warning when custom data is provided.");
	});

	QUnit.module("exit", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("exit: destroys dialog if it was created", async function(assert) {
		await createController();
		// Stub a dialog onto the controller
		const oDialogDestroySpy = this.spy();
		oController._oDialog = {
			destroy: oDialogDestroySpy
		};

		oController.destroy();
		oController = null; // prevent double-destroy in afterEach

		assert.ok(oDialogDestroySpy.calledOnce, "Dialog destroy was called.");
	});

	QUnit.test("exit: detaches event handlers from table", async function(assert) {
		await createController();
		const oManageSpy = this.spy(oController, "_manageTableEventHandlers");

		oController.destroy();
		oController = null;

		assert.ok(oManageSpy.calledWith(sinon.match.any, false), "_manageTableEventHandlers called with bAttach=false.");
	});

	QUnit.module("setAutoSave / setTable misc", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("setAutoSave: turning off (true -> false) does NOT save", async function(assert) {
		const oService = createResolvingService();
		await createController({persoService: oService});
		const oSetSpy = this.spy(oService, "setPersData");

		oController.setAutoSave(false);
		assert.equal(oSetSpy.callCount, 0, "setPersData NOT called when toggling autoSave off.");
	});

	QUnit.test("setAutoSave: setting same value (true -> true) does NOT trigger duplicate save", async function(assert) {
		const oService = createResolvingService();
		await createController({persoService: oService});
		const oSetSpy = this.spy(oService, "setPersData");

		oController.setAutoSave(true);
		assert.equal(oSetSpy.callCount, 0, "setPersData NOT called when value unchanged.");
	});

	QUnit.test("setTable: setting same table is a no-op for refresh", async function(assert) {
		const oService = createResolvingService();
		let getPersDataCalls = 0;
		const oOriginalGet = oService.getPersData;
		oService.getPersData = function() {
			getPersDataCalls++;
			return oOriginalGet.apply(this, arguments);
		};
		await createController({persoService: oService});
		assert.equal(getPersDataCalls, 1, "getPersData called once on initial creation.");

		// Set the same table again
		oController.setTable(oTable);
		assert.equal(getPersDataCalls, 1, "Setting the same table does not trigger another refresh.");
	});

	QUnit.test("setTable: setting null clears initial perso data", async function(assert) {
		await createController();
		assert.ok(oController._oInitialPersoData, "Initial perso data captured after creation.");

		oController.setTable(null);
		assert.strictEqual(oController._oInitialPersoData, null, "Initial perso data cleared when table set to null.");
	});

	QUnit.module("Default property values", {
		afterEach: function() {
			destroyController();
		}
	});

	QUnit.test("Default property values are correctly initialized", async function(assert) {
		await createController();

		assert.strictEqual(oController.getAutoSave(), true, "autoSave default is true.");
		assert.strictEqual(oController.getCustomDataKey(), "persoKey", "customDataKey default is 'persoKey'.");
		assert.strictEqual(oController.getShowResetAll(), true, "showResetAll default is true.");
		assert.strictEqual(oController.getResetAllMode(), ResetAllMode.Default, "resetAllMode default is 'Default'.");
		assert.notOk(oController.getPersoService(), "persoService is not set by default.");
	});
});