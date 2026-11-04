// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals, assertThrows } from "./test_util.ts";
unitTest({
    perms: {
        read: true
    }
}, function dirCwdNotNull() {
    assert(Deno.cwd() != null);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function dirCwdChdirSuccess() {
    var initialdir = Deno.cwd();
    var path = Deno.makeTempDirSync();
    Deno.chdir(path);
    var current = Deno.cwd();
    if (Deno.build.os === "darwin") {
        assertEquals(current, "/private" + path);
    } else {
        assertEquals(current, path);
    }
    Deno.chdir(initialdir);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function dirCwdError() {
    // excluding windows since it throws resource busy, while removeSync
    if ([
        "linux",
        "darwin"
    ].includes(Deno.build.os)) {
        var initialdir = Deno.cwd();
        var path = Deno.makeTempDirSync();
        Deno.chdir(path);
        Deno.removeSync(path);
        try {
            assertThrows(function() {
                Deno.cwd();
            }, Deno.errors.NotFound);
        } finally{
            Deno.chdir(initialdir);
        }
    }
});
unitTest({
    perms: {
        read: false
    }
}, function dirCwdPermError() {
    assertThrows(function() {
        Deno.cwd();
    }, Deno.errors.PermissionDenied, "read access to <CWD>, run again with the --allow-read flag");
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function dirChdirError() {
    var path = Deno.makeTempDirSync() + "test";
    assertThrows(function() {
        Deno.chdir(path);
    }, Deno.errors.NotFound);
});
