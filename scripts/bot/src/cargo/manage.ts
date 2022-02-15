import { getLatestCommitMesssage } from "../util/git";
import { parsePrComments } from "./comment-parser";


(async () => {
    const latestCommitMessage = await getLatestCommitMesssage();
    console.log('Latest commit message:', latestCommitMessage);

    const lParenIndex = latestCommitMessage.lastIndexOf('(#');

    console.log(lParenIndex)

    if (!latestCommitMessage.endsWith(')') || lParenIndex === -1) {
        console.log(`This commit does not seems like a PR merge`)
        return;
    }

    const prNumber = parseInt(latestCommitMessage.substring(lParenIndex + 2, latestCommitMessage.length - 1));

    const actions = await parsePrComments(prNumber);

    for (const action of actions) {
        console.log(action);
    }
})()