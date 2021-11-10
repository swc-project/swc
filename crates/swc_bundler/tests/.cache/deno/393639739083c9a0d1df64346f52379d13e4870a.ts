// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/ws/tell_cluster_to_identify.ts


import { ws } from "./ws.ts";

/** Allows users to hook in and change to communicate to different clusters across different servers or anything they like. For example using redis pubsub to talk to other servers. */
export async function tellClusterToIdentify(_workerId: number, shardId: number, _bucketId: number) {
  await ws.identify(shardId, ws.maxShards);
}
