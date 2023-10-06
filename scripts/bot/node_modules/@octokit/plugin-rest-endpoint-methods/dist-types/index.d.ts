import { Octokit } from "@octokit/core";
export { RestEndpointMethodTypes } from "./generated/parameters-and-response-types";
import { Api } from "./types";
export declare function restEndpointMethods(octokit: Octokit): Api;
export declare namespace restEndpointMethods {
    var VERSION: string;
}
export declare function legacyRestEndpointMethods(octokit: Octokit): Api["rest"] & Api;
export declare namespace legacyRestEndpointMethods {
    var VERSION: string;
}
