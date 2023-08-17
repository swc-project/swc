import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useRouter } from "next/router";
import { useProject } from "@swr/use-project";
import useTeam from "@swr/use-team";
export default function MyComp() {
    var projectInfo = useProject(useRouter().query.project).data;
    useTeam().teamSlug;
    var projectId = null == projectInfo ? void 0 : projectInfo.id;
    return useProjectBranches(projectId).data, _jsx(_Fragment, {});
}
