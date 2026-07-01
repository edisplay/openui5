/*global QUnit */

sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/qunit/utils/nextUIUpdate"],
function (JSONModel, XMLView, nextUIUpdate) {
	"use strict";

	// global vars
	const oConfigModel = new JSONModel();
	const oConfigModelNoTitles = new JSONModel();

	oConfigModel.loadData("test-resources/sap/uxap/qunit/model/OPLazyLoadingWithTabs.json", {}, false);
	oConfigModelNoTitles.loadData("test-resources/sap/uxap/qunit/model/OPLazyLoadingWithTabsNoTitles.json", {}, false);

	// utility function that will be used in these tests
	const fnGetOneBlock = function () {
		return {
			Type: "sap.uxap.testblocks.employmentblockjob.EmploymentBlockJob",
			mappings: [{
				"externalModelName": "objectPageData",
				"externalPath": "/Employee/0",
				"internalModelName": "emp1"
			}, {
				"externalModelName": "objectPageData",
				"externalPath": "/Employee/1",
				"internalModelName": "emp2"
			}, {
				"externalModelName": "objectPageData",
				"externalPath": "/Employee/2",
				"internalModelName": "emp3"
			}, {
				"externalModelName": "objectPageData",
				"externalPath": "/Employee/3",
				"internalModelName": "emp4"
			}, {
				"externalModelName": "objectPageData",
				"externalPath": "/Employee/4",
				"internalModelName": "emp5"
			}, {
				"externalModelName": "objectPageData",
				"externalPath": "/Employee/5",
				"internalModelName": "emp6"
			}]
		};
	};

	const fnLoadMoreBlocks = function (oData) {
		oData.sections.forEach(function (oSection, iIndexSection) {
			oSection.subSections.forEach(function (oSubSection) {
				oSubSection.blocks = [fnGetOneBlock()];
				if (iIndexSection <= 4) {
					oSubSection.mode = "Collapsed";
					oSubSection.moreBlocks = [fnGetOneBlock()];
				}
			});
		});
	};

	const fnBlockIsConnected = (oBlock) => !!oBlock._bConnected;

	const fnSubSectionIsloaded = (oSubSection) => oSubSection.getBlocks().every(fnBlockIsConnected);

	const fnSectionIsLoaded = (oSection) => oSection.getSubSections().every(fnSubSectionIsloaded);

	const fnAssertTabLoaded = function (assert, oSection, iIndex, bExpectLoaded) {
		const sMessage = "Section/tab [" + (iIndex + 1) + "]";
		if (bExpectLoaded) {
			assert.ok(fnSectionIsLoaded(oSection), sMessage + " loaded");
		} else {
			assert.ok(!fnSectionIsLoaded(oSection), sMessage + " not loaded");
		}
	};

	const fnAssertTabsAreLoaded = (assert, aSections, aExpectedTabIndicedToBeLoaded) => {
		aSections.forEach((oSection, iIndex) => {
			fnAssertTabLoaded(assert, oSection, iIndex, aExpectedTabIndicedToBeLoaded.indexOf(iIndex) >= 0);
		});
	};

	const fnTestSection = async function (oObjectPageLayout, iIndex, aLoadedSections, assert, testContext) {
		const aSections = oObjectPageLayout.getSections();
		oObjectPageLayout.scrollToSection(aSections[iIndex].getId());
		aLoadedSections.push(iIndex);
		await nextUIUpdate();

		return new Promise((resolve) => {
// eslint-disable-next-line no-warning-comments
			// Cannot replace with nextUIUpdate — waits for OPL lazy-load DOM propagation after scrollToSection
			// OPL fires internal DOM calculations after the render cycle
			setTimeout(() => {
				fnAssertTabsAreLoaded(assert, aSections, aLoadedSections);
				resolve();
			}, 500);
		});
	};


	/**
	 * @deprecated Since version 1.120
	 */
	QUnit.module("ObjectPage with tabs - lazy loading", {
		beforeEach: function (assert) {
			const done = assert.async();
			XMLView.create({
				id: "UxAP-27_ObjectPageConfig",
				viewName: "view.UxAP-27_ObjectPageConfig"
			}).then(async (oView) => {
				this.oView = oView;
				this.oComponentContainer = this.oView.byId("objectPageContainer");
				this.oView.setModel(oConfigModel, "objectPageLayoutMetadata");
				this.oView.placeAt("qunit-fixture");
				await nextUIUpdate();
				this.oComponentContainer.attachEventOnce("componentCreated", function () {
					done();
				});
			});
		},
		afterEach: function () {
			this.oView.destroy();
		}
	});

	/**
	 * @deprecated Since version 1.120
	 */
	QUnit.test("loading the selected section/tab", function (assert) {
		// Arrange
		const oObjectPageLayout = this.oComponentContainer.getObjectPageLayoutInstance();
		const oData = oConfigModel.getData();
		const aSections = oObjectPageLayout.getSections();
		const aLoadedSections = [0];
		const fnDone = assert.async();
		const pAll = [];

		fnLoadMoreBlocks(oData);
		oConfigModel.setData(oData);

		// Act
		// OPL processes data updates and re-renders asynchronously
		setTimeout(function () {
			// Expect the first section to be loaded by default
			fnAssertTabsAreLoaded(assert, aSections, aLoadedSections);

			// expect each section to load when selected
			for (let i = 1; i < aSections.length; i++) {
				pAll.push(fnTestSection(oObjectPageLayout, i, aLoadedSections, assert, this));
			}

			// Assert
			Promise.all(pAll).then(() => fnDone());
		}.bind(this), 1000);
	});

	/**
	 * @deprecated Since version 1.120
	 */
	QUnit.test("loading only the selected section/tab", function (assert) {
		// Arrange
		const oObjectPageLayout = this.oView.byId("objectPageContainer").getObjectPageLayoutInstance();
		const oData = oConfigModel.getData();
		const aSections = oObjectPageLayout.getSections();
		const fnDone = assert.async();

		fnLoadMoreBlocks(oData);
		oConfigModel.setData(oData);

		// Act
		// OPL processes data updates and re-renders asynchronously
		setTimeout(function () {
			// load some tab > bottom subSection
			let targetSubSection = aSections[2].getSubSections()[1];
			const precedingSubSection = aSections[2].getSubSections()[0];
			oObjectPageLayout.scrollToSection(targetSubSection.getId(), 0);

			// OPL scroll and lazy-load processing is asynchronous
			setTimeout(function () {
				// Assert
				assert.ok(fnSubSectionIsloaded(targetSubSection), "target subsection is loaded");
				assert.ok(!fnSubSectionIsloaded(precedingSubSection), "preceding subsection is not loaded");

				// load next tab > top subSection
				targetSubSection = aSections[3].getSubSections()[0];
				oObjectPageLayout.scrollToSection(targetSubSection.getId(), 0);

				// OPL scroll and lazy-load processing is asynchronous
				setTimeout(function () {
					// Assert
					assert.ok(fnSubSectionIsloaded(targetSubSection),"target subsection is loaded");
					assert.ok(!fnSubSectionIsloaded(precedingSubSection), "preceding subsection is still not loaded");

					fnDone();
				}, 500);
			}, 500);
		}, 1000);
	});

	/**
	 * @deprecated Since version 1.120
	 */
	QUnit.test("loading in IconTab mode", function (assert) {
		// Arrange
		const oObjectPageLayout = this.oView.byId("objectPageContainer").getObjectPageLayoutInstance();
		const oData = oConfigModelNoTitles.getData();
		const aSections = oObjectPageLayout.getSections();
		const fnDone = assert.async();
		let oTargetSection;

		fnLoadMoreBlocks(oData);
		oConfigModel.setData(oData);

		// Act
		// OPL processes data updates and re-renders asynchronously
		setTimeout(function () {
			oTargetSection = aSections[6];
			oObjectPageLayout.scrollToSection(oTargetSection.getId(), 0, undefined, true); // Simulate click on IconTabBar

			// OPL scroll and lazy-load processing is asynchronous
			setTimeout(function () {
				// Assert
				assert.ok(fnSubSectionIsloaded(oTargetSection.getSubSections()[0]),"target subsection is loaded");
				assert.ok(oObjectPageLayout._grepCurrentTabSectionBases().length === 2, "Section and SubSection are returned");

				// Cleanup
				fnDone();
			}, 500);
		}, 1000);
	});
});
