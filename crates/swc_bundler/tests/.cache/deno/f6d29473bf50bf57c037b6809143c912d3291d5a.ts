// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/structures/mod.ts


import { createDiscordenoChannel } from "./channel.ts";
import { createDiscordenoGuild } from "./guild.ts";
import { createDiscordenoMember } from "./member.ts";
import { createDiscordenoMessage } from "./message.ts";
import { createDiscordenoRole } from "./role.ts";
import { createDiscordenoVoiceState } from "./voice_state.ts";

import type { DiscordenoChannel } from "./channel.ts";
import type { DiscordenoGuild } from "./guild.ts";
import type { DiscordenoMember } from "./member.ts";
import type { DiscordenoMessage } from "./message.ts";
import type { DiscordenoRole } from "./role.ts";
import type { DiscordenoVoiceState } from "./voice_state.ts";

/** This is the placeholder where the structure creation functions are kept. */
export let structures = {
  createDiscordenoChannel,
  createDiscordenoGuild,
  createDiscordenoMember,
  createDiscordenoMessage,
  createDiscordenoRole,
  createDiscordenoVoiceState,
};

export type {
  DiscordenoChannel,
  DiscordenoGuild,
  DiscordenoMember,
  DiscordenoMessage,
  DiscordenoRole,
  DiscordenoVoiceState,
};

export type Structures = typeof structures;

/** This function is used to update/reload/customize the internal structures of Discordeno.
 *
 *  ⚠️ **ADVANCED USE ONLY: If you customize this incorrectly, you could potentially create many new errors/bugs.
 * Please take caution when using this.**
 */
export function updateStructures(newStructures: Structures) {
  structures = {
    ...structures,
    ...newStructures,
  };
}
