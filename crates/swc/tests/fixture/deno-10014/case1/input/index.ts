import "./errors.ts";

function a() {
    t();
}

function t(x = false) {
    if (x) {
        throw new Error("Hello");
    }
    t(!0);
}

a();