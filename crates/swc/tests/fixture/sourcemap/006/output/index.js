import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
it("should compress avif smaller than webp and smaller than jpg", /*#__PURE__*/ _async_to_generator(function() {
    var query, _tmp, res1, _tmp1, res2, _tmp2, res3, _tmp3, avif, webp, jpeg, _tmp4;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                _tmp = {};
                query = (_tmp.url = "/test.jpg", _tmp.w = w, _tmp.q = 75, _tmp);
                _tmp1 = {};
                return [
                    4,
                    fetchViaHTTP(appPort, "/_next/image", query, (_tmp1.headers = {
                        accept: "image/avif"
                    }, _tmp1))
                ];
            case 1:
                res1 = _state.sent();
                expect(res1.status).toBe(200);
                expect(res1.headers.get("Content-Type")).toBe("image/avif");
                _tmp2 = {};
                return [
                    4,
                    fetchViaHTTP(appPort, "/_next/image", query, (_tmp2.headers = {
                        accept: "image/webp"
                    }, _tmp2))
                ];
            case 2:
                res2 = _state.sent();
                expect(res2.status).toBe(200);
                expect(res2.headers.get("Content-Type")).toBe("image/webp");
                _tmp3 = {};
                return [
                    4,
                    fetchViaHTTP(appPort, "/_next/image", query, (_tmp3.headers = {
                        accept: "image/jpeg"
                    }, _tmp3))
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
                _tmp4 = {};
                console.log((_tmp4.isSharp = isSharp, _tmp4.w = w, _tmp4.avif = avif, _tmp4.webp = webp, _tmp4.jpeg = jpeg, _tmp4));
                expect(webp).toBeLessThan(jpeg);
                expect(avif).toBeLessThan(webp);
                return [
                    2
                ];
        }
    });
}));
