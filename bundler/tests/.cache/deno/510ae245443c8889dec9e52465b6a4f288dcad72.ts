// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/ws/spawn_shards.ts


import { delay } from "../util/utils.ts";
import { ws } from "./ws.ts";

/** Begin spawning shards. */
export function spawnShards(firstShardId = 0) {
  /** Stored as bucketId: [clusterId, [ShardIds]] */
  const maxShards = ws.maxShards || ws.botGatewayData.shards;
  let cluster = 0;

  for (let index = firstShardId; index < ws.botGatewayData.sessionStartLimit.maxConcurrency; index++) {
    ws.log("DEBUG", `1. Running for loop in spawnShards function.`);
    // ORGANIZE ALL SHARDS INTO THEIR OWN BUCKETS
    for (let i = 0; i < maxShards; i++) {
      ws.log("DEBUG", `2. Running for loop in spawnShards function.`);
      const bucketId = i % ws.botGatewayData.sessionStartLimit.maxConcurrency;
      const bucket = ws.buckets.get(bucketId);

      if (!bucket) {
        // Create the bucket since it doesnt exist
        ws.buckets.set(bucketId, {
          clusters: [[cluster, i]],
          createNextShard: true,
        });

        if (cluster + 1 <= ws.maxClusters) cluster++;
      } else {
        // FIND A QUEUE IN THIS BUCKET THAT HAS SPACE
        const queue = bucket.clusters.find((q) => q.length < ws.shardsPerCluster + 1);
        if (queue) {
          // IF THE QUEUE HAS SPACE JUST ADD IT TO THIS QUEUE
          queue.push(i);
        } else {
          if (cluster + 1 <= ws.maxClusters) cluster++;
          // ADD A NEW QUEUE FOR THIS SHARD
          bucket.clusters.push([cluster, i]);
        }
      }
    }
  }

  // SPREAD THIS OUT TO DIFFERENT CLUSTERS TO BEGIN STARTING UP
  ws.buckets.forEach(async (bucket, bucketId) => {
    ws.log("DEBUG", `3. Running forEach loop in spawnShards function.`);
    for (const [clusterId, ...queue] of bucket.clusters) {
      ws.log("DEBUG", `4. Running for of loop in spawnShards function.`);
      let shardId = queue.shift();

      while (shardId !== undefined) {
        ws.log("DEBUG", "5. Running while loop in spawnShards function.");
        if (!bucket.createNextShard) {
          await delay(100);
          continue;
        }

        bucket.createNextShard = false;
        await ws.tellClusterToIdentify(clusterId, shardId, bucketId);
        shardId = queue.shift();
      }
    }
  });
}
