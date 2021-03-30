/*
 * ! ${copyright}
 */

sap.ui.define([
	"sap/ui/fl/apply/_internal/flexObjects/CompVariant",
	"sap/base/Log"
], function(
	CompVariant,
	Log
) {
	"use strict";

	var mChangeHandlers = {
		addFavorite: function (oVariant) {
			oVariant.setFavorite(true);
		},
		removeFavorite: function (oVariant) {
			oVariant.setFavorite(false);
		},
		updateVariant: function (oVariant, oChange) {
			var oChangeContent = oChange.getContent();
			if (oChangeContent.executeOnSelection !== undefined) {
				oVariant.setExecuteOnSelection(oChangeContent.executeOnSelection);
			}
			if (oChangeContent.favorite !== undefined) {
				oVariant.setFavorite(oChangeContent.favorite);
			}
			if (oChangeContent.contexts) {
				oVariant.setContexts(oChangeContent.contexts);
			}
			if (oChangeContent.variantContent) {
				oVariant.setContent(oChangeContent.variantContent);
			}

			var sVariantName = oChange.getText("variantName");
			if (sVariantName) {
				oVariant.setName(sVariantName);
			}
		}
	};

	function getChangesMappedByVariant(mCompVariants) {
		var mChanges = {};

		mCompVariants.changes.forEach(function (oChange) {
			var sVariantId = oChange.getSelector().variantId || oChange.getContent().key;
			if (!mChanges[sVariantId]) {
				mChanges[sVariantId] = [];
			}

			mChanges[sVariantId].push(oChange);
		});

		return mChanges;
	}

	function logNoChangeHandler(oVariant, oChange) {
		Log.error("No change handler for change with the ID '" + oChange.getId() +
			"' and type '" + oChange.getChangeType() + "' defined.\n" +
			"The variant '" + oVariant.getId() + "'was not modified'");
	}

	function createVariant(sPersistencyKey, oVariantInput) {
		var oVariantData = {
			fileName: oVariantInput.id || "*standard*",
			persisted: oVariantInput.persisted,
			content: oVariantInput.content || {},
			texts: {
				variantName: {
					value: oVariantInput.name || ""
				}
			},
			selector: {
				persistencyKey: sPersistencyKey
			}
		};

		if (oVariantInput.favorite !== undefined) {
			oVariantData.favorite = oVariantInput.favorite;
		}

		if (oVariantInput.executeOnSelection !== undefined) {
			oVariantData.executeOnSelection = oVariantInput.executeOnSelection;
		}

		return new CompVariant(oVariantData);
	}

	function applyChangeOnVariant(oVariant, oChange) {
		var oChangeHandler = mChangeHandlers[oChange.getChangeType()] || logNoChangeHandler;
		oChangeHandler(oVariant, oChange);
		oVariant.addChange(oChange);
	}

	function applyChangesOnVariant(mChanges, oVariant) {
		var sVariantId = oVariant.getId();
		if (mChanges[sVariantId]) {
			mChanges[sVariantId].forEach(function (oChange) {
				applyChangeOnVariant(oVariant, oChange);
			});
		}
	}

	/**
	 * Class in charge of applying changes.
	 * This includes combining the variants passed on the <code>merge</code> call, sorting and applying changes.
	 *
	 * @namespace sap.ui.fl.apply._internal.flexState.compVariants.CompVariantMerger
	 * @since 1.86
	 * @version ${version}
	 * @private
	 * @ui5-restricted sap.ui.fl
	 */
	return {
		merge: function (sPersistencyKey, mCompData, oStandardVariantInput) {
			var aVariants = mCompData.nonPersistedVariants.concat(mCompData.variants);
			var mChanges = getChangesMappedByVariant(mCompData);
			aVariants.forEach(applyChangesOnVariant.bind(undefined, mChanges));

			// check for an overwritten standard variant
			var oStandardVariant;
			aVariants.forEach(function (oVariant) {
				if (oVariant.getContent() && oVariant.getContent().standardvariant) {
					oStandardVariant = oVariant;
				}
			});

			if (!oStandardVariant) {
				// create a new standard variant with the passed input
				oStandardVariant = createVariant(sPersistencyKey, oStandardVariantInput);
				applyChangesOnVariant(mChanges, oStandardVariant);
			} else {
				// remove all standard variant entries
				aVariants = aVariants.filter(function (oVariant) {
					return !oVariant.getContent() || !oVariant.getContent().standardvariant;
				});
			}

			// the standard must always be visible
			oStandardVariant.setFavorite(true);
			if (mCompData.standardVariant) {
				var bExecuteOnSelection = mCompData.standardVariant.getContent().executeOnSelect;
				oStandardVariant.setExecuteOnSelection(bExecuteOnSelection);
				// TODO remove as soon as the consumer uses the API
				oStandardVariant.getContent().executeOnSelect = bExecuteOnSelection;
			}

			return {
				standardVariant: oStandardVariant,
				variants: aVariants
			};
		},

		/**
		 * Enhances Standard Variants and non-persisted variants with additional properties and
		 * creates a new CompVariant out of it.
		 *
		 * @function
		 * @since 1.89
		 * @version ${version}
		 * @private
		 * @ui5-restricted sap.ui.fl
		 *
		 * @param {string} persistencyKey - Key of the variant management
		 * @param {object} oVariantInput - Standard Variant or non-persisted Variants like oData variant
		 */
		createVariant: function(sPersistencyKey, oVariantInput) {
			return createVariant(sPersistencyKey, oVariantInput);
		},
		applyChangeOnVariant: applyChangeOnVariant
	};
});