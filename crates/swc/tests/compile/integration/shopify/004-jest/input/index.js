import React from "react";
import { useI18n } from "@shopify/react-i18n";

export function App() {
    const [i18n] = useI18n();
    return <h1>{i18n.translate("foo")}</h1>;
}
