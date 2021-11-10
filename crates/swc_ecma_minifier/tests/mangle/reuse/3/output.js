const a = new TextEncoder();
function b(b) {
    return a.encode(b);
}
new TextDecoder();
const c = globalThis.Deno?.noColor ?? true;
let d = !c;
function e(a, b) {
    return {
        open: `\x1b[${a.join(";")}m`,
        close: `\x1b[${b}m`,
        regexp: new RegExp(`\\x1b\\[${b}m`, "g")
    };
}
function f(a, b) {
    return d ? `${b.open}${a.replace(b.regexp, b.open)}${b.close}` : a;
}
function g(a) {
    return f(a, e([
        1
    ], 22));
}
function h(a) {
    return f(a, e([
        2
    ], 22));
}
function i(a) {
    return f(a, e([
        31
    ], 39));
}
function j(a) {
    return f(a, e([
        32
    ], 39));
}
function k(a) {
    return f(a, e([
        33
    ], 39));
}
function l(a) {
    return f(a, e([
        34
    ], 39));
}
function m(a) {
    return f(a, e([
        35
    ], 39));
}
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
const n = /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g;
const o = /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g;
const p = /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;
const q = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            İ: '\u0069',
            I: '\u0131'
        }
    },
    az: {
        regexp: /[\u0130]/g,
        map: {
            İ: '\u0069',
            I: '\u0131'
        }
    },
    lt: {
        regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
        map: {
            I: '\u0069\u0307',
            J: '\u006A\u0307',
            Į: '\u012F\u0307',
            Ì: '\u0069\u0307\u0300',
            Í: '\u0069\u0307\u0301',
            Ĩ: '\u0069\u0307\u0303'
        }
    }
};
function r(a, b) {
    const c = b && q[b];
    a = a == null ? '' : String(a);
    if (c) {
        a = a.replace(c.regexp, (a)=>c.map[a]
        );
    }
    return a.toLowerCase();
}
function s(a, b, c) {
    if (a == null) {
        return '';
    }
    c = typeof c !== 'string' ? ' ' : c;
    function d(a, b, d) {
        if (b === 0 || b === d.length - a.length) {
            return '';
        }
        return c || '';
    }
    a = String(a).replace(n, '$1 $2').replace(o, '$1 $2').replace(p, d);
    return r(a, b);
}
const t = {
    tr: {
        regexp: /[\u0069]/g,
        map: {
            i: '\u0130'
        }
    },
    az: {
        regexp: /[\u0069]/g,
        map: {
            i: '\u0130'
        }
    },
    lt: {
        regexp: /[\u0069\u006A\u012F]\u0307|\u0069\u0307[\u0300\u0301\u0303]/g,
        map: {
            i̇: '\u0049',
            j̇: '\u004A',
            į̇: '\u012E',
            i̇̀: '\u00CC',
            i̇́: '\u00CD',
            i̇̃: '\u0128'
        }
    }
};
function u(a, b) {
    const c = b && t[b];
    a = a == null ? '' : String(a);
    if (c) {
        a = a.replace(c.regexp, function(a) {
            return c.map[a];
        });
    }
    return a.toUpperCase();
}
function v(a, b, c) {
    let d = s(a, b);
    if (!c) {
        d = d.replace(/ (?=\d)/g, '_');
    }
    return d.replace(/ (.)/g, function(a, c) {
        return u(c, b);
    });
}
function w(a, b) {
    return s(a, b, '-');
}
function x(a) {
    const b = [];
    let c = false;
    for (const d of a){
        if (c) {
            b.push(d);
        } else if (d === '--') {
            c = true;
            b.push(d);
        } else if (d[0] === '-') {
            const e = d[1] === '-';
            if (d.includes('=')) {
                const f = d.split('=');
                const g = f.shift();
                if (e) {
                    b.push(g);
                } else {
                    h(g);
                }
                b.push(f.join('='));
            } else if (e) {
                b.push(d);
            } else {
                h(d);
            }
        } else {
            b.push(d);
        }
    }
    return b;
    function h(a) {
        const c = a.slice(1).split('');
        if (isNaN(a[a.length - 1])) {
            c.forEach((a)=>b.push(`-${a}`)
            );
        } else {
            b.push(`-${c.shift()}`);
            b.push(c.join(''));
        }
    }
}
var y;
(function(a) {
    a["STRING"] = 'string';
    a["NUMBER"] = 'number';
    a["BOOLEAN"] = 'boolean';
})(y || (y = {
}));
const z = (a, b, c)=>{
    if (~[
        '1',
        'true'
    ].indexOf(c)) {
        return true;
    }
    if (~[
        '0',
        'false'
    ].indexOf(c)) {
        return false;
    }
    throw new Error(`Option --${a.name} must be of type boolean but got: ${c}`);
};
const A = (a, b, c)=>{
    if (isNaN(c)) {
        throw new Error(`Option --${a.name} must be of type number but got: ${c}`);
    }
    return parseFloat(c);
};
const B = (a, b, c)=>{
    return c;
};
const C = {
    [y.STRING]: B,
    [y.NUMBER]: A,
    [y.BOOLEAN]: z
};
function D(a, b) {
    while(b[0] === '-'){
        b = b.slice(1);
    }
    for (const c of a){
        if (H(c, b)) {
            return c;
        }
    }
    return;
}
function E(a, b, c, d) {
    const e = {
    };
    for (const f of a){
        const g = v(f.name);
        if (typeof b[g] === 'undefined' && typeof f.default !== 'undefined') {
            b[g] = typeof f.default === 'function' ? f.default() : f.default;
            e[g] = true;
        }
    }
    const h = Object.keys(b);
    if (h.length === 0 && d) {
        return;
    }
    const i = h.map((b)=>({
            name: b,
            option: D(a, w(b))
        })
    );
    for (const { name: j , option: k  } of i){
        if (!k) {
            throw new Error('Unknown option: --' + j);
        }
        if (k.standalone) {
            if (h.length > 1) {
                if (i.every(({ option: a  })=>a && (k === a || e[a.name])
                )) {
                    return;
                }
                throw new Error(`Option --${k.name} cannot be combined with other options.`);
            }
            return;
        }
        k.conflicts?.forEach((a)=>{
            if (m(a)) {
                throw new Error(`Option --${k.name} conflicts with option: --${a}`);
            }
        });
        k.depends?.forEach((a)=>{
            if (!m(a) && !e[k.name]) {
                throw new Error(`Option --${k.name} depends on option: --${a}`);
            }
        });
        const l = (k.args?.length || 0) > 1;
        k.args?.forEach((a, c)=>{
            if (a.requiredValue && (typeof b[j] === 'undefined' || l && typeof b[j][c] === 'undefined')) {
                throw new Error(`Missing value for option: --${k.name}`);
            }
        });
        function m(a) {
            const c = v(a);
            return typeof b[c] !== 'undefined';
        }
    }
    for (const n of a){
        if (n.required && !(v(n.name) in b)) {
            if ((!n.conflicts || !n.conflicts.find((a)=>!!b[a]
            )) && !i.find((a)=>a.option?.conflicts?.find((a)=>a === n.name
                )
            )) {
                throw new Error(`Missing required option: --${n.name}`);
            }
        }
    }
    if (h.length === 0 && !d) {
        throw new Error('No arguments.');
    }
}
function F(a, b = {
}) {
    !b.flags && (b.flags = []);
    const c = x(a);
    let d = false;
    let e = false;
    const f = {
    };
    const g = [];
    const h = [];
    let i = false;
    b.flags.forEach((a)=>{
        a.depends?.forEach((a)=>{
            if (!b.flags || !D(b.flags, a)) {
                throw new Error(`Unknown required option: ${a}`);
            }
        });
        a.conflicts?.forEach((a)=>{
            if (!b.flags || !D(b.flags, a)) {
                throw new Error(`Unknown conflicting option: ${a}`);
            }
        });
    });
    for(let j = 0; j < c.length; j++){
        let k;
        let l;
        const m = c[j];
        if (d) {
            g.push(m);
            continue;
        }
        if (m === '--') {
            d = true;
            continue;
        }
        const n = m.length > 1 && m[0] === '-';
        const o = ()=>c[j + 1]
        ;
        if (n && !i) {
            if (m[2] === '-' || m[1] === '-' && m.length === 3) {
                throw new Error(`Invalid flag name: ${m}`);
            }
            e = m.indexOf('--no-') === 0;
            const p = m.replace(/^-+(no-)?/, '');
            k = D(b.flags, p);
            if (!k) {
                if (b.flags.length) {
                    throw new Error(`Unknown option: ${m}`);
                }
                k = {
                    name: p,
                    optionalValue: true,
                    type: y.STRING
                };
            }
            if (!k.name) {
                throw new Error(`Missing name for option: ${m}`);
            }
            const q = v(k.name);
            if (typeof f[q] !== 'undefined' && !k.collect) {
                throw new Error(`Duplicate option: ${m}`);
            }
            l = k.args?.length ? k.args : [
                {
                    type: k.type,
                    requiredValue: k.requiredValue,
                    optionalValue: k.optionalValue,
                    variadic: k.variadic,
                    list: k.list,
                    separator: k.separator
                }
            ];
            let r = 0;
            let s = false;
            const t = f[q];
            w(k, l);
            if (typeof f[q] === 'undefined') {
                if (typeof k.default !== 'undefined') {
                    f[q] = typeof k.default === 'function' ? k.default() : k.default;
                } else if (l[r].requiredValue) {
                    throw new Error(`Missing value for option: --${k.name}`);
                } else {
                    f[q] = true;
                }
            }
            if (typeof k.value !== 'undefined') {
                f[q] = k.value(f[q], t);
            } else if (k.collect) {
                const u = t || [];
                u.push(f[q]);
                f[q] = u;
            }
            function w(a, d) {
                const g = d[r];
                if (!g) {
                    throw new Error('Unknown option: ' + o());
                }
                if (!g.type) {
                    g.type = y.BOOLEAN;
                }
                if (a.args?.length) {
                    if ((typeof g.optionalValue === 'undefined' || g.optionalValue === false) && typeof g.requiredValue === 'undefined') {
                        g.requiredValue = true;
                    }
                } else {
                    if (g.type !== y.BOOLEAN && (typeof g.optionalValue === 'undefined' || g.optionalValue === false) && typeof g.requiredValue === 'undefined') {
                        g.requiredValue = true;
                    }
                }
                if (g.requiredValue) {
                    if (s) {
                        throw new Error(`An required argument can not follow an optional argument but found in: ${a.name}`);
                    }
                } else {
                    s = true;
                }
                if (e) {
                    if (g.type !== y.BOOLEAN && !g.optionalValue) {
                        throw new Error(`Negate not supported by --${a.name}. Only optional option or options of type boolean can be negated.`);
                    }
                    f[q] = false;
                    return;
                }
                let h;
                let i = false;
                if (g.list && l(g)) {
                    const k = o().split(g.separator || ',').map((b)=>{
                        const c = m(a, g, b);
                        if (typeof c === 'undefined') {
                            throw new Error(`List item of option --${a?.name} must be of type ${g.type} but got: ${b}`);
                        }
                        return c;
                    });
                    if (k?.length) {
                        h = k;
                    }
                } else {
                    if (l(g)) {
                        h = m(a, g, o());
                    } else if (g.optionalValue && g.type === y.BOOLEAN) {
                        h = true;
                    }
                }
                if (i) {
                    j++;
                    if (!g.variadic) {
                        r++;
                    } else if (d[r + 1]) {
                        throw new Error('An argument cannot follow an variadic argument: ' + o());
                    }
                }
                if (typeof h !== 'undefined' && (d.length > 1 || g.variadic)) {
                    if (!f[q]) {
                        f[q] = [];
                    }
                    f[q].push(h);
                    if (l(g)) {
                        w(a, d);
                    }
                } else {
                    f[q] = h;
                }
                function l(a) {
                    return !!(c[j + 1] && (a.optionalValue || a.requiredValue || a.variadic) && (c[j + 1][0] !== '-' || a.type === y.NUMBER && !isNaN(c[j + 1])) && a);
                }
                function m(a, c, d) {
                    let e = b.parse ? b.parse(c.type || y.STRING, a, c, d) : G(a, c, d);
                    if (typeof e !== 'undefined') {
                        i = true;
                    }
                    return e;
                }
            }
        } else {
            if (b.stopEarly) {
                i = true;
            }
            h.push(m);
        }
    }
    if (b.flags && b.flags.length) {
        E(b.flags, f, b.knownFlaks, b.allowEmpty);
    }
    return {
        flags: f,
        unknown: h,
        literal: g
    };
}
function G(a, b, c) {
    const d = C[b.type || y.STRING];
    if (!d) {
        throw new Error(`Unknown type ${b.type}`);
    }
    return d(a, b, c);
}
function H(a, b) {
    return a.name === b || a.aliases && a.aliases.indexOf(b) !== -1;
}
function I(a, b = '', c = ' ') {
    while(b.length < a){
        b += c;
    }
    return b;
}
const { inspect: J  } = Deno;
const K = /%[sdjoO%]/g;
function L(...a) {
    if (typeof a[0] !== 'string') {
        let b = [];
        for(let c = 0; c < arguments.length; c++){
            b.push(J(arguments[c]));
        }
        return b.join(' ');
    }
    let d = 1;
    const e = a[0];
    const f = a.length;
    let g = String(e).replace(K, function(b) {
        if (b === '%%') {
            return '%';
        }
        if (d >= f) {
            return b;
        }
        switch(b){
            case '%s':
                return String(a[d++]);
            case '%d':
                return String(Number(a[d++]));
            case '%j':
                try {
                    return JSON.stringify(a[d++]);
                } catch (c) {
                    return '[Circular]';
                }
            case '%o':
            case '%O':
                return J(a[d++]);
            default:
                return b;
        }
    });
    for(let h = a[d]; d < f; h = a[++d]){
        if (h == null || typeof h !== 'object') {
            g += ' ' + h;
        } else {
            g += ' ' + J(h);
        }
    }
    return g;
}
class M {
}
class N extends M {
    parse(O, P, Q) {
        return z(O, P, Q);
    }
    complete() {
        return [
            'true',
            'false'
        ];
    }
}
class R extends M {
    parse(S, T, U) {
        return A(S, T, U);
    }
}
class V extends M {
    parse(W, X, Y) {
        return B(W, X, Y);
    }
}
class Z {
    static splitArguments($) {
        const _ = $.trim().split(/[, =] */g);
        const aa = [];
        while(_[_.length - 1] && this.ARGUMENT_REGEX.test(_[_.length - 1])){
            aa.unshift(_.pop());
        }
        const ba = aa.join(' ');
        return {
            args: _,
            typeDefinition: ba
        };
    }
    static parseArgumentsDefinition(ca) {
        const da = [];
        let ea = false;
        let fa = false;
        const ga = ca.split(/ +/);
        for (const ha of ga){
            if (fa) {
                throw new Error('An argument can not follow an variadic argument.');
            }
            const ia = ha.split(this.ARGUMENT_DETAILS_REGEX);
            const ja = ia[2] || y.STRING;
            let ka = {
                optionalValue: ha[0] !== '<',
                name: ia[1],
                action: ia[3] || ja,
                variadic: false,
                list: ja ? ha.indexOf(ja + '[]') !== -1 : false,
                type: ja
            };
            if (!ka.optionalValue && ea) {
                throw new Error('An required argument can not follow an optional argument.');
            }
            if (ha[0] === '[') {
                ea = true;
            }
            if (ka.name.length > 3) {
                const la = ka.name.slice(0, 3) === '...';
                const ma = ka.name.slice(-3) === '...';
                fa = ka.variadic = la || ma;
                if (la) {
                    ka.name = ka.name.slice(3);
                } else if (ma) {
                    ka.name = ka.name.slice(0, -3);
                }
            }
            if (ka.name) {
                da.push(ka);
            }
        }
        return da;
    }
    static highlightArguments(na) {
        if (!na) {
            return '';
        }
        return this.parseArgumentsDefinition(na).map((a)=>this.highlightArgumentDetails(a)
        ).join(' ');
    }
    static highlightArgumentDetails(oa) {
        let pa = '';
        pa += k(oa.optionalValue ? '[' : '<');
        let qa = '';
        qa += oa.name;
        if (oa.variadic) {
            qa += '...';
        }
        qa = m(qa);
        pa += qa;
        pa += k(':');
        pa += i(oa.type);
        if (oa.list) {
            pa += j('[]');
        }
        pa += k(oa.optionalValue ? ']' : '>');
        return pa;
    }
}
Z.ARGUMENT_REGEX = /^[<\[].+[\]>]$/;
Z.ARGUMENT_DETAILS_REGEX = /[<\[:>\]]/;
const ra = {
    top: '─',
    topMid: '┬',
    topLeft: '┌',
    topRight: '┐',
    bottom: '─',
    bottomMid: '┴',
    bottomLeft: '└',
    bottomRight: '┘',
    left: '│',
    leftMid: '├',
    mid: '─',
    midMid: '┼',
    right: '│',
    rightMid: '┤',
    middle: '│'
};
class sa {
    get length() {
        return this.toString().length;
    }
    static from(ta) {
        const ua = new this(ta);
        if (ta instanceof sa) {
            ua.options = Object.assign({
            }, ta.options);
        }
        return ua;
    }
    constructor(va){
        this.value = va;
        this.options = {
        };
    }
    toString() {
        return this.value.toString();
    }
    setValue(wa) {
        this.value = wa;
        return this;
    }
    clone(xa) {
        const ya = new sa(xa ?? this);
        ya.options = Object.assign({
        }, this.options);
        return ya;
    }
    border(za, Aa = true) {
        if (Aa || typeof this.options.border === 'undefined') {
            this.options.border = za;
        }
        return this;
    }
    colSpan(Ba, Ca = true) {
        if (Ca || typeof this.options.colSpan === 'undefined') {
            this.options.colSpan = Ba;
        }
        return this;
    }
    rowSpan(Da, Ea = true) {
        if (Ea || typeof this.options.rowSpan === 'undefined') {
            this.options.rowSpan = Da;
        }
        return this;
    }
    getBorder() {
        return this.options.border === true;
    }
    getColSpan() {
        return typeof this.options.colSpan === 'number' && this.options.colSpan > 0 ? this.options.colSpan : 1;
    }
    getRowSpan() {
        return typeof this.options.rowSpan === 'number' && this.options.rowSpan > 0 ? this.options.rowSpan : 1;
    }
}
class Fa extends Array {
    static from(Ga) {
        const Ha = new this(...Ga);
        if (Ga instanceof Fa) {
            Ha.options = Object.assign({
            }, Ga.options);
        }
        return Ha;
    }
    clone() {
        const Ia = new Fa(...this.map((a)=>a instanceof sa ? a.clone() : a
        ));
        Ia.options = Object.assign({
        }, this.options);
        return Ia;
    }
    border(Ja, Ka = true) {
        if (Ka || typeof this.options.border === 'undefined') {
            this.options.border = Ja;
        }
        return this;
    }
    getBorder() {
        return this.options.border === true;
    }
    hasBorder() {
        return this.getBorder() || this.some((a)=>a instanceof sa && a.getBorder()
        );
    }
    constructor(...La){
        super(...La);
        this.options = {
        };
    }
}
function Ma(a, b) {
    let c = '';
    const d = b.split(/ /g);
    for(let e = 0; e < d.length; e++){
        let f = d[e];
        let g = f.indexOf('\n') !== -1;
        if (g) {
            f = f.split('\n').shift();
        }
        if (c) {
            const h = Oa(f).length;
            const i = Oa(c).length;
            if (i + h >= a) {
                break;
            }
        }
        c += (e > 0 ? ' ' : '') + f;
        if (g) {
            break;
        }
    }
    return c;
}
const Na = /(\x1b|\e|\033)\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]/g;
function Oa(a) {
    return a.replace(Na, '');
}
function Pa(a, b, c) {
    return Math.max(...b.map((b)=>(b[a] instanceof sa && b[a].getColSpan() > 1 ? '' : b[a]?.toString() || '').split('\n').map((a)=>{
            const b = typeof c === 'undefined' ? a : Ma(c, a);
            return Oa(b).length || 0;
        })
    ).flat());
}
class Qa {
    constructor(Ra, Sa){
        this.table = Ra;
        this.options = Sa;
    }
    toString() {
        const Ta = this.createLayout();
        return Ta.rows.length ? this.renderRows(Ta) : '';
    }
    createLayout() {
        Object.keys(this.options.chars).forEach((a)=>{
            if (typeof this.options.chars[a] !== 'string') {
                this.options.chars[a] = '';
            }
        });
        const Ua = this.table.getBorder() || this.table.hasBodyBorder();
        const Va = this.table.hasHeaderBorder();
        const Wa = Va || Ua;
        const Xa = this.table.getHeader();
        const Ya = this.spanRows(Xa ? [
            Xa,
            ...this.table
        ] : this.table.slice());
        const Za = Math.max(...Ya.map((a)=>a.length
        ));
        for (const $a of Ya){
            const _a = $a.length;
            if (_a < Za) {
                const ab = Za - _a;
                for(let bb = 0; bb < ab; bb++){
                    $a.push(this.createCell(null, $a));
                }
            }
        }
        const cb = [];
        const db = [];
        for(let eb = 0; eb < Za; eb++){
            const fb = Array.isArray(this.options.minCellWidth) ? this.options.minCellWidth[eb] : this.options.minCellWidth;
            const gb = Array.isArray(this.options.maxCellWidth) ? this.options.maxCellWidth[eb] : this.options.maxCellWidth;
            const hb = Pa(eb, Ya, gb);
            db[eb] = Math.min(gb, Math.max(fb, hb));
            cb[eb] = Array.isArray(this.options.padding) ? this.options.padding[eb] : this.options.padding;
        }
        return {
            padding: cb,
            width: db,
            rows: Ya,
            columns: Za,
            hasBorder: Wa,
            hasBodyBorder: Ua,
            hasHeaderBorder: Va
        };
    }
    spanRows(ib, jb = 0, kb = 0, lb = [], mb = 1) {
        const nb = ib;
        if (jb >= nb.length && lb.every((a)=>a === 1
        )) {
            return nb;
        } else if (nb[jb] && kb >= nb[jb].length && kb >= lb.length && mb === 1) {
            return this.spanRows(nb, ++jb, 0, lb, 1);
        }
        if (mb > 1) {
            mb--;
            lb[kb] = lb[kb - 1];
            nb[jb].splice(kb - 1, 0, nb[jb][kb - 1]);
            return this.spanRows(nb, jb, ++kb, lb, mb);
        }
        if (kb === 0) {
            nb[jb] = this.createRow(nb[jb] || []);
        }
        if (lb[kb] > 1) {
            lb[kb]--;
            nb[jb].splice(kb, 0, nb[jb - 1][kb]);
            return this.spanRows(nb, jb, ++kb, lb, mb);
        }
        nb[jb][kb] = this.createCell(nb[jb][kb] || null, nb[jb]);
        mb = nb[jb][kb].getColSpan();
        lb[kb] = nb[jb][kb].getRowSpan();
        return this.spanRows(nb, jb, ++kb, lb, mb);
    }
    createRow(ob) {
        return Fa.from(ob).border(this.table.getBorder(), false);
    }
    createCell(pb, qb) {
        return sa.from(pb ?? '').border(qb.getBorder(), false);
    }
    renderRows(rb) {
        let sb = '';
        const tb = new Array(rb.columns).fill(1);
        for(let ub = 0; ub < rb.rows.length; ub++){
            sb += this.renderRow(tb, ub, rb);
        }
        return sb.slice(0, -1);
    }
    renderRow(vb, wb, xb, yb) {
        const zb = xb.rows[wb];
        const Ab = xb.rows[wb - 1];
        const Bb = xb.rows[wb + 1];
        let Cb = '';
        let Db = 1;
        if (!yb && wb === 0 && zb.hasBorder()) {
            Cb += this.renderBorderRow(undefined, zb, vb, xb);
        }
        let Eb = false;
        Cb += ' '.repeat(this.options.indent || 0);
        for(let Fb = 0; Fb < xb.columns; Fb++){
            if (Db > 1) {
                Db--;
                vb[Fb] = vb[Fb - 1];
                continue;
            }
            Cb += this.renderCell(Fb, zb, Ab, vb, xb);
            if (vb[Fb] > 1) {
                if (!yb) {
                    vb[Fb]--;
                }
            } else if (!Ab || Ab[Fb] !== zb[Fb]) {
                vb[Fb] = zb[Fb].getRowSpan();
            }
            Db = zb[Fb].getColSpan();
            if (vb[Fb] === 1 && zb[Fb].length) {
                Eb = true;
            }
        }
        if (xb.columns > 0) {
            if (zb[xb.columns - 1].getBorder()) {
                Cb += this.options.chars.right;
            } else if (xb.hasBorder) {
                Cb += ' ';
            }
        }
        Cb += '\n';
        if (Eb) {
            return Cb + this.renderRow(vb, wb, xb, Eb);
        }
        if (wb === 0 && xb.hasHeaderBorder || wb < xb.rows.length - 1 && xb.hasBodyBorder) {
            Cb += this.renderBorderRow(zb, Bb, vb, xb);
        }
        if (wb === xb.rows.length - 1 && zb.hasBorder()) {
            Cb += this.renderBorderRow(zb, undefined, vb, xb);
        }
        return Cb;
    }
    renderCell(Gb, Hb, Ib, Jb, Kb, Lb) {
        let Mb = '';
        const Nb = Hb[Gb - 1];
        const Ob = Hb[Gb];
        if (!Lb) {
            if (Gb === 0) {
                if (Ob.getBorder()) {
                    Mb += this.options.chars.left;
                } else if (Kb.hasBorder) {
                    Mb += ' ';
                }
            } else {
                if (Ob.getBorder() || Nb?.getBorder()) {
                    Mb += this.options.chars.middle;
                } else if (Kb.hasBorder) {
                    Mb += ' ';
                }
            }
        }
        let Pb = Kb.width[Gb];
        const Qb = Ob.getColSpan();
        if (Qb > 1) {
            for(let Rb = 1; Rb < Qb; Rb++){
                Pb += Kb.width[Gb + Rb] + Kb.padding[Gb + Rb];
                if (Kb.hasBorder) {
                    Pb += Kb.padding[Gb + Rb] + 1;
                }
            }
        }
        const { current: Sb , next: Tb  } = this.renderCellValue(Ob, Pb);
        Hb[Gb].setValue(Tb);
        if (Kb.hasBorder) {
            Mb += ' '.repeat(Kb.padding[Gb]);
        }
        Mb += Sb;
        if (Kb.hasBorder || Gb < Kb.columns - 1) {
            Mb += ' '.repeat(Kb.padding[Gb]);
        }
        return Mb;
    }
    renderCellValue(Ub, Vb) {
        const Wb = Math.min(Vb, Oa(Ub.toString()).length);
        let Xb = Ma(Wb, Ub.toString());
        const Yb = Oa(Xb).length > Wb;
        if (Yb) {
            Xb = Xb.slice(0, Wb);
        }
        const Zb = Ub.toString().slice(Xb.length + (Yb ? 0 : 1));
        const $b = Vb - Oa(Xb).length;
        const _b = Xb + ' '.repeat($b);
        return {
            current: _b,
            next: Ub.clone(Zb)
        };
    }
    renderBorderRow(ac, bc, cc, dc) {
        let ec = '';
        let fc = 1;
        for(let gc = 0; gc < dc.columns; gc++){
            if (cc[gc] > 1) {
                if (!bc) {
                    throw new Error('invalid layout');
                }
                if (fc > 1) {
                    fc--;
                    continue;
                }
            }
            ec += this.renderBorderCell(gc, ac, bc, cc, dc);
            fc = bc?.[gc].getColSpan() ?? 1;
        }
        return ec.length ? ' '.repeat(this.options.indent) + ec + '\n' : '';
    }
    renderBorderCell(hc, ic, jc, kc, lc) {
        const mc = ic?.[hc - 1];
        const nc = jc?.[hc - 1];
        const oc = ic?.[hc];
        const pc = jc?.[hc];
        const qc = !!mc?.getBorder();
        const rc = !!nc?.getBorder();
        const sc = !!oc?.getBorder();
        const tc = !!pc?.getBorder();
        const uc = (a)=>(a?.getColSpan() ?? 1) > 1
        ;
        const vc = (a)=>(a?.getRowSpan() ?? 1) > 1
        ;
        let wc = '';
        if (hc === 0) {
            if (kc[hc] > 1) {
                if (sc) {
                    wc += this.options.chars.left;
                } else {
                    wc += ' ';
                }
            } else if (sc && tc) {
                wc += this.options.chars.leftMid;
            } else if (sc) {
                wc += this.options.chars.bottomLeft;
            } else if (tc) {
                wc += this.options.chars.topLeft;
            } else {
                wc += ' ';
            }
        } else if (hc < lc.columns) {
            if (qc && tc || sc && rc) {
                const xc = uc(mc);
                const yc = uc(nc);
                const zc = uc(oc);
                const Ac = uc(pc);
                const Bc = vc(mc);
                const Cc = vc(nc);
                const Dc = vc(oc);
                const Ec = vc(pc);
                const Fc = qc && tc && sc && rc;
                const Gc = Bc && Dc && Cc && Ec;
                const Hc = xc && zc && yc && Ac;
                if (Gc && Fc) {
                    wc += this.options.chars.middle;
                } else if (Hc && Fc && mc === oc && nc === pc) {
                    wc += this.options.chars.mid;
                } else if (xc && zc && mc === oc) {
                    wc += this.options.chars.topMid;
                } else if (yc && Ac && nc === pc) {
                    wc += this.options.chars.bottomMid;
                } else if (Bc && Cc && mc === nc) {
                    wc += this.options.chars.leftMid;
                } else if (Dc && Ec && oc === pc) {
                    wc += this.options.chars.rightMid;
                } else {
                    wc += this.options.chars.midMid;
                }
            } else if (qc && sc) {
                if (uc(mc) && uc(oc) && mc === oc) {
                    wc += this.options.chars.bottom;
                } else {
                    wc += this.options.chars.bottomMid;
                }
            } else if (sc && tc) {
                if (kc[hc] > 1) {
                    wc += this.options.chars.left;
                } else {
                    wc += this.options.chars.leftMid;
                }
            } else if (tc && rc) {
                if (uc(nc) && uc(pc) && nc === pc) {
                    wc += this.options.chars.top;
                } else {
                    wc += this.options.chars.topMid;
                }
            } else if (qc && rc) {
                if (vc(mc) && mc === nc) {
                    wc += this.options.chars.right;
                } else {
                    wc += this.options.chars.rightMid;
                }
            } else if (qc) {
                wc += this.options.chars.bottomRight;
            } else if (sc) {
                wc += this.options.chars.bottomLeft;
            } else if (rc) {
                wc += this.options.chars.topRight;
            } else if (tc) {
                wc += this.options.chars.topLeft;
            } else {
                wc += ' ';
            }
        }
        const Ic = lc.padding[hc] + lc.width[hc] + lc.padding[hc];
        if (kc[hc] > 1 && jc) {
            wc += this.renderCell(hc, jc, ic, kc, lc, true);
            if (jc[hc] === jc[jc.length - 1]) {
                if (sc) {
                    wc += this.options.chars.right;
                } else {
                    wc += ' ';
                }
                return wc;
            }
        } else if (sc && tc) {
            wc += this.options.chars.mid.repeat(Ic);
        } else if (sc) {
            wc += this.options.chars.bottom.repeat(Ic);
        } else if (tc) {
            wc += this.options.chars.top.repeat(Ic);
        } else {
            wc += ' '.repeat(Ic);
        }
        if (hc === lc.columns - 1) {
            if (sc && tc) {
                wc += this.options.chars.rightMid;
            } else if (sc) {
                wc += this.options.chars.bottomRight;
            } else if (tc) {
                wc += this.options.chars.topRight;
            } else {
                wc += ' ';
            }
        }
        return wc;
    }
}
class Jc extends Array {
    static from(Kc) {
        const Lc = new this(...Kc);
        if (Kc instanceof Jc) {
            Lc.options = Object.assign({
            }, Kc.options);
            Lc.headerRow = Kc.headerRow ? Fa.from(Kc.headerRow) : undefined;
        }
        return Lc;
    }
    static fromJson(Mc) {
        return new this().fromJson(Mc);
    }
    static render(Nc) {
        Jc.from(Nc).render();
    }
    fromJson(Oc) {
        this.header(Object.keys(Oc[0]));
        this.body(Oc.map((a)=>Object.values(a)
        ));
        return this;
    }
    header(Pc) {
        this.headerRow = Pc instanceof Fa ? Pc : Fa.from(Pc);
        return this;
    }
    body(Qc) {
        this.length = 0;
        this.push(...Qc);
        return this;
    }
    clone() {
        const Rc = new Jc(...this.map((a)=>a instanceof Fa ? a.clone() : Fa.from(a).clone()
        ));
        Rc.options = Object.assign({
        }, this.options);
        Rc.headerRow = this.headerRow?.clone();
        return Rc;
    }
    toString() {
        return new Qa(this, this.options).toString();
    }
    render() {
        Deno.stdout.writeSync(b(this.toString() + '\n'));
        return this;
    }
    maxCellWidth(Sc, Tc = true) {
        if (Tc || typeof this.options.maxCellWidth === 'undefined') {
            this.options.maxCellWidth = Sc;
        }
        return this;
    }
    minCellWidth(Uc, Vc = true) {
        if (Vc || typeof this.options.minCellWidth === 'undefined') {
            this.options.minCellWidth = Uc;
        }
        return this;
    }
    indent(Wc, Xc = true) {
        if (Xc || typeof this.options.indent === 'undefined') {
            this.options.indent = Wc;
        }
        return this;
    }
    padding(Yc, Zc = true) {
        if (Zc || typeof this.options.padding === 'undefined') {
            this.options.padding = Yc;
        }
        return this;
    }
    border($c, _c = true) {
        if (_c || typeof this.options.border === 'undefined') {
            this.options.border = $c;
        }
        return this;
    }
    chars(ad) {
        Object.assign(this.options.chars, ad);
        return this;
    }
    getHeader() {
        return this.headerRow;
    }
    getBody() {
        return this.slice();
    }
    getMaxCellWidth() {
        return this.options.maxCellWidth;
    }
    getMinCellWidth() {
        return this.options.minCellWidth;
    }
    getIndent() {
        return this.options.indent;
    }
    getPadding() {
        return this.options.padding;
    }
    getBorder() {
        return this.options.border === true;
    }
    hasHeaderBorder() {
        return this.getBorder() || this.headerRow instanceof Fa && this.headerRow.hasBorder();
    }
    hasBodyBorder() {
        return this.getBorder() || this.some((a)=>a instanceof Fa ? a.hasBorder() : a.some((a)=>a instanceof sa ? a.getBorder : false
            )
        );
    }
    hasBorder() {
        return this.hasHeaderBorder() || this.hasBodyBorder();
    }
    constructor(...bd){
        super(...bd);
        this.options = {
            indent: 0,
            border: false,
            maxCellWidth: Infinity,
            minCellWidth: 0,
            padding: 1,
            chars: ra
        };
    }
}
class cd {
    static generate(dd) {
        return new cd(dd).generate();
    }
    constructor(ed){
        this.cmd = ed;
        this.indent = 2;
    }
    generate() {
        return this.generateHeader() + this.generateDescription() + this.generateOptions() + this.generateCommands() + this.generateEnvironmentVariables() + this.generateExamples() + '\n';
    }
    generateHeader() {
        return '\n' + Jc.from([
            [
                g('Usage:'),
                m(`${this.cmd.getName()}${this.cmd.getArgsDefinition() ? ' ' + this.cmd.getArgsDefinition() : ''}`)
            ],
            [
                g('Version:'),
                k(`v${this.cmd.getVersion()}`)
            ]
        ]).indent(this.indent).padding(1).toString() + '\n';
    }
    generateDescription() {
        if (!this.cmd.getDescription()) {
            return '';
        }
        return this.label('Description') + Jc.from([
            [
                this.cmd.getDescription()
            ]
        ]).indent(this.indent * 2).maxCellWidth(140).padding(1).toString() + '\n';
    }
    generateOptions() {
        const fd = this.cmd.getOptions(false);
        if (!fd.length) {
            return '';
        }
        const gd = !!fd.find((a)=>!!a.typeDefinition
        );
        if (gd) {
            return this.label('Options') + Jc.from([
                ...fd.map((a)=>[
                        a.flags.split(/,? +/g).map((a)=>l(a)
                        ).join(', '),
                        Z.highlightArguments(a.typeDefinition || ''),
                        i(g('-')) + ' ' + a.description.split('\n').shift(),
                        this.generateHints(a)
                    ]
                )
            ]).padding([
                2,
                2,
                2
            ]).indent(this.indent * 2).maxCellWidth([
                60,
                60,
                80,
                60
            ]).toString() + '\n';
        }
        return this.label('Options') + Jc.from([
            ...fd.map((a)=>[
                    a.flags.split(/,? +/g).map((a)=>l(a)
                    ).join(', '),
                    i(g('-')) + ' ' + a.description.split('\n').shift(),
                    this.generateHints(a)
                ]
            )
        ]).padding([
            2,
            2
        ]).indent(this.indent * 2).maxCellWidth([
            60,
            80,
            60
        ]).toString() + '\n';
    }
    generateCommands() {
        const hd = this.cmd.getCommands(false);
        if (!hd.length) {
            return '';
        }
        const id = !!hd.find((a)=>!!a.getArgsDefinition()
        );
        if (id) {
            return this.label('Commands') + Jc.from([
                ...hd.map((a)=>[
                        [
                            a.getName(),
                            ...a.getAliases()
                        ].map((a)=>l(a)
                        ).join(', '),
                        Z.highlightArguments(a.getArgsDefinition() || ''),
                        i(g('-')) + ' ' + a.getDescription().split('\n').shift()
                    ]
                )
            ]).padding([
                2,
                2,
                2
            ]).indent(this.indent * 2).toString() + '\n';
        }
        return this.label('Commands') + Jc.from([
            ...hd.map((a)=>[
                    [
                        a.getName(),
                        ...a.getAliases()
                    ].map((a)=>l(a)
                    ).join(', '),
                    i(g('-')) + ' ' + a.getDescription().split('\n').shift()
                ]
            )
        ]).padding([
            2,
            2
        ]).indent(this.indent * 2).toString() + '\n';
    }
    generateEnvironmentVariables() {
        const jd = this.cmd.getEnvVars(false);
        if (!jd.length) {
            return '';
        }
        return this.label('Environment variables') + Jc.from([
            ...jd.map((a)=>[
                    a.names.map((a)=>l(a)
                    ).join(', '),
                    Z.highlightArgumentDetails(a.details),
                    `${i(g('-'))} ${a.description}`
                ]
            )
        ]).padding(2).indent(this.indent * 2).toString() + '\n';
    }
    generateExamples() {
        const kd = this.cmd.getExamples();
        if (!kd.length) {
            return '';
        }
        return this.label('Examples') + Jc.from(kd.map((a)=>[
                h(g(`${pd(a.name)}:`)),
                `\n${a.description}`
            ]
        )).padding(1).indent(this.indent * 2).maxCellWidth(150).toString() + '\n';
    }
    generateHints(ld) {
        const md = [];
        ld.required && md.push(k(`required`));
        typeof ld.default !== 'undefined' && md.push(l(g(`Default: `)) + l(L(ld.default)));
        ld.depends && ld.depends.length && md.push(i(g(`depends: `)) + ld.depends.map((a)=>i(a)
        ).join(', '));
        ld.conflicts && ld.conflicts.length && md.push(i(g(`conflicts: `)) + ld.conflicts.map((a)=>i(a)
        ).join(', '));
        if (md.length) {
            return `(${md.join(', ')})`;
        }
        return '';
    }
    line(...nd) {
        return (nd.length ? ' '.repeat(this.indent) + L(...nd) : '') + '\n';
    }
    label(od) {
        return '\n' + this.line(g(`${od}:`)) + '\n';
    }
}
function pd(a) {
    return (a?.charAt(0).toUpperCase() + a.slice(1)) ?? '';
}
const { stdout: qd , stderr: rd  } = Deno;
const sd = Deno.permissions;
const td = sd && sd.query && await sd.query({
    name: 'env'
});
const ud = !!td && td.state === 'granted';
class vd {
    versionOption(wd, xd, yd) {
        this._versionOption = wd === false ? wd : {
            flags: wd,
            desc: xd,
            opts: typeof yd === 'function' ? {
                action: yd
            } : yd
        };
        return this;
    }
    helpOption(zd, Ad, Bd) {
        this._helpOption = zd === false ? zd : {
            flags: zd,
            desc: Ad,
            opts: typeof Bd === 'function' ? {
                action: Bd
            } : Bd
        };
        return this;
    }
    command(Cd, Dd, Ed) {
        let Fd;
        if (typeof Dd === 'string') {
            Fd = Dd;
            Dd = undefined;
        }
        const Gd = Z.splitArguments(Cd);
        const Hd = Gd.args.shift();
        const Id = Gd.args;
        if (!Hd) {
            throw this.error(new Error('Missing command name.'));
        }
        if (this.getBaseCommand(Hd, true)) {
            if (!Ed) {
                throw this.error(new Error(`Duplicate command: ${Hd}`));
            }
            this.removeCommand(Hd);
        }
        const Jd = (Dd || new vd()).reset();
        Jd._name = Hd;
        Jd._parent = this;
        if (Fd) {
            Jd.isExecutable = true;
            Jd.description(Fd);
        }
        if (Gd.typeDefinition) {
            Jd.arguments(Gd.typeDefinition);
        }
        Id.forEach((a)=>Jd.aliases.push(a)
        );
        this.commands.set(Hd, Jd);
        this.select(Hd);
        return this;
    }
    alias(Kd) {
        if (this.cmd === this) {
            throw this.error(new Error(`Failed to add alias '${Kd}'. No sub command selected.`));
        }
        if (this.cmd.aliases.indexOf(Kd) !== -1) {
            throw this.error(new Error(`Duplicate alias: ${Kd}`));
        }
        this.cmd.aliases.push(Kd);
        return this;
    }
    reset() {
        return this.cmd = this;
    }
    select(Ld) {
        const Md = this.getBaseCommand(Ld, true);
        if (!Md) {
            throw this.error(new Error(`Sub-command not found: ${Ld}`));
        }
        this.cmd = Md;
        return this;
    }
    name(Nd) {
        this.cmd._name = Nd;
        return this;
    }
    version(Od) {
        this.cmd.ver = Od;
        return this;
    }
    description(Pd) {
        this.cmd.desc = Pd;
        return this;
    }
    hidden() {
        this.cmd.isHidden = true;
        return this;
    }
    global() {
        this.cmd.isGlobal = true;
        return this;
    }
    arguments(Qd) {
        this.cmd.argsDefinition = Qd;
        return this;
    }
    action(Rd) {
        this.cmd.fn = Rd;
        return this;
    }
    allowEmpty(Sd = true) {
        this.cmd._allowEmpty = Sd;
        return this;
    }
    stopEarly(Td = true) {
        this.cmd._stopEarly = Td;
        return this;
    }
    useRawArgs(Ud = true) {
        this.cmd._useRawArgs = Ud;
        return this;
    }
    default(Vd) {
        this.cmd.defaultCommand = Vd;
        return this;
    }
    type(Wd, Xd, Yd) {
        if (this.cmd.types.get(Wd) && !Yd?.override) {
            throw this.error(new Error(`Type '${Wd}' already exists.`));
        }
        this.cmd.types.set(Wd, {
            ...Yd,
            name: Wd,
            handler: Xd
        });
        if (Xd instanceof M && typeof Xd.complete !== 'undefined') {
            this.complete(Wd, (a, b)=>Xd.complete?.(a, b) || []
            , Yd);
        }
        return this;
    }
    complete(Zd, $d, _d) {
        if (this.cmd.completions.has(Zd) && !_d?.override) {
            throw this.error(new Error(`Completion '${Zd}' already exists.`));
        }
        this.cmd.completions.set(Zd, {
            name: Zd,
            complete: $d,
            ..._d
        });
        return this;
    }
    throwErrors() {
        this.cmd.throwOnError = true;
        return this;
    }
    shouldThrowErrors() {
        return this.cmd.throwOnError || !!this.cmd._parent?.shouldThrowErrors();
    }
    getCompletions() {
        return this.getGlobalCompletions().concat(this.getBaseCompletions());
    }
    getBaseCompletions() {
        return Array.from(this.completions.values());
    }
    getGlobalCompletions() {
        const ae = (a, b = [], c = [])=>{
            if (a) {
                if (a.completions.size) {
                    a.completions.forEach((a)=>{
                        if (a.global && !this.completions.has(a.name) && c.indexOf(a.name) === -1) {
                            c.push(a.name);
                            b.push(a);
                        }
                    });
                }
                return ae(a._parent, b, c);
            }
            return b;
        };
        return ae(this._parent);
    }
    getCompletion(be) {
        return this.getBaseCompletion(be) ?? this.getGlobalCompletion(be);
    }
    getBaseCompletion(ce) {
        return this.completions.get(ce);
    }
    getGlobalCompletion(de) {
        if (!this._parent) {
            return;
        }
        let ee = this._parent.getBaseCompletion(de);
        if (!ee?.global) {
            return this._parent.getGlobalCompletion(de);
        }
        return ee;
    }
    option(fe, ge, he) {
        if (typeof he === 'function') {
            return this.option(fe, ge, {
                value: he
            });
        }
        const ie = Z.splitArguments(fe);
        const je = ie.typeDefinition ? Z.parseArgumentsDefinition(ie.typeDefinition) : [];
        const ke = {
            name: '',
            description: ge,
            args: je,
            flags: ie.args.join(', '),
            typeDefinition: ie.typeDefinition,
            ...he
        };
        if (ke.separator) {
            for (const le of je){
                if (le.list) {
                    le.separator = ke.separator;
                }
            }
        }
        for (const me of ie.args){
            const ne = me.trim();
            const oe = /^--/.test(ne);
            const pe = oe ? ne.slice(2) : ne.slice(1);
            if (ke.name === pe || ke.aliases && ~ke.aliases.indexOf(pe)) {
                throw this.error(new Error(`Duplicate command name: ${pe}`));
            }
            if (!ke.name && oe) {
                ke.name = pe;
            } else if (!ke.aliases) {
                ke.aliases = [
                    pe
                ];
            } else {
                ke.aliases.push(pe);
            }
            if (this.cmd.getBaseOption(pe, true)) {
                if (he?.override) {
                    this.removeOption(pe);
                } else {
                    throw this.error(new Error(`Duplicate option name: ${pe}`));
                }
            }
        }
        if (ke.prepend) {
            this.cmd.options.unshift(ke);
        } else {
            this.cmd.options.push(ke);
        }
        return this;
    }
    example(qe, re) {
        if (this.cmd.hasExample(qe)) {
            throw this.error(new Error('Example already exists.'));
        }
        this.cmd.examples.push({
            name: qe,
            description: re
        });
        return this;
    }
    env(se, te, ue) {
        const ve = Z.splitArguments(se);
        if (!ve.typeDefinition) {
            ve.typeDefinition = '<value:boolean>';
        }
        if (ve.args.some((a)=>this.cmd.getBaseEnvVar(a, true)
        )) {
            throw this.error(new Error(`Environment variable already exists: ${se}`));
        }
        const we = Z.parseArgumentsDefinition(ve.typeDefinition);
        if (we.length > 1) {
            throw this.error(new Error(`An environment variable can only have one value but got: ${se}`));
        } else if (we.length && we[0].optionalValue) {
            throw this.error(new Error(`An environment variable can not have an optional value but '${se}' is defined as optional.`));
        } else if (we.length && we[0].variadic) {
            throw this.error(new Error(`An environment variable can not have an variadic value but '${se}' is defined as variadic.`));
        }
        this.cmd.envVars.push({
            names: ve.args,
            description: te,
            type: we[0].type,
            details: we.shift(),
            ...ue
        });
        return this;
    }
    async parse(xe = Deno.args, ye) {
        this.reset().registerDefaults();
        this.rawArgs = xe;
        const ze = this.rawArgs.length > 0 && this.getCommand(this.rawArgs[0], true);
        if (ze) {
            ze._globalParent = this;
            return await ze.parse(this.rawArgs.slice(1), ye);
        }
        if (this.isExecutable) {
            if (!ye) {
                await this.executeExecutable(this.rawArgs);
            }
            return {
                options: {
                },
                args: this.rawArgs,
                cmd: this,
                literal: this.literalArgs
            };
        } else if (this._useRawArgs) {
            if (ye) {
                return {
                    options: {
                    },
                    args: this.rawArgs,
                    cmd: this,
                    literal: this.literalArgs
                };
            }
            return await this.execute({
            }, ...this.rawArgs);
        } else {
            const { flags: Ae , unknown: Be , literal: Ce  } = this.parseFlags(this.rawArgs);
            this.literalArgs = Ce;
            const De = this.parseArguments(Be, Ae);
            this.validateEnvVars();
            if (ye) {
                return {
                    options: Ae,
                    args: De,
                    cmd: this,
                    literal: this.literalArgs
                };
            }
            return await this.execute(Ae, ...De);
        }
    }
    registerDefaults() {
        if (this.getParent() || this.hasDefaults) {
            return this;
        }
        this.hasDefaults = true;
        this.reset();
        if (this._versionOption !== false) {
            this.option(this._versionOption?.flags || '-V, --version', this._versionOption?.desc || 'Show the version number for this program.', Object.assign({
                standalone: true,
                prepend: true,
                action: async function() {
                    await Deno.stdout.writeSync(b(this.getVersion() + '\n'));
                    Deno.exit(0);
                }
            }, this._versionOption?.opts ?? {
            }));
        }
        if (this._helpOption !== false) {
            this.option(this._helpOption?.flags || '-h, --help', this._helpOption?.desc || 'Show this help.', Object.assign({
                standalone: true,
                global: true,
                prepend: true,
                action: function() {
                    this.help();
                    Deno.exit(0);
                }
            }, this._helpOption?.opts ?? {
            }));
        }
        return this;
    }
    async execute(Ee, ...Fe) {
        const Ge = this.findActionFlag(Ee);
        if (Ge && Ge.action) {
            await Ge.action.call(this, Ee, ...Fe);
            return {
                options: Ee,
                args: Fe,
                cmd: this,
                literal: this.literalArgs
            };
        }
        if (this.fn) {
            try {
                await this.fn(Ee, ...Fe);
            } catch (He) {
                throw this.error(He);
            }
        } else if (this.defaultCommand) {
            const Ie = this.getCommand(this.defaultCommand, true);
            if (!Ie) {
                throw this.error(new Error(`Default command '${this.defaultCommand}' not found.`));
            }
            Ie._globalParent = this;
            try {
                await Ie.execute(Ee, ...Fe);
            } catch (Je) {
                throw this.error(Je);
            }
        }
        return {
            options: Ee,
            args: Fe,
            cmd: this,
            literal: this.literalArgs
        };
    }
    async executeExecutable(Ke) {
        const [Le, ...Me] = this.getPath().split(' ');
        Me.unshift(Le.replace(/\.ts$/, ''));
        const Ne = Me.join('-');
        try {
            await Deno.run({
                cmd: [
                    Ne,
                    ...Ke
                ]
            });
            return;
        } catch (Oe) {
            if (!Oe.message.match(/No such file or directory/)) {
                throw Oe;
            }
        }
        try {
            await Deno.run({
                cmd: [
                    Ne + '.ts',
                    ...Ke
                ]
            });
            return;
        } catch (Pe) {
            if (!Pe.message.match(/No such file or directory/)) {
                throw Pe;
            }
        }
        throw this.error(new Error(`Sub-command executable not found: ${Ne}${h('(.ts)')}`));
    }
    parseFlags(Qe) {
        try {
            return F(Qe, {
                stopEarly: this._stopEarly,
                allowEmpty: this._allowEmpty,
                flags: this.getOptions(true),
                parse: (a, b, c, d)=>this.parseType(a, b, c, d)
            });
        } catch (Re) {
            throw this.error(Re);
        }
    }
    parseType(Se, Te, Ue, Ve) {
        const We = this.getType(Se);
        if (!We) {
            throw this.error(new Error(`No type registered with name: ${Se}`));
        }
        return We.handler instanceof M ? We.handler.parse(Te, Ue, Ve) : We.handler(Te, Ue, Ve);
    }
    validateEnvVars() {
        const Xe = this.getEnvVars(true);
        if (!Xe.length) {
            return;
        }
        if (ud) {
            Xe.forEach((a)=>{
                const b = a.names.find((a)=>!!Deno.env.get(a)
                );
                if (b) {
                    const c = Deno.env.get(b);
                    try {
                        this.parseType(a.type, {
                            name: b
                        }, a, c || '');
                    } catch (d) {
                        throw new Error(`Environment variable '${b}' must be of type ${a.type} but got: ${c}`);
                    }
                }
            });
        }
    }
    parseArguments(Ye, Ze) {
        const $e = [];
        Ye = Ye.slice(0);
        if (!this.hasArguments()) {
            if (Ye.length) {
                if (this.hasCommands(true)) {
                    throw this.error(new Error(`Unknown command: ${Ye.join(' ')}`));
                } else {
                    throw this.error(new Error(`No arguments allowed for command: ${this._name}`));
                }
            }
        } else {
            if (!Ye.length) {
                const _e = this.getArguments().filter((a)=>!a.optionalValue
                ).map((a)=>a.name
                );
                if (_e.length) {
                    const af = Object.keys(Ze);
                    const bf = !!af.find((a)=>this.getOption(a, true)?.standalone
                    );
                    if (!bf) {
                        throw this.error(new Error('Missing argument(s): ' + _e.join(', ')));
                    }
                }
                return $e;
            }
            for (const cf of this.getArguments()){
                if (!cf.optionalValue && !Ye.length) {
                    throw this.error(new Error(`Missing argument: ${cf.name}`));
                }
                let df;
                if (cf.variadic) {
                    df = Ye.splice(0, Ye.length);
                } else {
                    df = Ye.shift();
                }
                if (df) {
                    $e.push(df);
                }
            }
            if (Ye.length) {
                throw this.error(new Error(`To many arguments: ${Ye.join(' ')}`));
            }
        }
        return $e;
    }
    findActionFlag(ef) {
        const ff = Object.keys(ef);
        for (const gf of ff){
            const hf = this.getOption(gf, true);
            if (hf?.action) {
                return hf;
            }
        }
        return;
    }
    getName() {
        return this._name;
    }
    getParent() {
        return this._parent;
    }
    getGlobalParent() {
        return this._globalParent;
    }
    getMainCommand() {
        return this._parent?.getMainCommand() ?? this;
    }
    getAliases() {
        return this.aliases;
    }
    getPath() {
        return this._parent ? this._parent.getPath() + ' ' + this._name : this._name;
    }
    getArgsDefinition() {
        return this.argsDefinition;
    }
    getArgument(jf) {
        return this.getArguments().find((a)=>a.name === jf
        );
    }
    getArguments() {
        if (!this.args.length && this.argsDefinition) {
            this.args = Z.parseArgumentsDefinition(this.argsDefinition);
        }
        return this.args;
    }
    hasArguments() {
        return !!this.argsDefinition;
    }
    getVersion() {
        return this.ver || (this._parent?.getVersion() ?? '');
    }
    getDescription() {
        return typeof this.desc === 'function' ? this.desc = this.desc() : this.desc;
    }
    getShortDescription() {
        return this.getDescription().trim().split('\n').shift();
    }
    hasOptions(kf) {
        return this.getOptions(kf).length > 0;
    }
    getOptions(lf) {
        return this.getGlobalOptions(lf).concat(this.getBaseOptions(lf));
    }
    getBaseOptions(mf) {
        if (!this.options.length) {
            return [];
        }
        return mf ? this.options.slice(0) : this.options.filter((a)=>!a.hidden
        );
    }
    getGlobalOptions(nf) {
        const of = (a, b = [], c = [])=>{
            if (a) {
                if (a.options.length) {
                    a.options.forEach((a)=>{
                        if (a.global && !this.options.find((b)=>b.name === a.name
                        ) && c.indexOf(a.name) === -1 && (nf || !a.hidden)) {
                            c.push(a.name);
                            b.push(a);
                        }
                    });
                }
                return of(a._parent, b, c);
            }
            return b;
        };
        return of(this._parent);
    }
    hasOption(pf, qf) {
        return !!this.getOption(pf, qf);
    }
    getOption(rf, sf) {
        return this.getBaseOption(rf, sf) ?? this.getGlobalOption(rf, sf);
    }
    getBaseOption(tf, uf) {
        const vf = this.options.find((a)=>a.name === tf
        );
        return vf && (uf || !vf.hidden) ? vf : undefined;
    }
    getGlobalOption(wf, xf) {
        if (!this._parent) {
            return;
        }
        let yf = this._parent.getBaseOption(wf, xf);
        if (!yf || !yf.global) {
            return this._parent.getGlobalOption(wf, xf);
        }
        return yf;
    }
    removeOption(zf) {
        const Af = this.options.findIndex((a)=>a.name === zf
        );
        if (Af === -1) {
            return;
        }
        return this.options.splice(Af, 1)[0];
    }
    hasCommands(Bf) {
        return this.getCommands(Bf).length > 0;
    }
    getCommands(Cf) {
        return this.getGlobalCommands(Cf).concat(this.getBaseCommands(Cf));
    }
    getBaseCommands(Df) {
        const Ef = Array.from(this.commands.values());
        return Df ? Ef : Ef.filter((a)=>!a.isHidden
        );
    }
    getGlobalCommands(Ff) {
        const Gf = (a, b = [], c = [])=>{
            if (a) {
                if (a.commands.size) {
                    a.commands.forEach((a)=>{
                        if (a.isGlobal && this !== a && !this.commands.has(a._name) && c.indexOf(a._name) === -1 && (Ff || !a.isHidden)) {
                            c.push(a._name);
                            b.push(a);
                        }
                    });
                }
                return Gf(a._parent, b, c);
            }
            return b;
        };
        return Gf(this._parent);
    }
    hasCommand(Hf, If) {
        return !!this.getCommand(Hf, If);
    }
    getCommand(Jf, Kf) {
        return this.getBaseCommand(Jf, Kf) ?? this.getGlobalCommand(Jf, Kf);
    }
    getBaseCommand(Lf, Mf) {
        let Nf = this.commands.get(Lf);
        return Nf && (Mf || !Nf.isHidden) ? Nf : undefined;
    }
    getGlobalCommand(Of, Pf) {
        if (!this._parent) {
            return;
        }
        let Qf = this._parent.getBaseCommand(Of, Pf);
        if (!Qf?.isGlobal) {
            return this._parent.getGlobalCommand(Of, Pf);
        }
        return Qf;
    }
    removeCommand(Rf) {
        const Sf = this.getBaseCommand(Rf, true);
        if (Sf) {
            this.commands.delete(Rf);
        }
        return Sf;
    }
    getTypes() {
        return this.getGlobalTypes().concat(this.getBaseTypes());
    }
    getBaseTypes() {
        return Array.from(this.types.values());
    }
    getGlobalTypes() {
        const Tf = (a, b = [], c = [])=>{
            if (a) {
                if (a.types.size) {
                    a.types.forEach((a)=>{
                        if (a.global && !this.types.has(a.name) && c.indexOf(a.name) === -1) {
                            c.push(a.name);
                            b.push(a);
                        }
                    });
                }
                return Tf(a._parent, b, c);
            }
            return b;
        };
        return Tf(this._parent);
    }
    getType(Uf) {
        return this.getBaseType(Uf) ?? this.getGlobalType(Uf);
    }
    getBaseType(Vf) {
        return this.types.get(Vf);
    }
    getGlobalType(Wf) {
        if (!this._parent) {
            return;
        }
        let Xf = this._parent.getBaseType(Wf);
        if (!Xf?.global) {
            return this._parent.getGlobalType(Wf);
        }
        return Xf;
    }
    hasEnvVars(Yf) {
        return this.getEnvVars(Yf).length > 0;
    }
    getEnvVars(Zf) {
        return this.getGlobalEnvVars(Zf).concat(this.getBaseEnvVars(Zf));
    }
    getBaseEnvVars($f) {
        if (!this.envVars.length) {
            return [];
        }
        return $f ? this.envVars.slice(0) : this.envVars.filter((a)=>!a.hidden
        );
    }
    getGlobalEnvVars(_f) {
        const ag = (a, b = [], c = [])=>{
            if (a) {
                if (a.envVars.length) {
                    a.envVars.forEach((a)=>{
                        if (a.global && !this.envVars.find((b)=>b.names[0] === a.names[0]
                        ) && c.indexOf(a.names[0]) === -1 && (_f || !a.hidden)) {
                            c.push(a.names[0]);
                            b.push(a);
                        }
                    });
                }
                return ag(a._parent, b, c);
            }
            return b;
        };
        return ag(this._parent);
    }
    hasEnvVar(bg, cg) {
        return !!this.getEnvVar(bg, cg);
    }
    getEnvVar(dg, eg) {
        return this.getBaseEnvVar(dg, eg) ?? this.getGlobalEnvVar(dg, eg);
    }
    getBaseEnvVar(fg, gg) {
        const hg = this.envVars.find((a)=>a.names.indexOf(fg) !== -1
        );
        return hg && (gg || !hg.hidden) ? hg : undefined;
    }
    getGlobalEnvVar(ig, jg) {
        if (!this._parent) {
            return;
        }
        let kg = this._parent.getBaseEnvVar(ig, jg);
        if (!kg?.global) {
            return this._parent.getGlobalEnvVar(ig, jg);
        }
        return kg;
    }
    hasExamples() {
        return this.examples.length > 0;
    }
    getExamples() {
        return this.examples;
    }
    hasExample(lg) {
        return !!this.getExample(lg);
    }
    getExample(mg) {
        return this.examples.find((a)=>a.name === mg
        );
    }
    getRawArgs() {
        return this.rawArgs;
    }
    getLiteralArgs() {
        return this.literalArgs;
    }
    write(...ng) {
        qd.writeSync(b(I(2) + L(...ng)));
    }
    writeError(...og) {
        rd.writeSync(b(I(2) + i(L(`[ERROR:${this._name}]`, ...og))));
    }
    log(...pg) {
        this.write(...pg, '\n');
    }
    logError(...qg) {
        this.writeError(...qg, '\n');
    }
    error(rg, sg = true) {
        if (this.shouldThrowErrors()) {
            return rg;
        }
        const tg = ud ? !!Deno.env.get('CLIFFY_DEBUG') : false;
        sg && this.help();
        this.logError(tg ? rg : rg.message);
        this.log();
        Deno.exit(1);
    }
    help() {
        Deno.stdout.writeSync(b(this.getHelp()));
    }
    getHelp() {
        this.registerDefaults();
        return cd.generate(this);
    }
    constructor(){
        this.types = new Map([
            [
                'string',
                {
                    name: 'string',
                    handler: new V()
                }
            ],
            [
                'number',
                {
                    name: 'number',
                    handler: new R()
                }
            ],
            [
                'boolean',
                {
                    name: 'boolean',
                    handler: new N()
                }
            ]
        ]);
        this.rawArgs = [];
        this.literalArgs = [];
        this._name = 'COMMAND';
        this.ver = '0.0.0';
        this.desc = '';
        this.options = [];
        this.commands = new Map();
        this.examples = [];
        this.envVars = [];
        this.aliases = [];
        this.completions = new Map();
        this.cmd = this;
        this.isExecutable = false;
        this.throwOnError = false;
        this._allowEmpty = true;
        this._stopEarly = false;
        this._useRawArgs = false;
        this.args = [];
        this.isHidden = false;
        this.isGlobal = false;
        this.hasDefaults = false;
    }
}
function ug(a, b) {
    return s(a, b, '_');
}
class vg {
    static generate(wg) {
        return new vg(wg).generate();
    }
    constructor(xg){
        this.cmd = xg;
        this.actions = new Map();
    }
    generate() {
        return `
# compdef _${ug(this.cmd.getPath())} ${this.cmd.getPath()}
#
# zsh completion for ${this.cmd.getPath()}
#
# version: ${this.cmd.getVersion()}
#

autoload -U is-at-least

(( $+functions[__${ug(this.cmd.getName())}_complete] )) ||
function __${ug(this.cmd.getName())}_complete {
    local name="$1"; shift
    local action="$1"; shift
    integer ret=1
    local -a values
    local expl
    _tags "$name"
    while _tags; do
        if _requested "$name"; then
            values=( \$( ${this.cmd.getName()} completions complete $action $@) )
            if (( \${#values[@]} )); then
                while _next_label "$name" expl "$action"; do
                    compadd -S '' "\$expl[@]" $values[@]
                done
            fi
        fi
    done
}

${this.generateCompletions(this.cmd).trim()}

# _${ug(this.cmd.getPath())} "\${@}"

compdef _${ug(this.cmd.getPath())} ${this.cmd.getPath()}

#
# Local Variables:
# mode: Shell-Script
# sh-indentation: 4
# indent-tabs-mode: nil
# sh-basic-offset: 4
# End:
# vim: ft=zsh sw=4 ts=4 et
`.trim();
    }
    generateCompletions(yg, zg = '') {
        if (!yg.hasCommands(false) && !yg.hasOptions(false) && !yg.hasArguments()) {
            return '';
        }
        zg = (zg ? zg + ' ' : '') + yg.getName();
        return `(( $+functions[_${ug(zg)}] )) ||
function _${ug(zg)}() {` + (!yg.getParent() ? `\n\n    local context state state_descr line\n    typeset -A opt_args` : '') + this.generateCommandCompletions(yg, zg) + this.generateSubCommandCompletions(yg, zg) + this.generateArgumentCompletions(yg, zg) + this.generateActions(yg) + `\n}\n\n` + yg.getCommands(false).filter((a)=>a !== yg
        ).map((a)=>this.generateCompletions(a, zg)
        ).join('');
    }
    generateCommandCompletions(Ag, Bg) {
        const Cg = Ag.getCommands(false);
        let Dg = Cg.map((a)=>`'${a.getName()}:${a.getShortDescription()}'`
        ).join('\n            ');
        if (Dg) {
            Dg = `
        local -a commands
        commands=(
            ${Dg}
        )
        _describe 'command' commands`;
        }
        if (Ag.hasArguments()) {
            const Eg = Bg.split(' ').slice(1).join(' ');
            const Fg = Ag.getArguments()[0];
            const Gg = this.addAction(Fg, Eg);
            if (Gg) {
                Dg += `\n        __${ug(this.cmd.getName())}_complete ${Gg.arg.name} ${Gg.arg.action} ${Gg.cmd}`;
            }
        }
        if (Dg) {
            Dg = `\n\n    function _commands() {${Dg}\n    }`;
        }
        return Dg;
    }
    generateSubCommandCompletions(Hg, Ig) {
        if (Hg.hasCommands(false)) {
            const Jg = Hg.getCommands(false).map((a)=>`${a.getName()}) _${ug(Ig + ' ' + a.getName())} ;;`
            ).join('\n            ');
            return `\n
    function _command_args() {
        case "$words[1]" in\n            ${Jg}\n        esac
    }`;
        }
        return '';
    }
    generateArgumentCompletions(Kg, Lg) {
        this.actions.clear();
        const Mg = this.generateOptions(Kg, Lg);
        let Ng = 0;
        let Og = '\n\n    _arguments -w -s -S -C';
        if (Kg.hasOptions()) {
            Og += ` \\\n        ${Mg.join(' \\\n        ')}`;
        }
        if (Kg.hasCommands(false) || Kg.hasArguments()) {
            Og += ` \\\n        '${++Ng}: :_commands'`;
        }
        if (Kg.hasArguments() || Kg.hasCommands(false)) {
            const Pg = [];
            for (const Qg of Kg.getArguments().slice(1)){
                const Rg = Lg.split(' ').slice(1).join(' ');
                const Sg = this.addAction(Qg, Rg);
                Pg.push(`${++Ng}${Qg.optionalValue ? '::' : ':'}${Sg.name}`);
            }
            Og += Pg.map((a)=>`\\\n        '${a}'`
            ).join('');
            if (Kg.hasCommands(false)) {
                Og += ` \\\n        '*:: :->command_args'`;
            }
        }
        return Og;
    }
    generateOptions(Tg, Ug) {
        const Vg = [];
        const Wg = Ug.split(' ');
        Wg.shift();
        const Xg = Wg.join(' ');
        const Yg = Tg.getOptions(false).map((a)=>a.standalone ? a.flags.split(/[, ] */g) : false
        ).flat().filter((a)=>typeof a === 'string'
        );
        for (const Zg of Tg.getOptions(false)){
            Vg.push(this.generateOption(Zg, Xg, Yg));
        }
        return Vg;
    }
    generateOption($g, _g, ah) {
        let bh = $g.conflicts?.length ? [
            ...ah,
            ...$g.conflicts
        ] : ah;
        bh = $g.collect ? bh : [
            ...bh,
            ...$g.flags.split(/[, ] */g)
        ];
        let ch = '';
        for (const dh of $g.args){
            const eh = this.addAction(dh, _g);
            if (dh.variadic) {
                ch += `${dh.optionalValue ? '::' : ':'}${dh.name}:->${eh.name}`;
            } else {
                ch += `${dh.optionalValue ? '::' : ':'}${dh.name}:->${eh.name}`;
            }
        }
        const fh = $g.description.trim().split('\n').shift();
        const gh = $g.collect ? '*' : '';
        const hh = $g.flags.replace(/ +/g, '');
        if ($g.standalone) {
            return `'(- *)'{${gh}${hh}}'[${fh}]${ch}'`;
        } else {
            const ih = bh.length ? `'(${bh.join(' ')})'` : '';
            return `${ih}{${gh}${hh}}'[${fh}]${ch}'`;
        }
    }
    addAction(jh, kh) {
        const lh = `${jh.name}-${jh.action}`;
        if (!this.actions.has(lh)) {
            this.actions.set(lh, {
                arg: jh,
                label: `${jh.name}: ${jh.action}`,
                name: lh,
                cmd: kh
            });
        }
        return this.actions.get(lh);
    }
    generateActions(mh) {
        let nh = [];
        if (this.actions.size) {
            nh = Array.from(this.actions).map(([a, b])=>`${a}) __${ug(this.cmd.getName())}_complete ${b.arg.name} ${b.arg.action} ${b.cmd} ;;`
            );
        }
        if (mh.hasCommands(false)) {
            nh.unshift(`command_args) _command_args ;;`);
        }
        if (nh.length) {
            return `\n\n    case "$state" in\n        ${nh.join('\n        ')}\n    esac`;
        }
        return '';
    }
}
new vd();
