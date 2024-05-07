var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
it("should compress avif smaller than webp and smaller than jpg", /*#__PURE__*/ _async_to_generator._(function() {
    var query, res1, res2, res3, avif, webp, jpeg;
    return _ts_generator._(this, function(_state) {
        switch(_state.label){
            case 0:
                query = {
                    url: "/test.jpg",
                    w: w,
                    q: 75
                };
                return [
                    4,
                    fetchViaHTTP(appPort, "/_next/image", query, {
                        headers: {
                            accept: "image/avif"
                        }
                    })
                ];
            case 1:
                res1 = _state.sent();
                expect(res1.status).toBe(200);
                expect(res1.headers.get("Content-Type")).toBe("image/avif");
                return [
                    4,
                    fetchViaHTTP(appPort, "/_next/image", query, {
                        headers: {
                            accept: "image/webp"
                        }
                    })
                ];
            case 2:
                res2 = _state.sent();
                expect(res2.status).toBe(200);
                expect(res2.headers.get("Content-Type")).toBe("image/webp");
                return [
                    4,
                    fetchViaHTTP(appPort, "/_next/image", query, {
                        headers: {
                            accept: "image/jpeg"
                        }
                    })
                ];
            case 3:
                res3 = _state.sent();
                expect(res3.status).toBe(200);
                expect(res3.headers.get("Content-Type")).toBe("image/jpeg");
                return [
                    4,
                    res1.buffer()
                ];
            case 4:
                avif = _state.sent().byteLength;
                return [
                    4,
                    res2.buffer()
                ];
            case 5:
                webp = _state.sent().byteLength;
                return [
                    4,
                    res3.buffer()
                ];
            case 6:
                jpeg = _state.sent().byteLength;
                console.log({
                    isSharp: isSharp,
                    w: w,
                    avif: avif,
                    webp: webp,
                    jpeg: jpeg
                });
                expect(webp).toBeLessThan(jpeg);
                expect(avif).toBeLessThan(webp);
                return [
                    2
                ];
        }
    });
}));
