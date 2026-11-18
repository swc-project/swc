import crossFade from 'inline-style-prefixer/lib/plugins/crossFade';
import imageSet from 'inline-style-prefixer/lib/plugins/imageSet';
import logical from 'inline-style-prefixer/lib/plugins/logical';
import position from 'inline-style-prefixer/lib/plugins/position';
import sizing from 'inline-style-prefixer/lib/plugins/sizing';
import transition from 'inline-style-prefixer/lib/plugins/transition';
const w = ['Webkit'];
const m = ['Moz'];
const wm = ['Webkit', 'Moz'];
const wms = ['Webkit', 'ms'];
const wmms = ['Webkit', 'Moz', 'ms'];

export default {
  plugins: [crossFade, imageSet, logical, position, sizing, transition],
  prefixMap: {
    appearance: wmms,
    userSelect: wm,
    textEmphasisPosition: wms,
    textEmphasis: wms,
    textEmphasisStyle: wms,
    textEmphasisColor: wms,
    boxDecorationBreak: wms,
    clipPath: w,
    maskImage: wms,
    maskMode: wms,
    maskRepeat: wms,
    maskPosition: wms,
    maskClip: wms,
    maskOrigin: wms,
    maskSize: wms,
    maskComposite: wms,
    mask: wms,
    maskBorderSource: wms,
    maskBorderMode: wms,
    maskBorderSlice: wms,
    maskBorderWidth: wms,
    maskBorderOutset: wms,
    maskBorderRepeat: wms,
    maskBorder: wms,
    maskType: wms,
    textDecorationStyle: w,
    textDecorationSkip: w,
    textDecorationLine: w,
    textDecorationColor: w,
    filter: w,
    breakAfter: w,
    breakBefore: w,
    breakInside: w,
    columnCount: w,
    columnFill: w,
    columnGap: w,
    columnRule: w,
    columnRuleColor: w,
    columnRuleStyle: w,
    columnRuleWidth: w,
    columns: w,
    columnSpan: w,
    columnWidth: w,
    backdropFilter: w,
    hyphens: w,
    flowInto: w,
    flowFrom: w,
    regionFragment: w,
    textOrientation: w,
    tabSize: m,
    fontKerning: w,
    textSizeAdjust: w
  }
};
