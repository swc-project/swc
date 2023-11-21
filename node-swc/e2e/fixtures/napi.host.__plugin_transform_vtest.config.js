module.exports = {
    napi: {
        name: "swc_host___plugin_transform_vtest",
        triples: {
            defaults: true,
            additional: [
                "x86_64-unknown-linux-musl",
                "x86_64-unknown-freebsd",
                "i686-pc-windows-msvc",

                "aarch64-apple-darwin",
                "aarch64-linux-android",
                "aarch64-unknown-linux-musl",
                "aarch64-pc-windows-msvc",
                "armv7-linux-androideabi",
            ],
        },
    },
};
