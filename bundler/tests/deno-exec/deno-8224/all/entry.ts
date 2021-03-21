import * as oak from 'https://deno.land/x/oak/mod.ts';
import * as dsoReflect from 'https://deno.land/x/dso@v1.0.0/src/Reflect.ts';
import * as path from 'https://deno.land/std/path/mod.ts';
import * as uuid from 'https://deno.land/std/uuid/v4.ts';
import * as fs from 'https://deno.land/std/fs/mod.ts';
import * as flagTypes from 'https://deno.land/x/args@1.0.7/flag-types.ts';
import * as valueTypes from 'https://deno.land/x/args@1.0.7/value-types.ts';
import * as args from 'https://deno.land/x/args@1.0.7/wrapper.ts';
import * as datetime from 'https://deno.land/std/datetime/mod.ts';
import * as log from 'https://deno.land/std/log/mod.ts';
import * as base64Url from 'https://deno.land/std/encoding/base64url.ts';
import * as bytes from 'https://deno.land/std/bytes/mod.ts';
import * as sha256 from 'https://deno.land/std/hash/sha256.ts';
import * as jszip from 'https://deno.land/x/jszip/mod.ts';
import * as signal from 'https://deno.land/std/signal/mod.ts';

console.log(
    oak, dsoReflect, path, uuid, fs, flagTypes, valueTypes,
    args, datetime, log, base64Url, bytes, sha256, jszip, signal
)