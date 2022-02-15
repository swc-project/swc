import { getLatestCommitMesssage } from "../util/git";
import { parsePrComments } from "./comment-parser";


(async () => {
    const latestCommitMessage = await getLatestCommitMesssage();
    console.log('Latest commit message:', latestCommitMessage);

    const lParenIndex = latestCommitMessage.lastIndexOf('(');

    if (!latestCommitMessage.endsWith(')') || lParenIndex === -1) {
        console.log(`This commit does not seems like a PR merge`)
        return;
    }

    const prNumber = parseInt(latestCommitMessage.substring(lParenIndex + 1, latestCommitMessage.length - 1));

    const actions = await parsePrComments(prNumber);

    if (actions.length === 0) {
        throw new Error('PR does not have a review comment to parse');
    }
})()