import { getLatestCommitMesssage } from "./util/git";
import { octokit } from "./util/octokit";

// We only auto-rebase if the latest commit message is one of 
//
// - test(*)
// - chore:


(async () => {
    const latestCommitMessage = await getLatestCommitMesssage();

    console.log(latestCommitMessage)

    // octokit.rest.repos.mergeUpstream({
    //     owner,
    //     repo,
    //     branch,
    // });
})()
