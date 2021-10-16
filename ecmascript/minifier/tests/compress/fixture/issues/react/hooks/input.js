import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useRouter } from 'next/router';
import { useProject } from '@swr/use-project';
import useTeam from '@swr/use-team';
export default function MyComp() {
    var _query = useRouter().query, projectName = _query.project;
    var ref = useProject(projectName), projectInfo = ref.data;
    var ref1 = useTeam(), teamSlug = ref1.teamSlug;
    var projectId = projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.id;
    var ref2 = useProjectBranches(projectId), branches = ref2.data;
    return (/*#__PURE__*/ _jsx(_Fragment, {
    }));
};
