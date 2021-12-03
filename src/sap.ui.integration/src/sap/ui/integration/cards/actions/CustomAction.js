/*!
 * ${copyright}
 */
sap.ui.define([
	"./BaseAction"
], function (
	BaseAction
) {
	"use strict";

	var CustomAction = BaseAction.extend("sap.ui.integration.cards.actions.CustomAction");

	CustomAction.prototype.execute = function () {
		var mConfig = this.getConfig();

		if (typeof mConfig.action === "function") {
			mConfig.action(this.getCardInstance(), this.getSourceInstance());
		}
	};

	return CustomAction;
});