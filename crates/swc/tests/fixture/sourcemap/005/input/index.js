
const avif = await res1.buffer()
const webp = await res2.buffer()
const jpeg = await res3.buffer()

expect(avif.byteLength).toBeLessThan(webp.byteLength)
expect(avif.byteLength).toBeLessThan(jpeg.byteLength)