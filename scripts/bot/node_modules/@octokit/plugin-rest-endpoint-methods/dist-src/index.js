import ENDPOINTS from "./generated/endpoints";
import { VERSION } from "./version";
import { endpointsToMethods } from "./endpoints-to-methods";
export function restEndpointMethods(octokit) {
    const api = endpointsToMethods(octokit, ENDPOINTS);
    return {
        rest: api,
    };
}
restEndpointMethods.VERSION = VERSION;
export function legacyRestEndpointMethods(octokit) {
    const api = endpointsToMethods(octokit, ENDPOINTS);
    return {
        ...api,
        rest: api,
    };
}
legacyRestEndpointMethods.VERSION = VERSION;
