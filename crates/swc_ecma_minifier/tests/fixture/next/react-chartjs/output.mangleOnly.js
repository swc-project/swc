export function generateTicks$1(_, e) {
    const s = [];
    const t = 1e-14;
    const { bounds: n , step: h , min: l , max: M , precision: a , count: E , maxTicks: u , maxDigits: c , includeBounds: r  } = _;
    const m = h || 1;
    const i = u - 1;
    const { min: o , max: D  } = e;
    const O = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(l);
    const P = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(M);
    const k = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(E);
    const p = (D - o) / (c + 1);
    let f = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aI)((D - o) / i / m) * m;
    let g, L, K, I;
    if (f < t && !O && !P) {
        return [
            {
                value: o
            },
            {
                value: D
            }
        ];
    }
    I = Math.ceil(D / f) - Math.floor(o / f);
    if (I > i) {
        f = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aI)(I * f / i / m) * m;
    }
    if (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(a)) {
        g = Math.pow(10, a);
        f = Math.ceil(f * g) / g;
    }
    if (n === 'ticks') {
        L = Math.floor(o / f) * f;
        K = Math.ceil(D / f) * f;
    } else {
        L = o;
        K = D;
    }
    if (O && P && h && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aJ)((M - l) / h, f / 1000)) {
        I = Math.round(Math.min((M - l) / f, u));
        f = (M - l) / I;
        L = l;
        K = M;
    } else if (k) {
        L = O ? l : L;
        K = P ? M : K;
        I = E - 1;
        f = (K - L) / I;
    } else {
        I = (K - L) / f;
        if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aK)(I, Math.round(I), f / 1000)) {
            I = Math.round(I);
        } else {
            I = Math.ceil(I);
        }
    }
    const T = Math.max((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aL)(f), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aL)(L));
    g = Math.pow(10, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(a) ? T : a);
    L = Math.round(L * g) / g;
    K = Math.round(K * g) / g;
    let j = 0;
    if (O) {
        if (r && L !== l) {
            s.push({
                value: l
            });
            if (L < l) {
                j++;
            }
            if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aK)(Math.round((L + j * f) * g) / g, l, relativeLabelSize(l, p, _))) {
                j++;
            }
        } else if (L < l) {
            j++;
        }
    }
    for(; j < I; ++j){
        s.push({
            value: Math.round((L + j * f) * g) / g
        });
    }
    if (P && r && K !== M) {
        if (s.length && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aK)(s[s.length - 1].value, M, relativeLabelSize(M, p, _))) {
            s[s.length - 1].value = M;
        } else {
            s.push({
                value: M
            });
        }
    } else if (!P || K === M) {
        s.push({
            value: K
        });
    }
    return s;
}
