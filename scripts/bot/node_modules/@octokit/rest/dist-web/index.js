import { Octokit as Octokit$1 } from '@octokit/core';
import { requestLog } from '@octokit/plugin-request-log';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import { legacyRestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

const VERSION = "18.12.0";

const Octokit = Octokit$1.plugin(requestLog, legacyRestEndpointMethods, paginateRest).defaults({
    userAgent: `octokit-rest.js/${VERSION}`,
});

export { Octokit };
//# sourceMappingURL=index.js.map
