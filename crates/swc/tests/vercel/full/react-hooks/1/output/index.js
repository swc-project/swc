import { jsx as r, Fragment as t } from "react/jsx-runtime";
import e from "react";
import { useRouter as o } from "next/router";
import { useProject as m } from "@swr/use-project";
import a from "@swr/use-team";
export default function u() {
    var e = o().query.project, u = m(e).data;
    return a().teamSlug, useProjectBranches(null == u ? void 0 : u.id).data, r(t, {});
import { jsx as r, Fragment as o } from "react/jsx-runtime";
import t from "react";
import { useRouter as m } from "next/router";
import { useProject as a } from "@swr/use-project";
import i from "@swr/use-team";
export default function e() {
    var t = a(m().query.project).data;
    return i().teamSlug, useProjectBranches(null == t ? void 0 : t.id).data, r(o, {});
};
