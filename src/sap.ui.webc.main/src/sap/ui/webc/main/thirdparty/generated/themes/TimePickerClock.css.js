sap.ui.define(["exports", "sap/ui/webc/common/thirdparty/base/asset-registries/Themes", "sap/ui/webc/common/thirdparty/theming/generated/themes/sap_fiori_3/parameters-bundle.css", "./sap_fiori_3/parameters-bundle.css"], function (_exports, _Themes, _parametersBundle, _parametersBundle2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _parametersBundle = _interopRequireDefault(_parametersBundle);
  _parametersBundle2 = _interopRequireDefault(_parametersBundle2);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  (0, _Themes.registerThemePropertiesLoader)("@ui5/webcomponents-theming", "sap_fiori_3", async () => _parametersBundle.default);
  (0, _Themes.registerThemePropertiesLoader)("@ui5/webcomponents", "sap_fiori_3", async () => _parametersBundle2.default);
  const styleData = {
    packageName: "@ui5/webcomponents",
    fileName: "themes/TimePickerClock.css",
    content: ".ui5-tp-clock{display:none;outline:none;padding:.5625rem;position:relative;width:auto}.ui5-tp-clock-active{display:block}.ui5-tp-clock-dial{background-color:var(--sapLegend_WorkingBackground);border-radius:100%;display:block;position:relative;text-align:center;width:auto;z-index:1}.ui5-tp-clock-dial:before{align-items:center;border-radius:100%;bottom:2.75rem;color:var(--sapContent_LabelColor);content:attr(data-label);display:flex;font-family:var(--sapFontFamily);font-size:var(--sapFontSize);justify-content:center;left:2.75rem;position:absolute;right:2.75rem;top:2.75rem;z-index:2}.ui5-tp-clock-dial:after{content:\"\";display:block;padding-bottom:100%}.ui5-tp-clock-inner .ui5-tp-clock-dial:before{background-color:var(--sapLegend_WorkingBackground)}.ui5-tp-clock-cover{border-radius:100%;bottom:.5625rem;left:.5625rem;position:absolute;right:.5625rem;top:.5625rem;touch-action:none;z-index:10}.ui5-tp-clock-item{-webkit-touch-callout:none;display:inline-block;height:100%;left:50%;position:absolute;top:0;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:2.75rem;z-index:3}.ui5-tp-clock-item.ui5-tp-clock-marker{z-index:4}.ui5-tp-clock-dot{background-color:var(--sapField_BorderColor);border-radius:100%;box-sizing:border-box;display:block;height:.3125rem;margin:0 auto .25rem auto;width:.25rem}.ui5-tp-clock-mid-dot{background-color:var(--sapField_BorderColor);border-radius:100%;box-sizing:border-box;display:block;height:.1875rem;margin:0 auto .375rem auto;width:.125rem}.ui5-tp-clock-marker{background-color:var(--sapButton_Selected_Background);border:.0625rem solid var(--sapButton_Selected_BorderColor);border-radius:100%;box-sizing:border-box;height:.5625rem;margin:0 auto;width:.25rem}.ui5-tp-clock-number{border-radius:100%;box-sizing:border-box;color:var(--sapTextColor);display:inline-block;font-family:var(--sapFontFamily);font-size:var(--sapFontSize);height:2.75rem;line-height:2.75rem;text-align:center;vertical-align:top;width:2.75rem}.ui5-tp-clock-number.ui5-tp-clock-number-hover:not(.ui5-tp-clock-selected){background-color:var(--sapList_Hover_Background)}.ui5-tp-clock-selected{background-color:var(--sapButton_Selected_Background);border:.0625rem solid var(--sapButton_Selected_BorderColor);color:var(--sapButton_Selected_TextColor)}"
  };
  var _default = styleData;
  _exports.default = _default;
});