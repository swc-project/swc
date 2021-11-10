// Loaded from https://raw.githubusercontent.com/nats-io/nkeys.js/v1.0.0-9/src/mod.ts


/*
 * Copyright 2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export type { KeyPair } from "./nkeys.ts";
export {
  createAccount,
  createOperator,
  createPair,
  createUser,
  fromPublic,
  fromSeed,
  NKeysError,
  NKeysErrorCode,
  Prefix,
} from "./nkeys.ts";

export { decode, encode } from "./util.ts";
