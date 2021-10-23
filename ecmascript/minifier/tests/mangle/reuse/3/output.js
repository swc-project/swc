const a = new TextEncoder();
function b(c) {
    return a.encode(c);
}
new TextDecoder();
const d = globalThis.Deno?.noColor ?? true;
let e = !d;
function f(c, g) {
    return {
        open: `\x1b[${c.join(";")}m`,
        close: `\x1b[${g}m`,
        regexp: new RegExp(`\\x1b\\[${g}m`, "g")
    };
}
function h(c, g) {
    return e ? `${g.open}${c.replace(g.regexp, g.open)}${g.close}` : c;
}
function i(c) {
    return h(c, f([
        1
    ], 22));
}
function j(c) {
    return h(c, f([
        2
    ], 22));
}
function k(c) {
    return h(c, f([
        31
    ], 39));
}
function l(c) {
    return h(c, f([
        32
    ], 39));
}
function m(c) {
    return h(c, f([
        33
    ], 39));
}
function n(c) {
    return h(c, f([
        34
    ], 39));
}
function o(c) {
    return h(c, f([
        35
    ], 39));
}
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
const p = /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g;
const q = /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g;
const r = /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;
const s = {
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
function t(c, g) {
    const u = g && s[g];
    c = c == null ? '' : String(c);
    if (u) {
        c = c.replace(u.regexp, (v)=>u.map[v]
        );
    }
    return c.toLowerCase();
}
function w(c, g, u) {
    if (c == null) {
        return '';
    }
    u = typeof u !== 'string' ? ' ' : u;
    function v(x, y, z) {
        if (y === 0 || y === z.length - x.length) {
            return '';
        }
        return u || '';
    }
    c = String(c).replace(p, '$1 $2').replace(q, '$1 $2').replace(r, v);
    return t(c, g);
}
const A = {
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
function B(c, g) {
    const u = g && A[g];
    c = c == null ? '' : String(c);
    if (u) {
        c = c.replace(u.regexp, function(x) {
            return u.map[x];
        });
    }
    return c.toUpperCase();
}
function C(c, g, u) {
    let v = w(c, g);
    if (!u) {
        v = v.replace(/ (?=\d)/g, '_');
    }
    return v.replace(/ (.)/g, function(x, y) {
        return B(y, g);
    });
}
function D(c, g) {
    return w(c, g, '-');
}
function E(c) {
    const g = [];
    let u = false;
    for (const v of c){
        if (u) {
            g.push(v);
        } else if (v === '--') {
            u = true;
            g.push(v);
        } else if (v[0] === '-') {
            const x = v[1] === '-';
            if (v.includes('=')) {
                const y = v.split('=');
                const z = y.shift();
                if (x) {
                    g.push(z);
                } else {
                    F(z);
                }
                g.push(y.join('='));
            } else if (x) {
                g.push(v);
            } else {
                F(v);
            }
        } else {
            g.push(v);
        }
    }
    return g;
    function F(G) {
        const H = G.slice(1).split('');
        if (isNaN(G[G.length - 1])) {
            H.forEach((I)=>g.push(`-${I}`)
            );
        } else {
            g.push(`-${H.shift()}`);
            g.push(H.join(''));
        }
    }
}
var J;
(function(c) {
    c["STRING"] = 'string';
    c["NUMBER"] = 'number';
    c["BOOLEAN"] = 'boolean';
})(J || (J = {
}));
const K = (c, g, u)=>{
    if (~[
        '1',
        'true'
    ].indexOf(u)) {
        return true;
    }
    if (~[
        '0',
        'false'
    ].indexOf(u)) {
        return false;
    }
    throw new Error(`Option --${c.name} must be of type boolean but got: ${u}`);
};
const L = (c, g, u)=>{
    if (isNaN(u)) {
        throw new Error(`Option --${c.name} must be of type number but got: ${u}`);
    }
    return parseFloat(u);
};
const M = (c, g, u)=>{
    return u;
};
const N = {
    [J.STRING]: M,
    [J.NUMBER]: L,
    [J.BOOLEAN]: K
};
function O(c, g) {
    while(g[0] === '-'){
        g = g.slice(1);
    }
    for (const u of c){
        if (v(u, g)) {
            return u;
        }
    }
    return;
}
function P(c, g, u, x) {
    const y = {
    };
    for (const z of c){
        const F = C(z.name);
        if (typeof g[F] === 'undefined' && typeof z.default !== 'undefined') {
            g[F] = typeof z.default === 'function' ? z.default() : z.default;
            y[F] = true;
        }
    }
    const G = Object.keys(g);
    if (G.length === 0 && x) {
        return;
    }
    const I = G.map((Q)=>({
            name: Q,
            option: O(c, D(Q))
        })
    );
    for (const { name: R , option: S  } of I){
        if (!S) {
            throw new Error('Unknown option: --' + R);
        }
        if (S.standalone) {
            if (G.length > 1) {
                if (I.every(({ option: T  })=>T && (S === T || y[T.name])
                )) {
                    return;
                }
                throw new Error(`Option --${S.name} cannot be combined with other options.`);
            }
            return;
        }
        S.conflicts?.forEach((U)=>{
            if (V(U)) {
                throw new Error(`Option --${S.name} conflicts with option: --${U}`);
            }
        });
        S.depends?.forEach((W)=>{
            if (!V(W) && !y[S.name]) {
                throw new Error(`Option --${S.name} depends on option: --${W}`);
            }
        });
        const X = (S.args?.length || 0) > 1;
        S.args?.forEach((Y, Z)=>{
            if (Y.requiredValue && (typeof g[R] === 'undefined' || X && typeof g[R][Z] === 'undefined')) {
                throw new Error(`Missing value for option: --${S.name}`);
            }
        });
        function V($) {
            const _ = C($);
            return typeof g[_] !== 'undefined';
        }
    }
    for (const aa of c){
        if (aa.required && !(C(aa.name) in g)) {
            if ((!aa.conflicts || !aa.conflicts.find((ba)=>!!g[ba]
            )) && !I.find((ca)=>ca.option?.conflicts?.find((da)=>da === aa.name
                )
            )) {
                throw new Error(`Missing required option: --${aa.name}`);
            }
        }
    }
    if (G.length === 0 && !x) {
        throw new Error('No arguments.');
    }
}
function ea(c, g = {
}) {
    !g.flags && (g.flags = []);
    const u = E(c);
    let y = false;
    let z = false;
    const F = {
    };
    const G = [];
    const H = [];
    let I = false;
    g.flags.forEach((Q)=>{
        Q.depends?.forEach((R)=>{
            if (!g.flags || !O(g.flags, R)) {
                throw new Error(`Unknown required option: ${R}`);
            }
        });
        Q.conflicts?.forEach((S)=>{
            if (!g.flags || !O(g.flags, S)) {
                throw new Error(`Unknown conflicting option: ${S}`);
            }
        });
    });
    for(let T = 0; T < u.length; T++){
        let U;
        let V;
        const W = u[T];
        if (y) {
            G.push(W);
            continue;
        }
        if (W === '--') {
            y = true;
            continue;
        }
        const X = W.length > 1 && W[0] === '-';
        const Y = ()=>u[T + 1]
        ;
        if (X && !I) {
            if (W[2] === '-' || W[1] === '-' && W.length === 3) {
                throw new Error(`Invalid flag name: ${W}`);
            }
            z = W.indexOf('--no-') === 0;
            const Z = W.replace(/^-+(no-)?/, '');
            U = O(g.flags, Z);
            if (!U) {
                if (g.flags.length) {
                    throw new Error(`Unknown option: ${W}`);
                }
                U = {
                    name: Z,
                    optionalValue: true,
                    type: J.STRING
                };
            }
            if (!U.name) {
                throw new Error(`Missing name for option: ${W}`);
            }
            const $ = C(U.name);
            if (typeof F[$] !== 'undefined' && !U.collect) {
                throw new Error(`Duplicate option: ${W}`);
            }
            V = U.args?.length ? U.args : [
                {
                    type: U.type,
                    requiredValue: U.requiredValue,
                    optionalValue: U.optionalValue,
                    variadic: U.variadic,
                    list: U.list,
                    separator: U.separator
                }
            ];
            let _ = 0;
            let aa = false;
            const ba = F[$];
            ca(U, V);
            if (typeof F[$] === 'undefined') {
                if (typeof U.default !== 'undefined') {
                    F[$] = typeof U.default === 'function' ? U.default() : U.default;
                } else if (V[_].requiredValue) {
                    throw new Error(`Missing value for option: --${U.name}`);
                } else {
                    F[$] = true;
                }
            }
            if (typeof U.value !== 'undefined') {
                F[$] = U.value(F[$], ba);
            } else if (U.collect) {
                const da = ba || [];
                da.push(F[$]);
                F[$] = da;
            }
            function ca(fa, ga) {
                const ha = ga[_];
                if (!ha) {
                    throw new Error('Unknown option: ' + Y());
                }
                if (!ha.type) {
                    ha.type = J.BOOLEAN;
                }
                if (fa.args?.length) {
                    if ((typeof ha.optionalValue === 'undefined' || ha.optionalValue === false) && typeof ha.requiredValue === 'undefined') {
                        ha.requiredValue = true;
                    }
                } else {
                    if (ha.type !== J.BOOLEAN && (typeof ha.optionalValue === 'undefined' || ha.optionalValue === false) && typeof ha.requiredValue === 'undefined') {
                        ha.requiredValue = true;
                    }
                }
                if (ha.requiredValue) {
                    if (aa) {
                        throw new Error(`An required argument can not follow an optional argument but found in: ${fa.name}`);
                    }
                } else {
                    aa = true;
                }
                if (z) {
                    if (ha.type !== J.BOOLEAN && !ha.optionalValue) {
                        throw new Error(`Negate not supported by --${fa.name}. Only optional option or options of type boolean can be negated.`);
                    }
                    F[$] = false;
                    return;
                }
                let ia;
                let ja = false;
                if (ha.list && ka(ha)) {
                    const la = Y().split(ha.separator || ',').map((ma)=>{
                        const na = oa(fa, ha, ma);
                        if (typeof na === 'undefined') {
                            throw new Error(`List item of option --${fa?.name} must be of type ${ha.type} but got: ${ma}`);
                        }
                        return na;
                    });
                    if (la?.length) {
                        ia = la;
                    }
                } else {
                    if (ka(ha)) {
                        ia = oa(fa, ha, Y());
                    } else if (ha.optionalValue && ha.type === J.BOOLEAN) {
                        ia = true;
                    }
                }
                if (ja) {
                    T++;
                    if (!ha.variadic) {
                        _++;
                    } else if (ga[_ + 1]) {
                        throw new Error('An argument cannot follow an variadic argument: ' + Y());
                    }
                }
                if (typeof ia !== 'undefined' && (ga.length > 1 || ha.variadic)) {
                    if (!F[$]) {
                        F[$] = [];
                    }
                    F[$].push(ia);
                    if (ka(ha)) {
                        ca(fa, ga);
                    }
                } else {
                    F[$] = ia;
                }
                function ka(pa) {
                    return !!(u[T + 1] && (pa.optionalValue || pa.requiredValue || pa.variadic) && (u[T + 1][0] !== '-' || pa.type === J.NUMBER && !isNaN(u[T + 1])) && pa);
                }
                function oa(qa, ra, sa) {
                    let ta = g.parse ? g.parse(ra.type || J.STRING, qa, ra, sa) : ua(qa, ra, sa);
                    if (typeof ta !== 'undefined') {
                        ja = true;
                    }
                    return ta;
                }
            }
        } else {
            if (g.stopEarly) {
                I = true;
            }
            H.push(W);
        }
    }
    if (g.flags && g.flags.length) {
        P(g.flags, F, g.knownFlaks, g.allowEmpty);
    }
    return {
        flags: F,
        unknown: H,
        literal: G
    };
}
function ua(c, g, u) {
    const x = N[g.type || J.STRING];
    if (!x) {
        throw new Error(`Unknown type ${g.type}`);
    }
    return x(c, g, u);
}
function v(c, g) {
    return c.name === g || c.aliases && c.aliases.indexOf(g) !== -1;
}
function va(c, g = '', u = ' ') {
    while(g.length < c){
        g += u;
    }
    return g;
}
const { inspect  } = Deno;
const wa = /%[sdjoO%]/g;
function xa(...c) {
    if (typeof c[0] !== 'string') {
        let g = [];
        for(let u = 0; u < arguments.length; u++){
            g.push(inspect(arguments[u]));
        }
        return g.join(' ');
    }
    let z = 1;
    const F = c[0];
    const G = c.length;
    let H = String(F).replace(wa, function(I) {
        if (I === '%%') {
            return '%';
        }
        if (z >= G) {
            return I;
        }
        switch(I){
            case '%s':
                return String(c[z++]);
            case '%d':
                return String(Number(c[z++]));
            case '%j':
                try {
                    return JSON.stringify(c[z++]);
                } catch (S) {
                    return '[Circular]';
                }
            case '%o':
            case '%O':
                return inspect(c[z++]);
            default:
                return I;
        }
    });
    for(let T = c[z]; z < G; T = c[++z]){
        if (T == null || typeof T !== 'object') {
            H += ' ' + T;
        } else {
            H += ' ' + inspect(T);
        }
    }
    return H;
}
class ya {
}
class za extends ya {
    parse(Aa, Ba, Ca) {
        return K(Aa, Ba, Ca);
    }
    complete() {
        return [
            'true',
            'false'
        ];
    }
}
class Da extends ya {
    parse(Ea, Fa, Ga) {
        return L(Ea, Fa, Ga);
    }
}
class Ha extends ya {
    parse(Ia, Ja, Ka) {
        return M(Ia, Ja, Ka);
    }
}
class La {
    static splitArguments(Ma) {
        const Na = Ma.trim().split(/[, =] */g);
        const Oa = [];
        while(Na[Na.length - 1] && this.ARGUMENT_REGEX.test(Na[Na.length - 1])){
            Oa.unshift(Na.pop());
        }
        const Pa = Oa.join(' ');
        return {
            args: Na,
            typeDefinition: Pa
        };
    }
    static parseArgumentsDefinition(Qa) {
        const Ra = [];
        let Sa = false;
        let Ta = false;
        const Ua = Qa.split(/ +/);
        for (const Va of Ua){
            if (Ta) {
                throw new Error('An argument can not follow an variadic argument.');
            }
            const Wa = Va.split(this.ARGUMENT_DETAILS_REGEX);
            const Xa = Wa[2] || J.STRING;
            let Ya = {
                optionalValue: Va[0] !== '<',
                name: Wa[1],
                action: Wa[3] || Xa,
                variadic: false,
                list: Xa ? Va.indexOf(Xa + '[]') !== -1 : false,
                type: Xa
            };
            if (!Ya.optionalValue && Sa) {
                throw new Error('An required argument can not follow an optional argument.');
            }
            if (Va[0] === '[') {
                Sa = true;
            }
            if (Ya.name.length > 3) {
                const Za = Ya.name.slice(0, 3) === '...';
                const $a = Ya.name.slice(-3) === '...';
                Ta = Ya.variadic = Za || $a;
                if (Za) {
                    Ya.name = Ya.name.slice(3);
                } else if ($a) {
                    Ya.name = Ya.name.slice(0, -3);
                }
            }
            if (Ya.name) {
                Ra.push(Ya);
            }
        }
        return Ra;
    }
    static highlightArguments(_a) {
        if (!_a) {
            return '';
        }
        return this.parseArgumentsDefinition(_a).map((c)=>this.highlightArgumentDetails(c)
        ).join(' ');
    }
    static highlightArgumentDetails(ab) {
        let bb = '';
        bb += m(ab.optionalValue ? '[' : '<');
        let cb = '';
        cb += ab.name;
        if (ab.variadic) {
            cb += '...';
        }
        cb = o(cb);
        bb += cb;
        bb += m(':');
        bb += k(ab.type);
        if (ab.list) {
            bb += l('[]');
        }
        bb += m(ab.optionalValue ? ']' : '>');
        return bb;
    }
}
La.ARGUMENT_REGEX = /^[<\[].+[\]>]$/;
La.ARGUMENT_DETAILS_REGEX = /[<\[:>\]]/;
const db = {
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
class eb {
    get length() {
        return this.toString().length;
    }
    static from(fb) {
        const gb = new this(fb);
        if (fb instanceof eb) {
            gb.options = Object.assign({
            }, fb.options);
        }
        return gb;
    }
    constructor(hb){
        this.value = hb;
        this.options = {
        };
    }
    toString() {
        return this.value.toString();
    }
    setValue(ib) {
        this.value = ib;
        return this;
    }
    clone(jb) {
        const kb = new eb(jb ?? this);
        kb.options = Object.assign({
        }, this.options);
        return kb;
    }
    border(lb, mb = true) {
        if (mb || typeof this.options.border === 'undefined') {
            this.options.border = lb;
        }
        return this;
    }
    colSpan(nb, ob = true) {
        if (ob || typeof this.options.colSpan === 'undefined') {
            this.options.colSpan = nb;
        }
        return this;
    }
    rowSpan(pb, qb = true) {
        if (qb || typeof this.options.rowSpan === 'undefined') {
            this.options.rowSpan = pb;
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
class rb extends Array {
    static from(sb) {
        const tb = new this(...sb);
        if (sb instanceof rb) {
            tb.options = Object.assign({
            }, sb.options);
        }
        return tb;
    }
    clone() {
        const ub = new rb(...this.map((c)=>c instanceof eb ? c.clone() : c
        ));
        ub.options = Object.assign({
        }, this.options);
        return ub;
    }
    border(vb, wb = true) {
        if (wb || typeof this.options.border === 'undefined') {
            this.options.border = vb;
        }
        return this;
    }
    getBorder() {
        return this.options.border === true;
    }
    hasBorder() {
        return this.getBorder() || this.some((c)=>c instanceof eb && c.getBorder()
        );
    }
    constructor(...xb){
        super(...xb);
        this.options = {
        };
    }
}
function yb(c, g) {
    let u = '';
    const v = g.split(/ /g);
    for(let x = 0; x < v.length; x++){
        let y = v[x];
        let z = y.indexOf('\n') !== -1;
        if (z) {
            y = y.split('\n').shift();
        }
        if (u) {
            const F = G(y).length;
            const H = G(u).length;
            if (H + F >= c) {
                break;
            }
        }
        u += (x > 0 ? ' ' : '') + y;
        if (z) {
            break;
        }
    }
    return u;
}
const zb = /(\x1b|\e|\033)\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]/g;
function G(c) {
    return c.replace(zb, '');
}
function Ab(c, g, u) {
    return Math.max(...g.map((x)=>(x[c] instanceof eb && x[c].getColSpan() > 1 ? '' : x[c]?.toString() || '').split('\n').map((y)=>{
            const z = typeof u === 'undefined' ? y : yb(u, y);
            return G(z).length || 0;
        })
    ).flat());
}
class Bb {
    constructor(Cb, Db){
        this.table = Cb;
        this.options = Db;
    }
    toString() {
        const Eb = this.createLayout();
        return Eb.rows.length ? this.renderRows(Eb) : '';
    }
    createLayout() {
        Object.keys(this.options.chars).forEach((c)=>{
            if (typeof this.options.chars[c] !== 'string') {
                this.options.chars[c] = '';
            }
        });
        const Fb = this.table.getBorder() || this.table.hasBodyBorder();
        const Gb = this.table.hasHeaderBorder();
        const Hb = Gb || Fb;
        const Ib = this.table.getHeader();
        const Jb = this.spanRows(Ib ? [
            Ib,
            ...this.table
        ] : this.table.slice());
        const Kb = Math.max(...Jb.map((c)=>c.length
        ));
        for (const Lb of Jb){
            const Mb = Lb.length;
            if (Mb < Kb) {
                const Nb = Kb - Mb;
                for(let Ob = 0; Ob < Nb; Ob++){
                    Lb.push(this.createCell(null, Lb));
                }
            }
        }
        const Pb = [];
        const Qb = [];
        for(let Rb = 0; Rb < Kb; Rb++){
            const Sb = Array.isArray(this.options.minCellWidth) ? this.options.minCellWidth[Rb] : this.options.minCellWidth;
            const Tb = Array.isArray(this.options.maxCellWidth) ? this.options.maxCellWidth[Rb] : this.options.maxCellWidth;
            const Ub = Ab(Rb, Jb, Tb);
            Qb[Rb] = Math.min(Tb, Math.max(Sb, Ub));
            Pb[Rb] = Array.isArray(this.options.padding) ? this.options.padding[Rb] : this.options.padding;
        }
        return {
            padding: Pb,
            width: Qb,
            rows: Jb,
            columns: Kb,
            hasBorder: Hb,
            hasBodyBorder: Fb,
            hasHeaderBorder: Gb
        };
    }
    spanRows(Vb, Wb = 0, Xb = 0, Yb = [], Zb = 1) {
        const $b = Vb;
        if (Wb >= $b.length && Yb.every((c)=>c === 1
        )) {
            return $b;
        } else if ($b[Wb] && Xb >= $b[Wb].length && Xb >= Yb.length && Zb === 1) {
            return this.spanRows($b, ++Wb, 0, Yb, 1);
        }
        if (Zb > 1) {
            Zb--;
            Yb[Xb] = Yb[Xb - 1];
            $b[Wb].splice(Xb - 1, 0, $b[Wb][Xb - 1]);
            return this.spanRows($b, Wb, ++Xb, Yb, Zb);
        }
        if (Xb === 0) {
            $b[Wb] = this.createRow($b[Wb] || []);
        }
        if (Yb[Xb] > 1) {
            Yb[Xb]--;
            $b[Wb].splice(Xb, 0, $b[Wb - 1][Xb]);
            return this.spanRows($b, Wb, ++Xb, Yb, Zb);
        }
        $b[Wb][Xb] = this.createCell($b[Wb][Xb] || null, $b[Wb]);
        Zb = $b[Wb][Xb].getColSpan();
        Yb[Xb] = $b[Wb][Xb].getRowSpan();
        return this.spanRows($b, Wb, ++Xb, Yb, Zb);
    }
    createRow(_b) {
        return rb.from(_b).border(this.table.getBorder(), false);
    }
    createCell(ac, bc) {
        return eb.from(ac ?? '').border(bc.getBorder(), false);
    }
    renderRows(cc) {
        let dc = '';
        const ec = new Array(cc.columns).fill(1);
        for(let fc = 0; fc < cc.rows.length; fc++){
            dc += this.renderRow(ec, fc, cc);
        }
        return dc.slice(0, -1);
    }
    renderRow(gc, hc, ic, jc) {
        const kc = ic.rows[hc];
        const lc = ic.rows[hc - 1];
        const mc = ic.rows[hc + 1];
        let nc = '';
        let oc = 1;
        if (!jc && hc === 0 && kc.hasBorder()) {
            nc += this.renderBorderRow(undefined, kc, gc, ic);
        }
        let pc = false;
        nc += ' '.repeat(this.options.indent || 0);
        for(let qc = 0; qc < ic.columns; qc++){
            if (oc > 1) {
                oc--;
                gc[qc] = gc[qc - 1];
                continue;
            }
            nc += this.renderCell(qc, kc, lc, gc, ic);
            if (gc[qc] > 1) {
                if (!jc) {
                    gc[qc]--;
                }
            } else if (!lc || lc[qc] !== kc[qc]) {
                gc[qc] = kc[qc].getRowSpan();
            }
            oc = kc[qc].getColSpan();
            if (gc[qc] === 1 && kc[qc].length) {
                pc = true;
            }
        }
        if (ic.columns > 0) {
            if (kc[ic.columns - 1].getBorder()) {
                nc += this.options.chars.right;
            } else if (ic.hasBorder) {
                nc += ' ';
            }
        }
        nc += '\n';
        if (pc) {
            return nc + this.renderRow(gc, hc, ic, pc);
        }
        if (hc === 0 && ic.hasHeaderBorder || hc < ic.rows.length - 1 && ic.hasBodyBorder) {
            nc += this.renderBorderRow(kc, mc, gc, ic);
        }
        if (hc === ic.rows.length - 1 && kc.hasBorder()) {
            nc += this.renderBorderRow(kc, undefined, gc, ic);
        }
        return nc;
    }
    renderCell(rc, sc, tc, uc, vc, wc) {
        let xc = '';
        const yc = sc[rc - 1];
        const zc = sc[rc];
        if (!wc) {
            if (rc === 0) {
                if (zc.getBorder()) {
                    xc += this.options.chars.left;
                } else if (vc.hasBorder) {
                    xc += ' ';
                }
            } else {
                if (zc.getBorder() || yc?.getBorder()) {
                    xc += this.options.chars.middle;
                } else if (vc.hasBorder) {
                    xc += ' ';
                }
            }
        }
        let Ac = vc.width[rc];
        const Bc = zc.getColSpan();
        if (Bc > 1) {
            for(let Cc = 1; Cc < Bc; Cc++){
                Ac += vc.width[rc + Cc] + vc.padding[rc + Cc];
                if (vc.hasBorder) {
                    Ac += vc.padding[rc + Cc] + 1;
                }
            }
        }
        const { current , next  } = this.renderCellValue(zc, Ac);
        sc[rc].setValue(next);
        if (vc.hasBorder) {
            xc += ' '.repeat(vc.padding[rc]);
        }
        xc += current;
        if (vc.hasBorder || rc < vc.columns - 1) {
            xc += ' '.repeat(vc.padding[rc]);
        }
        return xc;
    }
    renderCellValue(Dc, Ec) {
        const Fc = Math.min(Ec, G(Dc.toString()).length);
        let Gc = yb(Fc, Dc.toString());
        const Hc = G(Gc).length > Fc;
        if (Hc) {
            Gc = Gc.slice(0, Fc);
        }
        const Ic = Dc.toString().slice(Gc.length + (Hc ? 0 : 1));
        const Jc = Ec - G(Gc).length;
        const Kc = Gc + ' '.repeat(Jc);
        return {
            current: Kc,
            next: Dc.clone(Ic)
        };
    }
    renderBorderRow(Lc, Mc, Nc, Oc) {
        let Pc = '';
        let Qc = 1;
        for(let Rc = 0; Rc < Oc.columns; Rc++){
            if (Nc[Rc] > 1) {
                if (!Mc) {
                    throw new Error('invalid layout');
                }
                if (Qc > 1) {
                    Qc--;
                    continue;
                }
            }
            Pc += this.renderBorderCell(Rc, Lc, Mc, Nc, Oc);
            Qc = Mc?.[Rc].getColSpan() ?? 1;
        }
        return Pc.length ? ' '.repeat(this.options.indent) + Pc + '\n' : '';
    }
    renderBorderCell(Sc, Tc, Uc, Vc, Wc) {
        const Xc = Tc?.[Sc - 1];
        const Yc = Uc?.[Sc - 1];
        const Zc = Tc?.[Sc];
        const $c = Uc?.[Sc];
        const _c = !!Xc?.getBorder();
        const ad = !!Yc?.getBorder();
        const bd = !!Zc?.getBorder();
        const cd = !!$c?.getBorder();
        const dd = (c)=>(c?.getColSpan() ?? 1) > 1
        ;
        const ed = (c)=>(c?.getRowSpan() ?? 1) > 1
        ;
        let fd = '';
        if (Sc === 0) {
            if (Vc[Sc] > 1) {
                if (bd) {
                    fd += this.options.chars.left;
                } else {
                    fd += ' ';
                }
            } else if (bd && cd) {
                fd += this.options.chars.leftMid;
            } else if (bd) {
                fd += this.options.chars.bottomLeft;
            } else if (cd) {
                fd += this.options.chars.topLeft;
            } else {
                fd += ' ';
            }
        } else if (Sc < Wc.columns) {
            if (_c && cd || bd && ad) {
                const gd = dd(Xc);
                const hd = dd(Yc);
                const id = dd(Zc);
                const jd = dd($c);
                const kd = ed(Xc);
                const ld = ed(Yc);
                const md = ed(Zc);
                const nd = ed($c);
                const od = _c && cd && bd && ad;
                const pd = kd && md && ld && nd;
                const qd = gd && id && hd && jd;
                if (pd && od) {
                    fd += this.options.chars.middle;
                } else if (qd && od && Xc === Zc && Yc === $c) {
                    fd += this.options.chars.mid;
                } else if (gd && id && Xc === Zc) {
                    fd += this.options.chars.topMid;
                } else if (hd && jd && Yc === $c) {
                    fd += this.options.chars.bottomMid;
                } else if (kd && ld && Xc === Yc) {
                    fd += this.options.chars.leftMid;
                } else if (md && nd && Zc === $c) {
                    fd += this.options.chars.rightMid;
                } else {
                    fd += this.options.chars.midMid;
                }
            } else if (_c && bd) {
                if (dd(Xc) && dd(Zc) && Xc === Zc) {
                    fd += this.options.chars.bottom;
                } else {
                    fd += this.options.chars.bottomMid;
                }
            } else if (bd && cd) {
                if (Vc[Sc] > 1) {
                    fd += this.options.chars.left;
                } else {
                    fd += this.options.chars.leftMid;
                }
            } else if (cd && ad) {
                if (dd(Yc) && dd($c) && Yc === $c) {
                    fd += this.options.chars.top;
                } else {
                    fd += this.options.chars.topMid;
                }
            } else if (_c && ad) {
                if (ed(Xc) && Xc === Yc) {
                    fd += this.options.chars.right;
                } else {
                    fd += this.options.chars.rightMid;
                }
            } else if (_c) {
                fd += this.options.chars.bottomRight;
            } else if (bd) {
                fd += this.options.chars.bottomLeft;
            } else if (ad) {
                fd += this.options.chars.topRight;
            } else if (cd) {
                fd += this.options.chars.topLeft;
            } else {
                fd += ' ';
            }
        }
        const rd = Wc.padding[Sc] + Wc.width[Sc] + Wc.padding[Sc];
        if (Vc[Sc] > 1 && Uc) {
            fd += this.renderCell(Sc, Uc, Tc, Vc, Wc, true);
            if (Uc[Sc] === Uc[Uc.length - 1]) {
                if (bd) {
                    fd += this.options.chars.right;
                } else {
                    fd += ' ';
                }
                return fd;
            }
        } else if (bd && cd) {
            fd += this.options.chars.mid.repeat(rd);
        } else if (bd) {
            fd += this.options.chars.bottom.repeat(rd);
        } else if (cd) {
            fd += this.options.chars.top.repeat(rd);
        } else {
            fd += ' '.repeat(rd);
        }
        if (Sc === Wc.columns - 1) {
            if (bd && cd) {
                fd += this.options.chars.rightMid;
            } else if (bd) {
                fd += this.options.chars.bottomRight;
            } else if (cd) {
                fd += this.options.chars.topRight;
            } else {
                fd += ' ';
            }
        }
        return fd;
    }
}
class sd extends Array {
    static from(td) {
        const ud = new this(...td);
        if (td instanceof sd) {
            ud.options = Object.assign({
            }, td.options);
            ud.headerRow = td.headerRow ? rb.from(td.headerRow) : undefined;
        }
        return ud;
    }
    static fromJson(vd) {
        return new this().fromJson(vd);
    }
    static render(wd) {
        sd.from(wd).render();
    }
    fromJson(xd) {
        this.header(Object.keys(xd[0]));
        this.body(xd.map((c)=>Object.values(c)
        ));
        return this;
    }
    header(yd) {
        this.headerRow = yd instanceof rb ? yd : rb.from(yd);
        return this;
    }
    body(zd) {
        this.length = 0;
        this.push(...zd);
        return this;
    }
    clone() {
        const Ad = new sd(...this.map((c)=>c instanceof rb ? c.clone() : rb.from(c).clone()
        ));
        Ad.options = Object.assign({
        }, this.options);
        Ad.headerRow = this.headerRow?.clone();
        return Ad;
    }
    toString() {
        return new Bb(this, this.options).toString();
    }
    render() {
        Deno.stdout.writeSync(b(this.toString() + '\n'));
        return this;
    }
    maxCellWidth(Bd, Cd = true) {
        if (Cd || typeof this.options.maxCellWidth === 'undefined') {
            this.options.maxCellWidth = Bd;
        }
        return this;
    }
    minCellWidth(Dd, Ed = true) {
        if (Ed || typeof this.options.minCellWidth === 'undefined') {
            this.options.minCellWidth = Dd;
        }
        return this;
    }
    indent(Fd, Gd = true) {
        if (Gd || typeof this.options.indent === 'undefined') {
            this.options.indent = Fd;
        }
        return this;
    }
    padding(Hd, Id = true) {
        if (Id || typeof this.options.padding === 'undefined') {
            this.options.padding = Hd;
        }
        return this;
    }
    border(Jd, Kd = true) {
        if (Kd || typeof this.options.border === 'undefined') {
            this.options.border = Jd;
        }
        return this;
    }
    chars(Ld) {
        Object.assign(this.options.chars, Ld);
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
        return this.getBorder() || this.headerRow instanceof rb && this.headerRow.hasBorder();
    }
    hasBodyBorder() {
        return this.getBorder() || this.some((c)=>c instanceof rb ? c.hasBorder() : c.some((g)=>g instanceof eb ? g.getBorder : false
            )
        );
    }
    hasBorder() {
        return this.hasHeaderBorder() || this.hasBodyBorder();
    }
    constructor(...Md){
        super(...Md);
        this.options = {
            indent: 0,
            border: false,
            maxCellWidth: Infinity,
            minCellWidth: 0,
            padding: 1,
            chars: db
        };
    }
}
class Nd {
    static generate(Od) {
        return new Nd(Od).generate();
    }
    constructor(Pd){
        this.cmd = Pd;
        this.indent = 2;
    }
    generate() {
        return this.generateHeader() + this.generateDescription() + this.generateOptions() + this.generateCommands() + this.generateEnvironmentVariables() + this.generateExamples() + '\n';
    }
    generateHeader() {
        return '\n' + sd.from([
            [
                i('Usage:'),
                o(`${this.cmd.getName()}${this.cmd.getArgsDefinition() ? ' ' + this.cmd.getArgsDefinition() : ''}`)
            ],
            [
                i('Version:'),
                m(`v${this.cmd.getVersion()}`)
            ]
        ]).indent(this.indent).padding(1).toString() + '\n';
    }
    generateDescription() {
        if (!this.cmd.getDescription()) {
            return '';
        }
        return this.label('Description') + sd.from([
            [
                this.cmd.getDescription()
            ]
        ]).indent(this.indent * 2).maxCellWidth(140).padding(1).toString() + '\n';
    }
    generateOptions() {
        const Qd = this.cmd.getOptions(false);
        if (!Qd.length) {
            return '';
        }
        const Rd = !!Qd.find((c)=>!!c.typeDefinition
        );
        if (Rd) {
            return this.label('Options') + sd.from([
                ...Qd.map((c)=>[
                        c.flags.split(/,? +/g).map((g)=>n(g)
                        ).join(', '),
                        La.highlightArguments(c.typeDefinition || ''),
                        k(i('-')) + ' ' + c.description.split('\n').shift(),
                        this.generateHints(c)
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
        return this.label('Options') + sd.from([
            ...Qd.map((c)=>[
                    c.flags.split(/,? +/g).map((g)=>n(g)
                    ).join(', '),
                    k(i('-')) + ' ' + c.description.split('\n').shift(),
                    this.generateHints(c)
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
        const Sd = this.cmd.getCommands(false);
        if (!Sd.length) {
            return '';
        }
        const Td = !!Sd.find((c)=>!!c.getArgsDefinition()
        );
        if (Td) {
            return this.label('Commands') + sd.from([
                ...Sd.map((c)=>[
                        [
                            c.getName(),
                            ...c.getAliases()
                        ].map((g)=>n(g)
                        ).join(', '),
                        La.highlightArguments(c.getArgsDefinition() || ''),
                        k(i('-')) + ' ' + c.getDescription().split('\n').shift()
                    ]
                )
            ]).padding([
                2,
                2,
                2
            ]).indent(this.indent * 2).toString() + '\n';
        }
        return this.label('Commands') + sd.from([
            ...Sd.map((c)=>[
                    [
                        c.getName(),
                        ...c.getAliases()
                    ].map((g)=>n(g)
                    ).join(', '),
                    k(i('-')) + ' ' + c.getDescription().split('\n').shift()
                ]
            )
        ]).padding([
            2,
            2
        ]).indent(this.indent * 2).toString() + '\n';
    }
    generateEnvironmentVariables() {
        const Ud = this.cmd.getEnvVars(false);
        if (!Ud.length) {
            return '';
        }
        return this.label('Environment variables') + sd.from([
            ...Ud.map((c)=>[
                    c.names.map((g)=>n(g)
                    ).join(', '),
                    La.highlightArgumentDetails(c.details),
                    `${k(i('-'))} ${c.description}`
                ]
            )
        ]).padding(2).indent(this.indent * 2).toString() + '\n';
    }
    generateExamples() {
        const Vd = this.cmd.getExamples();
        if (!Vd.length) {
            return '';
        }
        return this.label('Examples') + sd.from(Vd.map((c)=>[
                j(i(`${g(c.name)}:`)),
                `\n${c.description}`
            ]
        )).padding(1).indent(this.indent * 2).maxCellWidth(150).toString() + '\n';
    }
    generateHints(Wd) {
        const Xd = [];
        Wd.required && Xd.push(m(`required`));
        typeof Wd.default !== 'undefined' && Xd.push(n(i(`Default: `)) + n(xa(Wd.default)));
        Wd.depends && Wd.depends.length && Xd.push(k(i(`depends: `)) + Wd.depends.map((c)=>k(c)
        ).join(', '));
        Wd.conflicts && Wd.conflicts.length && Xd.push(k(i(`conflicts: `)) + Wd.conflicts.map((c)=>k(c)
        ).join(', '));
        if (Xd.length) {
            return `(${Xd.join(', ')})`;
        }
        return '';
    }
    line(...Yd) {
        return (Yd.length ? ' '.repeat(this.indent) + xa(...Yd) : '') + '\n';
    }
    label(Zd) {
        return '\n' + this.line(i(`${Zd}:`)) + '\n';
    }
}
function g(c) {
    return (c?.charAt(0).toUpperCase() + c.slice(1)) ?? '';
}
const { stdout , stderr  } = Deno;
const $d = Deno.permissions;
const _d = $d && $d.query && await $d.query({
    name: 'env'
});
const ae = !!_d && _d.state === 'granted';
class be {
    versionOption(ce, de, ee) {
        this._versionOption = ce === false ? ce : {
            flags: ce,
            desc: de,
            opts: typeof ee === 'function' ? {
                action: ee
            } : ee
        };
        return this;
    }
    helpOption(fe, ge, he) {
        this._helpOption = fe === false ? fe : {
            flags: fe,
            desc: ge,
            opts: typeof he === 'function' ? {
                action: he
            } : he
        };
        return this;
    }
    command(ie, je, ke) {
        let le;
        if (typeof je === 'string') {
            le = je;
            je = undefined;
        }
        const me = La.splitArguments(ie);
        const ne = me.args.shift();
        const oe = me.args;
        if (!ne) {
            throw this.error(new Error('Missing command name.'));
        }
        if (this.getBaseCommand(ne, true)) {
            if (!ke) {
                throw this.error(new Error(`Duplicate command: ${ne}`));
            }
            this.removeCommand(ne);
        }
        const pe = (je || new be()).reset();
        pe._name = ne;
        pe._parent = this;
        if (le) {
            pe.isExecutable = true;
            pe.description(le);
        }
        if (me.typeDefinition) {
            pe.arguments(me.typeDefinition);
        }
        oe.forEach((c)=>pe.aliases.push(c)
        );
        this.commands.set(ne, pe);
        this.select(ne);
        return this;
    }
    alias(qe) {
        if (this.cmd === this) {
            throw this.error(new Error(`Failed to add alias '${qe}'. No sub command selected.`));
        }
        if (this.cmd.aliases.indexOf(qe) !== -1) {
            throw this.error(new Error(`Duplicate alias: ${qe}`));
        }
        this.cmd.aliases.push(qe);
        return this;
    }
    reset() {
        return this.cmd = this;
    }
    select(re) {
        const se = this.getBaseCommand(re, true);
        if (!se) {
            throw this.error(new Error(`Sub-command not found: ${re}`));
        }
        this.cmd = se;
        return this;
    }
    name(te) {
        this.cmd._name = te;
        return this;
    }
    version(ue) {
        this.cmd.ver = ue;
        return this;
    }
    description(ve) {
        this.cmd.desc = ve;
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
    arguments(we) {
        this.cmd.argsDefinition = we;
        return this;
    }
    action(xe) {
        this.cmd.fn = xe;
        return this;
    }
    allowEmpty(ye = true) {
        this.cmd._allowEmpty = ye;
        return this;
    }
    stopEarly(ze = true) {
        this.cmd._stopEarly = ze;
        return this;
    }
    useRawArgs(Ae = true) {
        this.cmd._useRawArgs = Ae;
        return this;
    }
    default(Be) {
        this.cmd.defaultCommand = Be;
        return this;
    }
    type(Ce, De, Ee) {
        if (this.cmd.types.get(Ce) && !Ee?.override) {
            throw this.error(new Error(`Type '${Ce}' already exists.`));
        }
        this.cmd.types.set(Ce, {
            ...Ee,
            name: Ce,
            handler: De
        });
        if (De instanceof ya && typeof De.complete !== 'undefined') {
            this.complete(Ce, (c, g)=>De.complete?.(c, g) || []
            , Ee);
        }
        return this;
    }
    complete(Fe, Ge, He) {
        if (this.cmd.completions.has(Fe) && !He?.override) {
            throw this.error(new Error(`Completion '${Fe}' already exists.`));
        }
        this.cmd.completions.set(Fe, {
            name: Fe,
            complete: Ge,
            ...He
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
        const Ie = (c, g = [], u = [])=>{
            if (c) {
                if (c.completions.size) {
                    c.completions.forEach((v)=>{
                        if (v.global && !this.completions.has(v.name) && u.indexOf(v.name) === -1) {
                            u.push(v.name);
                            g.push(v);
                        }
                    });
                }
                return Ie(c._parent, g, u);
            }
            return g;
        };
        return Ie(this._parent);
    }
    getCompletion(Je) {
        return this.getBaseCompletion(Je) ?? this.getGlobalCompletion(Je);
    }
    getBaseCompletion(Ke) {
        return this.completions.get(Ke);
    }
    getGlobalCompletion(Le) {
        if (!this._parent) {
            return;
        }
        let Me = this._parent.getBaseCompletion(Le);
        if (!Me?.global) {
            return this._parent.getGlobalCompletion(Le);
        }
        return Me;
    }
    option(Ne, Oe, Pe) {
        if (typeof Pe === 'function') {
            return this.option(Ne, Oe, {
                value: Pe
            });
        }
        const Qe = La.splitArguments(Ne);
        const Re = Qe.typeDefinition ? La.parseArgumentsDefinition(Qe.typeDefinition) : [];
        const Se = {
            name: '',
            description: Oe,
            args: Re,
            flags: Qe.args.join(', '),
            typeDefinition: Qe.typeDefinition,
            ...Pe
        };
        if (Se.separator) {
            for (const Te of Re){
                if (Te.list) {
                    Te.separator = Se.separator;
                }
            }
        }
        for (const Ue of Qe.args){
            const Ve = Ue.trim();
            const We = /^--/.test(Ve);
            const Xe = We ? Ve.slice(2) : Ve.slice(1);
            if (Se.name === Xe || Se.aliases && ~Se.aliases.indexOf(Xe)) {
                throw this.error(new Error(`Duplicate command name: ${Xe}`));
            }
            if (!Se.name && We) {
                Se.name = Xe;
            } else if (!Se.aliases) {
                Se.aliases = [
                    Xe
                ];
            } else {
                Se.aliases.push(Xe);
            }
            if (this.cmd.getBaseOption(Xe, true)) {
                if (Pe?.override) {
                    this.removeOption(Xe);
                } else {
                    throw this.error(new Error(`Duplicate option name: ${Xe}`));
                }
            }
        }
        if (Se.prepend) {
            this.cmd.options.unshift(Se);
        } else {
            this.cmd.options.push(Se);
        }
        return this;
    }
    example(Ye, Ze) {
        if (this.cmd.hasExample(Ye)) {
            throw this.error(new Error('Example already exists.'));
        }
        this.cmd.examples.push({
            name: Ye,
            description: Ze
        });
        return this;
    }
    env($e, _e, af) {
        const bf = La.splitArguments($e);
        if (!bf.typeDefinition) {
            bf.typeDefinition = '<value:boolean>';
        }
        if (bf.args.some((c)=>this.cmd.getBaseEnvVar(c, true)
        )) {
            throw this.error(new Error(`Environment variable already exists: ${$e}`));
        }
        const cf = La.parseArgumentsDefinition(bf.typeDefinition);
        if (cf.length > 1) {
            throw this.error(new Error(`An environment variable can only have one value but got: ${$e}`));
        } else if (cf.length && cf[0].optionalValue) {
            throw this.error(new Error(`An environment variable can not have an optional value but '${$e}' is defined as optional.`));
        } else if (cf.length && cf[0].variadic) {
            throw this.error(new Error(`An environment variable can not have an variadic value but '${$e}' is defined as variadic.`));
        }
        this.cmd.envVars.push({
            names: bf.args,
            description: _e,
            type: cf[0].type,
            details: cf.shift(),
            ...af
        });
        return this;
    }
    async parse(df = Deno.args, ef) {
        this.reset().registerDefaults();
        this.rawArgs = df;
        const ff = this.rawArgs.length > 0 && this.getCommand(this.rawArgs[0], true);
        if (ff) {
            ff._globalParent = this;
            return await ff.parse(this.rawArgs.slice(1), ef);
        }
        if (this.isExecutable) {
            if (!ef) {
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
            if (ef) {
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
            const { flags , unknown , literal  } = this.parseFlags(this.rawArgs);
            this.literalArgs = literal;
            const gf = this.parseArguments(unknown, flags);
            this.validateEnvVars();
            if (ef) {
                return {
                    options: flags,
                    args: gf,
                    cmd: this,
                    literal: this.literalArgs
                };
            }
            return await this.execute(flags, ...gf);
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
    async execute(hf, ...jf) {
        const kf = this.findActionFlag(hf);
        if (kf && kf.action) {
            await kf.action.call(this, hf, ...jf);
            return {
                options: hf,
                args: jf,
                cmd: this,
                literal: this.literalArgs
            };
        }
        if (this.fn) {
            try {
                await this.fn(hf, ...jf);
            } catch (c) {
                throw this.error(c);
            }
        } else if (this.defaultCommand) {
            const lf = this.getCommand(this.defaultCommand, true);
            if (!lf) {
                throw this.error(new Error(`Default command '${this.defaultCommand}' not found.`));
            }
            lf._globalParent = this;
            try {
                await lf.execute(hf, ...jf);
            } catch (c) {
                throw this.error(c);
            }
        }
        return {
            options: hf,
            args: jf,
            cmd: this,
            literal: this.literalArgs
        };
    }
    async executeExecutable(mf) {
        const [nf, ...of] = this.getPath().split(' ');
        of.unshift(nf.replace(/\.ts$/, ''));
        const pf = of.join('-');
        try {
            await Deno.run({
                cmd: [
                    pf,
                    ...mf
                ]
            });
            return;
        } catch (c) {
            if (!c.message.match(/No such file or directory/)) {
                throw c;
            }
        }
        try {
            await Deno.run({
                cmd: [
                    pf + '.ts',
                    ...mf
                ]
            });
            return;
        } catch (c) {
            if (!c.message.match(/No such file or directory/)) {
                throw c;
            }
        }
        throw this.error(new Error(`Sub-command executable not found: ${pf}${j('(.ts)')}`));
    }
    parseFlags(qf) {
        try {
            return ea(qf, {
                stopEarly: this._stopEarly,
                allowEmpty: this._allowEmpty,
                flags: this.getOptions(true),
                parse: (c, g, u, v)=>this.parseType(c, g, u, v)
            });
        } catch (c) {
            throw this.error(c);
        }
    }
    parseType(rf, sf, tf, uf) {
        const vf = this.getType(rf);
        if (!vf) {
            throw this.error(new Error(`No type registered with name: ${rf}`));
        }
        return vf.handler instanceof ya ? vf.handler.parse(sf, tf, uf) : vf.handler(sf, tf, uf);
    }
    validateEnvVars() {
        const wf = this.getEnvVars(true);
        if (!wf.length) {
            return;
        }
        if (ae) {
            wf.forEach((g)=>{
                const u = g.names.find((x)=>!!Deno.env.get(x)
                );
                if (u) {
                    const y = Deno.env.get(u);
                    try {
                        this.parseType(g.type, {
                            name: u
                        }, g, y || '');
                    } catch (z) {
                        throw new Error(`Environment variable '${u}' must be of type ${g.type} but got: ${y}`);
                    }
                }
            });
        }
    }
    parseArguments(xf, yf) {
        const zf = [];
        xf = xf.slice(0);
        if (!this.hasArguments()) {
            if (xf.length) {
                if (this.hasCommands(true)) {
                    throw this.error(new Error(`Unknown command: ${xf.join(' ')}`));
                } else {
                    throw this.error(new Error(`No arguments allowed for command: ${this._name}`));
                }
            }
        } else {
            if (!xf.length) {
                const Af = this.getArguments().filter((c)=>!c.optionalValue
                ).map((c)=>c.name
                );
                if (Af.length) {
                    const Bf = Object.keys(yf);
                    const Cf = !!Bf.find((c)=>this.getOption(c, true)?.standalone
                    );
                    if (!Cf) {
                        throw this.error(new Error('Missing argument(s): ' + Af.join(', ')));
                    }
                }
                return zf;
            }
            for (const Df of this.getArguments()){
                if (!Df.optionalValue && !xf.length) {
                    throw this.error(new Error(`Missing argument: ${Df.name}`));
                }
                let Ef;
                if (Df.variadic) {
                    Ef = xf.splice(0, xf.length);
                } else {
                    Ef = xf.shift();
                }
                if (Ef) {
                    zf.push(Ef);
                }
            }
            if (xf.length) {
                throw this.error(new Error(`To many arguments: ${xf.join(' ')}`));
            }
        }
        return zf;
    }
    findActionFlag(Ff) {
        const Gf = Object.keys(Ff);
        for (const Hf of Gf){
            const If = this.getOption(Hf, true);
            if (If?.action) {
                return If;
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
    getArgument(Jf) {
        return this.getArguments().find((c)=>c.name === Jf
        );
    }
    getArguments() {
        if (!this.args.length && this.argsDefinition) {
            this.args = La.parseArgumentsDefinition(this.argsDefinition);
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
    hasOptions(Kf) {
        return this.getOptions(Kf).length > 0;
    }
    getOptions(Lf) {
        return this.getGlobalOptions(Lf).concat(this.getBaseOptions(Lf));
    }
    getBaseOptions(Mf) {
        if (!this.options.length) {
            return [];
        }
        return Mf ? this.options.slice(0) : this.options.filter((c)=>!c.hidden
        );
    }
    getGlobalOptions(Nf) {
        const Of = (c, g = [], u = [])=>{
            if (c) {
                if (c.options.length) {
                    c.options.forEach((v)=>{
                        if (v.global && !this.options.find((x)=>x.name === v.name
                        ) && u.indexOf(v.name) === -1 && (Nf || !v.hidden)) {
                            u.push(v.name);
                            g.push(v);
                        }
                    });
                }
                return Of(c._parent, g, u);
            }
            return g;
        };
        return Of(this._parent);
    }
    hasOption(Pf, Qf) {
        return !!this.getOption(Pf, Qf);
    }
    getOption(Rf, Sf) {
        return this.getBaseOption(Rf, Sf) ?? this.getGlobalOption(Rf, Sf);
    }
    getBaseOption(Tf, Uf) {
        const Vf = this.options.find((c)=>c.name === Tf
        );
        return Vf && (Uf || !Vf.hidden) ? Vf : undefined;
    }
    getGlobalOption(Wf, Xf) {
        if (!this._parent) {
            return;
        }
        let Yf = this._parent.getBaseOption(Wf, Xf);
        if (!Yf || !Yf.global) {
            return this._parent.getGlobalOption(Wf, Xf);
        }
        return Yf;
    }
    removeOption(Zf) {
        const $f = this.options.findIndex((c)=>c.name === Zf
        );
        if ($f === -1) {
            return;
        }
        return this.options.splice($f, 1)[0];
    }
    hasCommands(_f) {
        return this.getCommands(_f).length > 0;
    }
    getCommands(ag) {
        return this.getGlobalCommands(ag).concat(this.getBaseCommands(ag));
    }
    getBaseCommands(bg) {
        const cg = Array.from(this.commands.values());
        return bg ? cg : cg.filter((c)=>!c.isHidden
        );
    }
    getGlobalCommands(dg) {
        const eg = (c, g = [], u = [])=>{
            if (c) {
                if (c.commands.size) {
                    c.commands.forEach((v)=>{
                        if (v.isGlobal && this !== v && !this.commands.has(v._name) && u.indexOf(v._name) === -1 && (dg || !v.isHidden)) {
                            u.push(v._name);
                            g.push(v);
                        }
                    });
                }
                return eg(c._parent, g, u);
            }
            return g;
        };
        return eg(this._parent);
    }
    hasCommand(fg, gg) {
        return !!this.getCommand(fg, gg);
    }
    getCommand(hg, ig) {
        return this.getBaseCommand(hg, ig) ?? this.getGlobalCommand(hg, ig);
    }
    getBaseCommand(jg, kg) {
        let lg = this.commands.get(jg);
        return lg && (kg || !lg.isHidden) ? lg : undefined;
    }
    getGlobalCommand(mg, ng) {
        if (!this._parent) {
            return;
        }
        let og = this._parent.getBaseCommand(mg, ng);
        if (!og?.isGlobal) {
            return this._parent.getGlobalCommand(mg, ng);
        }
        return og;
    }
    removeCommand(pg) {
        const qg = this.getBaseCommand(pg, true);
        if (qg) {
            this.commands.delete(pg);
        }
        return qg;
    }
    getTypes() {
        return this.getGlobalTypes().concat(this.getBaseTypes());
    }
    getBaseTypes() {
        return Array.from(this.types.values());
    }
    getGlobalTypes() {
        const rg = (c, g = [], u = [])=>{
            if (c) {
                if (c.types.size) {
                    c.types.forEach((v)=>{
                        if (v.global && !this.types.has(v.name) && u.indexOf(v.name) === -1) {
                            u.push(v.name);
                            g.push(v);
                        }
                    });
                }
                return rg(c._parent, g, u);
            }
            return g;
        };
        return rg(this._parent);
    }
    getType(sg) {
        return this.getBaseType(sg) ?? this.getGlobalType(sg);
    }
    getBaseType(tg) {
        return this.types.get(tg);
    }
    getGlobalType(ug) {
        if (!this._parent) {
            return;
        }
        let vg = this._parent.getBaseType(ug);
        if (!vg?.global) {
            return this._parent.getGlobalType(ug);
        }
        return vg;
    }
    hasEnvVars(wg) {
        return this.getEnvVars(wg).length > 0;
    }
    getEnvVars(xg) {
        return this.getGlobalEnvVars(xg).concat(this.getBaseEnvVars(xg));
    }
    getBaseEnvVars(yg) {
        if (!this.envVars.length) {
            return [];
        }
        return yg ? this.envVars.slice(0) : this.envVars.filter((c)=>!c.hidden
        );
    }
    getGlobalEnvVars(zg) {
        const Ag = (c, g = [], u = [])=>{
            if (c) {
                if (c.envVars.length) {
                    c.envVars.forEach((v)=>{
                        if (v.global && !this.envVars.find((x)=>x.names[0] === v.names[0]
                        ) && u.indexOf(v.names[0]) === -1 && (zg || !v.hidden)) {
                            u.push(v.names[0]);
                            g.push(v);
                        }
                    });
                }
                return Ag(c._parent, g, u);
            }
            return g;
        };
        return Ag(this._parent);
    }
    hasEnvVar(Bg, Cg) {
        return !!this.getEnvVar(Bg, Cg);
    }
    getEnvVar(Dg, Eg) {
        return this.getBaseEnvVar(Dg, Eg) ?? this.getGlobalEnvVar(Dg, Eg);
    }
    getBaseEnvVar(Fg, Gg) {
        const Hg = this.envVars.find((c)=>c.names.indexOf(Fg) !== -1
        );
        return Hg && (Gg || !Hg.hidden) ? Hg : undefined;
    }
    getGlobalEnvVar(Ig, Jg) {
        if (!this._parent) {
            return;
        }
        let Kg = this._parent.getBaseEnvVar(Ig, Jg);
        if (!Kg?.global) {
            return this._parent.getGlobalEnvVar(Ig, Jg);
        }
        return Kg;
    }
    hasExamples() {
        return this.examples.length > 0;
    }
    getExamples() {
        return this.examples;
    }
    hasExample(Lg) {
        return !!this.getExample(Lg);
    }
    getExample(Mg) {
        return this.examples.find((c)=>c.name === Mg
        );
    }
    getRawArgs() {
        return this.rawArgs;
    }
    getLiteralArgs() {
        return this.literalArgs;
    }
    write(...Ng) {
        stdout.writeSync(b(va(2) + xa(...Ng)));
    }
    writeError(...Og) {
        stderr.writeSync(b(va(2) + k(xa(`[ERROR:${this._name}]`, ...Og))));
    }
    log(...Pg) {
        this.write(...Pg, '\n');
    }
    logError(...Qg) {
        this.writeError(...Qg, '\n');
    }
    error(Rg, Sg = true) {
        if (this.shouldThrowErrors()) {
            return Rg;
        }
        const Tg = ae ? !!Deno.env.get('CLIFFY_DEBUG') : false;
        Sg && this.help();
        this.logError(Tg ? Rg : Rg.message);
        this.log();
        Deno.exit(1);
    }
    help() {
        Deno.stdout.writeSync(b(this.getHelp()));
    }
    getHelp() {
        this.registerDefaults();
        return Nd.generate(this);
    }
    constructor(){
        this.types = new Map([
            [
                'string',
                {
                    name: 'string',
                    handler: new Ha()
                }
            ],
            [
                'number',
                {
                    name: 'number',
                    handler: new Da()
                }
            ],
            [
                'boolean',
                {
                    name: 'boolean',
                    handler: new za()
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
function Ug(c, g) {
    return w(c, g, '_');
}
class Vg {
    static generate(Wg) {
        return new Vg(Wg).generate();
    }
    constructor(Xg){
        this.cmd = Xg;
        this.actions = new Map();
    }
    generate() {
        return `
# compdef _${Ug(this.cmd.getPath())} ${this.cmd.getPath()}
#
# zsh completion for ${this.cmd.getPath()}
#
# version: ${this.cmd.getVersion()}
#

autoload -U is-at-least

(( $+functions[__${Ug(this.cmd.getName())}_complete] )) ||
function __${Ug(this.cmd.getName())}_complete {
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

# _${Ug(this.cmd.getPath())} "\${@}"

compdef _${Ug(this.cmd.getPath())} ${this.cmd.getPath()}

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
    generateCompletions(Yg, Zg = '') {
        if (!Yg.hasCommands(false) && !Yg.hasOptions(false) && !Yg.hasArguments()) {
            return '';
        }
        Zg = (Zg ? Zg + ' ' : '') + Yg.getName();
        return `(( $+functions[_${Ug(Zg)}] )) ||
function _${Ug(Zg)}() {` + (!Yg.getParent() ? `\n\n    local context state state_descr line\n    typeset -A opt_args` : '') + this.generateCommandCompletions(Yg, Zg) + this.generateSubCommandCompletions(Yg, Zg) + this.generateArgumentCompletions(Yg, Zg) + this.generateActions(Yg) + `\n}\n\n` + Yg.getCommands(false).filter((c)=>c !== Yg
        ).map((c)=>this.generateCompletions(c, Zg)
        ).join('');
    }
    generateCommandCompletions($g, _g) {
        const ah = $g.getCommands(false);
        let bh = ah.map((c)=>`'${c.getName()}:${c.getShortDescription()}'`
        ).join('\n            ');
        if (bh) {
            bh = `
        local -a commands
        commands=(
            ${bh}
        )
        _describe 'command' commands`;
        }
        if ($g.hasArguments()) {
            const ch = _g.split(' ').slice(1).join(' ');
            const dh = $g.getArguments()[0];
            const eh = this.addAction(dh, ch);
            if (eh) {
                bh += `\n        __${Ug(this.cmd.getName())}_complete ${eh.arg.name} ${eh.arg.action} ${eh.cmd}`;
            }
        }
        if (bh) {
            bh = `\n\n    function _commands() {${bh}\n    }`;
        }
        return bh;
    }
    generateSubCommandCompletions(fh, gh) {
        if (fh.hasCommands(false)) {
            const hh = fh.getCommands(false).map((c)=>`${c.getName()}) _${Ug(gh + ' ' + c.getName())} ;;`
            ).join('\n            ');
            return `\n
    function _command_args() {
        case "$words[1]" in\n            ${hh}\n        esac
    }`;
        }
        return '';
    }
    generateArgumentCompletions(ih, jh) {
        this.actions.clear();
        const kh = this.generateOptions(ih, jh);
        let lh = 0;
        let mh = '\n\n    _arguments -w -s -S -C';
        if (ih.hasOptions()) {
            mh += ` \\\n        ${kh.join(' \\\n        ')}`;
        }
        if (ih.hasCommands(false) || ih.hasArguments()) {
            mh += ` \\\n        '${++lh}: :_commands'`;
        }
        if (ih.hasArguments() || ih.hasCommands(false)) {
            const nh = [];
            for (const oh of ih.getArguments().slice(1)){
                const ph = jh.split(' ').slice(1).join(' ');
                const qh = this.addAction(oh, ph);
                nh.push(`${++lh}${oh.optionalValue ? '::' : ':'}${qh.name}`);
            }
            mh += nh.map((c)=>`\\\n        '${c}'`
            ).join('');
            if (ih.hasCommands(false)) {
                mh += ` \\\n        '*:: :->command_args'`;
            }
        }
        return mh;
    }
    generateOptions(rh, sh) {
        const th = [];
        const uh = sh.split(' ');
        uh.shift();
        const vh = uh.join(' ');
        const wh = rh.getOptions(false).map((c)=>c.standalone ? c.flags.split(/[, ] */g) : false
        ).flat().filter((c)=>typeof c === 'string'
        );
        for (const xh of rh.getOptions(false)){
            th.push(this.generateOption(xh, vh, wh));
        }
        return th;
    }
    generateOption(yh, zh, Ah) {
        let Bh = yh.conflicts?.length ? [
            ...Ah,
            ...yh.conflicts
        ] : Ah;
        Bh = yh.collect ? Bh : [
            ...Bh,
            ...yh.flags.split(/[, ] */g)
        ];
        let Ch = '';
        for (const Dh of yh.args){
            const Eh = this.addAction(Dh, zh);
            if (Dh.variadic) {
                Ch += `${Dh.optionalValue ? '::' : ':'}${Dh.name}:->${Eh.name}`;
            } else {
                Ch += `${Dh.optionalValue ? '::' : ':'}${Dh.name}:->${Eh.name}`;
            }
        }
        const Fh = yh.description.trim().split('\n').shift();
        const Gh = yh.collect ? '*' : '';
        const Hh = yh.flags.replace(/ +/g, '');
        if (yh.standalone) {
            return `'(- *)'{${Gh}${Hh}}'[${Fh}]${Ch}'`;
        } else {
            const Ih = Bh.length ? `'(${Bh.join(' ')})'` : '';
            return `${Ih}{${Gh}${Hh}}'[${Fh}]${Ch}'`;
        }
    }
    addAction(Jh, Kh) {
        const Lh = `${Jh.name}-${Jh.action}`;
        if (!this.actions.has(Lh)) {
            this.actions.set(Lh, {
                arg: Jh,
                label: `${Jh.name}: ${Jh.action}`,
                name: Lh,
                cmd: Kh
            });
        }
        return this.actions.get(Lh);
    }
    generateActions(Mh) {
        let Nh = [];
        if (this.actions.size) {
            Nh = Array.from(this.actions).map(([c, g])=>`${c}) __${Ug(this.cmd.getName())}_complete ${g.arg.name} ${g.arg.action} ${g.cmd} ;;`
            );
        }
        if (Mh.hasCommands(false)) {
            Nh.unshift(`command_args) _command_args ;;`);
        }
        if (Nh.length) {
            return `\n\n    case "$state" in\n        ${Nh.join('\n        ')}\n    esac`;
        }
        return '';
    }
}
new be();
