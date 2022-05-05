import { getCurrentPrNumber } from "../util/octokit";
import { parsePrComments } from "./comment-parser";

(async () => {
    const prNumber = getCurrentPrNumber();
    console.log(`Checking PR #${prNumber}`);

    const actions = await parsePrComments(prNumber);

    if (actions.length === 0) {
        throw new Error(
            "PR does not have a review comment to parse. Please wait for a comment by @kdy1 to be added."
        );
    }
})();
