import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
it("should compress avif smaller than webp and smaller than jpg", _async_to_generator(regeneratorRuntime.mark(function _callee() {
    var query, res1, res2, res3, avif, webp, jpeg;
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                query = {
                    url: "/test.jpg",
                    w: w,
                    q: 75
                };
                _ctx.next = 3;
                return fetchViaHTTP(appPort, "/_next/image", query, {
                    headers: {
                        accept: "image/avif"
                    }
                });
            case 3:
                res1 = _ctx.sent;
                expect(res1.status).toBe(200);
                expect(res1.headers.get("Content-Type")).toBe("image/avif");
                _ctx.next = 8;
                return fetchViaHTTP(appPort, "/_next/image", query, {
                    headers: {
                        accept: "image/webp"
                    }
                });
            case 8:
                res2 = _ctx.sent;
                expect(res2.status).toBe(200);
                expect(res2.headers.get("Content-Type")).toBe("image/webp");
                _ctx.next = 13;
                return fetchViaHTTP(appPort, "/_next/image", query, {
                    headers: {
                        accept: "image/jpeg"
                    }
                });
            case 13:
                res3 = _ctx.sent;
                expect(res3.status).toBe(200);
                expect(res3.headers.get("Content-Type")).toBe("image/jpeg");
                _ctx.next = 18;
                return res1.buffer();
            case 18:
                avif = _ctx.sent.byteLength;
                _ctx.next = 21;
                return res2.buffer();
            case 21:
                webp = _ctx.sent.byteLength;
                _ctx.next = 24;
                return res3.buffer();
            case 24:
                jpeg = _ctx.sent.byteLength;
                console.log({
                    isSharp: isSharp,
                    w: w,
                    avif: avif,
                    webp: webp,
                    jpeg: jpeg
                });
                expect(webp).toBeLessThan(jpeg);
                expect(avif).toBeLessThan(webp);
            case 28:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
})));
