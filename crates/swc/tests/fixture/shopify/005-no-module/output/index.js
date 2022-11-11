import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import React from "react";
import { useI18n } from "@shopify/react-i18n";
export function App() {
    var _useI18n = _sliced_to_array(useI18n(), 1), i18n = _useI18n[0];
    return /*#__PURE__*/ React.createElement("h1", null, i18n.translate("foo"));
}
