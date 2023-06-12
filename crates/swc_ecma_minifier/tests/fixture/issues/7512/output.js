export default function(module, __unused_webpack_exports, __nested_webpack_require_250569__) {
    "use strict";
    module.exports = function(model, view, projection, bounds, ortho) {
        multiply(mvp, view, model);
        multiply(mvp, projection, mvp);
        var ptr = 0;
        for(var i = 0; i < 2; ++i){
            x[2] = bounds[i][2];
            for(var j = 0; j < 2; ++j){
                x[1] = bounds[j][1];
                for(var k = 0; k < 2; ++k){
                    x[0] = bounds[k][0];
                    !function(result, x, mat) {
                        for(var i = 0; i < 4; ++i){
                            result[i] = mat[12 + i];
                            for(var j = 0; j < 3; ++j)result[i] += x[j] * mat[4 * j + i];
                        }
                    }(pCubeVerts[ptr], x, mvp);
                    ptr += 1;
                }
            }
        }
        var closest = -1;
        for(var i = 0; i < 8; ++i){
            var w = pCubeVerts[i][3];
            for(var l = 0; l < 3; ++l)cubeVerts[i][l] = pCubeVerts[i][l] / w;
            ortho && (cubeVerts[i][2] *= -1);
            w < 0 && (closest < 0 ? closest = i : cubeVerts[i][2] < cubeVerts[closest][2] && (closest = i));
        }
        if (closest < 0) {
            closest = 0;
            for(var d = 0; d < 3; ++d){
                var u = (d + 2) % 3;
                var v = (d + 1) % 3;
                var o0 = -1;
                var o1 = -1;
                for(var s = 0; s < 2; ++s){
                    var f0 = s << d;
                    var f1 = f0 + (s << u) + (1 - s << v);
                    var f2 = f0 + (1 - s << u) + (s << v);
                    if (!(0 > orient(cubeVerts[f0], cubeVerts[f1], cubeVerts[f2], zero3))) s ? o0 = 1 : o1 = 1;
                }
                if (o0 < 0 || o1 < 0) {
                    o1 > o0 && (closest |= 1 << d);
                    continue;
                }
                for(var s = 0; s < 2; ++s){
                    var f0 = s << d;
                    var f1 = f0 + (s << u) + (1 - s << v);
                    var f2 = f0 + (1 - s << u) + (s << v);
                    var o = function(p) {
                        for(var i = 0; i < FRUSTUM_PLANES.length; ++i){
                            p = splitPoly.positive(p, FRUSTUM_PLANES[i]);
                            if (p.length < 3) return 0;
                        }
                        var base = p[0];
                        var ax = base[0] / base[3];
                        var ay = base[1] / base[3];
                        var area = 0.0;
                        for(var i = 1; i + 1 < p.length; ++i){
                            var b = p[i];
                            var c = p[i + 1];
                            var bx = b[0] / b[3];
                            var by = b[1] / b[3];
                            var cx = c[0] / c[3];
                            var cy = c[1] / c[3];
                            var uy = by - ay;
                            area += Math.abs((bx - ax) * (cy - ay) - uy * (cx - ax));
                        }
                        return area;
                    }([
                        pCubeVerts[f0],
                        pCubeVerts[f1],
                        pCubeVerts[f2],
                        pCubeVerts[f0 + (1 << u) + (1 << v)]
                    ]);
                    s ? o0 = o : o1 = o;
                }
                if (o1 > o0) {
                    closest |= 1 << d;
                    continue;
                }
            }
        }
        var farthest = 7 ^ closest;
        var bottom = -1;
        for(var i = 0; i < 8; ++i){
            if (i !== closest && i !== farthest) bottom < 0 ? bottom = i : cubeVerts[bottom][1] > cubeVerts[i][1] && (bottom = i);
        }
        var left = -1;
        for(var i = 0; i < 3; ++i){
            var idx = bottom ^ 1 << i;
            if (idx !== closest && idx !== farthest) {
                left < 0 && (left = idx);
                var v = cubeVerts[idx];
                v[0] < cubeVerts[left][0] && (left = idx);
            }
        }
        var right = -1;
        for(var i = 0; i < 3; ++i){
            var idx = bottom ^ 1 << i;
            if (idx !== closest && idx !== farthest && idx !== left) {
                right < 0 && (right = idx);
                var v = cubeVerts[idx];
                v[0] > cubeVerts[right][0] && (right = idx);
            }
        }
        var cubeEdges = CUBE_EDGES;
        cubeEdges[0] = cubeEdges[1] = cubeEdges[2] = 0;
        cubeEdges[bits.log2(left ^ bottom)] = bottom & left;
        cubeEdges[bits.log2(bottom ^ right)] = bottom & right;
        var top = 7 ^ right;
        if (top === closest || top === farthest) {
            top = 7 ^ left;
            cubeEdges[bits.log2(right ^ top)] = top & right;
        } else cubeEdges[bits.log2(left ^ top)] = top & left;
        var axis = CUBE_AXIS;
        var cutCorner = closest;
        for(var d = 0; d < 3; ++d)cutCorner & 1 << d ? axis[d] = -1 : axis[d] = 1;
        return CUBE_RESULT;
    };
    var bits = __nested_webpack_require_250569__(2288);
    var multiply = __nested_webpack_require_250569__(104);
    var splitPoly = __nested_webpack_require_250569__(4670);
    var orient = __nested_webpack_require_250569__(417);
    var mvp = Array(16);
    var pCubeVerts = Array(8);
    var cubeVerts = Array(8);
    var x = [
        ,
        ,
        , 
    ];
    var zero3 = [
        0,
        0,
        0
    ];
    !function() {
        for(var i = 0; i < 8; ++i){
            pCubeVerts[i] = [
                1,
                1,
                1,
                1
            ];
            cubeVerts[i] = [
                1,
                1,
                1
            ];
        }
    }();
    var FRUSTUM_PLANES = [
        [
            0,
            0,
            1,
            0,
            0
        ],
        [
            0,
            0,
            -1,
            1,
            0
        ],
        [
            0,
            -1,
            0,
            1,
            0
        ],
        [
            0,
            1,
            0,
            1,
            0
        ],
        [
            -1,
            0,
            0,
            1,
            0
        ],
        [
            1,
            0,
            0,
            1,
            0
        ]
    ];
    var CUBE_EDGES = [
        1,
        1,
        1
    ];
    var CUBE_AXIS = [
        0,
        0,
        0
    ];
    var CUBE_RESULT = {
        cubeEdges: CUBE_EDGES,
        axis: CUBE_AXIS
    };
}
