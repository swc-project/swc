module.exports = {
    napi: {
        name: "swc_host_plugin_transform_schema_v1",
        triples: {
            defaults: true,
            additional: [
                "x86_64-unknown-linux-musl",
                "x86_64-unknown-freebsd",
                "i686-pc-windows-msvc",
                "aarch64-unknown-linux-gnu",
                "aarch64-apple-darwin",
                "aarch64-linux-android",
                "aarch64-unknown-linux-musl",
                "aarch64-pc-windows-msvc",
                "armv7-linux-androideabi",
            ],
        },
    },
};
