import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import React from "react";
import { useI18n } from "@shopify/react-i18n";
export function App() {
    var ref = _sliced_to_array(useI18n(), 1), i18n = ref[0];
    return /*#__PURE__*/ React.createElement("h1", null, i18n.translate("foo"));
}
