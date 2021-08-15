// Loaded from https://cdn.skypack.dev/-/ipaddr.js@v2.0.1-Gb4sD7xwOvS6n7C0Ihjk/dist=es2020,mode=imports/optimized/ipaddrjs.js


var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function(path, base) {
      return commonjsRequire(path, base === void 0 || base === null ? module.path : base);
    }
  }, fn(module, module.exports), module.exports;
}
function commonjsRequire() {
  throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
var ipaddr = createCommonjsModule(function(module) {
  (function(root) {
    const ipv4Part = "(0?\\d+|0x[a-f0-9]+)";
    const ipv4Regexes = {
      fourOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
      threeOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
      twoOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}$`, "i"),
      longValue: new RegExp(`^${ipv4Part}$`, "i")
    };
    const octalRegex = new RegExp(`^0[0-7]+$`, "i");
    const hexRegex = new RegExp(`^0x[a-f0-9]+$`, "i");
    const zoneIndex = "%[0-9a-z]{1,}";
    const ipv6Part = "(?:[0-9a-f]+::?)+";
    const ipv6Regexes = {
      zoneIndex: new RegExp(zoneIndex, "i"),
      native: new RegExp(`^(::)?(${ipv6Part})?([0-9a-f]+)?(::)?(${zoneIndex})?$`, "i"),
      deprecatedTransitional: new RegExp(`^(?:::)(${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?)$`, "i"),
      transitional: new RegExp(`^((?:${ipv6Part})|(?:::)(?:${ipv6Part})?)${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?$`, "i")
    };
    function expandIPv6(string, parts) {
      if (string.indexOf("::") !== string.lastIndexOf("::")) {
        return null;
      }
      let colonCount = 0;
      let lastColon = -1;
      let zoneId = (string.match(ipv6Regexes.zoneIndex) || [])[0];
      let replacement, replacementCount;
      if (zoneId) {
        zoneId = zoneId.substring(1);
        string = string.replace(/%.+$/, "");
      }
      while ((lastColon = string.indexOf(":", lastColon + 1)) >= 0) {
        colonCount++;
      }
      if (string.substr(0, 2) === "::") {
        colonCount--;
      }
      if (string.substr(-2, 2) === "::") {
        colonCount--;
      }
      if (colonCount > parts) {
        return null;
      }
      replacementCount = parts - colonCount;
      replacement = ":";
      while (replacementCount--) {
        replacement += "0:";
      }
      string = string.replace("::", replacement);
      if (string[0] === ":") {
        string = string.slice(1);
      }
      if (string[string.length - 1] === ":") {
        string = string.slice(0, -1);
      }
      parts = function() {
        const ref = string.split(":");
        const results = [];
        for (let i = 0; i < ref.length; i++) {
          results.push(parseInt(ref[i], 16));
        }
        return results;
      }();
      return {
        parts,
        zoneId
      };
    }
    function matchCIDR(first, second, partSize, cidrBits) {
      if (first.length !== second.length) {
        throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
      }
      let part = 0;
      let shift;
      while (cidrBits > 0) {
        shift = partSize - cidrBits;
        if (shift < 0) {
          shift = 0;
        }
        if (first[part] >> shift !== second[part] >> shift) {
          return false;
        }
        cidrBits -= partSize;
        part += 1;
      }
      return true;
    }
    function parseIntAuto(string) {
      if (hexRegex.test(string)) {
        return parseInt(string, 16);
      }
      if (string[0] === "0" && !isNaN(parseInt(string[1], 10))) {
        if (octalRegex.test(string)) {
          return parseInt(string, 8);
        }
        throw new Error(`ipaddr: cannot parse ${string} as octal`);
      }
      return parseInt(string, 10);
    }
    function padPart(part, length) {
      while (part.length < length) {
        part = `0${part}`;
      }
      return part;
    }
    const ipaddr2 = {};
    ipaddr2.IPv4 = function() {
      function IPv42(octets) {
        if (octets.length !== 4) {
          throw new Error("ipaddr: ipv4 octet count should be 4");
        }
        let i, octet;
        for (i = 0; i < octets.length; i++) {
          octet = octets[i];
          if (!(0 <= octet && octet <= 255)) {
            throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
          }
        }
        this.octets = octets;
      }
      IPv42.prototype.SpecialRanges = {
        unspecified: [[new IPv42([0, 0, 0, 0]), 8]],
        broadcast: [[new IPv42([255, 255, 255, 255]), 32]],
        multicast: [[new IPv42([224, 0, 0, 0]), 4]],
        linkLocal: [[new IPv42([169, 254, 0, 0]), 16]],
        loopback: [[new IPv42([127, 0, 0, 0]), 8]],
        carrierGradeNat: [[new IPv42([100, 64, 0, 0]), 10]],
        private: [
          [new IPv42([10, 0, 0, 0]), 8],
          [new IPv42([172, 16, 0, 0]), 12],
          [new IPv42([192, 168, 0, 0]), 16]
        ],
        reserved: [
          [new IPv42([192, 0, 0, 0]), 24],
          [new IPv42([192, 0, 2, 0]), 24],
          [new IPv42([192, 88, 99, 0]), 24],
          [new IPv42([198, 51, 100, 0]), 24],
          [new IPv42([203, 0, 113, 0]), 24],
          [new IPv42([240, 0, 0, 0]), 4]
        ]
      };
      IPv42.prototype.kind = function() {
        return "ipv4";
      };
      IPv42.prototype.match = function(other, cidrRange) {
        let ref;
        if (cidrRange === void 0) {
          ref = other;
          other = ref[0];
          cidrRange = ref[1];
        }
        if (other.kind() !== "ipv4") {
          throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
        }
        return matchCIDR(this.octets, other.octets, 8, cidrRange);
      };
      IPv42.prototype.prefixLengthFromSubnetMask = function() {
        let cidr = 0;
        let stop = false;
        const zerotable = {
          0: 8,
          128: 7,
          192: 6,
          224: 5,
          240: 4,
          248: 3,
          252: 2,
          254: 1,
          255: 0
        };
        let i, octet, zeros;
        for (i = 3; i >= 0; i -= 1) {
          octet = this.octets[i];
          if (octet in zerotable) {
            zeros = zerotable[octet];
            if (stop && zeros !== 0) {
              return null;
            }
            if (zeros !== 8) {
              stop = true;
            }
            cidr += zeros;
          } else {
            return null;
          }
        }
        return 32 - cidr;
      };
      IPv42.prototype.range = function() {
        return ipaddr2.subnetMatch(this, this.SpecialRanges);
      };
      IPv42.prototype.toByteArray = function() {
        return this.octets.slice(0);
      };
      IPv42.prototype.toIPv4MappedAddress = function() {
        return ipaddr2.IPv6.parse(`::ffff:${this.toString()}`);
      };
      IPv42.prototype.toNormalizedString = function() {
        return this.toString();
      };
      IPv42.prototype.toString = function() {
        return this.octets.join(".");
      };
      return IPv42;
    }();
    ipaddr2.IPv4.broadcastAddressFromCIDR = function(string) {
      try {
        const cidr = this.parseCIDR(string);
        const ipInterfaceOctets = cidr[0].toByteArray();
        const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
        const octets = [];
        let i = 0;
        while (i < 4) {
          octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
          i++;
        }
        return new this(octets);
      } catch (e) {
        throw new Error("ipaddr: the address does not have IPv4 CIDR format");
      }
    };
    ipaddr2.IPv4.isIPv4 = function(string) {
      return this.parser(string) !== null;
    };
    ipaddr2.IPv4.isValid = function(string) {
      try {
        new this(this.parser(string));
        return true;
      } catch (e) {
        return false;
      }
    };
    ipaddr2.IPv4.isValidFourPartDecimal = function(string) {
      if (ipaddr2.IPv4.isValid(string) && string.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/)) {
        return true;
      } else {
        return false;
      }
    };
    ipaddr2.IPv4.networkAddressFromCIDR = function(string) {
      let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
      try {
        cidr = this.parseCIDR(string);
        ipInterfaceOctets = cidr[0].toByteArray();
        subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
        octets = [];
        i = 0;
        while (i < 4) {
          octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
          i++;
        }
        return new this(octets);
      } catch (e) {
        throw new Error("ipaddr: the address does not have IPv4 CIDR format");
      }
    };
    ipaddr2.IPv4.parse = function(string) {
      const parts = this.parser(string);
      if (parts === null) {
        throw new Error("ipaddr: string is not formatted like an IPv4 Address");
      }
      return new this(parts);
    };
    ipaddr2.IPv4.parseCIDR = function(string) {
      let match;
      if (match = string.match(/^(.+)\/(\d+)$/)) {
        const maskLength = parseInt(match[2]);
        if (maskLength >= 0 && maskLength <= 32) {
          const parsed = [this.parse(match[1]), maskLength];
          Object.defineProperty(parsed, "toString", {
            value: function() {
              return this.join("/");
            }
          });
          return parsed;
        }
      }
      throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
    };
    ipaddr2.IPv4.parser = function(string) {
      let match, part, value;
      if (match = string.match(ipv4Regexes.fourOctet)) {
        return function() {
          const ref = match.slice(1, 6);
          const results = [];
          for (let i = 0; i < ref.length; i++) {
            part = ref[i];
            results.push(parseIntAuto(part));
          }
          return results;
        }();
      } else if (match = string.match(ipv4Regexes.longValue)) {
        value = parseIntAuto(match[1]);
        if (value > 4294967295 || value < 0) {
          throw new Error("ipaddr: address outside defined range");
        }
        return function() {
          const results = [];
          let shift;
          for (shift = 0; shift <= 24; shift += 8) {
            results.push(value >> shift & 255);
          }
          return results;
        }().reverse();
      } else if (match = string.match(ipv4Regexes.twoOctet)) {
        return function() {
          const ref = match.slice(1, 4);
          const results = [];
          value = parseIntAuto(ref[1]);
          if (value > 16777215 || value < 0) {
            throw new Error("ipaddr: address outside defined range");
          }
          results.push(parseIntAuto(ref[0]));
          results.push(value >> 16 & 255);
          results.push(value >> 8 & 255);
          results.push(value & 255);
          return results;
        }();
      } else if (match = string.match(ipv4Regexes.threeOctet)) {
        return function() {
          const ref = match.slice(1, 5);
          const results = [];
          value = parseIntAuto(ref[2]);
          if (value > 65535 || value < 0) {
            throw new Error("ipaddr: address outside defined range");
          }
          results.push(parseIntAuto(ref[0]));
          results.push(parseIntAuto(ref[1]));
          results.push(value >> 8 & 255);
          results.push(value & 255);
          return results;
        }();
      } else {
        return null;
      }
    };
    ipaddr2.IPv4.subnetMaskFromPrefixLength = function(prefix) {
      prefix = parseInt(prefix);
      if (prefix < 0 || prefix > 32) {
        throw new Error("ipaddr: invalid IPv4 prefix length");
      }
      const octets = [0, 0, 0, 0];
      let j = 0;
      const filledOctetCount = Math.floor(prefix / 8);
      while (j < filledOctetCount) {
        octets[j] = 255;
        j++;
      }
      if (filledOctetCount < 4) {
        octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;
      }
      return new this(octets);
    };
    ipaddr2.IPv6 = function() {
      function IPv62(parts, zoneId) {
        let i, part;
        if (parts.length === 16) {
          this.parts = [];
          for (i = 0; i <= 14; i += 2) {
            this.parts.push(parts[i] << 8 | parts[i + 1]);
          }
        } else if (parts.length === 8) {
          this.parts = parts;
        } else {
          throw new Error("ipaddr: ipv6 part count should be 8 or 16");
        }
        for (i = 0; i < this.parts.length; i++) {
          part = this.parts[i];
          if (!(0 <= part && part <= 65535)) {
            throw new Error("ipaddr: ipv6 part should fit in 16 bits");
          }
        }
        if (zoneId) {
          this.zoneId = zoneId;
        }
      }
      IPv62.prototype.SpecialRanges = {
        unspecified: [new IPv62([0, 0, 0, 0, 0, 0, 0, 0]), 128],
        linkLocal: [new IPv62([65152, 0, 0, 0, 0, 0, 0, 0]), 10],
        multicast: [new IPv62([65280, 0, 0, 0, 0, 0, 0, 0]), 8],
        loopback: [new IPv62([0, 0, 0, 0, 0, 0, 0, 1]), 128],
        uniqueLocal: [new IPv62([64512, 0, 0, 0, 0, 0, 0, 0]), 7],
        ipv4Mapped: [new IPv62([0, 0, 0, 0, 0, 65535, 0, 0]), 96],
        rfc6145: [new IPv62([0, 0, 0, 0, 65535, 0, 0, 0]), 96],
        rfc6052: [new IPv62([100, 65435, 0, 0, 0, 0, 0, 0]), 96],
        "6to4": [new IPv62([8194, 0, 0, 0, 0, 0, 0, 0]), 16],
        teredo: [new IPv62([8193, 0, 0, 0, 0, 0, 0, 0]), 32],
        reserved: [[new IPv62([8193, 3512, 0, 0, 0, 0, 0, 0]), 32]]
      };
      IPv62.prototype.isIPv4MappedAddress = function() {
        return this.range() === "ipv4Mapped";
      };
      IPv62.prototype.kind = function() {
        return "ipv6";
      };
      IPv62.prototype.match = function(other, cidrRange) {
        let ref;
        if (cidrRange === void 0) {
          ref = other;
          other = ref[0];
          cidrRange = ref[1];
        }
        if (other.kind() !== "ipv6") {
          throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
        }
        return matchCIDR(this.parts, other.parts, 16, cidrRange);
      };
      IPv62.prototype.prefixLengthFromSubnetMask = function() {
        let cidr = 0;
        let stop = false;
        const zerotable = {
          0: 16,
          32768: 15,
          49152: 14,
          57344: 13,
          61440: 12,
          63488: 11,
          64512: 10,
          65024: 9,
          65280: 8,
          65408: 7,
          65472: 6,
          65504: 5,
          65520: 4,
          65528: 3,
          65532: 2,
          65534: 1,
          65535: 0
        };
        let part, zeros;
        for (let i = 7; i >= 0; i -= 1) {
          part = this.parts[i];
          if (part in zerotable) {
            zeros = zerotable[part];
            if (stop && zeros !== 0) {
              return null;
            }
            if (zeros !== 16) {
              stop = true;
            }
            cidr += zeros;
          } else {
            return null;
          }
        }
        return 128 - cidr;
      };
      IPv62.prototype.range = function() {
        return ipaddr2.subnetMatch(this, this.SpecialRanges);
      };
      IPv62.prototype.toByteArray = function() {
        let part;
        const bytes = [];
        const ref = this.parts;
        for (let i = 0; i < ref.length; i++) {
          part = ref[i];
          bytes.push(part >> 8);
          bytes.push(part & 255);
        }
        return bytes;
      };
      IPv62.prototype.toFixedLengthString = function() {
        const addr = function() {
          const results = [];
          for (let i = 0; i < this.parts.length; i++) {
            results.push(padPart(this.parts[i].toString(16), 4));
          }
          return results;
        }.call(this).join(":");
        let suffix = "";
        if (this.zoneId) {
          suffix = `%${this.zoneId}`;
        }
        return addr + suffix;
      };
      IPv62.prototype.toIPv4Address = function() {
        if (!this.isIPv4MappedAddress()) {
          throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
        }
        const ref = this.parts.slice(-2);
        const high = ref[0];
        const low = ref[1];
        return new ipaddr2.IPv4([high >> 8, high & 255, low >> 8, low & 255]);
      };
      IPv62.prototype.toNormalizedString = function() {
        const addr = function() {
          const results = [];
          for (let i = 0; i < this.parts.length; i++) {
            results.push(this.parts[i].toString(16));
          }
          return results;
        }.call(this).join(":");
        let suffix = "";
        if (this.zoneId) {
          suffix = `%${this.zoneId}`;
        }
        return addr + suffix;
      };
      IPv62.prototype.toRFC5952String = function() {
        const regex = /((^|:)(0(:|$)){2,})/g;
        const string = this.toNormalizedString();
        let bestMatchIndex = 0;
        let bestMatchLength = -1;
        let match;
        while (match = regex.exec(string)) {
          if (match[0].length > bestMatchLength) {
            bestMatchIndex = match.index;
            bestMatchLength = match[0].length;
          }
        }
        if (bestMatchLength < 0) {
          return string;
        }
        return `${string.substring(0, bestMatchIndex)}::${string.substring(bestMatchIndex + bestMatchLength)}`;
      };
      IPv62.prototype.toString = function() {
        return this.toNormalizedString().replace(/((^|:)(0(:|$))+)/, "::");
      };
      return IPv62;
    }();
    ipaddr2.IPv6.broadcastAddressFromCIDR = function(string) {
      try {
        const cidr = this.parseCIDR(string);
        const ipInterfaceOctets = cidr[0].toByteArray();
        const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
        const octets = [];
        let i = 0;
        while (i < 16) {
          octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
          i++;
        }
        return new this(octets);
      } catch (e) {
        throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${e})`);
      }
    };
    ipaddr2.IPv6.isIPv6 = function(string) {
      return this.parser(string) !== null;
    };
    ipaddr2.IPv6.isValid = function(string) {
      if (typeof string === "string" && string.indexOf(":") === -1) {
        return false;
      }
      try {
        const addr = this.parser(string);
        new this(addr.parts, addr.zoneId);
        return true;
      } catch (e) {
        return false;
      }
    };
    ipaddr2.IPv6.networkAddressFromCIDR = function(string) {
      let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
      try {
        cidr = this.parseCIDR(string);
        ipInterfaceOctets = cidr[0].toByteArray();
        subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
        octets = [];
        i = 0;
        while (i < 16) {
          octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
          i++;
        }
        return new this(octets);
      } catch (e) {
        throw new Error(`ipaddr: the address does not have IPv6 CIDR format (${e})`);
      }
    };
    ipaddr2.IPv6.parse = function(string) {
      const addr = this.parser(string);
      if (addr.parts === null) {
        throw new Error("ipaddr: string is not formatted like an IPv6 Address");
      }
      return new this(addr.parts, addr.zoneId);
    };
    ipaddr2.IPv6.parseCIDR = function(string) {
      let maskLength, match, parsed;
      if (match = string.match(/^(.+)\/(\d+)$/)) {
        maskLength = parseInt(match[2]);
        if (maskLength >= 0 && maskLength <= 128) {
          parsed = [this.parse(match[1]), maskLength];
          Object.defineProperty(parsed, "toString", {
            value: function() {
              return this.join("/");
            }
          });
          return parsed;
        }
      }
      throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
    };
    ipaddr2.IPv6.parser = function(string) {
      let addr, i, match, octet, octets, zoneId;
      if (match = string.match(ipv6Regexes.deprecatedTransitional)) {
        return this.parser(`::ffff:${match[1]}`);
      }
      if (ipv6Regexes.native.test(string)) {
        return expandIPv6(string, 8);
      }
      if (match = string.match(ipv6Regexes.transitional)) {
        zoneId = match[6] || "";
        addr = expandIPv6(match[1].slice(0, -1) + zoneId, 6);
        if (addr.parts) {
          octets = [
            parseInt(match[2]),
            parseInt(match[3]),
            parseInt(match[4]),
            parseInt(match[5])
          ];
          for (i = 0; i < octets.length; i++) {
            octet = octets[i];
            if (!(0 <= octet && octet <= 255)) {
              return null;
            }
          }
          addr.parts.push(octets[0] << 8 | octets[1]);
          addr.parts.push(octets[2] << 8 | octets[3]);
          return {
            parts: addr.parts,
            zoneId: addr.zoneId
          };
        }
      }
      return null;
    };
    ipaddr2.IPv6.subnetMaskFromPrefixLength = function(prefix) {
      prefix = parseInt(prefix);
      if (prefix < 0 || prefix > 128) {
        throw new Error("ipaddr: invalid IPv6 prefix length");
      }
      const octets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let j = 0;
      const filledOctetCount = Math.floor(prefix / 8);
      while (j < filledOctetCount) {
        octets[j] = 255;
        j++;
      }
      if (filledOctetCount < 16) {
        octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;
      }
      return new this(octets);
    };
    ipaddr2.fromByteArray = function(bytes) {
      const length = bytes.length;
      if (length === 4) {
        return new ipaddr2.IPv4(bytes);
      } else if (length === 16) {
        return new ipaddr2.IPv6(bytes);
      } else {
        throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
      }
    };
    ipaddr2.isValid = function(string) {
      return ipaddr2.IPv6.isValid(string) || ipaddr2.IPv4.isValid(string);
    };
    ipaddr2.parse = function(string) {
      if (ipaddr2.IPv6.isValid(string)) {
        return ipaddr2.IPv6.parse(string);
      } else if (ipaddr2.IPv4.isValid(string)) {
        return ipaddr2.IPv4.parse(string);
      } else {
        throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
      }
    };
    ipaddr2.parseCIDR = function(string) {
      try {
        return ipaddr2.IPv6.parseCIDR(string);
      } catch (e) {
        try {
          return ipaddr2.IPv4.parseCIDR(string);
        } catch (e2) {
          throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format");
        }
      }
    };
    ipaddr2.process = function(string) {
      const addr = this.parse(string);
      if (addr.kind() === "ipv6" && addr.isIPv4MappedAddress()) {
        return addr.toIPv4Address();
      } else {
        return addr;
      }
    };
    ipaddr2.subnetMatch = function(address, rangeList, defaultName) {
      let i, rangeName, rangeSubnets, subnet;
      if (defaultName === void 0 || defaultName === null) {
        defaultName = "unicast";
      }
      for (rangeName in rangeList) {
        if (Object.prototype.hasOwnProperty.call(rangeList, rangeName)) {
          rangeSubnets = rangeList[rangeName];
          if (rangeSubnets[0] && !(rangeSubnets[0] instanceof Array)) {
            rangeSubnets = [rangeSubnets];
          }
          for (i = 0; i < rangeSubnets.length; i++) {
            subnet = rangeSubnets[i];
            if (address.kind() === subnet[0].kind() && address.match.apply(address, subnet)) {
              return rangeName;
            }
          }
        }
      }
      return defaultName;
    };
    if (module.exports) {
      module.exports = ipaddr2;
    } else {
      root.ipaddr = ipaddr2;
    }
  })(commonjsGlobal);
});
var IPv4 = ipaddr.IPv4;
var IPv6 = ipaddr.IPv6;
export default ipaddr;
var fromByteArray = ipaddr.fromByteArray;
var isValid = ipaddr.isValid;
var parse = ipaddr.parse;
var parseCIDR = ipaddr.parseCIDR;
var process = ipaddr.process;
var subnetMatch = ipaddr.subnetMatch;
export {IPv4, IPv6, ipaddr as __moduleExports, fromByteArray, isValid, parse, parseCIDR, process, subnetMatch};
