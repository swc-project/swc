it("should compress avif smaller than webp and smaller than jpg", async () => {
    const query = { url: "/test.jpg", w, q: 75 };
    const res1 = await fetchViaHTTP(appPort, "/_next/image", query, {
        headers: {
            accept: "image/avif",
        },
    });
    expect(res1.status).toBe(200);
    expect(res1.headers.get("Content-Type")).toBe("image/avif");

    const res2 = await fetchViaHTTP(appPort, "/_next/image", query, {
        headers: {
            accept: "image/webp",
        },
    });
    expect(res2.status).toBe(200);
    expect(res2.headers.get("Content-Type")).toBe("image/webp");

    const res3 = await fetchViaHTTP(appPort, "/_next/image", query, {
        headers: {
            accept: "image/jpeg",
        },
    });
    expect(res3.status).toBe(200);
    expect(res3.headers.get("Content-Type")).toBe("image/jpeg");

    const avif = (await res1.buffer()).byteLength;
    const webp = (await res2.buffer()).byteLength;
    const jpeg = (await res3.buffer()).byteLength;

    console.log({ isSharp, w, avif, webp, jpeg });

    expect(webp).toBeLessThan(jpeg);
    expect(avif).toBeLessThan(webp);
});
