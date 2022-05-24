const k = new TextEncoder();
function l(a) {
    return k.encode(a);
}
new TextDecoder();
const f = globalThis.Deno?.noColor ?? true;
let m = !f;
function n(b, a) {
    return {
        open: `\x1b[${b.join(";")}m`,
        close: `\x1b[${a}m`,
        regexp: new RegExp(`\\x1b\\[${a}m`, "g")
    };
}
function o(b, a) {
    return m ? `${a.open}${b.replace(a.regexp, a.open)}${a.close}` : b;
}
function p(a) {
    return o(a, n([
        1
    ], 22));
}
function q(a) {
    return o(a, n([
        2
    ], 22));
}
function r(a) {
    return o(a, n([
        31
    ], 39));
}
function s(a) {
    return o(a, n([
        32
    ], 39));
}
function t(a) {
    return o(a, n([
        33
    ], 39));
}
function u(a) {
    return o(a, n([
        34
    ], 39));
}
function v(a) {
    return o(a, n([
        35
    ], 39));
}
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
const w = /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g;
const x = /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g;
const y = /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;
const z = {
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
function A(a, b) {
    const c = b && z[b];
    a = a == null ? "" : String(a);
    if (c) {
        a = a.replace(c.regexp, (a)=>c.map[a]);
    }
    return a.toLowerCase();
}
function B(a, c, b) {
    if (a == null) {
        return "";
    }
    b = typeof b !== "string" ? " " : b;
    function d(c, a, d) {
        if (a === 0 || a === d.length - c.length) {
            return "";
        }
        return b || "";
    }
    a = String(a).replace(w, "$1 $2").replace(x, "$1 $2").replace(y, d);
    return A(a, c);
}
const C = {
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
function D(a, b) {
    const c = b && C[b];
    a = a == null ? "" : String(a);
    if (c) {
        a = a.replace(c.regexp, function(a) {
            return c.map[a];
        });
    }
    return a.toUpperCase();
}
function E(b, c, d) {
    let a = B(b, c);
    if (!d) {
        a = a.replace(/ (?=\d)/g, "_");
    }
    return a.replace(/ (.)/g, function(b, a) {
        return D(a, c);
    });
}
function F(a, b) {
    return B(a, b, "-");
}
function G(g) {
    const b = [];
    let c = false;
    for (const a of g){
        if (c) {
            b.push(a);
        } else if (a === "--") {
            c = true;
            b.push(a);
        } else if (a[0] === "-") {
            const d = a[1] === "-";
            if (a.includes("=")) {
                const e = a.split("=");
                const f = e.shift();
                if (d) {
                    b.push(f);
                } else {
                    h(f);
                }
                b.push(e.join("="));
            } else if (d) {
                b.push(a);
            } else {
                h(a);
            }
        } else {
            b.push(a);
        }
    }
    return b;
    function h(a) {
        const c = a.slice(1).split("");
        if (isNaN(a[a.length - 1])) {
            c.forEach((a)=>b.push(`-${a}`));
        } else {
            b.push(`-${c.shift()}`);
            b.push(c.join(""));
        }
    }
}
var a;
(function(a) {
    a["STRING"] = "string";
    a["NUMBER"] = "number";
    a["BOOLEAN"] = "boolean";
})(a || (a = {}));
const g = (b, c, a)=>{
    if (~[
        "1",
        "true"
    ].indexOf(a)) {
        return true;
    }
    if (~[
        "0",
        "false"
    ].indexOf(a)) {
        return false;
    }
    throw new Error(`Option --${b.name} must be of type boolean but got: ${a}`);
};
const h = (b, c, a)=>{
    if (isNaN(a)) {
        throw new Error(`Option --${b.name} must be of type number but got: ${a}`);
    }
    return parseFloat(a);
};
const i = (b, c, a)=>{
    return a;
};
const H = {
    [a.STRING]: i,
    [a.NUMBER]: h,
    [a.BOOLEAN]: g
};
function I(c, a) {
    while(a[0] === "-"){
        a = a.slice(1);
    }
    for (const b of c){
        if (M(b, a)) {
            return b;
        }
    }
    return;
}
function J(h, d, l, i) {
    const j = {};
    for (const b of h){
        const f = E(b.name);
        if (typeof d[f] === "undefined" && typeof b.default !== "undefined") {
            d[f] = typeof b.default === "function" ? b.default() : b.default;
            j[f] = true;
        }
    }
    const e = Object.keys(d);
    if (e.length === 0 && i) {
        return;
    }
    const g = e.map((a)=>({
            name: a,
            option: I(h, F(a))
        }));
    for (const { name: k , option: a  } of g){
        if (!a) {
            throw new Error("Unknown option: --" + k);
        }
        if (a.standalone) {
            if (e.length > 1) {
                if (g.every(({ option: b  })=>b && (a === b || j[b.name]))) {
                    return;
                }
                throw new Error(`Option --${a.name} cannot be combined with other options.`);
            }
            return;
        }
        a.conflicts?.forEach((b)=>{
            if (n(b)) {
                throw new Error(`Option --${a.name} conflicts with option: --${b}`);
            }
        });
        a.depends?.forEach((b)=>{
            if (!n(b) && !j[a.name]) {
                throw new Error(`Option --${a.name} depends on option: --${b}`);
            }
        });
        const m = (a.args?.length || 0) > 1;
        a.args?.forEach((b, c)=>{
            if (b.requiredValue && (typeof d[k] === "undefined" || (m && typeof d[k][c] === "undefined"))) {
                throw new Error(`Missing value for option: --${a.name}`);
            }
        });
        function n(a) {
            const b = E(a);
            return typeof d[b] !== "undefined";
        }
    }
    for (const c of h){
        if (c.required && !(E(c.name) in d)) {
            if ((!c.conflicts || !c.conflicts.find((a)=>!!d[a])) && !g.find((a)=>a.option?.conflicts?.find((a)=>a === c.name))) {
                throw new Error(`Missing required option: --${c.name}`);
            }
        }
    }
    if (e.length === 0 && !i) {
        throw new Error("No arguments.");
    }
}
function K(q, d = {}) {
    !d.flags && (d.flags = []);
    const i = G(q);
    let j = false;
    let r = false;
    const e = {};
    const k = [];
    const l = [];
    let m = false;
    d.flags.forEach((a)=>{
        a.depends?.forEach((a)=>{
            if (!d.flags || !I(d.flags, a)) {
                throw new Error(`Unknown required option: ${a}`);
            }
        });
        a.conflicts?.forEach((a)=>{
            if (!d.flags || !I(d.flags, a)) {
                throw new Error(`Unknown conflicting option: ${a}`);
            }
        });
    });
    for(let g = 0; g < i.length; g++){
        let b;
        let h;
        const c = i[g];
        if (j) {
            k.push(c);
            continue;
        }
        if (c === "--") {
            j = true;
            continue;
        }
        const s = c.length > 1 && c[0] === "-";
        const u = ()=>i[g + 1];
        if (s && !m) {
            if (c[2] === "-" || (c[1] === "-" && c.length === 3)) {
                throw new Error(`Invalid flag name: ${c}`);
            }
            r = c.indexOf("--no-") === 0;
            const n = c.replace(/^-+(no-)?/, "");
            b = I(d.flags, n);
            if (!b) {
                if (d.flags.length) {
                    throw new Error(`Unknown option: ${c}`);
                }
                b = {
                    name: n,
                    optionalValue: true,
                    type: a.STRING
                };
            }
            if (!b.name) {
                throw new Error(`Missing name for option: ${c}`);
            }
            const f = E(b.name);
            if (typeof e[f] !== "undefined" && !b.collect) {
                throw new Error(`Duplicate option: ${c}`);
            }
            h = b.args?.length ? b.args : [
                {
                    type: b.type,
                    requiredValue: b.requiredValue,
                    optionalValue: b.optionalValue,
                    variadic: b.variadic,
                    list: b.list,
                    separator: b.separator
                }, 
            ];
            let t = 0;
            let v = false;
            const o = e[f];
            w(b, h);
            if (typeof e[f] === "undefined") {
                if (typeof b.default !== "undefined") {
                    e[f] = typeof b.default === "function" ? b.default() : b.default;
                } else if (h[t].requiredValue) {
                    throw new Error(`Missing value for option: --${b.name}`);
                } else {
                    e[f] = true;
                }
            }
            if (typeof b.value !== "undefined") {
                e[f] = b.value(e[f], o);
            } else if (b.collect) {
                const p = o || [];
                p.push(e[f]);
                e[f] = p;
            }
            function w(h, j) {
                const b = j[t];
                if (!b) {
                    throw new Error("Unknown option: " + u());
                }
                if (!b.type) {
                    b.type = a.BOOLEAN;
                }
                if (h.args?.length) {
                    if ((typeof b.optionalValue === "undefined" || b.optionalValue === false) && typeof b.requiredValue === "undefined") {
                        b.requiredValue = true;
                    }
                } else {
                    if (b.type !== a.BOOLEAN && (typeof b.optionalValue === "undefined" || b.optionalValue === false) && typeof b.requiredValue === "undefined") {
                        b.requiredValue = true;
                    }
                }
                if (b.requiredValue) {
                    if (v) {
                        throw new Error(`An required argument can not follow an optional argument but found in: ${h.name}`);
                    }
                } else {
                    v = true;
                }
                if (r) {
                    if (b.type !== a.BOOLEAN && !b.optionalValue) {
                        throw new Error(`Negate not supported by --${h.name}. Only optional option or options of type boolean can be negated.`);
                    }
                    e[f] = false;
                    return;
                }
                let c;
                let l = false;
                if (b.list && m(b)) {
                    const k = u().split(b.separator || ",").map((a)=>{
                        const c = n(h, b, a);
                        if (typeof c === "undefined") {
                            throw new Error(`List item of option --${h?.name} must be of type ${b.type} but got: ${a}`);
                        }
                        return c;
                    });
                    if (k?.length) {
                        c = k;
                    }
                } else {
                    if (m(b)) {
                        c = n(h, b, u());
                    } else if (b.optionalValue && b.type === a.BOOLEAN) {
                        c = true;
                    }
                }
                if (l) {
                    g++;
                    if (!b.variadic) {
                        t++;
                    } else if (j[t + 1]) {
                        throw new Error("An argument cannot follow an variadic argument: " + u());
                    }
                }
                if (typeof c !== "undefined" && (j.length > 1 || b.variadic)) {
                    if (!e[f]) {
                        e[f] = [];
                    }
                    e[f].push(c);
                    if (m(b)) {
                        w(h, j);
                    }
                } else {
                    e[f] = c;
                }
                function m(b) {
                    return !!(i[g + 1] && (b.optionalValue || b.requiredValue || b.variadic) && (i[g + 1][0] !== "-" || (b.type === a.NUMBER && !isNaN(i[g + 1]))) && b);
                }
                function n(c, b, e) {
                    let f = d.parse ? d.parse(b.type || a.STRING, c, b, e) : L(c, b, e);
                    if (typeof f !== "undefined") {
                        l = true;
                    }
                    return f;
                }
            }
        } else {
            if (d.stopEarly) {
                m = true;
            }
            l.push(c);
        }
    }
    if (d.flags && d.flags.length) {
        J(d.flags, e, d.knownFlaks, d.allowEmpty);
    }
    return {
        flags: e,
        unknown: l,
        literal: k
    };
}
function L(d, b, e) {
    const c = H[b.type || a.STRING];
    if (!c) {
        throw new Error(`Unknown type ${b.type}`);
    }
    return c(d, b, e);
}
function M(a, b) {
    return (a.name === b || (a.aliases && a.aliases.indexOf(b) !== -1));
}
function N(b, a = "", c = " ") {
    while(a.length < b){
        a += c;
    }
    return a;
}
const { inspect: O  } = Deno;
const P = /%[sdjoO%]/g;
function Q(...a) {
    if (typeof a[0] !== "string") {
        let f = [];
        for(let c = 0; c < arguments.length; c++){
            f.push(O(arguments[c]));
        }
        return f.join(" ");
    }
    let d = 1;
    const g = a[0];
    const h = a.length;
    let e = String(g).replace(P, function(b) {
        if (b === "%%") {
            return "%";
        }
        if (d >= h) {
            return b;
        }
        switch(b){
            case "%s":
                return String(a[d++]);
            case "%d":
                return String(Number(a[d++]));
            case "%j":
                try {
                    return JSON.stringify(a[d++]);
                } catch (c) {
                    return "[Circular]";
                }
            case "%o":
            case "%O":
                return O(a[d++]);
            default:
                return b;
        }
    });
    for(let b = a[d]; d < h; b = a[++d]){
        if (b == null || typeof b !== "object") {
            e += " " + b;
        } else {
            e += " " + O(b);
        }
    }
    return e;
}
class b {
}
class R extends b {
    parse(a, b, c) {
        return g(a, b, c);
    }
    complete() {
        return [
            "true",
            "false"
        ];
    }
}
class S extends b {
    parse(a, b, c) {
        return h(a, b, c);
    }
}
class T extends b {
    parse(a, b, c) {
        return i(a, b, c);
    }
}
class d {
    static splitArguments(c) {
        const a = c.trim().split(/[, =] */g);
        const b = [];
        while(a[a.length - 1] && this.ARGUMENT_REGEX.test(a[a.length - 1])){
            b.unshift(a.pop());
        }
        const d = b.join(" ");
        return {
            args: a,
            typeDefinition: d
        };
    }
    static parseArgumentsDefinition(k) {
        const f = [];
        let g = false;
        let h = false;
        const l = k.split(/ +/);
        for (const c of l){
            if (h) {
                throw new Error("An argument can not follow an variadic argument.");
            }
            const e = c.split(this.ARGUMENT_DETAILS_REGEX);
            const d = e[2] || a.STRING;
            let b = {
                optionalValue: c[0] !== "<",
                name: e[1],
                action: e[3] || d,
                variadic: false,
                list: d ? c.indexOf(d + "[]") !== -1 : false,
                type: d
            };
            if (!b.optionalValue && g) {
                throw new Error("An required argument can not follow an optional argument.");
            }
            if (c[0] === "[") {
                g = true;
            }
            if (b.name.length > 3) {
                const i = b.name.slice(0, 3) === "...";
                const j = b.name.slice(-3) === "...";
                h = b.variadic = i || j;
                if (i) {
                    b.name = b.name.slice(3);
                } else if (j) {
                    b.name = b.name.slice(0, -3);
                }
            }
            if (b.name) {
                f.push(b);
            }
        }
        return f;
    }
    static highlightArguments(a) {
        if (!a) {
            return "";
        }
        return this.parseArgumentsDefinition(a).map((a)=>this.highlightArgumentDetails(a)).join(" ");
    }
    static highlightArgumentDetails(b) {
        let a = "";
        a += t(b.optionalValue ? "[" : "<");
        let c = "";
        c += b.name;
        if (b.variadic) {
            c += "...";
        }
        c = v(c);
        a += c;
        a += t(":");
        a += r(b.type);
        if (b.list) {
            a += s("[]");
        }
        a += t(b.optionalValue ? "]" : ">");
        return a;
    }
}
d.ARGUMENT_REGEX = /^[<\[].+[\]>]$/;
d.ARGUMENT_DETAILS_REGEX = /[<\[:>\]]/;
const U = {
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
class V {
    get length() {
        return this.toString().length;
    }
    static from(a) {
        const b = new this(a);
        if (a instanceof V) {
            b.options = Object.assign({}, a.options);
        }
        return b;
    }
    constructor(a){
        this.value = a;
        this.options = {};
    }
    toString() {
        return this.value.toString();
    }
    setValue(a) {
        this.value = a;
        return this;
    }
    clone(b) {
        const a = new V(b ?? this);
        a.options = Object.assign({}, this.options);
        return a;
    }
    border(a, b = true) {
        if (b || typeof this.options.border === "undefined") {
            this.options.border = a;
        }
        return this;
    }
    colSpan(a, b = true) {
        if (b || typeof this.options.colSpan === "undefined") {
            this.options.colSpan = a;
        }
        return this;
    }
    rowSpan(a, b = true) {
        if (b || typeof this.options.rowSpan === "undefined") {
            this.options.rowSpan = a;
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
class W extends Array {
    static from(a) {
        const b = new this(...a);
        if (a instanceof W) {
            b.options = Object.assign({}, a.options);
        }
        return b;
    }
    clone() {
        const a = new W(...this.map((a)=>(a instanceof V ? a.clone() : a)));
        a.options = Object.assign({}, this.options);
        return a;
    }
    border(a, b = true) {
        if (b || typeof this.options.border === "undefined") {
            this.options.border = a;
        }
        return this;
    }
    getBorder() {
        return this.options.border === true;
    }
    hasBorder() {
        return (this.getBorder() || this.some((a)=>a instanceof V && a.getBorder()));
    }
    constructor(...a){
        super(...a);
        this.options = {};
    }
}
function X(f, g) {
    let b = "";
    const d = g.split(/ /g);
    for(let c = 0; c < d.length; c++){
        let a = d[c];
        let e = a.indexOf("\n") !== -1;
        if (e) {
            a = a.split("\n").shift();
        }
        if (b) {
            const h = Z(a).length;
            const i = Z(b).length;
            if (i + h >= f) {
                break;
            }
        }
        b += (c > 0 ? " " : "") + a;
        if (e) {
            break;
        }
    }
    return b;
}
const Y = /(\x1b|\e|\033)\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]/g;
function Z(a) {
    return a.replace(Y, "");
}
function $(b, a, c) {
    return Math.max(...a.map((a)=>(a[b] instanceof V && a[b].getColSpan() > 1 ? "" : a[b]?.toString() || "").split("\n").map((a)=>{
            const b = typeof c === "undefined" ? a : X(c, a);
            return Z(b).length || 0;
        })).flat());
}
class _ {
    constructor(a, b){
        this.table = a;
        this.options = b;
    }
    toString() {
        const a = this.createLayout();
        return a.rows.length ? this.renderRows(a) : "";
    }
    createLayout() {
        Object.keys(this.options.chars).forEach((a)=>{
            if (typeof this.options.chars[a] !== "string") {
                this.options.chars[a] = "";
            }
        });
        const e = this.table.getBorder() || this.table.hasBodyBorder();
        const f = this.table.hasHeaderBorder();
        const m = f || e;
        const g = this.table.getHeader();
        const b = this.spanRows(g ? [
            g,
            ...this.table
        ] : this.table.slice());
        const c = Math.max(...b.map((a)=>a.length));
        for (const d of b){
            const h = d.length;
            if (h < c) {
                const n = c - h;
                for(let i = 0; i < n; i++){
                    d.push(this.createCell(null, d));
                }
            }
        }
        const j = [];
        const k = [];
        for(let a = 0; a < c; a++){
            const o = Array.isArray(this.options.minCellWidth) ? this.options.minCellWidth[a] : this.options.minCellWidth;
            const l = Array.isArray(this.options.maxCellWidth) ? this.options.maxCellWidth[a] : this.options.maxCellWidth;
            const p = $(a, b, l);
            k[a] = Math.min(l, Math.max(o, p));
            j[a] = Array.isArray(this.options.padding) ? this.options.padding[a] : this.options.padding;
        }
        return {
            padding: j,
            width: k,
            rows: b,
            columns: c,
            hasBorder: m,
            hasBodyBorder: e,
            hasHeaderBorder: f
        };
    }
    spanRows(f, c = 0, a = 0, d = [], e = 1) {
        const b = f;
        if (c >= b.length && d.every((a)=>a === 1)) {
            return b;
        } else if (b[c] && a >= b[c].length && a >= d.length && e === 1) {
            return this.spanRows(b, ++c, 0, d, 1);
        }
        if (e > 1) {
            e--;
            d[a] = d[a - 1];
            b[c].splice(a - 1, 0, b[c][a - 1]);
            return this.spanRows(b, c, ++a, d, e);
        }
        if (a === 0) {
            b[c] = this.createRow(b[c] || []);
        }
        if (d[a] > 1) {
            d[a]--;
            b[c].splice(a, 0, b[c - 1][a]);
            return this.spanRows(b, c, ++a, d, e);
        }
        b[c][a] = this.createCell(b[c][a] || null, b[c]);
        e = b[c][a].getColSpan();
        d[a] = b[c][a].getRowSpan();
        return this.spanRows(b, c, ++a, d, e);
    }
    createRow(a) {
        return W.from(a).border(this.table.getBorder(), false);
    }
    createCell(a, b) {
        return V.from(a ?? "").border(b.getBorder(), false);
    }
    renderRows(a) {
        let c = "";
        const d = new Array(a.columns).fill(1);
        for(let b = 0; b < a.rows.length; b++){
            c += this.renderRow(d, b, a);
        }
        return c.slice(0, -1);
    }
    renderRow(c, f, a, j) {
        const d = a.rows[f];
        const g = a.rows[f - 1];
        const k = a.rows[f + 1];
        let e = "";
        let h = 1;
        if (!j && f === 0 && d.hasBorder()) {
            e += this.renderBorderRow(undefined, d, c, a);
        }
        let i = false;
        e += " ".repeat(this.options.indent || 0);
        for(let b = 0; b < a.columns; b++){
            if (h > 1) {
                h--;
                c[b] = c[b - 1];
                continue;
            }
            e += this.renderCell(b, d, g, c, a);
            if (c[b] > 1) {
                if (!j) {
                    c[b]--;
                }
            } else if (!g || g[b] !== d[b]) {
                c[b] = d[b].getRowSpan();
            }
            h = d[b].getColSpan();
            if (c[b] === 1 && d[b].length) {
                i = true;
            }
        }
        if (a.columns > 0) {
            if (d[a.columns - 1].getBorder()) {
                e += this.options.chars.right;
            } else if (a.hasBorder) {
                e += " ";
            }
        }
        e += "\n";
        if (i) {
            return (e + this.renderRow(c, f, a, i));
        }
        if ((f === 0 && a.hasHeaderBorder) || (f < a.rows.length - 1 && a.hasBodyBorder)) {
            e += this.renderBorderRow(d, k, c, a);
        }
        if (f === a.rows.length - 1 && d.hasBorder()) {
            e += this.renderBorderRow(d, undefined, c, a);
        }
        return e;
    }
    renderCell(b, f, m, n, a, i) {
        let c = "";
        const j = f[b - 1];
        const e = f[b];
        if (!i) {
            if (b === 0) {
                if (e.getBorder()) {
                    c += this.options.chars.left;
                } else if (a.hasBorder) {
                    c += " ";
                }
            } else {
                if (e.getBorder() || j?.getBorder()) {
                    c += this.options.chars.middle;
                } else if (a.hasBorder) {
                    c += " ";
                }
            }
        }
        let g = a.width[b];
        const h = e.getColSpan();
        if (h > 1) {
            for(let d = 1; d < h; d++){
                g += a.width[b + d] + a.padding[b + d];
                if (a.hasBorder) {
                    g += a.padding[b + d] + 1;
                }
            }
        }
        const { current: k , next: l  } = this.renderCellValue(e, g);
        f[b].setValue(l);
        if (a.hasBorder) {
            c += " ".repeat(a.padding[b]);
        }
        c += k;
        if (a.hasBorder || b < a.columns - 1) {
            c += " ".repeat(a.padding[b]);
        }
        return c;
    }
    renderCellValue(b, d) {
        const c = Math.min(d, Z(b.toString()).length);
        let a = X(c, b.toString());
        const e = Z(a).length > c;
        if (e) {
            a = a.slice(0, c);
        }
        const f = b.toString().slice(a.length + (e ? 0 : 1));
        const g = d - Z(a).length;
        const h = a + " ".repeat(g);
        return {
            current: h,
            next: b.clone(f)
        };
    }
    renderBorderRow(g, b, e, f) {
        let c = "";
        let d = 1;
        for(let a = 0; a < f.columns; a++){
            if (e[a] > 1) {
                if (!b) {
                    throw new Error("invalid layout");
                }
                if (d > 1) {
                    d--;
                    continue;
                }
            }
            c += this.renderBorderCell(a, g, b, e, f);
            d = b?.[a].getColSpan() ?? 1;
        }
        return c.length ? " ".repeat(this.options.indent) + c + "\n" : "";
    }
    renderBorderCell(b, q, j, o, k) {
        const e = q?.[b - 1];
        const f = j?.[b - 1];
        const g = q?.[b];
        const h = j?.[b];
        const l = !!e?.getBorder();
        const m = !!f?.getBorder();
        const c = !!g?.getBorder();
        const d = !!h?.getBorder();
        const i = (a)=>(a?.getColSpan() ?? 1) > 1;
        const n = (a)=>(a?.getRowSpan() ?? 1) > 1;
        let a = "";
        if (b === 0) {
            if (o[b] > 1) {
                if (c) {
                    a += this.options.chars.left;
                } else {
                    a += " ";
                }
            } else if (c && d) {
                a += this.options.chars.leftMid;
            } else if (c) {
                a += this.options.chars.bottomLeft;
            } else if (d) {
                a += this.options.chars.topLeft;
            } else {
                a += " ";
            }
        } else if (b < k.columns) {
            if ((l && d) || (c && m)) {
                const r = i(e);
                const s = i(f);
                const t = i(g);
                const u = i(h);
                const v = n(e);
                const w = n(f);
                const x = n(g);
                const y = n(h);
                const z = l && d && c && m;
                const A = v && x && w && y;
                const B = r && t && s && u;
                if (A && z) {
                    a += this.options.chars.middle;
                } else if (B && z && e === g && f === h) {
                    a += this.options.chars.mid;
                } else if (r && t && e === g) {
                    a += this.options.chars.topMid;
                } else if (s && u && f === h) {
                    a += this.options.chars.bottomMid;
                } else if (v && w && e === f) {
                    a += this.options.chars.leftMid;
                } else if (x && y && g === h) {
                    a += this.options.chars.rightMid;
                } else {
                    a += this.options.chars.midMid;
                }
            } else if (l && c) {
                if (i(e) && i(g) && e === g) {
                    a += this.options.chars.bottom;
                } else {
                    a += this.options.chars.bottomMid;
                }
            } else if (c && d) {
                if (o[b] > 1) {
                    a += this.options.chars.left;
                } else {
                    a += this.options.chars.leftMid;
                }
            } else if (d && m) {
                if (i(f) && i(h) && f === h) {
                    a += this.options.chars.top;
                } else {
                    a += this.options.chars.topMid;
                }
            } else if (l && m) {
                if (n(e) && e === f) {
                    a += this.options.chars.right;
                } else {
                    a += this.options.chars.rightMid;
                }
            } else if (l) {
                a += this.options.chars.bottomRight;
            } else if (c) {
                a += this.options.chars.bottomLeft;
            } else if (m) {
                a += this.options.chars.topRight;
            } else if (d) {
                a += this.options.chars.topLeft;
            } else {
                a += " ";
            }
        }
        const p = k.padding[b] + k.width[b] + k.padding[b];
        if (o[b] > 1 && j) {
            a += this.renderCell(b, j, q, o, k, true);
            if (j[b] === j[j.length - 1]) {
                if (c) {
                    a += this.options.chars.right;
                } else {
                    a += " ";
                }
                return a;
            }
        } else if (c && d) {
            a += this.options.chars.mid.repeat(p);
        } else if (c) {
            a += this.options.chars.bottom.repeat(p);
        } else if (d) {
            a += this.options.chars.top.repeat(p);
        } else {
            a += " ".repeat(p);
        }
        if (b === k.columns - 1) {
            if (c && d) {
                a += this.options.chars.rightMid;
            } else if (c) {
                a += this.options.chars.bottomRight;
            } else if (d) {
                a += this.options.chars.topRight;
            } else {
                a += " ";
            }
        }
        return a;
    }
}
class aa extends Array {
    static from(a) {
        const b = new this(...a);
        if (a instanceof aa) {
            b.options = Object.assign({}, a.options);
            b.headerRow = a.headerRow ? W.from(a.headerRow) : undefined;
        }
        return b;
    }
    static fromJson(a) {
        return new this().fromJson(a);
    }
    static render(a) {
        aa.from(a).render();
    }
    fromJson(a) {
        this.header(Object.keys(a[0]));
        this.body(a.map((a)=>Object.values(a)));
        return this;
    }
    header(a) {
        this.headerRow = a instanceof W ? a : W.from(a);
        return this;
    }
    body(a) {
        this.length = 0;
        this.push(...a);
        return this;
    }
    clone() {
        const a = new aa(...this.map((a)=>a instanceof W ? a.clone() : W.from(a).clone()));
        a.options = Object.assign({}, this.options);
        a.headerRow = this.headerRow?.clone();
        return a;
    }
    toString() {
        return new _(this, this.options).toString();
    }
    render() {
        Deno.stdout.writeSync(l(this.toString() + "\n"));
        return this;
    }
    maxCellWidth(a, b = true) {
        if (b || typeof this.options.maxCellWidth === "undefined") {
            this.options.maxCellWidth = a;
        }
        return this;
    }
    minCellWidth(a, b = true) {
        if (b || typeof this.options.minCellWidth === "undefined") {
            this.options.minCellWidth = a;
        }
        return this;
    }
    indent(a, b = true) {
        if (b || typeof this.options.indent === "undefined") {
            this.options.indent = a;
        }
        return this;
    }
    padding(a, b = true) {
        if (b || typeof this.options.padding === "undefined") {
            this.options.padding = a;
        }
        return this;
    }
    border(a, b = true) {
        if (b || typeof this.options.border === "undefined") {
            this.options.border = a;
        }
        return this;
    }
    chars(a) {
        Object.assign(this.options.chars, a);
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
        return (this.getBorder() || (this.headerRow instanceof W && this.headerRow.hasBorder()));
    }
    hasBodyBorder() {
        return (this.getBorder() || this.some((a)=>a instanceof W ? a.hasBorder() : a.some((a)=>a instanceof V ? a.getBorder : false)));
    }
    hasBorder() {
        return this.hasHeaderBorder() || this.hasBodyBorder();
    }
    constructor(...a){
        super(...a);
        this.options = {
            indent: 0,
            border: false,
            maxCellWidth: Infinity,
            minCellWidth: 0,
            padding: 1,
            chars: U
        };
    }
}
class ab {
    static generate(a) {
        return new ab(a).generate();
    }
    constructor(a){
        this.cmd = a;
        this.indent = 2;
    }
    generate() {
        return (this.generateHeader() + this.generateDescription() + this.generateOptions() + this.generateCommands() + this.generateEnvironmentVariables() + this.generateExamples() + "\n");
    }
    generateHeader() {
        return ("\n" + aa.from([
            [
                p("Usage:"),
                v(`${this.cmd.getName()}${this.cmd.getArgsDefinition() ? " " + this.cmd.getArgsDefinition() : ""}`), 
            ],
            [
                p("Version:"),
                t(`v${this.cmd.getVersion()}`)
            ], 
        ]).indent(this.indent).padding(1).toString() + "\n");
    }
    generateDescription() {
        if (!this.cmd.getDescription()) {
            return "";
        }
        return (this.label("Description") + aa.from([
            [
                this.cmd.getDescription()
            ]
        ]).indent(this.indent * 2).maxCellWidth(140).padding(1).toString() + "\n");
    }
    generateOptions() {
        const a = this.cmd.getOptions(false);
        if (!a.length) {
            return "";
        }
        const b = !!a.find((a)=>!!a.typeDefinition);
        if (b) {
            return (this.label("Options") + aa.from([
                ...a.map((a)=>[
                        a.flags.split(/,? +/g).map((a)=>u(a)).join(", "),
                        d.highlightArguments(a.typeDefinition || ""),
                        r(p("-")) + " " + a.description.split("\n").shift(),
                        this.generateHints(a), 
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
        return (this.label("Options") + aa.from([
            ...a.map((a)=>[
                    a.flags.split(/,? +/g).map((a)=>u(a)).join(", "),
                    r(p("-")) + " " + a.description.split("\n").shift(),
                    this.generateHints(a), 
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
        const a = this.cmd.getCommands(false);
        if (!a.length) {
            return "";
        }
        const b = !!a.find((a)=>!!a.getArgsDefinition());
        if (b) {
            return (this.label("Commands") + aa.from([
                ...a.map((a)=>[
                        [
                            a.getName(),
                            ...a.getAliases()
                        ].map((a)=>u(a)).join(", "),
                        d.highlightArguments(a.getArgsDefinition() || ""),
                        r(p("-")) + " " + a.getDescription().split("\n").shift(), 
                    ]), 
            ]).padding([
                2,
                2,
                2
            ]).indent(this.indent * 2).toString() + "\n");
        }
        return (this.label("Commands") + aa.from([
            ...a.map((a)=>[
                    [
                        a.getName(),
                        ...a.getAliases()
                    ].map((a)=>u(a)).join(", "),
                    r(p("-")) + " " + a.getDescription().split("\n").shift(), 
                ]), 
        ]).padding([
            2,
            2
        ]).indent(this.indent * 2).toString() + "\n");
    }
    generateEnvironmentVariables() {
        const a = this.cmd.getEnvVars(false);
        if (!a.length) {
            return "";
        }
        return (this.label("Environment variables") + aa.from([
            ...a.map((a)=>[
                    a.names.map((a)=>u(a)).join(", "),
                    d.highlightArgumentDetails(a.details),
                    `${r(p("-"))} ${a.description}`, 
                ]), 
        ]).padding(2).indent(this.indent * 2).toString() + "\n");
    }
    generateExamples() {
        const a = this.cmd.getExamples();
        if (!a.length) {
            return "";
        }
        return (this.label("Examples") + aa.from(a.map((a)=>[
                q(p(`${ac(a.name)}:`)),
                `\n${a.description}`, 
            ])).padding(1).indent(this.indent * 2).maxCellWidth(150).toString() + "\n");
    }
    generateHints(a) {
        const b = [];
        a.required && b.push(t(`required`));
        typeof a.default !== "undefined" && b.push(u(p(`Default: `)) + u(Q(a.default)));
        a.depends && a.depends.length && b.push(r(p(`depends: `)) + a.depends.map((a)=>r(a)).join(", "));
        a.conflicts && a.conflicts.length && b.push(r(p(`conflicts: `)) + a.conflicts.map((a)=>r(a)).join(", "));
        if (b.length) {
            return `(${b.join(", ")})`;
        }
        return "";
    }
    line(...a) {
        return ((a.length ? " ".repeat(this.indent) + Q(...a) : "") + "\n");
    }
    label(a) {
        return "\n" + this.line(p(`${a}:`)) + "\n";
    }
}
function ac(a) {
    return a?.charAt(0).toUpperCase() + a.slice(1) ?? "";
}
const { stdout: ad , stderr: ae  } = Deno;
const c = Deno.permissions;
const e = c && c.query && (await c.query({
    name: "env"
}));
const af = !!e && e.state === "granted";
class j {
    versionOption(a, c, b) {
        this._versionOption = a === false ? a : {
            flags: a,
            desc: c,
            opts: typeof b === "function" ? {
                action: b
            } : b
        };
        return this;
    }
    helpOption(a, c, b) {
        this._helpOption = a === false ? a : {
            flags: a,
            desc: c,
            opts: typeof b === "function" ? {
                action: b
            } : b
        };
        return this;
    }
    command(g, c, h) {
        let f;
        if (typeof c === "string") {
            f = c;
            c = undefined;
        }
        const e = d.splitArguments(g);
        const a = e.args.shift();
        const i = e.args;
        if (!a) {
            throw this.error(new Error("Missing command name."));
        }
        if (this.getBaseCommand(a, true)) {
            if (!h) {
                throw this.error(new Error(`Duplicate command: ${a}`));
            }
            this.removeCommand(a);
        }
        const b = (c || new j()).reset();
        b._name = a;
        b._parent = this;
        if (f) {
            b.isExecutable = true;
            b.description(f);
        }
        if (e.typeDefinition) {
            b.arguments(e.typeDefinition);
        }
        i.forEach((a)=>b.aliases.push(a));
        this.commands.set(a, b);
        this.select(a);
        return this;
    }
    alias(a) {
        if (this.cmd === this) {
            throw this.error(new Error(`Failed to add alias '${a}'. No sub command selected.`));
        }
        if (this.cmd.aliases.indexOf(a) !== -1) {
            throw this.error(new Error(`Duplicate alias: ${a}`));
        }
        this.cmd.aliases.push(a);
        return this;
    }
    reset() {
        return (this.cmd = this);
    }
    select(a) {
        const b = this.getBaseCommand(a, true);
        if (!b) {
            throw this.error(new Error(`Sub-command not found: ${a}`));
        }
        this.cmd = b;
        return this;
    }
    name(a) {
        this.cmd._name = a;
        return this;
    }
    version(a) {
        this.cmd.ver = a;
        return this;
    }
    description(a) {
        this.cmd.desc = a;
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
    arguments(a) {
        this.cmd.argsDefinition = a;
        return this;
    }
    action(a) {
        this.cmd.fn = a;
        return this;
    }
    allowEmpty(a = true) {
        this.cmd._allowEmpty = a;
        return this;
    }
    stopEarly(a = true) {
        this.cmd._stopEarly = a;
        return this;
    }
    useRawArgs(a = true) {
        this.cmd._useRawArgs = a;
        return this;
    }
    default(a) {
        this.cmd.defaultCommand = a;
        return this;
    }
    type(a, c, d) {
        if (this.cmd.types.get(a) && !d?.override) {
            throw this.error(new Error(`Type '${a}' already exists.`));
        }
        this.cmd.types.set(a, {
            ...d,
            name: a,
            handler: c
        });
        if (c instanceof b && typeof c.complete !== "undefined") {
            this.complete(a, (a, b)=>c.complete?.(a, b) || [], d);
        }
        return this;
    }
    complete(a, c, b) {
        if (this.cmd.completions.has(a) && !b?.override) {
            throw this.error(new Error(`Completion '${a}' already exists.`));
        }
        this.cmd.completions.set(a, {
            name: a,
            complete: c,
            ...b
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
        const a = (b, c = [], d = [])=>{
            if (b) {
                if (b.completions.size) {
                    b.completions.forEach((a)=>{
                        if (a.global && !this.completions.has(a.name) && d.indexOf(a.name) === -1) {
                            d.push(a.name);
                            c.push(a);
                        }
                    });
                }
                return a(b._parent, c, d);
            }
            return c;
        };
        return a(this._parent);
    }
    getCompletion(a) {
        return this.getBaseCompletion(a) ?? this.getGlobalCompletion(a);
    }
    getBaseCompletion(a) {
        return this.completions.get(a);
    }
    getGlobalCompletion(a) {
        if (!this._parent) {
            return;
        }
        let b = this._parent.getBaseCompletion(a);
        if (!b?.global) {
            return this._parent.getGlobalCompletion(a);
        }
        return b;
    }
    option(g, h, e) {
        if (typeof e === "function") {
            return this.option(g, h, {
                value: e
            });
        }
        const c = d.splitArguments(g);
        const i = c.typeDefinition ? d.parseArgumentsDefinition(c.typeDefinition) : [];
        const a = {
            name: "",
            description: h,
            args: i,
            flags: c.args.join(", "),
            typeDefinition: c.typeDefinition,
            ...e
        };
        if (a.separator) {
            for (const j of i){
                if (j.list) {
                    j.separator = a.separator;
                }
            }
        }
        for (const l of c.args){
            const f = l.trim();
            const k = /^--/.test(f);
            const b = k ? f.slice(2) : f.slice(1);
            if (a.name === b || (a.aliases && ~a.aliases.indexOf(b))) {
                throw this.error(new Error(`Duplicate command name: ${b}`));
            }
            if (!a.name && k) {
                a.name = b;
            } else if (!a.aliases) {
                a.aliases = [
                    b
                ];
            } else {
                a.aliases.push(b);
            }
            if (this.cmd.getBaseOption(b, true)) {
                if (e?.override) {
                    this.removeOption(b);
                } else {
                    throw this.error(new Error(`Duplicate option name: ${b}`));
                }
            }
        }
        if (a.prepend) {
            this.cmd.options.unshift(a);
        } else {
            this.cmd.options.push(a);
        }
        return this;
    }
    example(a, b) {
        if (this.cmd.hasExample(a)) {
            throw this.error(new Error("Example already exists."));
        }
        this.cmd.examples.push({
            name: a,
            description: b
        });
        return this;
    }
    env(b, e, f) {
        const c = d.splitArguments(b);
        if (!c.typeDefinition) {
            c.typeDefinition = "<value:boolean>";
        }
        if (c.args.some((a)=>this.cmd.getBaseEnvVar(a, true))) {
            throw this.error(new Error(`Environment variable already exists: ${b}`));
        }
        const a = d.parseArgumentsDefinition(c.typeDefinition);
        if (a.length > 1) {
            throw this.error(new Error(`An environment variable can only have one value but got: ${b}`));
        } else if (a.length && a[0].optionalValue) {
            throw this.error(new Error(`An environment variable can not have an optional value but '${b}' is defined as optional.`));
        } else if (a.length && a[0].variadic) {
            throw this.error(new Error(`An environment variable can not have an variadic value but '${b}' is defined as variadic.`));
        }
        this.cmd.envVars.push({
            names: c.args,
            description: e,
            type: a[0].type,
            details: a.shift(),
            ...f
        });
        return this;
    }
    async parse(e = Deno.args, a) {
        this.reset().registerDefaults();
        this.rawArgs = e;
        const b = this.rawArgs.length > 0 && this.getCommand(this.rawArgs[0], true);
        if (b) {
            b._globalParent = this;
            return await b.parse(this.rawArgs.slice(1), a);
        }
        if (this.isExecutable) {
            if (!a) {
                await this.executeExecutable(this.rawArgs);
            }
            return {
                options: {},
                args: this.rawArgs,
                cmd: this,
                literal: this.literalArgs
            };
        } else if (this._useRawArgs) {
            if (a) {
                return {
                    options: {},
                    args: this.rawArgs,
                    cmd: this,
                    literal: this.literalArgs
                };
            }
            return await this.execute({}, ...this.rawArgs);
        } else {
            const { flags: c , unknown: f , literal: g  } = this.parseFlags(this.rawArgs);
            this.literalArgs = g;
            const d = this.parseArguments(f, c);
            this.validateEnvVars();
            if (a) {
                return {
                    options: c,
                    args: d,
                    cmd: this,
                    literal: this.literalArgs
                };
            }
            return await this.execute(c, ...d);
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
                    await Deno.stdout.writeSync(l(this.getVersion() + "\n"));
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
    async execute(a, ...b) {
        const c = this.findActionFlag(a);
        if (c && c.action) {
            await c.action.call(this, a, ...b);
            return {
                options: a,
                args: b,
                cmd: this,
                literal: this.literalArgs
            };
        }
        if (this.fn) {
            try {
                await this.fn(a, ...b);
            } catch (e) {
                throw this.error(e);
            }
        } else if (this.defaultCommand) {
            const d = this.getCommand(this.defaultCommand, true);
            if (!d) {
                throw this.error(new Error(`Default command '${this.defaultCommand}' not found.`));
            }
            d._globalParent = this;
            try {
                await d.execute(a, ...b);
            } catch (f) {
                throw this.error(f);
            }
        }
        return {
            options: a,
            args: b,
            cmd: this,
            literal: this.literalArgs
        };
    }
    async executeExecutable(b) {
        const [f, ...c] = this.getPath().split(" ");
        c.unshift(f.replace(/\.ts$/, ""));
        const a = c.join("-");
        try {
            await Deno.run({
                cmd: [
                    a,
                    ...b
                ]
            });
            return;
        } catch (d) {
            if (!d.message.match(/No such file or directory/)) {
                throw d;
            }
        }
        try {
            await Deno.run({
                cmd: [
                    a + ".ts",
                    ...b
                ]
            });
            return;
        } catch (e) {
            if (!e.message.match(/No such file or directory/)) {
                throw e;
            }
        }
        throw this.error(new Error(`Sub-command executable not found: ${a}${q("(.ts)")}`));
    }
    parseFlags(a) {
        try {
            return K(a, {
                stopEarly: this._stopEarly,
                allowEmpty: this._allowEmpty,
                flags: this.getOptions(true),
                parse: (a, b, c, d)=>this.parseType(a, b, c, d)
            });
        } catch (b) {
            throw this.error(b);
        }
    }
    parseType(c, d, e, f) {
        const a = this.getType(c);
        if (!a) {
            throw this.error(new Error(`No type registered with name: ${c}`));
        }
        return a.handler instanceof b ? a.handler.parse(d, e, f) : a.handler(d, e, f);
    }
    validateEnvVars() {
        const a = this.getEnvVars(true);
        if (!a.length) {
            return;
        }
        if (af) {
            a.forEach((a)=>{
                const b = a.names.find((a)=>!!Deno.env.get(a));
                if (b) {
                    const c = Deno.env.get(b);
                    try {
                        this.parseType(a.type, {
                            name: b
                        }, a, c || "");
                    } catch (d) {
                        throw new Error(`Environment variable '${b}' must be of type ${a.type} but got: ${c}`);
                    }
                }
            });
        }
    }
    parseArguments(a, f) {
        const c = [];
        a = a.slice(0);
        if (!this.hasArguments()) {
            if (a.length) {
                if (this.hasCommands(true)) {
                    throw this.error(new Error(`Unknown command: ${a.join(" ")}`));
                } else {
                    throw this.error(new Error(`No arguments allowed for command: ${this._name}`));
                }
            }
        } else {
            if (!a.length) {
                const e = this.getArguments().filter((a)=>!a.optionalValue).map((a)=>a.name);
                if (e.length) {
                    const g = Object.keys(f);
                    const h = !!g.find((a)=>this.getOption(a, true)?.standalone);
                    if (!h) {
                        throw this.error(new Error("Missing argument(s): " + e.join(", ")));
                    }
                }
                return c;
            }
            for (const d of this.getArguments()){
                if (!d.optionalValue && !a.length) {
                    throw this.error(new Error(`Missing argument: ${d.name}`));
                }
                let b;
                if (d.variadic) {
                    b = a.splice(0, a.length);
                } else {
                    b = a.shift();
                }
                if (b) {
                    c.push(b);
                }
            }
            if (a.length) {
                throw this.error(new Error(`To many arguments: ${a.join(" ")}`));
            }
        }
        return c;
    }
    findActionFlag(b) {
        const c = Object.keys(b);
        for (const d of c){
            const a = this.getOption(d, true);
            if (a?.action) {
                return a;
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
    getArgument(a) {
        return this.getArguments().find((b)=>b.name === a);
    }
    getArguments() {
        if (!this.args.length && this.argsDefinition) {
            this.args = d.parseArgumentsDefinition(this.argsDefinition);
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
    hasOptions(a) {
        return this.getOptions(a).length > 0;
    }
    getOptions(a) {
        return this.getGlobalOptions(a).concat(this.getBaseOptions(a));
    }
    getBaseOptions(a) {
        if (!this.options.length) {
            return [];
        }
        return a ? this.options.slice(0) : this.options.filter((a)=>!a.hidden);
    }
    getGlobalOptions(b) {
        const a = (c, d = [], e = [])=>{
            if (c) {
                if (c.options.length) {
                    c.options.forEach((a)=>{
                        if (a.global && !this.options.find((b)=>b.name === a.name) && e.indexOf(a.name) === -1 && (b || !a.hidden)) {
                            e.push(a.name);
                            d.push(a);
                        }
                    });
                }
                return a(c._parent, d, e);
            }
            return d;
        };
        return a(this._parent);
    }
    hasOption(a, b) {
        return !!this.getOption(a, b);
    }
    getOption(a, b) {
        return (this.getBaseOption(a, b) ?? this.getGlobalOption(a, b));
    }
    getBaseOption(c, b) {
        const a = this.options.find((a)=>a.name === c);
        return a && (b || !a.hidden) ? a : undefined;
    }
    getGlobalOption(b, c) {
        if (!this._parent) {
            return;
        }
        let a = this._parent.getBaseOption(b, c);
        if (!a || !a.global) {
            return this._parent.getGlobalOption(b, c);
        }
        return a;
    }
    removeOption(b) {
        const a = this.options.findIndex((a)=>a.name === b);
        if (a === -1) {
            return;
        }
        return this.options.splice(a, 1)[0];
    }
    hasCommands(a) {
        return this.getCommands(a).length > 0;
    }
    getCommands(a) {
        return this.getGlobalCommands(a).concat(this.getBaseCommands(a));
    }
    getBaseCommands(b) {
        const a = Array.from(this.commands.values());
        return b ? a : a.filter((a)=>!a.isHidden);
    }
    getGlobalCommands(b) {
        const a = (c, d = [], e = [])=>{
            if (c) {
                if (c.commands.size) {
                    c.commands.forEach((a)=>{
                        if (a.isGlobal && this !== a && !this.commands.has(a._name) && e.indexOf(a._name) === -1 && (b || !a.isHidden)) {
                            e.push(a._name);
                            d.push(a);
                        }
                    });
                }
                return a(c._parent, d, e);
            }
            return d;
        };
        return a(this._parent);
    }
    hasCommand(a, b) {
        return !!this.getCommand(a, b);
    }
    getCommand(a, b) {
        return (this.getBaseCommand(a, b) ?? this.getGlobalCommand(a, b));
    }
    getBaseCommand(b, c) {
        let a = this.commands.get(b);
        return a && (c || !a.isHidden) ? a : undefined;
    }
    getGlobalCommand(a, b) {
        if (!this._parent) {
            return;
        }
        let c = this._parent.getBaseCommand(a, b);
        if (!c?.isGlobal) {
            return this._parent.getGlobalCommand(a, b);
        }
        return c;
    }
    removeCommand(a) {
        const b = this.getBaseCommand(a, true);
        if (b) {
            this.commands.delete(a);
        }
        return b;
    }
    getTypes() {
        return this.getGlobalTypes().concat(this.getBaseTypes());
    }
    getBaseTypes() {
        return Array.from(this.types.values());
    }
    getGlobalTypes() {
        const a = (b, c = [], d = [])=>{
            if (b) {
                if (b.types.size) {
                    b.types.forEach((a)=>{
                        if (a.global && !this.types.has(a.name) && d.indexOf(a.name) === -1) {
                            d.push(a.name);
                            c.push(a);
                        }
                    });
                }
                return a(b._parent, c, d);
            }
            return c;
        };
        return a(this._parent);
    }
    getType(a) {
        return this.getBaseType(a) ?? this.getGlobalType(a);
    }
    getBaseType(a) {
        return this.types.get(a);
    }
    getGlobalType(a) {
        if (!this._parent) {
            return;
        }
        let b = this._parent.getBaseType(a);
        if (!b?.global) {
            return this._parent.getGlobalType(a);
        }
        return b;
    }
    hasEnvVars(a) {
        return this.getEnvVars(a).length > 0;
    }
    getEnvVars(a) {
        return this.getGlobalEnvVars(a).concat(this.getBaseEnvVars(a));
    }
    getBaseEnvVars(a) {
        if (!this.envVars.length) {
            return [];
        }
        return a ? this.envVars.slice(0) : this.envVars.filter((a)=>!a.hidden);
    }
    getGlobalEnvVars(b) {
        const a = (c, d = [], e = [])=>{
            if (c) {
                if (c.envVars.length) {
                    c.envVars.forEach((a)=>{
                        if (a.global && !this.envVars.find((b)=>b.names[0] === a.names[0]) && e.indexOf(a.names[0]) === -1 && (b || !a.hidden)) {
                            e.push(a.names[0]);
                            d.push(a);
                        }
                    });
                }
                return a(c._parent, d, e);
            }
            return d;
        };
        return a(this._parent);
    }
    hasEnvVar(a, b) {
        return !!this.getEnvVar(a, b);
    }
    getEnvVar(a, b) {
        return (this.getBaseEnvVar(a, b) ?? this.getGlobalEnvVar(a, b));
    }
    getBaseEnvVar(c, b) {
        const a = this.envVars.find((a)=>a.names.indexOf(c) !== -1);
        return a && (b || !a.hidden) ? a : undefined;
    }
    getGlobalEnvVar(a, b) {
        if (!this._parent) {
            return;
        }
        let c = this._parent.getBaseEnvVar(a, b);
        if (!c?.global) {
            return this._parent.getGlobalEnvVar(a, b);
        }
        return c;
    }
    hasExamples() {
        return this.examples.length > 0;
    }
    getExamples() {
        return this.examples;
    }
    hasExample(a) {
        return !!this.getExample(a);
    }
    getExample(a) {
        return this.examples.find((b)=>b.name === a);
    }
    getRawArgs() {
        return this.rawArgs;
    }
    getLiteralArgs() {
        return this.literalArgs;
    }
    write(...a) {
        ad.writeSync(l(N(2) + Q(...a)));
    }
    writeError(...a) {
        ae.writeSync(l(N(2) + r(Q(`[ERROR:${this._name}]`, ...a))));
    }
    log(...a) {
        this.write(...a, "\n");
    }
    logError(...a) {
        this.writeError(...a, "\n");
    }
    error(a, b = true) {
        if (this.shouldThrowErrors()) {
            return a;
        }
        const c = af ? !!Deno.env.get("CLIFFY_DEBUG") : false;
        b && this.help();
        this.logError(c ? a : a.message);
        this.log();
        Deno.exit(1);
    }
    help() {
        Deno.stdout.writeSync(l(this.getHelp()));
    }
    getHelp() {
        this.registerDefaults();
        return ab.generate(this);
    }
    constructor(){
        this.types = new Map([
            [
                "string",
                {
                    name: "string",
                    handler: new T()
                }, 
            ],
            [
                "number",
                {
                    name: "number",
                    handler: new S()
                }, 
            ],
            [
                "boolean",
                {
                    name: "boolean",
                    handler: new R()
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
function ag(a, b) {
    return B(a, b, "_");
}
class ah {
    static generate(a) {
        return new ah(a).generate();
    }
    constructor(a){
        this.cmd = a;
        this.actions = new Map();
    }
    generate() {
        return `
# compdef _${ag(this.cmd.getPath())} ${this.cmd.getPath()}
#
# zsh completion for ${this.cmd.getPath()}
#
# version: ${this.cmd.getVersion()}
#

autoload -U is-at-least

(( $+functions[__${ag(this.cmd.getName())}_complete] )) ||
function __${ag(this.cmd.getName())}_complete {
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

# _${ag(this.cmd.getPath())} "\${@}"

compdef _${ag(this.cmd.getPath())} ${this.cmd.getPath()}

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
    generateCompletions(a, b = "") {
        if (!a.hasCommands(false) && !a.hasOptions(false) && !a.hasArguments()) {
            return "";
        }
        b = (b ? b + " " : "") + a.getName();
        return (`(( $+functions[_${ag(b)}] )) ||
function _${ag(b)}() {` + (!a.getParent() ? `\n\n    local context state state_descr line\n    typeset -A opt_args` : "") + this.generateCommandCompletions(a, b) + this.generateSubCommandCompletions(a, b) + this.generateArgumentCompletions(a, b) + this.generateActions(a) + `\n}\n\n` + a.getCommands(false).filter((b)=>b !== a).map((a)=>this.generateCompletions(a, b)).join(""));
    }
    generateCommandCompletions(c, d) {
        const e = c.getCommands(false);
        let a = e.map((a)=>`'${a.getName()}:${a.getShortDescription()}'`).join("\n            ");
        if (a) {
            a = `
        local -a commands
        commands=(
            ${a}
        )
        _describe 'command' commands`;
        }
        if (c.hasArguments()) {
            const f = d.split(" ").slice(1).join(" ");
            const g = c.getArguments()[0];
            const b = this.addAction(g, f);
            if (b) {
                a += `\n        __${ag(this.cmd.getName())}_complete ${b.arg.name} ${b.arg.action} ${b.cmd}`;
            }
        }
        if (a) {
            a = `\n\n    function _commands() {${a}\n    }`;
        }
        return a;
    }
    generateSubCommandCompletions(a, c) {
        if (a.hasCommands(false)) {
            const b = a.getCommands(false).map((a)=>`${a.getName()}) _${ag(c + " " + a.getName())} ;;`).join("\n            ");
            return `\n
    function _command_args() {
        case "$words[1]" in\n            ${b}\n        esac
    }`;
        }
        return "";
    }
    generateArgumentCompletions(a, c) {
        this.actions.clear();
        const g = this.generateOptions(a, c);
        let d = 0;
        let b = "\n\n    _arguments -w -s -S -C";
        if (a.hasOptions()) {
            b += ` \\\n        ${g.join(" \\\n        ")}`;
        }
        if (a.hasCommands(false) || a.hasArguments()) {
            b += ` \\\n        '${++d}: :_commands'`;
        }
        if (a.hasArguments() || a.hasCommands(false)) {
            const e = [];
            for (const f of a.getArguments().slice(1)){
                const h = c.split(" ").slice(1).join(" ");
                const i = this.addAction(f, h);
                e.push(`${++d}${f.optionalValue ? "::" : ":"}${i.name}`);
            }
            b += e.map((a)=>`\\\n        '${a}'`).join("");
            if (a.hasCommands(false)) {
                b += ` \\\n        '*:: :->command_args'`;
            }
        }
        return b;
    }
    generateOptions(a, d) {
        const b = [];
        const c = d.split(" ");
        c.shift();
        const e = c.join(" ");
        const f = a.getOptions(false).map((a)=>a.standalone ? a.flags.split(/[, ] */g) : false).flat().filter((a)=>typeof a === "string");
        for (const g of a.getOptions(false)){
            b.push(this.generateOption(g, e, f));
        }
        return b;
    }
    generateOption(a, j, e) {
        let c = a.conflicts?.length ? [
            ...e,
            ...a.conflicts
        ] : e;
        c = a.collect ? c : [
            ...c,
            ...a.flags.split(/[, ] */g)
        ];
        let d = "";
        for (const b of a.args){
            const f = this.addAction(b, j);
            if (b.variadic) {
                d += `${b.optionalValue ? "::" : ":"}${b.name}:->${f.name}`;
            } else {
                d += `${b.optionalValue ? "::" : ":"}${b.name}:->${f.name}`;
            }
        }
        const g = a.description.trim().split("\n").shift();
        const h = a.collect ? "*" : "";
        const i = a.flags.replace(/ +/g, "");
        if (a.standalone) {
            return `'(- *)'{${h}${i}}'[${g}]${d}'`;
        } else {
            const k = c.length ? `'(${c.join(" ")})'` : "";
            return `${k}{${h}${i}}'[${g}]${d}'`;
        }
    }
    addAction(a, c) {
        const b = `${a.name}-${a.action}`;
        if (!this.actions.has(b)) {
            this.actions.set(b, {
                arg: a,
                label: `${a.name}: ${a.action}`,
                name: b,
                cmd: c
            });
        }
        return this.actions.get(b);
    }
    generateActions(b) {
        let a = [];
        if (this.actions.size) {
            a = Array.from(this.actions).map(([b, a])=>`${b}) __${ag(this.cmd.getName())}_complete ${a.arg.name} ${a.arg.action} ${a.cmd} ;;`);
        }
        if (b.hasCommands(false)) {
            a.unshift(`command_args) _command_args ;;`);
        }
        if (a.length) {
            return `\n\n    case "$state" in\n        ${a.join("\n        ")}\n    esac`;
        }
        return "";
    }
}
new j();
