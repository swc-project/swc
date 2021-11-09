// Loaded from https://deno.land/x/jpegts@1.1/lib/decoder.ts


/* tslint:disable */

import { Image } from "./image.ts"

const JpegImage = (function jpegImage() {
  "use strict";
  const dctZigZag = new Int32Array([
     0,
     1,  8,
    16,  9,  2,
     3, 10, 17, 24,
    32, 25, 18, 11, 4,
     5, 12, 19, 26, 33, 40,
    48, 41, 34, 27, 20, 13,  6,
     7, 14, 21, 28, 35, 42, 49, 56,
    57, 50, 43, 36, 29, 22, 15,
    23, 30, 37, 44, 51, 58,
    59, 52, 45, 38, 31,
    39, 46, 53, 60,
    61, 54, 47,
    55, 62,
    63
  ]);

  const dctCos1  =  4017   // cos(pi/16)
  const dctSin1  =   799   // sin(pi/16)
  const dctCos3  =  3406   // cos(3*pi/16)
  const dctSin3  =  2276   // sin(3*pi/16)
  const dctCos6  =  1567   // cos(6*pi/16)
  const dctSin6  =  3784   // sin(6*pi/16)
  const dctSqrt2 =  5793   // sqrt(2)
  const dctSqrt1d2 = 2896  // sqrt(2) / 2

  function constructor() {
  }

  // @ts-ignore
  function buildHuffmanTable(codeLengths, values) {
    let k = 0
    const code = []
    let  i, j, length = 16;
    while (length > 0 && !codeLengths[length - 1]) {
      length--;
    }
    code.push({children: [], index: 0});
    let p = code[0], q;
    for (i = 0; i < length; i++) {
      for (j = 0; j < codeLengths[i]; j++) {
        // @ts-ignore
        p = code.pop();
        // @ts-ignore
        p.children[p.index] = values[k];
        while (p.index > 0) {
          // @ts-ignore
          p = code.pop();
        }
        p.index++;
        code.push(p);
        while (code.length <= i) {
          code.push(q = {children: [], index: 0});
          // @ts-ignore
          p.children[p.index] = q.children;
          p = q;
        }
        k++;
      }
      if (i + 1 < length) {
        // p here points to last code
        code.push(q = {children: [], index: 0});
        // @ts-ignore
        p.children[p.index] = q.children;
        p = q;
      }
    }
    return code[0].children;
  }

  // @ts-ignore
  function decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive) {
    
    const mcusPerLine = frame.mcusPerLine;
    const progressive = frame.progressive;

    const startOffset = offset
    let bitsData = 0, bitsCount = 0;
    function readBit() {
      if (bitsCount > 0) {
        bitsCount--;
        return (bitsData >> bitsCount) & 1;
      }
      bitsData = data[offset++];
      if (bitsData === 0xFF) {
        const nextByte = data[offset++];
        if (nextByte) {
          throw new Error("unexpected marker: " + ((bitsData << 8) | nextByte).toString(16));
        }
        // unstuff 0
      }
      bitsCount = 7;
      return bitsData >>> 7;
    }
    // @ts-ignore
    function decodeHuffman(tree) {
      let node = tree, bit;
      while ((bit = readBit()) !== null) {
        node = node[bit];
        if (typeof node === "number") {
          return node;
        }
        if (typeof node !== "object") {
          throw new Error("invalid huffman sequence");
        }
      }
      return null;
    }
    // @ts-ignore
    function receive(length) {
      let n = 0;
      while (length > 0) {
        const bit = readBit();
        if (bit === null) { return; }
        n = (n << 1) | bit;
        length--;
      }
      return n;
    }
    // @ts-ignore
    function receiveAndExtend(length) {
      const n = receive(length);
      // @ts-ignore
      if (n >= 1 << (length - 1)) {
        return n;
      }
      // @ts-ignore
      return n + (-1 << length) + 1;
    }
    // @ts-ignore
    function decodeBaseline(component, zz) {
      const t = decodeHuffman(component.huffmanTableDC);
      const diff = t === 0 ? 0 : receiveAndExtend(t);
      zz[0] = (component.pred += diff);
      let k = 1;
      while (k < 64) {
        const rs = decodeHuffman(component.huffmanTableAC);
        // @ts-ignore
        const s = rs & 15, r = rs >> 4;
        if (s === 0) {
          if (r < 15) {
            break;
          }
          k += 16;
          continue;
        }
        k += r;
        const z = dctZigZag[k];
        zz[z] = receiveAndExtend(s);
        k++;
      }
    }
    // @ts-ignore
    function decodeDCFirst(component, zz) {
      const t = decodeHuffman(component.huffmanTableDC);
      // @ts-ignore
      const diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
      zz[0] = (component.pred += diff);
    }
    // @ts-ignore
    function decodeDCSuccessive(component, zz) {
      zz[0] |= readBit() << successive;
    }
    let eobrun = 0;
    // @ts-ignore
    function decodeACFirst(component, zz) {
      if (eobrun > 0) {
        eobrun--;
        return;
      }
      let k = spectralStart, e = spectralEnd;
      while (k <= e) {
        const rs = decodeHuffman(component.huffmanTableAC);
        // @ts-ignore
        const s = rs & 15, r = rs >> 4;
        if (s === 0) {
          if (r < 15) {
            // @ts-ignore
            eobrun = receive(r) + (1 << r) - 1;
            break;
          }
          k += 16;
          continue;
        }
        k += r;
        const z = dctZigZag[k];
        // @ts-ignore
        zz[z] = receiveAndExtend(s) * (1 << successive);
        k++;
      }
    }
    // @ts-ignore
    let successiveACState = 0, successiveACNextValue;
    // @ts-ignore
    function decodeACSuccessive(component, zz) {
      let k = spectralStart, e = spectralEnd, r = 0;
      while (k <= e) {
        const z = dctZigZag[k];
        const direction = zz[z] < 0 ? -1 : 1;
        switch (successiveACState) {
        case 0: // initial state
          const rs = decodeHuffman(component.huffmanTableAC);
          // @ts-ignore
          const s = rs & 15;
          // @ts-ignore
          r = rs >> 4
          if (s === 0) {
            if (r < 15) {
              // @ts-ignore
              eobrun = receive(r) + (1 << r);
              successiveACState = 4;
            } else {
              r = 16;
              successiveACState = 1;
            }
          } else {
            if (s !== 1) {
              throw new Error("invalid ACn encoding");
            }
            successiveACNextValue = receiveAndExtend(s);
            successiveACState = r ? 2 : 3;
          }
          continue;
        case 1: // skipping r zero items
        case 2:
          if (zz[z]) {
            zz[z] += (readBit() << successive) * direction;
          } else {
            r--;
            if (r === 0) {
              successiveACState = successiveACState == 2 ? 3 : 0;
            }
          }
          break;
        case 3: // set value for a zero item
          if (zz[z]) {
            zz[z] += (readBit() << successive) * direction;
          } else {
            // @ts-ignore
            zz[z] = successiveACNextValue << successive;
            successiveACState = 0;
          }
          break;
        case 4: // eob
          if (zz[z]) {
            zz[z] += (readBit() << successive) * direction;
          }
          break;
        }
        k++;
      }
      if (successiveACState === 4) {
        eobrun--;
        if (eobrun === 0) {
          successiveACState = 0;
        }
      }
    }
    // @ts-ignore
    function decodeMcu(component, decode, mcu, row, col) {
      const mcuRow = (mcu / mcusPerLine) | 0;
      const mcuCol = mcu % mcusPerLine;
      const blockRow = mcuRow * component.v + row;
      const blockCol = mcuCol * component.h + col;
      decode(component, component.blocks[blockRow][blockCol]);
    }
    // @ts-ignore
    function decodeBlock(component, decode, mcu) {
      const blockRow = (mcu / component.blocksPerLine) | 0;
      const blockCol = mcu % component.blocksPerLine;
      decode(component, component.blocks[blockRow][blockCol]);
    }

    const componentsLength = components.length;
    let component, i, j, k, n;
    let decodeFn;
    if (progressive) {
      if (spectralStart === 0) {
        decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
      } else {
        decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
      }
    } else {
      decodeFn = decodeBaseline;
    }

    let mcu = 0, marker;
    let mcuExpected;
    if (componentsLength == 1) {
      mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
    } else {
      mcuExpected = mcusPerLine * frame.mcusPerColumn;
    }
    if (!resetInterval) { resetInterval = mcuExpected; }

    let h, v;
    while (mcu < mcuExpected) {
      // reset interval stuff
      for (i = 0; i < componentsLength; i++) {
        components[i].pred = 0;
      }
      eobrun = 0;

      if (componentsLength == 1) {
        component = components[0];
        for (n = 0; n < resetInterval; n++) {
          decodeBlock(component, decodeFn, mcu);
          mcu++;
        }
      } else {
        for (n = 0; n < resetInterval; n++) {
          for (i = 0; i < componentsLength; i++) {
            component = components[i];
            h = component.h;
            v = component.v;
            for (j = 0; j < v; j++) {
              for (k = 0; k < h; k++) {
                decodeMcu(component, decodeFn, mcu, j, k);
              }
            }
          }
          mcu++;

          // If we've reached our expected MCU's, stop decoding
          if (mcu === mcuExpected) { break; }
        }
      }

      // find marker
      bitsCount = 0;
      marker = (data[offset] << 8) | data[offset + 1];
      if (marker < 0xFF00) {
        throw new Error("marker was not found");
      }

      if (marker >= 0xFFD0 && marker <= 0xFFD7) { // RSTx
        offset += 2;
      } else {
        break;
      }
    }

    return offset - startOffset;
  }
// @ts-ignore
  function buildComponentData(frame, component) {
    const lines = [];
    const blocksPerLine = component.blocksPerLine;
    const blocksPerColumn = component.blocksPerColumn;
    const samplesPerLine = blocksPerLine << 3;
    const R = new Int32Array(64), r = new Uint8Array(64);

    // @ts-ignore
    function quantizeAndInverse(zz, dataOut, dataIn) {
      const qt = component.quantizationTable;
      let v0, v1, v2, v3, v4, v5, v6, v7, t;
      const p = dataIn;
      let i;

      // dequant
      for (i = 0; i < 64; i++) {
        p[i] = zz[i] * qt[i];
      }

      // inverse DCT on rows
      for (i = 0; i < 8; ++i) {
        const row = 8 * i;

        // check for all-zero AC coefficients
        if (p[1 + row] == 0 && p[2 + row] == 0 && p[3 + row] == 0 &&
            p[4 + row] == 0 && p[5 + row] == 0 && p[6 + row] == 0 &&
            p[7 + row] == 0) {
          t = (dctSqrt2 * p[0 + row] + 512) >> 10;
          p[0 + row] = t;
          p[1 + row] = t;
          p[2 + row] = t;
          p[3 + row] = t;
          p[4 + row] = t;
          p[5 + row] = t;
          p[6 + row] = t;
          p[7 + row] = t;
          continue;
        }

        // stage 4
        v0 = (dctSqrt2 * p[0 + row] + 128) >> 8;
        v1 = (dctSqrt2 * p[4 + row] + 128) >> 8;
        v2 = p[2 + row];
        v3 = p[6 + row];
        v4 = (dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128) >> 8;
        v7 = (dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128) >> 8;
        v5 = p[3 + row] << 4;
        v6 = p[5 + row] << 4;

        // stage 3
        t = (v0 - v1 + 1) >> 1;
        v0 = (v0 + v1 + 1) >> 1;
        v1 = t;
        t = (v2 * dctSin6 + v3 * dctCos6 + 128) >> 8;
        v2 = (v2 * dctCos6 - v3 * dctSin6 + 128) >> 8;
        v3 = t;
        t = (v4 - v6 + 1) >> 1;
        v4 = (v4 + v6 + 1) >> 1;
        v6 = t;
        t = (v7 + v5 + 1) >> 1;
        v5 = (v7 - v5 + 1) >> 1;
        v7 = t;

        // stage 2
        t = (v0 - v3 + 1) >> 1;
        v0 = (v0 + v3 + 1) >> 1;
        v3 = t;
        t = (v1 - v2 + 1) >> 1;
        v1 = (v1 + v2 + 1) >> 1;
        v2 = t;
        t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
        v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
        v7 = t;
        t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
        v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
        v6 = t;

        // stage 1
        p[0 + row] = v0 + v7;
        p[7 + row] = v0 - v7;
        p[1 + row] = v1 + v6;
        p[6 + row] = v1 - v6;
        p[2 + row] = v2 + v5;
        p[5 + row] = v2 - v5;
        p[3 + row] = v3 + v4;
        p[4 + row] = v3 - v4;
      }

      // inverse DCT on columns
      for (i = 0; i < 8; ++i) {
        const col = i;

        // check for all-zero AC coefficients
        if (p[1 * 8 + col] == 0 && p[2 * 8 + col] == 0 && p[3 * 8 + col] == 0 &&
            p[4 * 8 + col] == 0 && p[5 * 8 + col] == 0 && p[6 * 8 + col] == 0 &&
            p[7 * 8 + col] == 0) {
          t = (dctSqrt2 * dataIn[i + 0] + 8192) >> 14;
          p[0 * 8 + col] = t;
          p[1 * 8 + col] = t;
          p[2 * 8 + col] = t;
          p[3 * 8 + col] = t;
          p[4 * 8 + col] = t;
          p[5 * 8 + col] = t;
          p[6 * 8 + col] = t;
          p[7 * 8 + col] = t;
          continue;
        }

        // stage 4
        v0 = (dctSqrt2 * p[0 * 8 + col] + 2048) >> 12;
        v1 = (dctSqrt2 * p[4 * 8 + col] + 2048) >> 12;
        v2 = p[2 * 8 + col];
        v3 = p[6 * 8 + col];
        v4 = (dctSqrt1d2 * (p[1 * 8 + col] - p[7 * 8 + col]) + 2048) >> 12;
        v7 = (dctSqrt1d2 * (p[1 * 8 + col] + p[7 * 8 + col]) + 2048) >> 12;
        v5 = p[3 * 8 + col];
        v6 = p[5 * 8 + col];

        // stage 3
        t = (v0 - v1 + 1) >> 1;
        v0 = (v0 + v1 + 1) >> 1;
        v1 = t;
        t = (v2 * dctSin6 + v3 * dctCos6 + 2048) >> 12;
        v2 = (v2 * dctCos6 - v3 * dctSin6 + 2048) >> 12;
        v3 = t;
        t = (v4 - v6 + 1) >> 1;
        v4 = (v4 + v6 + 1) >> 1;
        v6 = t;
        t = (v7 + v5 + 1) >> 1;
        v5 = (v7 - v5 + 1) >> 1;
        v7 = t;

        // stage 2
        t = (v0 - v3 + 1) >> 1;
        v0 = (v0 + v3 + 1) >> 1;
        v3 = t;
        t = (v1 - v2 + 1) >> 1;
        v1 = (v1 + v2 + 1) >> 1;
        v2 = t;
        t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
        v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
        v7 = t;
        t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
        v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
        v6 = t;

        // stage 1
        p[0 * 8 + col] = v0 + v7;
        p[7 * 8 + col] = v0 - v7;
        p[1 * 8 + col] = v1 + v6;
        p[6 * 8 + col] = v1 - v6;
        p[2 * 8 + col] = v2 + v5;
        p[5 * 8 + col] = v2 - v5;
        p[3 * 8 + col] = v3 + v4;
        p[4 * 8 + col] = v3 - v4;
      }

      // convert to 8-bit integers
      for (i = 0; i < 64; ++i) {
        const sample = 128 + ((p[i] + 8) >> 4);
        dataOut[i] = sample < 0 ? 0 : sample > 0xFF ? 0xFF : sample;
      }
    }

    let i, j;
    for (let blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
      const scanLine = blockRow << 3;
      for (i = 0; i < 8; i++) {
        lines.push(new Uint8Array(samplesPerLine));
      }
      for (let blockCol = 0; blockCol < blocksPerLine; blockCol++) {
        quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);

        let offset = 0, sample = blockCol << 3;
        for (j = 0; j < 8; j++) {
          const line = lines[scanLine + j];
          for (i = 0; i < 8; i++) {
            line[sample + i] = r[offset++];
          }
        }
      }
    }
    return lines;
  }

  // @ts-ignore
  function clampTo8bit(a) {
    return a < 0 ? 0 : a > 255 ? 255 : a;
  }

  constructor.prototype = {
    // @ts-ignore
    load: function load(path) {
      // let xhr = new XMLHttpRequest();
      // xhr.open("GET", path, true);
      // xhr.responseType = "arraybuffer";
      // xhr.onload = (function() {
      //   // TODO catch parse error
      //   let data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
      //   this.parse(data);
      //   if (this.onload)
      //     this.onload();
      // }).bind(this);
      // xhr.send(null);
    },
    parse: function parse(data: Uint8Array) {
      let offset = 0;
      function readUint16() {
        const value = (data[offset] << 8) | data[offset + 1];
        offset += 2;
        return value;
      }
      function readDataBlock() {
        const length = readUint16();
        const array = data.subarray(offset, offset + length - 2);
        offset += array.length;
        return array;
      }
      // @ts-ignore
      function prepareComponents(frame) {
        let maxH = 0, maxV = 0;
        let component, componentId;
        for (componentId in frame.components) {
          if (frame.components.hasOwnProperty(componentId)) {
            component = frame.components[componentId];
            if (maxH < component.h) { maxH = component.h; }
            if (maxV < component.v) { maxV = component.v; }
          }
        }
        const mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
        const mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
        for (componentId in frame.components) {
          if (frame.components.hasOwnProperty(componentId)) {
            component = frame.components[componentId];
            const blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
            const blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines  / 8) * component.v / maxV);
            const blocksPerLineForMcu = mcusPerLine * component.h;
            const blocksPerColumnForMcu = mcusPerColumn * component.v;
            const blocks = [];
            for (let i = 0; i < blocksPerColumnForMcu; i++) {
              const row = [];
              for (let j = 0; j < blocksPerLineForMcu; j++) {
                row.push(new Int32Array(64));
              }
              blocks.push(row);
            }
            component.blocksPerLine = blocksPerLine;
            component.blocksPerColumn = blocksPerColumn;
            component.blocks = blocks;
          }
        }
        frame.maxH = maxH;
        frame.maxV = maxV;
        frame.mcusPerLine = mcusPerLine;
        frame.mcusPerColumn = mcusPerColumn;
      }
      let jfif = null;
      let adobe = null;
      let frame, resetInterval;
      const quantizationTables = [], frames = [];
      // @ts-ignore
      const huffmanTablesAC = [], huffmanTablesDC = [];
      let fileMarker = readUint16();
      if (fileMarker != 0xFFD8) { // SOI (Start of Image)
        throw new Error("SOI not found");
      }

      fileMarker = readUint16();
      while (fileMarker != 0xFFD9) { // EOI (End of image)
        let i, j, l;
        switch (fileMarker) {
          case 0xFF00: break;
          case 0xFFE0: // APP0 (Application Specific)
          case 0xFFE1: // APP1
          case 0xFFE2: // APP2
          case 0xFFE3: // APP3
          case 0xFFE4: // APP4
          case 0xFFE5: // APP5
          case 0xFFE6: // APP6
          case 0xFFE7: // APP7
          case 0xFFE8: // APP8
          case 0xFFE9: // APP9
          case 0xFFEA: // APP10
          case 0xFFEB: // APP11
          case 0xFFEC: // APP12
          case 0xFFED: // APP13
          case 0xFFEE: // APP14
          case 0xFFEF: // APP15
          case 0xFFFE: // COM (Comment)
            const appData = readDataBlock();

            if (fileMarker === 0xFFE0) {
              if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 &&
                appData[3] === 0x46 && appData[4] === 0) { // 'JFIF\x00'
                jfif = {
                  version: { major: appData[5], minor: appData[6] },
                  densityUnits: appData[7],
                  xDensity: (appData[8] << 8) | appData[9],
                  yDensity: (appData[10] << 8) | appData[11],
                  thumbWidth: appData[12],
                  thumbHeight: appData[13],
                  thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                };
              }
            }
            // TODO APP1 - Exif
            if (fileMarker === 0xFFEE) {
              if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F &&
                appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0) { // 'Adobe\x00'
                adobe = {
                  version: appData[6],
                  flags0: (appData[7] << 8) | appData[8],
                  flags1: (appData[9] << 8) | appData[10],
                  transformCode: appData[11]
                };
              }
            }
            break;

          case 0xFFDB: // DQT (Define Quantization Tables)
            const quantizationTablesLength = readUint16();
            const quantizationTablesEnd = quantizationTablesLength + offset - 2;
            while (offset < quantizationTablesEnd) {
              const quantizationTableSpec = data[offset++];
              const tableData = new Int32Array(64);
              if ((quantizationTableSpec >> 4) === 0) { // 8 bit values
                for (j = 0; j < 64; j++) {
                  const z = dctZigZag[j];
                  tableData[z] = data[offset++];
                }
              } else if ((quantizationTableSpec >> 4) === 1) { // 16 bit
                for (j = 0; j < 64; j++) {
                  const z = dctZigZag[j];
                  tableData[z] = readUint16();
                }
              } else {
                throw new Error("DQT: invalid table spec");
 }
              quantizationTables[quantizationTableSpec & 15] = tableData;
            }
            break;

          case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
          case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
          case 0xFFC2: // SOF2 (Start of Frame, Progressive DCT)
            readUint16(); // skip data length
            frame = {};
            // @ts-ignore
            frame.extended = (fileMarker === 0xFFC1);
            // @ts-ignore
            frame.progressive = (fileMarker === 0xFFC2);
            // @ts-ignore
            frame.precision = data[offset++];
            // @ts-ignore
            frame.scanLines = readUint16();
            // @ts-ignore
            frame.samplesPerLine = readUint16();
            // @ts-ignore
            frame.components = {};
            // @ts-ignore
            frame.componentsOrder = [];
            let componentsCount = data[offset++], componentId;
            for (i = 0; i < componentsCount; i++) {
              componentId = data[offset];
              const h = data[offset + 1] >> 4;
              const v = data[offset + 1] & 15;
              const qId = data[offset + 2];
              // @ts-ignore
              frame.componentsOrder.push(componentId);
              // @ts-ignore
              frame.components[componentId] = {
                h: h,
                v: v,
                quantizationIdx: qId
              };
              offset += 3;
            }
            prepareComponents(frame);
            frames.push(frame);
            break;

          case 0xFFC4: // DHT (Define Huffman Tables)
            const huffmanLength = readUint16();
            for (i = 2; i < huffmanLength;) {
              const huffmanTableSpec = data[offset++];
              const codeLengths = new Uint8Array(16);
              let codeLengthSum = 0;
              for (j = 0; j < 16; j++, offset++) {
                codeLengthSum += (codeLengths[j] = data[offset]);
              }
              const huffmanValues = new Uint8Array(codeLengthSum);
              for (j = 0; j < codeLengthSum; j++, offset++) {
                huffmanValues[j] = data[offset];
              }
              i += 17 + codeLengthSum;

              ((huffmanTableSpec >> 4) === 0 ?
              // @ts-ignore
                huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] =
                buildHuffmanTable(codeLengths, huffmanValues);
            }
            break;

          case 0xFFDD: // DRI (Define Restart Interval)
            readUint16(); // skip data length
            resetInterval = readUint16();
            break;

          case 0xFFDA: // SOS (Start of Scan)
            readUint16();
            const selectorsCount = data[offset++];
            let components = [], component;
            for (i = 0; i < selectorsCount; i++) {
              // @ts-ignore
              component = frame.components[data[offset++]];
              const tableSpec = data[offset++];
              // @ts-ignore
              component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
              // @ts-ignore
              component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
              components.push(component);
            }
            const spectralStart = data[offset++];
            const spectralEnd = data[offset++];
            const successiveApproximation = data[offset++];
            const processed = decodeScan(data, offset,
              frame, components, resetInterval,
              spectralStart, spectralEnd,
              successiveApproximation >> 4, successiveApproximation & 15);
            offset += processed;
            break;

          case 0xFFFF: // Fill bytes
            if (data[offset] !== 0xFF) { // Avoid skipping a valid marker.
              offset--;
            }
            break;

          default:
            if (data[offset - 3] == 0xFF &&
                data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
              // could be incorrect encoding -- last 0xFF byte of the previous
              // block was eaten by the encoder
              offset -= 3;
              break;
            }
            throw new Error("unknown JPEG marker " + fileMarker.toString(16));
        }
        fileMarker = readUint16();
      }
      if (frames.length != 1) {
        throw new Error("only single frame JPEGs supported");
      }

      // set each frame's components quantization table
      for (let i = 0; i < frames.length; i++) {
        // @ts-ignore
        const cp = frames[i].components;
        for (const j in cp) {
          cp[j].quantizationTable = quantizationTables[cp[j].quantizationIdx];
          delete cp[j].quantizationIdx;
        }
      }
      // @ts-ignore
      this.width = frame.samplesPerLine;
      // @ts-ignore
      this.height = frame.scanLines;
      this.jfif = jfif;
      this.adobe = adobe;
      this.components = [];
      // @ts-ignore
      for (let i = 0; i < frame.componentsOrder.length; i++) {
        // @ts-ignore
        const component = frame.components[frame.componentsOrder[i]];
        this.components.push({
          lines: buildComponentData(frame, component),
          // @ts-ignore
          scaleX: component.h / frame.maxH,
          // @ts-ignore
          scaleY: component.v / frame.maxV
        });
      }
    },
    // @ts-ignore
    getData: function getData(width, height) {
      const scaleX = this.width / width, scaleY = this.height / height;

      let component1, component2, component3, component4;
      let component1Line, component2Line, component3Line, component4Line;
      let x, y;
      let offset = 0;
      let Y, Cb, Cr, K, C, M, Ye, R, G, B;
      let colorTransform;
      const dataLength = width * height * this.components.length;
      const data = new Uint8Array(dataLength);
      switch (this.components.length) {
        case 1:
          component1 = this.components[0];
          for (y = 0; y < height; y++) {
            component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
            for (x = 0; x < width; x++) {
              Y = component1Line[0 | (x * component1.scaleX * scaleX)];

              data[offset++] = Y;
            }
          }
          break;
        case 2:
          // PDF might compress two component data in custom colorspace
          component1 = this.components[0];
          component2 = this.components[1];
          for (y = 0; y < height; y++) {
            component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
            component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
            for (x = 0; x < width; x++) {
              Y = component1Line[0 | (x * component1.scaleX * scaleX)];
              data[offset++] = Y;
              Y = component2Line[0 | (x * component2.scaleX * scaleX)];
              data[offset++] = Y;
            }
          }
          break;
        case 3:
          // The default transform for three components is true
          colorTransform = true;
          // The adobe transform marker overrides any previous setting
          if (this.adobe && this.adobe.transformCode) {
            colorTransform = true;
          } else if (typeof this.colorTransform !== "undefined") {
            colorTransform = !!this.colorTransform;
 }

          component1 = this.components[0];
          component2 = this.components[1];
          component3 = this.components[2];
          for (y = 0; y < height; y++) {
            component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
            component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
            component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
            for (x = 0; x < width; x++) {
              if (!colorTransform) {
                R = component1Line[0 | (x * component1.scaleX * scaleX)];
                G = component2Line[0 | (x * component2.scaleX * scaleX)];
                B = component3Line[0 | (x * component3.scaleX * scaleX)];
              } else {
                Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                Cr = component3Line[0 | (x * component3.scaleX * scaleX)];

                R = clampTo8bit(Y + 1.402 * (Cr - 128));
                G = clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                B = clampTo8bit(Y + 1.772 * (Cb - 128));
              }

              data[offset++] = R;
              data[offset++] = G;
              data[offset++] = B;
            }
          }
          break;
        case 4:
          if (!this.adobe) {
            throw new Error("Unsupported color mode (4 components)");
          }
          // The default transform for four components is false
          colorTransform = false;
          // The adobe transform marker overrides any previous setting
          if (this.adobe && this.adobe.transformCode) {
            colorTransform = true;
          } else if (typeof this.colorTransform !== "undefined") {
            colorTransform = !!this.colorTransform;
 }

          component1 = this.components[0];
          component2 = this.components[1];
          component3 = this.components[2];
          component4 = this.components[3];
          for (y = 0; y < height; y++) {
            component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
            component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
            component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
            component4Line = component4.lines[0 | (y * component4.scaleY * scaleY)];
            for (x = 0; x < width; x++) {
              if (!colorTransform) {
                C = component1Line[0 | (x * component1.scaleX * scaleX)];
                M = component2Line[0 | (x * component2.scaleX * scaleX)];
                Ye = component3Line[0 | (x * component3.scaleX * scaleX)];
                K = component4Line[0 | (x * component4.scaleX * scaleX)];
              } else {
                Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                Cr = component3Line[0 | (x * component3.scaleX * scaleX)];
                K = component4Line[0 | (x * component4.scaleX * scaleX)];

                C = 255 - clampTo8bit(Y + 1.402 * (Cr - 128));
                M = 255 - clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                Ye = 255 - clampTo8bit(Y + 1.772 * (Cb - 128));
              }
              data[offset++] = 255 - C;
              data[offset++] = 255 - M;
              data[offset++] = 255 - Ye;
              data[offset++] = 255 - K;
            }
          }
          break;
        default:
          throw new Error("Unsupported color mode");
      }
      return data;
    },
    // @ts-ignore
    copyToImageData: function copyToImageData(imageData) {
      const width = imageData.width, height = imageData.height;
      const imageDataArray = imageData.data;
      const data = this.getData(width, height);
      let i = 0, j = 0, x, y;
      let Y, K, C, M, R, G, B;
      switch (this.components.length) {
        case 1:
          for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
              Y = data[i++];

              imageDataArray[j++] = Y;
              imageDataArray[j++] = Y;
              imageDataArray[j++] = Y;
              imageDataArray[j++] = 255;
            }
          }
          break;
        case 3:
          for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
              R = data[i++];
              G = data[i++];
              B = data[i++];

              imageDataArray[j++] = R;
              imageDataArray[j++] = G;
              imageDataArray[j++] = B;
              imageDataArray[j++] = 255;
            }
          }
          break;
        case 4:
          for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
              C = data[i++];
              M = data[i++];
              Y = data[i++];
              K = data[i++];

              R = 255 - clampTo8bit(C * (1 - K / 255) + K);
              G = 255 - clampTo8bit(M * (1 - K / 255) + K);
              B = 255 - clampTo8bit(Y * (1 - K / 255) + K);

              imageDataArray[j++] = R;
              imageDataArray[j++] = G;
              imageDataArray[j++] = B;
              imageDataArray[j++] = 255;
            }
          }
          break;
        default:
          throw new Error("Unsupported color mode");
      }
    }
  };

  return constructor;
})();

export const decode = function (jpegData: Uint8Array, colorTransform: boolean = true): Image {

  const arr = new Uint8Array(jpegData);
  // @ts-ignore
  const decoder = new JpegImage();
  decoder.parse(arr);
  decoder.colorTransform = colorTransform;

  const image = new Image();
  image.height = decoder.height
  image.width = decoder.width
  image.data = new Uint8Array(decoder.width * decoder.height * 4)
  decoder.copyToImageData(image);
  return image;
}
