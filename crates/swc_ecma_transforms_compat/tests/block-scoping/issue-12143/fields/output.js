try {
    throw void 0;
} catch (_loop_init_0___14) {
    try {
        throw void 0;
    } catch (i__15) {
        try {
            throw void 0;
        } catch (C__16) {
            i__15 = 0;
            C__16 = class {
                x = i__15;
            };
            _loop_init_0___14 = [
                i__15,
                C__16
            ];
        }
    }
    for(var i__3 = _loop_init_0___14[0], C__3 = (C__3 = _loop_init_0___14[1], _loop_init_0___14 = void 0, C__3); i__3 < 1; i__3++){
        console.log(new C__3().x);
    }
}
try {
    throw void 0;
} catch (_loop_init_1___17) {
    try {
        throw void 0;
    } catch (i__18) {
        try {
            throw void 0;
        } catch (C__19) {
            i__18 = 0;
            C__19 = class {
                #x = i__18;
            };
            _loop_init_1___17 = [
                i__18,
                C__19
            ];
        }
    }
    for(var i__5 = _loop_init_1___17[0], C__5 = (C__5 = _loop_init_1___17[1], _loop_init_1___17 = void 0, C__5); i__5 < 1; i__5++){
        console.log(new C__5());
    }
}
try {
    throw void 0;
} catch (_loop_init_2___20) {
    try {
        throw void 0;
    } catch (i__21) {
        try {
            throw void 0;
        } catch (C__22) {
            i__21 = 0;
            C__22 = class {
                accessor x = i__21;
            };
            _loop_init_2___20 = [
                i__21,
                C__22
            ];
        }
    }
    for(var i__7 = _loop_init_2___20[0], C__7 = (C__7 = _loop_init_2___20[1], _loop_init_2___20 = void 0, C__7); i__7 < 1; i__7++){
        console.log(new C__7().x);
    }
}
try {
    throw void 0;
} catch (_loop_init_3___23) {
    try {
        throw void 0;
    } catch (i__24) {
        try {
            throw void 0;
        } catch (C__25) {
            i__24 = 0;
            C__25 = class {
                accessor #x = i__24;
            };
            _loop_init_3___23 = [
                i__24,
                C__25
            ];
        }
    }
    for(var i__9 = _loop_init_3___23[0], C__9 = (C__9 = _loop_init_3___23[1], _loop_init_3___23 = void 0, C__9); i__9 < 1; i__9++){
        console.log(new C__9());
    }
}
// Computed keys and static initializers run during class evaluation.
for(var i__11 = 0, C__11 = class {
    [i__11] = 1;
    static x = i__11;
    static #x = i__11;
    static accessor y = i__11;
    static accessor #y = i__11;
    static{
        this.z = i__11;
    }
}; i__11 < 1; i__11++){
    console.log(new C__11());
}
