import { jsx as r } from "react/jsx-runtime";
import { Fragment as t } from "react/jsx-runtime";
import { useRouter as e } from "next/router";
import { useProject as o } from "@swr/use-project";
import m from "@swr/use-team";
export default function a() {
    var a = o(e().query.project).data;
    return m().teamSlug, useProjectBranches(null == a ? void 0 : a.id).data, r(t, {});
}
import "react/jsx-runtime";
import "react";
import "next/router";
import "@swr/use-project";
import "@swr/use-team";
export { a as default };
