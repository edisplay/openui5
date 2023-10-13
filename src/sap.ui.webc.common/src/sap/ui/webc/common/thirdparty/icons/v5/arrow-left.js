sap.ui.define(["exports", "sap/ui/webc/common/thirdparty/base/asset-registries/Icons"], function (_exports, _Icons) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.pathData = _exports.ltr = _exports.default = _exports.accData = void 0;
  const name = "arrow-left";
  const pathData = "M181 103q7-7 17-7 11 0 18.5 7.5T224 122q0 10-8 18l-94 90h332q11 0 18.5 7.5T480 256t-7.5 18.5T454 282H122l94 90q8 8 8 18 0 11-7.5 18.5T198 416q-10 0-17-7L40 274q-8-6-8-18 0-11 8-19z";
  _exports.pathData = pathData;
  const ltr = false;
  _exports.ltr = ltr;
  const accData = null;
  _exports.accData = accData;
  const collection = "SAP-icons-v5";
  const packageName = "@ui5/webcomponents-icons";
  (0, _Icons.registerIcon)(name, {
    pathData,
    ltr,
    collection,
    packageName
  });
  var _default = "SAP-icons-v5/arrow-left";
  _exports.default = _default;
});