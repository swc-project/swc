import { RouteOptions, Route } from "@sapphire/plugin-api";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<RouteOptions>({ route: "vote" })
export class VoteRoute extends Route {}
