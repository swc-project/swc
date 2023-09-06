import { Octokit as Core } from "@octokit/core";
export { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
export declare const Octokit: typeof Core & import("@octokit/core/dist-types/types").Constructor<{
    paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
} & import("@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types").RestEndpointMethods & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api>;
export declare type Octokit = InstanceType<typeof Octokit>;
