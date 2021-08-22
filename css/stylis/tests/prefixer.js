import { prefix } from "../index.js"

describe('Prefixer', () => {
    test('text', () => {
        expect(prefix(`text-align:left;`, 10)).to.equal([`text-align:left;`].join(''))
        expect(prefix(`text-transform:none;`, 14)).to.equal([`text-transform:none;`].join(''))
        expect(prefix(`text-shadow:none;`, 11)).to.equal([`text-shadow:none;`].join(''))
        expect(prefix(`text-size-adjust:none;`, 16)).to.equal([`-webkit-text-size-adjust:none;`, `-moz-text-size-adjust:none;`, `-ms-text-size-adjust:none;`, `text-size-adjust:none;`].join(''))
        expect(prefix(`text-decoration:none;`, 15)).to.equal([`-webkit-text-decoration:none;`, `text-decoration:none;`].join(''))
    })

    test('mask', () => {
        expect(prefix(`mask:none;`, 10)).to.equal([`-webkit-mask:none;`, `mask:none;`].join(''))
        expect(prefix(`mask-image:none;`, 10)).to.equal([`-webkit-mask-image:none;`, `mask-image:none;`].join(''))
        expect(prefix(`mask-image:linear-gradient(#fff);`, 10)).to.equal([`-webkit-mask-image:linear-gradient(#fff);`, `mask-image:linear-gradient(#fff);`].join(''))
        expect(prefix(`mask-mode:none;`, 10)).to.equal([`-webkit-mask-mode:none;`, `mask-mode:none;`].join(''))
        expect(prefix(`mask-clip:none;`, 10)).to.equal([`-webkit-mask-clip:none;`, `mask-clip:none;`].join(''))
        expect(prefix(`mask-size:none;`, 10)).to.equal([`-webkit-mask-size:none;`, `mask-size:none;`].join(''))
        expect(prefix(`mask-repeat:none;`, 10)).to.equal([`-webkit-mask-repeat:none;`, `mask-repeat:none;`].join(''))
        expect(prefix(`mask-origin:none;`, 10)).to.equal([`-webkit-mask-origin:none;`, `mask-origin:none;`].join(''))
        expect(prefix(`mask-position:none;`, 10)).to.equal([`-webkit-mask-position:none;`, `mask-position:none;`].join(''))
        expect(prefix(`mask-composite:none;`, 10)).to.equal([`-webkit-mask-composite:none;`, `mask-composite:none;`].join(''))
    })

    test('filter', () => {
        expect(prefix(`filter:grayscale(100%);`, 6)).to.equal([`-webkit-filter:grayscale(100%);`, `filter:grayscale(100%);`].join(''))
        expect(prefix(`fill:red;`, 4)).to.equal([`fill:red;`].join(''))
    })

    test('position', () => {
        expect(prefix(`position:relative;`, 8)).to.equal([`position:relative;`].join(''))
        expect(prefix(`position:sticky;`, 8)).to.equal([`position:-webkit-sticky;`, `position:sticky;`].join(''))
    })

    test('color-adjust', () => {
        expect(prefix(`color:none;`, 5)).to.equal([`color:none;`].join(''))
        expect(prefix(`color-adjust:none;`, 12)).to.equal([`-webkit-print-color-adjust:none;`, `color-adjust:none;`].join(''))
    })

    test('box', () => {
        expect(prefix(`box-decoration-break:slice;`, 20)).to.equal([`-webkit-box-decoration-break:slice;`, `box-decoration-break:slice;`].join(''))
        expect(prefix(`box-sizing:border-box;`, 10)).to.equal([`box-sizing:border-box;`].join(''))
    })

    test('clip', () => {
        expect(prefix(`clip-path:none;`, 9)).to.equal([`-webkit-clip-path:none;`, `clip-path:none;`].join(''))
    })

    test('size', () => {
        expect(prefix(`width:auto;`, 5)).to.equal([`width:auto;`].join(''))
        expect(prefix(`width:unset;`, 5)).to.equal([`width:unset;`].join(''))
        expect(prefix(`width:initial;`, 5)).to.equal([`width:initial;`].join(''))
        expect(prefix(`width:inherit;`, 5)).to.equal([`width:inherit;`].join(''))
        expect(prefix(`width:10;`, 5)).to.equal([`width:10;`].join(''))
        expect(prefix(`width:min();`, 5)).to.equal([`width:min();`].join(''))
        expect(prefix(`width:var(--foo-content);`, 5)).to.equal([`width:var(--foo-content);`].join(''))
        expect(prefix(`width:var(-content);`, 5)).to.equal([`width:var(-content);`].join(''))
        expect(prefix(`width:var(--max-content);`, 5)).to.equal([`width:var(--max-content);`].join(''))
        expect(prefix(`width:--max-content;`, 5)).to.equal([`width:--max-content;`].join(''))
        expect(prefix(`width:fit-content;`, 5)).to.equal([`width:-webkit-fit-content;`, `width:-moz-fit-content;`, `width:fit-content;`].join(''))
        expect(prefix(`width:stackWidth;`, 5)).to.equal([`width:stackWidth;`].join(''))
        expect(prefix(`min-width:max-content;`, 9)).to.equal([`min-width:-webkit-max-content;`, `min-width:-moz-max-content;`, `min-width:max-content;`].join(''))
        expect(prefix(`max-width:min-content;`, 9)).to.equal([`max-width:-webkit-min-content;`, `max-width:-moz-min-content;`, `max-width:min-content;`].join(''))
        expect(prefix(`height:fill-available;`, 6)).to.equal([`height:-webkit-fill-available;`, `height:-moz-available;`, `height:fill-available;`].join(''))
        expect(prefix(`max-height:fit-content;`, 10)).to.equal([`max-height:-webkit-fit-content;`, `max-height:-moz-fit-content;`, `max-height:fit-content;`].join(''))
        expect(prefix(`width:stretch;`, 5)).to.equal([`width:-webkit-fill-available;`, `width:-moz-available;`, `width:fill-available;`, `width:stretch;`].join(''))
        expect(prefix(`width:stretch !important;`, 5)).to.equal([`width:-webkit-fill-available !important;`, `width:-moz-available !important;`, `width:fill-available !important;`, `width:stretch !important;`].join(''))
        expect(prefix(`min-block-size:max-content;`, 14)).to.equal([`min-block-size:-webkit-max-content;`, `min-block-size:-moz-max-content;`, `min-block-size:max-content;`].join(''))
        expect(prefix(`min-inline-size:max-content;`, 15)).to.equal([`min-inline-size:-webkit-max-content;`, `min-inline-size:-moz-max-content;`, `min-inline-size:max-content;`].join(''))
        expect(prefix(`width:max(250px, 100px);`, 5)).to.equal([`width:max(250px, 100px);`].join(''))
        expect(prefix(`height:min(150px, 200px);`, 6)).to.equal([`height:min(150px, 200px);`].join(''))
        expect(prefix(`min-width:min(100px, 50px);`, 9)).to.equal([`min-width:min(100px, 50px);`].join(''))
        expect(prefix(`max-width:max(150px, 200px);`, 9)).to.equal([`max-width:max(150px, 200px);`].join(''))
        expect(prefix(`min-height:max(100px, 50px);`, 10)).to.equal([`min-height:max(100px, 50px);`].join(''))
        expect(prefix(`max-height:min(150px, 200px);`, 10)).to.equal([`max-height:min(150px, 200px);`].join(''))
    })

    test('zoom', () => {
        expect(prefix(`min-zoom:0;`, 8)).to.equal([`min-zoom:0;`].join(''))
    })

    test('background', () => {
        expect(prefix(`background:none;`, 10)).to.equal([`background:none;`].join(''))
        expect(prefix(`background:image-set(url(foo.jpg) 2x);`, 10)).to.equal([`background:-webkit-image-set(url(foo.jpg) 2x);`, `background:image-set(url(foo.jpg) 2x);`].join(''))
        expect(prefix(`background-image:image-set(url(foo.jpg) 2x);`, 16)).to.equal([`background-image:-webkit-image-set(url(foo.jpg) 2x);`, `background-image:image-set(url(foo.jpg) 2x);`].join(''))
    })

    test('background-clip', () => {
        expect(prefix(`background-clip:text;`, 15)).to.equal([`-webkit-background-clip:text;`, `background-clip:text;`].join(''))
    })

    test('margin-inline', () => {
        expect(prefix(`margin-inline-start:20px;`, 19)).to.equal([`-webkit-margin-start:20px;`, `margin-inline-start:20px;`].join(''))
        expect(prefix(`margin-inline-end:20px;`, 17)).to.equal([`-webkit-margin-end:20px;`, `margin-inline-end:20px;`].join(''))
    })

    test('user-select', () => {
        expect(prefix(`user-select:none;`, 11)).to.equal([`-webkit-user-select:none;`, `-moz-user-select:none;`, `-ms-user-select:none;`, `user-select:none;`].join(''))
    })

    test('appearance', () => {
        expect(prefix(`appearance:none;`, 10)).to.equal([`-webkit-appearance:none;`, `-moz-appearance:none;`, `-ms-appearance:none;`, `appearance:none;`].join(''))
    })

    test('animation', () => {
        expect(prefix(`animation:inherit;`, 9)).to.equal([`-webkit-animation:inherit;`, `animation:inherit;`].join(''))
        expect(prefix(`animation-duration:0.6s;`, 18)).to.equal([`-webkit-animation-duration:0.6s;`, `animation-duration:0.6s;`].join(''))
        expect(prefix(`animation-name:slidein;`, 14)).to.equal([`-webkit-animation-name:slidein;`, `animation-name:slidein;`].join(''))
        expect(prefix(`animation-iteration-count:infinite;`, 25)).to.equal([`-webkit-animation-iteration-count:infinite;`, `animation-iteration-count:infinite;`].join(''))
        expect(prefix(`animation-timing-function:cubic-bezier(0.1,0.7,1.0,0.1);`, 25)).to.equal([
            `-webkit-animation-timing-function:cubic-bezier(0.1,0.7,1.0,0.1);`,
            `animation-timing-function:cubic-bezier(0.1,0.7,1.0,0.1);`
        ].join(''))
    })
})