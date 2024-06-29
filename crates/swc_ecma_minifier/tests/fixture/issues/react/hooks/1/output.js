import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useRouter } from "next/router";
import { useProject } from "@swr/use-project";
import useTeam from "@swr/use-team";
export default function MyComp() {
    var projectInfo = useProject(useRouter().query.project).data;
    return useTeam().teamSlug, useProjectBranches(null == projectInfo ? void 0 : projectInfo.id).data, _jsx(_Fragment, {});
}
import "react/jsx-runtime";
import "next/router";
import "@swr/use-project";
import "@swr/use-team";
export { MyComp as default };
