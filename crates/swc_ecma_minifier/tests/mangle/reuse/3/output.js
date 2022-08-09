const u = new TextEncoder();
function $($) {
    return u.encode($);
}
new TextDecoder();
const t = globalThis.Deno?.noColor ?? true;
let e = !t;
function _(u, $) {
    return {
        open: `\x1b[${u.join(";")}m`,
        close: `\x1b[${$}m`,
        regexp: new RegExp(`\\x1b\\[${$}m`, "g")
    };
}
function n(u, $) {
    return e ? `${$.open}${u.replace($.regexp, $.open)}${$.close}` : u;
}
function s(u) {
    return n(u, _([
        1
    ], 22));
}
function i(u) {
    return n(u, _([
        2
    ], 22));
}
function r(u) {
    return n(u, _([
        31
    ], 39));
}
function o(u) {
    return n(u, _([
        32
    ], 39));
}
function A(u) {
    return n(u, _([
        33
    ], 39));
}
function E(u) {
    return n(u, _([
        34
    ], 39));
}
function a(u) {
    return n(u, _([
        35
    ], 39));
}
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
const C = /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g;
const h = /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g;
const l = /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;
const F = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            İ: "\u0069",
            I: "\u0131"
        }
    },
    az: {
        regexp: /[\u0130]/g,
        map: {
            İ: "\u0069",
            I: "\u0131"
        }
    },
    lt: {
        regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
        map: {
            I: "\u0069\u0307",
            J: "\u006A\u0307",
            Į: "\u012F\u0307",
            Ì: "\u0069\u0307\u0300",
            Í: "\u0069\u0307\u0301",
            Ĩ: "\u0069\u0307\u0303"
        }
    }
};
function c(u, $) {
    const t = $ && F[$];
    u = u == null ? "" : String(u);
    if (t) {
        u = u.replace(t.regexp, (u)=>t.map[u]);
    }
    return u.toLowerCase();
}
function p(u, $, t) {
    if (u == null) {
        return "";
    }
    t = typeof t !== "string" ? " " : t;
    function e(u, $, e) {
        if ($ === 0 || $ === e.length - u.length) {
            return "";
        }
        return t || "";
    }
    u = String(u).replace(C, "$1 $2").replace(h, "$1 $2").replace(l, e);
    return c(u, $);
}
const f = {
    tr: {
        regexp: /[\u0069]/g,
        map: {
            i: "\u0130"
        }
    },
    az: {
        regexp: /[\u0069]/g,
        map: {
            i: "\u0130"
        }
    },
    lt: {
        regexp: /[\u0069\u006A\u012F]\u0307|\u0069\u0307[\u0300\u0301\u0303]/g,
        map: {
            i̇: "\u0049",
            j̇: "\u004A",
            į̇: "\u012E",
            i̇̀: "\u00CC",
            i̇́: "\u00CD",
            i̇̃: "\u0128"
        }
    }
};
function B(u, $) {
    const t = $ && f[$];
    u = u == null ? "" : String(u);
    if (t) {
        u = u.replace(t.regexp, function(u) {
            return t.map[u];
        });
    }
    return u.toUpperCase();
}
function D(u, $, t) {
    let e = p(u, $);
    if (!t) {
        e = e.replace(/ (?=\d)/g, "_");
    }
    return e.replace(/ (.)/g, function(u, t) {
        return B(t, $);
    });
}
function g(u, $) {
    return p(u, $, "-");
}
function d(u) {
    const $ = [];
    let t = false;
    for (const e of u){
        if (t) {
            $.push(e);
        } else if (e === "--") {
            t = true;
            $.push(e);
        } else if (e[0] === "-") {
            const _ = e[1] === "-";
            if (e.includes("=")) {
                const n = e.split("=");
                const s = n.shift();
                if (_) {
                    $.push(s);
                } else {
                    i(s);
                }
                $.push(n.join("="));
            } else if (_) {
                $.push(e);
            } else {
                i(e);
            }
        } else {
            $.push(e);
        }
    }
    return $;
    function i(u) {
        const t = u.slice(1).split("");
        if (isNaN(u[u.length - 1])) {
            t.forEach((u)=>$.push(`-${u}`));
        } else {
            $.push(`-${t.shift()}`);
            $.push(t.join(""));
        }
    }
}
var m;
(function(u) {
    u["STRING"] = "string";
    u["NUMBER"] = "number";
    u["BOOLEAN"] = "boolean";
})(m || (m = {}));
const w = (u, $, t)=>{
    if (~[
        "1",
        "true"
    ].indexOf(t)) {
        return true;
    }
    if (~[
        "0",
        "false"
    ].indexOf(t)) {
        return false;
    }
    throw new Error(`Option --${u.name} must be of type boolean but got: ${t}`);
};
const y = (u, $, t)=>{
    if (isNaN(t)) {
        throw new Error(`Option --${u.name} must be of type number but got: ${t}`);
    }
    return parseFloat(t);
};
const b = (u, $, t)=>{
    return t;
};
const x = {
    [m.STRING]: b,
    [m.NUMBER]: y,
    [m.BOOLEAN]: w
};
function v(u, $) {
    while($[0] === "-"){
        $ = $.slice(1);
    }
    for (const t of u){
        if (R(t, $)) {
            return t;
        }
    }
    return;
}
function O(u, $, t, e) {
    const _ = {};
    for (const n of u){
        const s = D(n.name);
        if (typeof $[s] === "undefined" && typeof n.default !== "undefined") {
            $[s] = typeof n.default === "function" ? n.default() : n.default;
            _[s] = true;
        }
    }
    const i = Object.keys($);
    if (i.length === 0 && e) {
        return;
    }
    const r = i.map(($)=>({
            name: $,
            option: v(u, g($))
        }));
    for (const { name: o , option: A  } of r){
        if (!A) {
            throw new Error("Unknown option: --" + o);
        }
        if (A.standalone) {
            if (i.length > 1) {
                if (r.every(({ option: u  })=>u && (A === u || _[u.name]))) {
                    return;
                }
                throw new Error(`Option --${A.name} cannot be combined with other options.`);
            }
            return;
        }
        A.conflicts?.forEach((u)=>{
            if (a(u)) {
                throw new Error(`Option --${A.name} conflicts with option: --${u}`);
            }
        });
        A.depends?.forEach((u)=>{
            if (!a(u) && !_[A.name]) {
                throw new Error(`Option --${A.name} depends on option: --${u}`);
            }
        });
        const E = (A.args?.length || 0) > 1;
        A.args?.forEach((u, t)=>{
            if (u.requiredValue && (typeof $[o] === "undefined" || (E && typeof $[o][t] === "undefined"))) {
                throw new Error(`Missing value for option: --${A.name}`);
            }
        });
        function a(u) {
            const t = D(u);
            return typeof $[t] !== "undefined";
        }
    }
    for (const C of u){
        if (C.required && !(D(C.name) in $)) {
            if ((!C.conflicts || !C.conflicts.find((u)=>!!$[u])) && !r.find((u)=>u.option?.conflicts?.find((u)=>u === C.name))) {
                throw new Error(`Missing required option: --${C.name}`);
            }
        }
    }
    if (i.length === 0 && !e) {
        throw new Error("No arguments.");
    }
}
function V(u, $ = {}) {
    !$.flags && ($.flags = []);
    const t = d(u);
    let e = false;
    let _ = false;
    const n = {};
    const s = [];
    const i = [];
    let r = false;
    $.flags.forEach((u)=>{
        u.depends?.forEach((u)=>{
            if (!$.flags || !v($.flags, u)) {
                throw new Error(`Unknown required option: ${u}`);
            }
        });
        u.conflicts?.forEach((u)=>{
            if (!$.flags || !v($.flags, u)) {
                throw new Error(`Unknown conflicting option: ${u}`);
            }
        });
    });
    for(let o = 0; o < t.length; o++){
        let A;
        let E;
        const a = t[o];
        if (e) {
            s.push(a);
            continue;
        }
        if (a === "--") {
            e = true;
            continue;
        }
        const C = a.length > 1 && a[0] === "-";
        const h = ()=>t[o + 1];
        if (C && !r) {
            if (a[2] === "-" || (a[1] === "-" && a.length === 3)) {
                throw new Error(`Invalid flag name: ${a}`);
            }
            _ = a.indexOf("--no-") === 0;
            const l = a.replace(/^-+(no-)?/, "");
            A = v($.flags, l);
            if (!A) {
                if ($.flags.length) {
                    throw new Error(`Unknown option: ${a}`);
                }
                A = {
                    name: l,
                    optionalValue: true,
                    type: m.STRING
                };
            }
            if (!A.name) {
                throw new Error(`Missing name for option: ${a}`);
            }
            const F = D(A.name);
            if (typeof n[F] !== "undefined" && !A.collect) {
                throw new Error(`Duplicate option: ${a}`);
            }
            E = A.args?.length ? A.args : [
                {
                    type: A.type,
                    requiredValue: A.requiredValue,
                    optionalValue: A.optionalValue,
                    variadic: A.variadic,
                    list: A.list,
                    separator: A.separator
                }, 
            ];
            let c = 0;
            let p = false;
            const f = n[F];
            g(A, E);
            if (typeof n[F] === "undefined") {
                if (typeof A.default !== "undefined") {
                    n[F] = typeof A.default === "function" ? A.default() : A.default;
                } else if (E[c].requiredValue) {
                    throw new Error(`Missing value for option: --${A.name}`);
                } else {
                    n[F] = true;
                }
            }
            if (typeof A.value !== "undefined") {
                n[F] = A.value(n[F], f);
            } else if (A.collect) {
                const B = f || [];
                B.push(n[F]);
                n[F] = B;
            }
            function g(u, e) {
                const s = e[c];
                if (!s) {
                    throw new Error("Unknown option: " + h());
                }
                if (!s.type) {
                    s.type = m.BOOLEAN;
                }
                if (u.args?.length) {
                    if ((typeof s.optionalValue === "undefined" || s.optionalValue === false) && typeof s.requiredValue === "undefined") {
                        s.requiredValue = true;
                    }
                } else {
                    if (s.type !== m.BOOLEAN && (typeof s.optionalValue === "undefined" || s.optionalValue === false) && typeof s.requiredValue === "undefined") {
                        s.requiredValue = true;
                    }
                }
                if (s.requiredValue) {
                    if (p) {
                        throw new Error(`An required argument can not follow an optional argument but found in: ${u.name}`);
                    }
                } else {
                    p = true;
                }
                if (_) {
                    if (s.type !== m.BOOLEAN && !s.optionalValue) {
                        throw new Error(`Negate not supported by --${u.name}. Only optional option or options of type boolean can be negated.`);
                    }
                    n[F] = false;
                    return;
                }
                let i;
                let r = false;
                if (s.list && E(s)) {
                    const A = h().split(s.separator || ",").map(($)=>{
                        const t = a(u, s, $);
                        if (typeof t === "undefined") {
                            throw new Error(`List item of option --${u?.name} must be of type ${s.type} but got: ${$}`);
                        }
                        return t;
                    });
                    if (A?.length) {
                        i = A;
                    }
                } else {
                    if (E(s)) {
                        i = a(u, s, h());
                    } else if (s.optionalValue && s.type === m.BOOLEAN) {
                        i = true;
                    }
                }
                if (r) {
                    o++;
                    if (!s.variadic) {
                        c++;
                    } else if (e[c + 1]) {
                        throw new Error("An argument cannot follow an variadic argument: " + h());
                    }
                }
                if (typeof i !== "undefined" && (e.length > 1 || s.variadic)) {
                    if (!n[F]) {
                        n[F] = [];
                    }
                    n[F].push(i);
                    if (E(s)) {
                        g(u, e);
                    }
                } else {
                    n[F] = i;
                }
                function E(u) {
                    return !!(t[o + 1] && (u.optionalValue || u.requiredValue || u.variadic) && (t[o + 1][0] !== "-" || (u.type === m.NUMBER && !isNaN(t[o + 1]))) && u);
                }
                function a(u, t, e) {
                    let _ = $.parse ? $.parse(t.type || m.STRING, u, t, e) : S(u, t, e);
                    if (typeof _ !== "undefined") {
                        r = true;
                    }
                    return _;
                }
            }
        } else {
            if ($.stopEarly) {
                r = true;
            }
            i.push(a);
        }
    }
    if ($.flags && $.flags.length) {
        O($.flags, n, $.knownFlaks, $.allowEmpty);
    }
    return {
        flags: n,
        unknown: i,
        literal: s
    };
}
function S(u, $, t) {
    const e = x[$.type || m.STRING];
    if (!e) {
        throw new Error(`Unknown type ${$.type}`);
    }
    return e(u, $, t);
}
function R(u, $) {
    return (u.name === $ || (u.aliases && u.aliases.indexOf($) !== -1));
}
function G(u, $ = "", t = " ") {
    while($.length < u){
        $ += t;
    }
    return $;
}
const { inspect: N  } = Deno;
const T = /%[sdjoO%]/g;
function j(...u) {
    if (typeof u[0] !== "string") {
        let $ = [];
        for(let t = 0; t < arguments.length; t++){
            $.push(N(arguments[t]));
        }
        return $.join(" ");
    }
    let e = 1;
    const _ = u[0];
    const n = u.length;
    let s = String(_).replace(T, function($) {
        if ($ === "%%") {
            return "%";
        }
        if (e >= n) {
            return $;
        }
        switch($){
            case "%s":
                return String(u[e++]);
            case "%d":
                return String(Number(u[e++]));
            case "%j":
                try {
                    return JSON.stringify(u[e++]);
                } catch (t) {
                    return "[Circular]";
                }
            case "%o":
            case "%O":
                return N(u[e++]);
            default:
                return $;
        }
    });
    for(let i = u[e]; e < n; i = u[++e]){
        if (i == null || typeof i !== "object") {
            s += " " + i;
        } else {
            s += " " + N(i);
        }
    }
    return s;
}
class M {
}
class W extends M {
    parse(u, $, t) {
        return w(u, $, t);
    }
    complete() {
        return [
            "true",
            "false"
        ];
    }
}
class q extends M {
    parse(u, $, t) {
        return y(u, $, t);
    }
}
class L extends M {
    parse(u, $, t) {
        return b(u, $, t);
    }
}
class H {
    static splitArguments(u) {
        const $ = u.trim().split(/[, =] */g);
        const t = [];
        while($[$.length - 1] && this.ARGUMENT_REGEX.test($[$.length - 1])){
            t.unshift($.pop());
        }
        const e = t.join(" ");
        return {
            args: $,
            typeDefinition: e
        };
    }
    static parseArgumentsDefinition(u) {
        const $ = [];
        let t = false;
        let e = false;
        const _ = u.split(/ +/);
        for (const n of _){
            if (e) {
                throw new Error("An argument can not follow an variadic argument.");
            }
            const s = n.split(this.ARGUMENT_DETAILS_REGEX);
            const i = s[2] || m.STRING;
            let r = {
                optionalValue: n[0] !== "<",
                name: s[1],
                action: s[3] || i,
                variadic: false,
                list: i ? n.indexOf(i + "[]") !== -1 : false,
                type: i
            };
            if (!r.optionalValue && t) {
                throw new Error("An required argument can not follow an optional argument.");
            }
            if (n[0] === "[") {
                t = true;
            }
            if (r.name.length > 3) {
                const o = r.name.slice(0, 3) === "...";
                const A = r.name.slice(-3) === "...";
                e = r.variadic = o || A;
                if (o) {
                    r.name = r.name.slice(3);
                } else if (A) {
                    r.name = r.name.slice(0, -3);
                }
            }
            if (r.name) {
                $.push(r);
            }
        }
        return $;
    }
    static highlightArguments(u) {
        if (!u) {
            return "";
        }
        return this.parseArgumentsDefinition(u).map((u)=>this.highlightArgumentDetails(u)).join(" ");
    }
    static highlightArgumentDetails(u) {
        let $ = "";
        $ += A(u.optionalValue ? "[" : "<");
        let t = "";
        t += u.name;
        if (u.variadic) {
            t += "...";
        }
        t = a(t);
        $ += t;
        $ += A(":");
        $ += r(u.type);
        if (u.list) {
            $ += o("[]");
        }
        $ += A(u.optionalValue ? "]" : ">");
        return $;
    }
}
H.ARGUMENT_REGEX = /^[<\[].+[\]>]$/;
H.ARGUMENT_DETAILS_REGEX = /[<\[:>\]]/;
const P = {
    top: "─",
    topMid: "┬",
    topLeft: "┌",
    topRight: "┐",
    bottom: "─",
    bottomMid: "┴",
    bottomLeft: "└",
    bottomRight: "┘",
    left: "│",
    leftMid: "├",
    mid: "─",
    midMid: "┼",
    right: "│",
    rightMid: "┤",
    middle: "│"
};
class k {
    get length() {
        return this.toString().length;
    }
    static from(u) {
        const $ = new this(u);
        if (u instanceof k) {
            $.options = Object.assign({}, u.options);
        }
        return $;
    }
    constructor(u){
        this.value = u;
        this.options = {};
    }
    toString() {
        return this.value.toString();
    }
    setValue(u) {
        this.value = u;
        return this;
    }
    clone(u) {
        const $ = new k(u ?? this);
        $.options = Object.assign({}, this.options);
        return $;
    }
    border(u, $ = true) {
        if ($ || typeof this.options.border === "undefined") {
            this.options.border = u;
        }
        return this;
    }
    colSpan(u, $ = true) {
        if ($ || typeof this.options.colSpan === "undefined") {
            this.options.colSpan = u;
        }
        return this;
    }
    rowSpan(u, $ = true) {
        if ($ || typeof this.options.rowSpan === "undefined") {
            this.options.rowSpan = u;
        }
        return this;
    }
    getBorder() {
        return this.options.border === true;
    }
    getColSpan() {
        return typeof this.options.colSpan === "number" && this.options.colSpan > 0 ? this.options.colSpan : 1;
    }
    getRowSpan() {
        return typeof this.options.rowSpan === "number" && this.options.rowSpan > 0 ? this.options.rowSpan : 1;
    }
}
class U extends Array {
    static from(u) {
        const $ = new this(...u);
        if (u instanceof U) {
            $.options = Object.assign({}, u.options);
        }
        return $;
    }
    clone() {
        const u = new U(...this.map((u)=>(u instanceof k ? u.clone() : u)));
        u.options = Object.assign({}, this.options);
        return u;
    }
    border(u, $ = true) {
        if ($ || typeof this.options.border === "undefined") {
            this.options.border = u;
        }
        return this;
    }
    getBorder() {
        return this.options.border === true;
    }
    hasBorder() {
        return (this.getBorder() || this.some((u)=>u instanceof k && u.getBorder()));
    }
    constructor(...u){
        super(...u);
        this.options = {};
    }
}
function I(u, $) {
    let t = "";
    const e = $.split(/ /g);
    for(let _ = 0; _ < e.length; _++){
        let n = e[_];
        let s = n.indexOf("\n") !== -1;
        if (s) {
            n = n.split("\n").shift();
        }
        if (t) {
            const i = X(n).length;
            const r = X(t).length;
            if (r + i >= u) {
                break;
            }
        }
        t += (_ > 0 ? " " : "") + n;
        if (s) {
            break;
        }
    }
    return t;
}
const z = /(\x1b|\e|\033)\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]/g;
function X(u) {
    return u.replace(z, "");
}
function Z(u, $, t) {
    return Math.max(...$.map(($)=>($[u] instanceof k && $[u].getColSpan() > 1 ? "" : $[u]?.toString() || "").split("\n").map((u)=>{
            const $ = typeof t === "undefined" ? u : I(t, u);
            return X($).length || 0;
        })).flat());
}
class J {
    constructor(u, $){
        this.table = u;
        this.options = $;
    }
    toString() {
        const u = this.createLayout();
        return u.rows.length ? this.renderRows(u) : "";
    }
    createLayout() {
        Object.keys(this.options.chars).forEach((u)=>{
            if (typeof this.options.chars[u] !== "string") {
                this.options.chars[u] = "";
            }
        });
        const u = this.table.getBorder() || this.table.hasBodyBorder();
        const $ = this.table.hasHeaderBorder();
        const t = $ || u;
        const e = this.table.getHeader();
        const _ = this.spanRows(e ? [
            e,
            ...this.table
        ] : this.table.slice());
        const n = Math.max(..._.map((u)=>u.length));
        for (const s of _){
            const i = s.length;
            if (i < n) {
                const r = n - i;
                for(let o = 0; o < r; o++){
                    s.push(this.createCell(null, s));
                }
            }
        }
        const A = [];
        const E = [];
        for(let a = 0; a < n; a++){
            const C = Array.isArray(this.options.minCellWidth) ? this.options.minCellWidth[a] : this.options.minCellWidth;
            const h = Array.isArray(this.options.maxCellWidth) ? this.options.maxCellWidth[a] : this.options.maxCellWidth;
            const l = Z(a, _, h);
            E[a] = Math.min(h, Math.max(C, l));
            A[a] = Array.isArray(this.options.padding) ? this.options.padding[a] : this.options.padding;
        }
        return {
            padding: A,
            width: E,
            rows: _,
            columns: n,
            hasBorder: t,
            hasBodyBorder: u,
            hasHeaderBorder: $
        };
    }
    spanRows(u, $ = 0, t = 0, e = [], _ = 1) {
        const n = u;
        if ($ >= n.length && e.every((u)=>u === 1)) {
            return n;
        } else if (n[$] && t >= n[$].length && t >= e.length && _ === 1) {
            return this.spanRows(n, ++$, 0, e, 1);
        }
        if (_ > 1) {
            _--;
            e[t] = e[t - 1];
            n[$].splice(t - 1, 0, n[$][t - 1]);
            return this.spanRows(n, $, ++t, e, _);
        }
        if (t === 0) {
            n[$] = this.createRow(n[$] || []);
        }
        if (e[t] > 1) {
            e[t]--;
            n[$].splice(t, 0, n[$ - 1][t]);
            return this.spanRows(n, $, ++t, e, _);
        }
        n[$][t] = this.createCell(n[$][t] || null, n[$]);
        _ = n[$][t].getColSpan();
        e[t] = n[$][t].getRowSpan();
        return this.spanRows(n, $, ++t, e, _);
    }
    createRow(u) {
        return U.from(u).border(this.table.getBorder(), false);
    }
    createCell(u, $) {
        return k.from(u ?? "").border($.getBorder(), false);
    }
    renderRows(u) {
        let $ = "";
        const t = new Array(u.columns).fill(1);
        for(let e = 0; e < u.rows.length; e++){
            $ += this.renderRow(t, e, u);
        }
        return $.slice(0, -1);
    }
    renderRow(u, $, t, e) {
        const _ = t.rows[$];
        const n = t.rows[$ - 1];
        const s = t.rows[$ + 1];
        let i = "";
        let r = 1;
        if (!e && $ === 0 && _.hasBorder()) {
            i += this.renderBorderRow(undefined, _, u, t);
        }
        let o = false;
        i += " ".repeat(this.options.indent || 0);
        for(let A = 0; A < t.columns; A++){
            if (r > 1) {
                r--;
                u[A] = u[A - 1];
                continue;
            }
            i += this.renderCell(A, _, n, u, t);
            if (u[A] > 1) {
                if (!e) {
                    u[A]--;
                }
            } else if (!n || n[A] !== _[A]) {
                u[A] = _[A].getRowSpan();
            }
            r = _[A].getColSpan();
            if (u[A] === 1 && _[A].length) {
                o = true;
            }
        }
        if (t.columns > 0) {
            if (_[t.columns - 1].getBorder()) {
                i += this.options.chars.right;
            } else if (t.hasBorder) {
                i += " ";
            }
        }
        i += "\n";
        if (o) {
            return (i + this.renderRow(u, $, t, o));
        }
        if (($ === 0 && t.hasHeaderBorder) || ($ < t.rows.length - 1 && t.hasBodyBorder)) {
            i += this.renderBorderRow(_, s, u, t);
        }
        if ($ === t.rows.length - 1 && _.hasBorder()) {
            i += this.renderBorderRow(_, undefined, u, t);
        }
        return i;
    }
    renderCell(u, $, t, e, _, n) {
        let s = "";
        const i = $[u - 1];
        const r = $[u];
        if (!n) {
            if (u === 0) {
                if (r.getBorder()) {
                    s += this.options.chars.left;
                } else if (_.hasBorder) {
                    s += " ";
                }
            } else {
                if (r.getBorder() || i?.getBorder()) {
                    s += this.options.chars.middle;
                } else if (_.hasBorder) {
                    s += " ";
                }
            }
        }
        let o = _.width[u];
        const A = r.getColSpan();
        if (A > 1) {
            for(let E = 1; E < A; E++){
                o += _.width[u + E] + _.padding[u + E];
                if (_.hasBorder) {
                    o += _.padding[u + E] + 1;
                }
            }
        }
        const { current: a , next: C  } = this.renderCellValue(r, o);
        $[u].setValue(C);
        if (_.hasBorder) {
            s += " ".repeat(_.padding[u]);
        }
        s += a;
        if (_.hasBorder || u < _.columns - 1) {
            s += " ".repeat(_.padding[u]);
        }
        return s;
    }
    renderCellValue(u, $) {
        const t = Math.min($, X(u.toString()).length);
        let e = I(t, u.toString());
        const _ = X(e).length > t;
        if (_) {
            e = e.slice(0, t);
        }
        const n = u.toString().slice(e.length + (_ ? 0 : 1));
        const s = $ - X(e).length;
        const i = e + " ".repeat(s);
        return {
            current: i,
            next: u.clone(n)
        };
    }
    renderBorderRow(u, $, t, e) {
        let _ = "";
        let n = 1;
        for(let s = 0; s < e.columns; s++){
            if (t[s] > 1) {
                if (!$) {
                    throw new Error("invalid layout");
                }
                if (n > 1) {
                    n--;
                    continue;
                }
            }
            _ += this.renderBorderCell(s, u, $, t, e);
            n = $?.[s].getColSpan() ?? 1;
        }
        return _.length ? " ".repeat(this.options.indent) + _ + "\n" : "";
    }
    renderBorderCell(u, $, t, e, _) {
        const n = $?.[u - 1];
        const s = t?.[u - 1];
        const i = $?.[u];
        const r = t?.[u];
        const o = !!n?.getBorder();
        const A = !!s?.getBorder();
        const E = !!i?.getBorder();
        const a = !!r?.getBorder();
        const C = (u)=>(u?.getColSpan() ?? 1) > 1;
        const h = (u)=>(u?.getRowSpan() ?? 1) > 1;
        let l = "";
        if (u === 0) {
            if (e[u] > 1) {
                if (E) {
                    l += this.options.chars.left;
                } else {
                    l += " ";
                }
            } else if (E && a) {
                l += this.options.chars.leftMid;
            } else if (E) {
                l += this.options.chars.bottomLeft;
            } else if (a) {
                l += this.options.chars.topLeft;
            } else {
                l += " ";
            }
        } else if (u < _.columns) {
            if ((o && a) || (E && A)) {
                const F = C(n);
                const c = C(s);
                const p = C(i);
                const f = C(r);
                const B = h(n);
                const D = h(s);
                const g = h(i);
                const d = h(r);
                const m = o && a && E && A;
                const w = B && g && D && d;
                const y = F && p && c && f;
                if (w && m) {
                    l += this.options.chars.middle;
                } else if (y && m && n === i && s === r) {
                    l += this.options.chars.mid;
                } else if (F && p && n === i) {
                    l += this.options.chars.topMid;
                } else if (c && f && s === r) {
                    l += this.options.chars.bottomMid;
                } else if (B && D && n === s) {
                    l += this.options.chars.leftMid;
                } else if (g && d && i === r) {
                    l += this.options.chars.rightMid;
                } else {
                    l += this.options.chars.midMid;
                }
            } else if (o && E) {
                if (C(n) && C(i) && n === i) {
                    l += this.options.chars.bottom;
                } else {
                    l += this.options.chars.bottomMid;
                }
            } else if (E && a) {
                if (e[u] > 1) {
                    l += this.options.chars.left;
                } else {
                    l += this.options.chars.leftMid;
                }
            } else if (a && A) {
                if (C(s) && C(r) && s === r) {
                    l += this.options.chars.top;
                } else {
                    l += this.options.chars.topMid;
                }
            } else if (o && A) {
                if (h(n) && n === s) {
                    l += this.options.chars.right;
                } else {
                    l += this.options.chars.rightMid;
                }
            } else if (o) {
                l += this.options.chars.bottomRight;
            } else if (E) {
                l += this.options.chars.bottomLeft;
            } else if (A) {
                l += this.options.chars.topRight;
            } else if (a) {
                l += this.options.chars.topLeft;
            } else {
                l += " ";
            }
        }
        const b = _.padding[u] + _.width[u] + _.padding[u];
        if (e[u] > 1 && t) {
            l += this.renderCell(u, t, $, e, _, true);
            if (t[u] === t[t.length - 1]) {
                if (E) {
                    l += this.options.chars.right;
                } else {
                    l += " ";
                }
                return l;
            }
        } else if (E && a) {
            l += this.options.chars.mid.repeat(b);
        } else if (E) {
            l += this.options.chars.bottom.repeat(b);
        } else if (a) {
            l += this.options.chars.top.repeat(b);
        } else {
            l += " ".repeat(b);
        }
        if (u === _.columns - 1) {
            if (E && a) {
                l += this.options.chars.rightMid;
            } else if (E) {
                l += this.options.chars.bottomRight;
            } else if (a) {
                l += this.options.chars.topRight;
            } else {
                l += " ";
            }
        }
        return l;
    }
}
class K extends Array {
    static from(u) {
        const $ = new this(...u);
        if (u instanceof K) {
            $.options = Object.assign({}, u.options);
            $.headerRow = u.headerRow ? U.from(u.headerRow) : undefined;
        }
        return $;
    }
    static fromJson(u) {
        return new this().fromJson(u);
    }
    static render(u) {
        K.from(u).render();
    }
    fromJson(u) {
        this.header(Object.keys(u[0]));
        this.body(u.map((u)=>Object.values(u)));
        return this;
    }
    header(u) {
        this.headerRow = u instanceof U ? u : U.from(u);
        return this;
    }
    body(u) {
        this.length = 0;
        this.push(...u);
        return this;
    }
    clone() {
        const u = new K(...this.map((u)=>u instanceof U ? u.clone() : U.from(u).clone()));
        u.options = Object.assign({}, this.options);
        u.headerRow = this.headerRow?.clone();
        return u;
    }
    toString() {
        return new J(this, this.options).toString();
    }
    render() {
        Deno.stdout.writeSync($(this.toString() + "\n"));
        return this;
    }
    maxCellWidth(u, $ = true) {
        if ($ || typeof this.options.maxCellWidth === "undefined") {
            this.options.maxCellWidth = u;
        }
        return this;
    }
    minCellWidth(u, $ = true) {
        if ($ || typeof this.options.minCellWidth === "undefined") {
            this.options.minCellWidth = u;
        }
        return this;
    }
    indent(u, $ = true) {
        if ($ || typeof this.options.indent === "undefined") {
            this.options.indent = u;
        }
        return this;
    }
    padding(u, $ = true) {
        if ($ || typeof this.options.padding === "undefined") {
            this.options.padding = u;
        }
        return this;
    }
    border(u, $ = true) {
        if ($ || typeof this.options.border === "undefined") {
            this.options.border = u;
        }
        return this;
    }
    chars(u) {
        Object.assign(this.options.chars, u);
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
        return (this.getBorder() || (this.headerRow instanceof U && this.headerRow.hasBorder()));
    }
    hasBodyBorder() {
        return (this.getBorder() || this.some((u)=>u instanceof U ? u.hasBorder() : u.some((u)=>u instanceof k ? u.getBorder : false)));
    }
    hasBorder() {
        return this.hasHeaderBorder() || this.hasBodyBorder();
    }
    constructor(...u){
        super(...u);
        this.options = {
            indent: 0,
            border: false,
            maxCellWidth: Infinity,
            minCellWidth: 0,
            padding: 1,
            chars: P
        };
    }
}
class Q {
    static generate(u) {
        return new Q(u).generate();
    }
    constructor(u){
        this.cmd = u;
        this.indent = 2;
    }
    generate() {
        return (this.generateHeader() + this.generateDescription() + this.generateOptions() + this.generateCommands() + this.generateEnvironmentVariables() + this.generateExamples() + "\n");
    }
    generateHeader() {
        return ("\n" + K.from([
            [
                s("Usage:"),
                a(`${this.cmd.getName()}${this.cmd.getArgsDefinition() ? " " + this.cmd.getArgsDefinition() : ""}`), 
            ],
            [
                s("Version:"),
                A(`v${this.cmd.getVersion()}`)
            ], 
        ]).indent(this.indent).padding(1).toString() + "\n");
    }
    generateDescription() {
        if (!this.cmd.getDescription()) {
            return "";
        }
        return (this.label("Description") + K.from([
            [
                this.cmd.getDescription()
            ]
        ]).indent(this.indent * 2).maxCellWidth(140).padding(1).toString() + "\n");
    }
    generateOptions() {
        const u = this.cmd.getOptions(false);
        if (!u.length) {
            return "";
        }
        const $ = !!u.find((u)=>!!u.typeDefinition);
        if ($) {
            return (this.label("Options") + K.from([
                ...u.map((u)=>[
                        u.flags.split(/,? +/g).map((u)=>E(u)).join(", "),
                        H.highlightArguments(u.typeDefinition || ""),
                        r(s("-")) + " " + u.description.split("\n").shift(),
                        this.generateHints(u), 
                    ]), 
            ]).padding([
                2,
                2,
                2
            ]).indent(this.indent * 2).maxCellWidth([
                60,
                60,
                80,
                60
            ]).toString() + "\n");
        }
        return (this.label("Options") + K.from([
            ...u.map((u)=>[
                    u.flags.split(/,? +/g).map((u)=>E(u)).join(", "),
                    r(s("-")) + " " + u.description.split("\n").shift(),
                    this.generateHints(u), 
                ]), 
        ]).padding([
            2,
            2
        ]).indent(this.indent * 2).maxCellWidth([
            60,
            80,
            60
        ]).toString() + "\n");
    }
    generateCommands() {
        const u = this.cmd.getCommands(false);
        if (!u.length) {
            return "";
        }
        const $ = !!u.find((u)=>!!u.getArgsDefinition());
        if ($) {
            return (this.label("Commands") + K.from([
                ...u.map((u)=>[
                        [
                            u.getName(),
                            ...u.getAliases()
                        ].map((u)=>E(u)).join(", "),
                        H.highlightArguments(u.getArgsDefinition() || ""),
                        r(s("-")) + " " + u.getDescription().split("\n").shift(), 
                    ]), 
            ]).padding([
                2,
                2,
                2
            ]).indent(this.indent * 2).toString() + "\n");
        }
        return (this.label("Commands") + K.from([
            ...u.map((u)=>[
                    [
                        u.getName(),
                        ...u.getAliases()
                    ].map((u)=>E(u)).join(", "),
                    r(s("-")) + " " + u.getDescription().split("\n").shift(), 
                ]), 
        ]).padding([
            2,
            2
        ]).indent(this.indent * 2).toString() + "\n");
    }
    generateEnvironmentVariables() {
        const u = this.cmd.getEnvVars(false);
        if (!u.length) {
            return "";
        }
        return (this.label("Environment variables") + K.from([
            ...u.map((u)=>[
                    u.names.map((u)=>E(u)).join(", "),
                    H.highlightArgumentDetails(u.details),
                    `${r(s("-"))} ${u.description}`, 
                ]), 
        ]).padding(2).indent(this.indent * 2).toString() + "\n");
    }
    generateExamples() {
        const u = this.cmd.getExamples();
        if (!u.length) {
            return "";
        }
        return (this.label("Examples") + K.from(u.map((u)=>[
                i(s(`${Y(u.name)}:`)),
                `\n${u.description}`, 
            ])).padding(1).indent(this.indent * 2).maxCellWidth(150).toString() + "\n");
    }
    generateHints(u) {
        const $ = [];
        u.required && $.push(A(`required`));
        typeof u.default !== "undefined" && $.push(E(s(`Default: `)) + E(j(u.default)));
        u.depends && u.depends.length && $.push(r(s(`depends: `)) + u.depends.map((u)=>r(u)).join(", "));
        u.conflicts && u.conflicts.length && $.push(r(s(`conflicts: `)) + u.conflicts.map((u)=>r(u)).join(", "));
        if ($.length) {
            return `(${$.join(", ")})`;
        }
        return "";
    }
    line(...u) {
        return ((u.length ? " ".repeat(this.indent) + j(...u) : "") + "\n");
    }
    label(u) {
        return "\n" + this.line(s(`${u}:`)) + "\n";
    }
}
function Y(u) {
    return u?.charAt(0).toUpperCase() + u.slice(1) ?? "";
}
const { stdout: uu , stderr: u$  } = Deno;
const ut = Deno.permissions;
const ue = ut && ut.query && (await ut.query({
    name: "env"
}));
const u_ = !!ue && ue.state === "granted";
class un {
    versionOption(u, $, t) {
        this._versionOption = u === false ? u : {
            flags: u,
            desc: $,
            opts: typeof t === "function" ? {
                action: t
            } : t
        };
        return this;
    }
    helpOption(u, $, t) {
        this._helpOption = u === false ? u : {
            flags: u,
            desc: $,
            opts: typeof t === "function" ? {
                action: t
            } : t
        };
        return this;
    }
    command(u, $, t) {
        let e;
        if (typeof $ === "string") {
            e = $;
            $ = undefined;
        }
        const _ = H.splitArguments(u);
        const n = _.args.shift();
        const s = _.args;
        if (!n) {
            throw this.error(new Error("Missing command name."));
        }
        if (this.getBaseCommand(n, true)) {
            if (!t) {
                throw this.error(new Error(`Duplicate command: ${n}`));
            }
            this.removeCommand(n);
        }
        const i = ($ || new un()).reset();
        i._name = n;
        i._parent = this;
        if (e) {
            i.isExecutable = true;
            i.description(e);
        }
        if (_.typeDefinition) {
            i.arguments(_.typeDefinition);
        }
        s.forEach((u)=>i.aliases.push(u));
        this.commands.set(n, i);
        this.select(n);
        return this;
    }
    alias(u) {
        if (this.cmd === this) {
            throw this.error(new Error(`Failed to add alias '${u}'. No sub command selected.`));
        }
        if (this.cmd.aliases.indexOf(u) !== -1) {
            throw this.error(new Error(`Duplicate alias: ${u}`));
        }
        this.cmd.aliases.push(u);
        return this;
    }
    reset() {
        return (this.cmd = this);
    }
    select(u) {
        const $ = this.getBaseCommand(u, true);
        if (!$) {
            throw this.error(new Error(`Sub-command not found: ${u}`));
        }
        this.cmd = $;
        return this;
    }
    name(u) {
        this.cmd._name = u;
        return this;
    }
    version(u) {
        this.cmd.ver = u;
        return this;
    }
    description(u) {
        this.cmd.desc = u;
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
    arguments(u) {
        this.cmd.argsDefinition = u;
        return this;
    }
    action(u) {
        this.cmd.fn = u;
        return this;
    }
    allowEmpty(u = true) {
        this.cmd._allowEmpty = u;
        return this;
    }
    stopEarly(u = true) {
        this.cmd._stopEarly = u;
        return this;
    }
    useRawArgs(u = true) {
        this.cmd._useRawArgs = u;
        return this;
    }
    default(u) {
        this.cmd.defaultCommand = u;
        return this;
    }
    type(u, $, t) {
        if (this.cmd.types.get(u) && !t?.override) {
            throw this.error(new Error(`Type '${u}' already exists.`));
        }
        this.cmd.types.set(u, {
            ...t,
            name: u,
            handler: $
        });
        if ($ instanceof M && typeof $.complete !== "undefined") {
            this.complete(u, (u, t)=>$.complete?.(u, t) || [], t);
        }
        return this;
    }
    complete(u, $, t) {
        if (this.cmd.completions.has(u) && !t?.override) {
            throw this.error(new Error(`Completion '${u}' already exists.`));
        }
        this.cmd.completions.set(u, {
            name: u,
            complete: $,
            ...t
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
        const u = ($, t = [], e = [])=>{
            if ($) {
                if ($.completions.size) {
                    $.completions.forEach((u)=>{
                        if (u.global && !this.completions.has(u.name) && e.indexOf(u.name) === -1) {
                            e.push(u.name);
                            t.push(u);
                        }
                    });
                }
                return u($._parent, t, e);
            }
            return t;
        };
        return u(this._parent);
    }
    getCompletion(u) {
        return this.getBaseCompletion(u) ?? this.getGlobalCompletion(u);
    }
    getBaseCompletion(u) {
        return this.completions.get(u);
    }
    getGlobalCompletion(u) {
        if (!this._parent) {
            return;
        }
        let $ = this._parent.getBaseCompletion(u);
        if (!$?.global) {
            return this._parent.getGlobalCompletion(u);
        }
        return $;
    }
    option(u, $, t) {
        if (typeof t === "function") {
            return this.option(u, $, {
                value: t
            });
        }
        const e = H.splitArguments(u);
        const _ = e.typeDefinition ? H.parseArgumentsDefinition(e.typeDefinition) : [];
        const n = {
            name: "",
            description: $,
            args: _,
            flags: e.args.join(", "),
            typeDefinition: e.typeDefinition,
            ...t
        };
        if (n.separator) {
            for (const s of _){
                if (s.list) {
                    s.separator = n.separator;
                }
            }
        }
        for (const i of e.args){
            const r = i.trim();
            const o = /^--/.test(r);
            const A = o ? r.slice(2) : r.slice(1);
            if (n.name === A || (n.aliases && ~n.aliases.indexOf(A))) {
                throw this.error(new Error(`Duplicate command name: ${A}`));
            }
            if (!n.name && o) {
                n.name = A;
            } else if (!n.aliases) {
                n.aliases = [
                    A
                ];
            } else {
                n.aliases.push(A);
            }
            if (this.cmd.getBaseOption(A, true)) {
                if (t?.override) {
                    this.removeOption(A);
                } else {
                    throw this.error(new Error(`Duplicate option name: ${A}`));
                }
            }
        }
        if (n.prepend) {
            this.cmd.options.unshift(n);
        } else {
            this.cmd.options.push(n);
        }
        return this;
    }
    example(u, $) {
        if (this.cmd.hasExample(u)) {
            throw this.error(new Error("Example already exists."));
        }
        this.cmd.examples.push({
            name: u,
            description: $
        });
        return this;
    }
    env(u, $, t) {
        const e = H.splitArguments(u);
        if (!e.typeDefinition) {
            e.typeDefinition = "<value:boolean>";
        }
        if (e.args.some((u)=>this.cmd.getBaseEnvVar(u, true))) {
            throw this.error(new Error(`Environment variable already exists: ${u}`));
        }
        const _ = H.parseArgumentsDefinition(e.typeDefinition);
        if (_.length > 1) {
            throw this.error(new Error(`An environment variable can only have one value but got: ${u}`));
        } else if (_.length && _[0].optionalValue) {
            throw this.error(new Error(`An environment variable can not have an optional value but '${u}' is defined as optional.`));
        } else if (_.length && _[0].variadic) {
            throw this.error(new Error(`An environment variable can not have an variadic value but '${u}' is defined as variadic.`));
        }
        this.cmd.envVars.push({
            names: e.args,
            description: $,
            type: _[0].type,
            details: _.shift(),
            ...t
        });
        return this;
    }
    async parse(u = Deno.args, $) {
        this.reset().registerDefaults();
        this.rawArgs = u;
        const t = this.rawArgs.length > 0 && this.getCommand(this.rawArgs[0], true);
        if (t) {
            t._globalParent = this;
            return await t.parse(this.rawArgs.slice(1), $);
        }
        if (this.isExecutable) {
            if (!$) {
                await this.executeExecutable(this.rawArgs);
            }
            return {
                options: {},
                args: this.rawArgs,
                cmd: this,
                literal: this.literalArgs
            };
        } else if (this._useRawArgs) {
            if ($) {
                return {
                    options: {},
                    args: this.rawArgs,
                    cmd: this,
                    literal: this.literalArgs
                };
            }
            return await this.execute({}, ...this.rawArgs);
        } else {
            const { flags: e , unknown: _ , literal: n  } = this.parseFlags(this.rawArgs);
            this.literalArgs = n;
            const s = this.parseArguments(_, e);
            this.validateEnvVars();
            if ($) {
                return {
                    options: e,
                    args: s,
                    cmd: this,
                    literal: this.literalArgs
                };
            }
            return await this.execute(e, ...s);
        }
    }
    registerDefaults() {
        if (this.getParent() || this.hasDefaults) {
            return this;
        }
        this.hasDefaults = true;
        this.reset();
        if (this._versionOption !== false) {
            this.option(this._versionOption?.flags || "-V, --version", this._versionOption?.desc || "Show the version number for this program.", Object.assign({
                standalone: true,
                prepend: true,
                action: async function() {
                    await Deno.stdout.writeSync($(this.getVersion() + "\n"));
                    Deno.exit(0);
                }
            }, this._versionOption?.opts ?? {}));
        }
        if (this._helpOption !== false) {
            this.option(this._helpOption?.flags || "-h, --help", this._helpOption?.desc || "Show this help.", Object.assign({
                standalone: true,
                global: true,
                prepend: true,
                action: function() {
                    this.help();
                    Deno.exit(0);
                }
            }, this._helpOption?.opts ?? {}));
        }
        return this;
    }
    async execute(u, ...$) {
        const t = this.findActionFlag(u);
        if (t && t.action) {
            await t.action.call(this, u, ...$);
            return {
                options: u,
                args: $,
                cmd: this,
                literal: this.literalArgs
            };
        }
        if (this.fn) {
            try {
                await this.fn(u, ...$);
            } catch (e) {
                throw this.error(e);
            }
        } else if (this.defaultCommand) {
            const _ = this.getCommand(this.defaultCommand, true);
            if (!_) {
                throw this.error(new Error(`Default command '${this.defaultCommand}' not found.`));
            }
            _._globalParent = this;
            try {
                await _.execute(u, ...$);
            } catch (n) {
                throw this.error(n);
            }
        }
        return {
            options: u,
            args: $,
            cmd: this,
            literal: this.literalArgs
        };
    }
    async executeExecutable(u) {
        const [$, ...t] = this.getPath().split(" ");
        t.unshift($.replace(/\.ts$/, ""));
        const e = t.join("-");
        try {
            await Deno.run({
                cmd: [
                    e,
                    ...u
                ]
            });
            return;
        } catch (_) {
            if (!_.message.match(/No such file or directory/)) {
                throw _;
            }
        }
        try {
            await Deno.run({
                cmd: [
                    e + ".ts",
                    ...u
                ]
            });
            return;
        } catch (n) {
            if (!n.message.match(/No such file or directory/)) {
                throw n;
            }
        }
        throw this.error(new Error(`Sub-command executable not found: ${e}${i("(.ts)")}`));
    }
    parseFlags(u) {
        try {
            return V(u, {
                stopEarly: this._stopEarly,
                allowEmpty: this._allowEmpty,
                flags: this.getOptions(true),
                parse: (u, $, t, e)=>this.parseType(u, $, t, e)
            });
        } catch ($) {
            throw this.error($);
        }
    }
    parseType(u, $, t, e) {
        const _ = this.getType(u);
        if (!_) {
            throw this.error(new Error(`No type registered with name: ${u}`));
        }
        return _.handler instanceof M ? _.handler.parse($, t, e) : _.handler($, t, e);
    }
    validateEnvVars() {
        const u = this.getEnvVars(true);
        if (!u.length) {
            return;
        }
        if (u_) {
            u.forEach((u)=>{
                const $ = u.names.find((u)=>!!Deno.env.get(u));
                if ($) {
                    const t = Deno.env.get($);
                    try {
                        this.parseType(u.type, {
                            name: $
                        }, u, t || "");
                    } catch (e) {
                        throw new Error(`Environment variable '${$}' must be of type ${u.type} but got: ${t}`);
                    }
                }
            });
        }
    }
    parseArguments(u, $) {
        const t = [];
        u = u.slice(0);
        if (!this.hasArguments()) {
            if (u.length) {
                if (this.hasCommands(true)) {
                    throw this.error(new Error(`Unknown command: ${u.join(" ")}`));
                } else {
                    throw this.error(new Error(`No arguments allowed for command: ${this._name}`));
                }
            }
        } else {
            if (!u.length) {
                const e = this.getArguments().filter((u)=>!u.optionalValue).map((u)=>u.name);
                if (e.length) {
                    const _ = Object.keys($);
                    const n = !!_.find((u)=>this.getOption(u, true)?.standalone);
                    if (!n) {
                        throw this.error(new Error("Missing argument(s): " + e.join(", ")));
                    }
                }
                return t;
            }
            for (const s of this.getArguments()){
                if (!s.optionalValue && !u.length) {
                    throw this.error(new Error(`Missing argument: ${s.name}`));
                }
                let i;
                if (s.variadic) {
                    i = u.splice(0, u.length);
                } else {
                    i = u.shift();
                }
                if (i) {
                    t.push(i);
                }
            }
            if (u.length) {
                throw this.error(new Error(`To many arguments: ${u.join(" ")}`));
            }
        }
        return t;
    }
    findActionFlag(u) {
        const $ = Object.keys(u);
        for (const t of $){
            const e = this.getOption(t, true);
            if (e?.action) {
                return e;
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
        return this._parent ? this._parent.getPath() + " " + this._name : this._name;
    }
    getArgsDefinition() {
        return this.argsDefinition;
    }
    getArgument(u) {
        return this.getArguments().find(($)=>$.name === u);
    }
    getArguments() {
        if (!this.args.length && this.argsDefinition) {
            this.args = H.parseArgumentsDefinition(this.argsDefinition);
        }
        return this.args;
    }
    hasArguments() {
        return !!this.argsDefinition;
    }
    getVersion() {
        return this.ver || (this._parent?.getVersion() ?? "");
    }
    getDescription() {
        return typeof this.desc === "function" ? (this.desc = this.desc()) : this.desc;
    }
    getShortDescription() {
        return this.getDescription().trim().split("\n").shift();
    }
    hasOptions(u) {
        return this.getOptions(u).length > 0;
    }
    getOptions(u) {
        return this.getGlobalOptions(u).concat(this.getBaseOptions(u));
    }
    getBaseOptions(u) {
        if (!this.options.length) {
            return [];
        }
        return u ? this.options.slice(0) : this.options.filter((u)=>!u.hidden);
    }
    getGlobalOptions(u) {
        const $ = (t, e = [], _ = [])=>{
            if (t) {
                if (t.options.length) {
                    t.options.forEach(($)=>{
                        if ($.global && !this.options.find((u)=>u.name === $.name) && _.indexOf($.name) === -1 && (u || !$.hidden)) {
                            _.push($.name);
                            e.push($);
                        }
                    });
                }
                return $(t._parent, e, _);
            }
            return e;
        };
        return $(this._parent);
    }
    hasOption(u, $) {
        return !!this.getOption(u, $);
    }
    getOption(u, $) {
        return (this.getBaseOption(u, $) ?? this.getGlobalOption(u, $));
    }
    getBaseOption(u, $) {
        const t = this.options.find(($)=>$.name === u);
        return t && ($ || !t.hidden) ? t : undefined;
    }
    getGlobalOption(u, $) {
        if (!this._parent) {
            return;
        }
        let t = this._parent.getBaseOption(u, $);
        if (!t || !t.global) {
            return this._parent.getGlobalOption(u, $);
        }
        return t;
    }
    removeOption(u) {
        const $ = this.options.findIndex(($)=>$.name === u);
        if ($ === -1) {
            return;
        }
        return this.options.splice($, 1)[0];
    }
    hasCommands(u) {
        return this.getCommands(u).length > 0;
    }
    getCommands(u) {
        return this.getGlobalCommands(u).concat(this.getBaseCommands(u));
    }
    getBaseCommands(u) {
        const $ = Array.from(this.commands.values());
        return u ? $ : $.filter((u)=>!u.isHidden);
    }
    getGlobalCommands(u) {
        const $ = (t, e = [], _ = [])=>{
            if (t) {
                if (t.commands.size) {
                    t.commands.forEach(($)=>{
                        if ($.isGlobal && this !== $ && !this.commands.has($._name) && _.indexOf($._name) === -1 && (u || !$.isHidden)) {
                            _.push($._name);
                            e.push($);
                        }
                    });
                }
                return $(t._parent, e, _);
            }
            return e;
        };
        return $(this._parent);
    }
    hasCommand(u, $) {
        return !!this.getCommand(u, $);
    }
    getCommand(u, $) {
        return (this.getBaseCommand(u, $) ?? this.getGlobalCommand(u, $));
    }
    getBaseCommand(u, $) {
        let t = this.commands.get(u);
        return t && ($ || !t.isHidden) ? t : undefined;
    }
    getGlobalCommand(u, $) {
        if (!this._parent) {
            return;
        }
        let t = this._parent.getBaseCommand(u, $);
        if (!t?.isGlobal) {
            return this._parent.getGlobalCommand(u, $);
        }
        return t;
    }
    removeCommand(u) {
        const $ = this.getBaseCommand(u, true);
        if ($) {
            this.commands.delete(u);
        }
        return $;
    }
    getTypes() {
        return this.getGlobalTypes().concat(this.getBaseTypes());
    }
    getBaseTypes() {
        return Array.from(this.types.values());
    }
    getGlobalTypes() {
        const u = ($, t = [], e = [])=>{
            if ($) {
                if ($.types.size) {
                    $.types.forEach((u)=>{
                        if (u.global && !this.types.has(u.name) && e.indexOf(u.name) === -1) {
                            e.push(u.name);
                            t.push(u);
                        }
                    });
                }
                return u($._parent, t, e);
            }
            return t;
        };
        return u(this._parent);
    }
    getType(u) {
        return this.getBaseType(u) ?? this.getGlobalType(u);
    }
    getBaseType(u) {
        return this.types.get(u);
    }
    getGlobalType(u) {
        if (!this._parent) {
            return;
        }
        let $ = this._parent.getBaseType(u);
        if (!$?.global) {
            return this._parent.getGlobalType(u);
        }
        return $;
    }
    hasEnvVars(u) {
        return this.getEnvVars(u).length > 0;
    }
    getEnvVars(u) {
        return this.getGlobalEnvVars(u).concat(this.getBaseEnvVars(u));
    }
    getBaseEnvVars(u) {
        if (!this.envVars.length) {
            return [];
        }
        return u ? this.envVars.slice(0) : this.envVars.filter((u)=>!u.hidden);
    }
    getGlobalEnvVars(u) {
        const $ = (t, e = [], _ = [])=>{
            if (t) {
                if (t.envVars.length) {
                    t.envVars.forEach(($)=>{
                        if ($.global && !this.envVars.find((u)=>u.names[0] === $.names[0]) && _.indexOf($.names[0]) === -1 && (u || !$.hidden)) {
                            _.push($.names[0]);
                            e.push($);
                        }
                    });
                }
                return $(t._parent, e, _);
            }
            return e;
        };
        return $(this._parent);
    }
    hasEnvVar(u, $) {
        return !!this.getEnvVar(u, $);
    }
    getEnvVar(u, $) {
        return (this.getBaseEnvVar(u, $) ?? this.getGlobalEnvVar(u, $));
    }
    getBaseEnvVar(u, $) {
        const t = this.envVars.find(($)=>$.names.indexOf(u) !== -1);
        return t && ($ || !t.hidden) ? t : undefined;
    }
    getGlobalEnvVar(u, $) {
        if (!this._parent) {
            return;
        }
        let t = this._parent.getBaseEnvVar(u, $);
        if (!t?.global) {
            return this._parent.getGlobalEnvVar(u, $);
        }
        return t;
    }
    hasExamples() {
        return this.examples.length > 0;
    }
    getExamples() {
        return this.examples;
    }
    hasExample(u) {
        return !!this.getExample(u);
    }
    getExample(u) {
        return this.examples.find(($)=>$.name === u);
    }
    getRawArgs() {
        return this.rawArgs;
    }
    getLiteralArgs() {
        return this.literalArgs;
    }
    write(...u) {
        uu.writeSync($(G(2) + j(...u)));
    }
    writeError(...u) {
        u$.writeSync($(G(2) + r(j(`[ERROR:${this._name}]`, ...u))));
    }
    log(...u) {
        this.write(...u, "\n");
    }
    logError(...u) {
        this.writeError(...u, "\n");
    }
    error(u, $ = true) {
        if (this.shouldThrowErrors()) {
            return u;
        }
        const t = u_ ? !!Deno.env.get("CLIFFY_DEBUG") : false;
        $ && this.help();
        this.logError(t ? u : u.message);
        this.log();
        Deno.exit(1);
    }
    help() {
        Deno.stdout.writeSync($(this.getHelp()));
    }
    getHelp() {
        this.registerDefaults();
        return Q.generate(this);
    }
    constructor(){
        this.types = new Map([
            [
                "string",
                {
                    name: "string",
                    handler: new L()
                }, 
            ],
            [
                "number",
                {
                    name: "number",
                    handler: new q()
                }, 
            ],
            [
                "boolean",
                {
                    name: "boolean",
                    handler: new W()
                }, 
            ], 
        ]);
        this.rawArgs = [];
        this.literalArgs = [];
        this._name = "COMMAND";
        this.ver = "0.0.0";
        this.desc = "";
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
function us(u, $) {
    return p(u, $, "_");
}
class ui {
    static generate(u) {
        return new ui(u).generate();
    }
    constructor(u){
        this.cmd = u;
        this.actions = new Map();
    }
    generate() {
        return `
# compdef _${us(this.cmd.getPath())} ${this.cmd.getPath()}
#
# zsh completion for ${this.cmd.getPath()}
#
# version: ${this.cmd.getVersion()}
#

autoload -U is-at-least

(( $+functions[__${us(this.cmd.getName())}_complete] )) ||
function __${us(this.cmd.getName())}_complete {
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

# _${us(this.cmd.getPath())} "\${@}"

compdef _${us(this.cmd.getPath())} ${this.cmd.getPath()}

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
    generateCompletions(u, $ = "") {
        if (!u.hasCommands(false) && !u.hasOptions(false) && !u.hasArguments()) {
            return "";
        }
        $ = ($ ? $ + " " : "") + u.getName();
        return (`(( $+functions[_${us($)}] )) ||
function _${us($)}() {` + (!u.getParent() ? `\n\n    local context state state_descr line\n    typeset -A opt_args` : "") + this.generateCommandCompletions(u, $) + this.generateSubCommandCompletions(u, $) + this.generateArgumentCompletions(u, $) + this.generateActions(u) + `\n}\n\n` + u.getCommands(false).filter(($)=>$ !== u).map((u)=>this.generateCompletions(u, $)).join(""));
    }
    generateCommandCompletions(u, $) {
        const t = u.getCommands(false);
        let e = t.map((u)=>`'${u.getName()}:${u.getShortDescription()}'`).join("\n            ");
        if (e) {
            e = `
        local -a commands
        commands=(
            ${e}
        )
        _describe 'command' commands`;
        }
        if (u.hasArguments()) {
            const _ = $.split(" ").slice(1).join(" ");
            const n = u.getArguments()[0];
            const s = this.addAction(n, _);
            if (s) {
                e += `\n        __${us(this.cmd.getName())}_complete ${s.arg.name} ${s.arg.action} ${s.cmd}`;
            }
        }
        if (e) {
            e = `\n\n    function _commands() {${e}\n    }`;
        }
        return e;
    }
    generateSubCommandCompletions(u, $) {
        if (u.hasCommands(false)) {
            const t = u.getCommands(false).map((u)=>`${u.getName()}) _${us($ + " " + u.getName())} ;;`).join("\n            ");
            return `\n
    function _command_args() {
        case "$words[1]" in\n            ${t}\n        esac
    }`;
        }
        return "";
    }
    generateArgumentCompletions(u, $) {
        this.actions.clear();
        const t = this.generateOptions(u, $);
        let e = 0;
        let _ = "\n\n    _arguments -w -s -S -C";
        if (u.hasOptions()) {
            _ += ` \\\n        ${t.join(" \\\n        ")}`;
        }
        if (u.hasCommands(false) || u.hasArguments()) {
            _ += ` \\\n        '${++e}: :_commands'`;
        }
        if (u.hasArguments() || u.hasCommands(false)) {
            const n = [];
            for (const s of u.getArguments().slice(1)){
                const i = $.split(" ").slice(1).join(" ");
                const r = this.addAction(s, i);
                n.push(`${++e}${s.optionalValue ? "::" : ":"}${r.name}`);
            }
            _ += n.map((u)=>`\\\n        '${u}'`).join("");
            if (u.hasCommands(false)) {
                _ += ` \\\n        '*:: :->command_args'`;
            }
        }
        return _;
    }
    generateOptions(u, $) {
        const t = [];
        const e = $.split(" ");
        e.shift();
        const _ = e.join(" ");
        const n = u.getOptions(false).map((u)=>u.standalone ? u.flags.split(/[, ] */g) : false).flat().filter((u)=>typeof u === "string");
        for (const s of u.getOptions(false)){
            t.push(this.generateOption(s, _, n));
        }
        return t;
    }
    generateOption(u, $, t) {
        let e = u.conflicts?.length ? [
            ...t,
            ...u.conflicts
        ] : t;
        e = u.collect ? e : [
            ...e,
            ...u.flags.split(/[, ] */g)
        ];
        let _ = "";
        for (const n of u.args){
            const s = this.addAction(n, $);
            if (n.variadic) {
                _ += `${n.optionalValue ? "::" : ":"}${n.name}:->${s.name}`;
            } else {
                _ += `${n.optionalValue ? "::" : ":"}${n.name}:->${s.name}`;
            }
        }
        const i = u.description.trim().split("\n").shift();
        const r = u.collect ? "*" : "";
        const o = u.flags.replace(/ +/g, "");
        if (u.standalone) {
            return `'(- *)'{${r}${o}}'[${i}]${_}'`;
        } else {
            const A = e.length ? `'(${e.join(" ")})'` : "";
            return `${A}{${r}${o}}'[${i}]${_}'`;
        }
    }
    addAction(u, $) {
        const t = `${u.name}-${u.action}`;
        if (!this.actions.has(t)) {
            this.actions.set(t, {
                arg: u,
                label: `${u.name}: ${u.action}`,
                name: t,
                cmd: $
            });
        }
        return this.actions.get(t);
    }
    generateActions(u) {
        let $ = [];
        if (this.actions.size) {
            $ = Array.from(this.actions).map(([u, $])=>`${u}) __${us(this.cmd.getName())}_complete ${$.arg.name} ${$.arg.action} ${$.cmd} ;;`);
        }
        if (u.hasCommands(false)) {
            $.unshift(`command_args) _command_args ;;`);
        }
        if ($.length) {
            return `\n\n    case "$state" in\n        ${$.join("\n        ")}\n    esac`;
        }
        return "";
    }
}
new un();
