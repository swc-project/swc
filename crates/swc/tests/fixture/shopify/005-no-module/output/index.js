import React from "react";
import { useI18n } from "@shopify/react-i18n";
export function App() {
    const [i18n] = useI18n();
    return /*#__PURE__*/ React.createElement("h1", null, i18n.translate("foo"));
}
