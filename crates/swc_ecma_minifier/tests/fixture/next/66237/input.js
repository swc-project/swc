"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[854],{

/***/ 8091:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  m6: function() { return /* reexport */ button_a; }
});

// UNUSED EXPORTS: SbbButtonLink, SbbButtonStatic, SbbMiniButton, SbbSecondaryButton, SbbSecondaryButtonLink, SbbSecondaryButtonStatic, SbbTertiaryButton, SbbTertiaryButtonLink, SbbTertiaryButtonStatic, SbbTransparentButton, SbbTransparentButtonLink, SbbTransparentButtonStatic

// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components-react/create-component-DnOg-u1x.js
var create_component_DnOg_u1x = __webpack_require__(9475);
// EXTERNAL MODULE: ./node_modules/lit/index.js + 2 modules
var lit = __webpack_require__(8620);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(2265);
// EXTERNAL MODULE: ./node_modules/lit/decorators.js + 3 modules
var decorators = __webpack_require__(7252);
// EXTERNAL MODULE: ./node_modules/@swc/helpers/esm/_tagged_template_literal.js
var esm_tagged_template_literal = __webpack_require__(8646);
// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/decorators.js
var core_decorators = __webpack_require__(9059);
// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/dom.js
var dom = __webpack_require__(3712);
// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/eventing.js
var eventing = __webpack_require__(9142);
// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/controllers.js
var controllers = __webpack_require__(2952);
;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/core/i18n.js
const n = {
    de: "Richtung",
    en: "Direction",
    fr: "Direction",
    it: "Direzione"
}, i = {
    de: "Ankunft",
    en: "Arrival",
    fr: "Arriv\xe9e",
    it: "Arrivo"
}, t = {
    de: "Sektor",
    en: "Sector",
    fr: "Secteur",
    it: "Settore"
}, a = {
    de: "Skt.",
    en: "Sec.",
    fr: "Sect.",
    it: "Set."
}, r = {
    first: {
        de: "Erste Klasse",
        en: "First Class",
        fr: "Premi\xe8re classe",
        it: "Prima classe"
    },
    second: {
        de: "Zweite Klasse",
        en: "Second Class",
        fr: "Deuxi\xe8me classe",
        it: "Seconda classe"
    }
}, i18n_o = {
    de: "Zug",
    en: "Train",
    fr: "Train",
    it: "Treno"
}, s = {
    de: "Z\xfcge",
    en: "Trains",
    fr: "Trains",
    it: "Treni"
}, i18n_c = {
    de: "Wagen des Zuges",
    en: "Coaches of the train",
    fr: "Wagons de train",
    it: "Carrozze del treno"
}, i18n_l = {
    de: "Wagen",
    en: "Train coach",
    fr: "Wagon de train",
    it: "Carrozza del treno"
}, d = {
    de: "Nummer",
    en: "Number",
    fr: "Num\xe9ro",
    it: "Numero"
}, i18n_u = (e)=>e ? {
        de: "Geschlossener Wagen mit der Nummer ".concat(e),
        en: "Closed train coach with the number ".concat(e),
        fr: "Wagon de train ferm\xe9 avec le num\xe9ro ".concat(e),
        it: "Carrozza del treno chiuso con il numero ".concat(e)
    } : {
        de: "Geschlossener Zugwaggon",
        en: "Closed train coach",
        fr: "Wagon de train ferm\xe9",
        it: "Carrozza del treno chiuso"
    }, f = {
    de: "Lokomotive",
    en: "Locomotive",
    fr: "Locomotive",
    it: "Locomotiva"
}, i18n_h = {
    previous: {
        de: "Kein Durchgang zum vorherigen Wagen",
        en: "No passage to the previous train coach",
        fr: "Pas de passage au wagon du train pr\xe9c\xe9dent",
        it: "Nessun passaggio alla carrozza del treno precedente"
    },
    next: {
        de: "Kein Durchgang zum n\xe4chsten Wagen",
        en: "No passage to the next train coach",
        fr: "Pas de passage au wagon de train suivant",
        it: "Nessun passaggio alla carrozza del treno successivo"
    },
    both: {
        de: "Kein Durchgang zum n\xe4chsten und vorherigen Wagen",
        en: "No passage to the next and previous train coach",
        fr: "Pas de passage au wagon de train suivant et pr\xe9c\xe9dent",
        it: "Nessun passaggio alla carrozza del treno successivo e precedente"
    }
}, i18n_g = {
    de: "Zus\xe4tzliche Wageninformation",
    en: "Additional wagon information",
    fr: "Informations suppl\xe9mentaires sur les wagons",
    it: "Informazioni aggiuntive sulla carrozza del treno"
}, m = {
    de: "Abfahrt",
    en: "Departure",
    fr: "D\xe9part",
    it: "Partenza"
}, i18n_p = {
    single: {
        long: {
            de: "Minute",
            en: "Minute",
            fr: "Minute",
            it: "Minuto"
        },
        short: {
            de: "m",
            en: "m",
            fr: "m",
            it: "m"
        }
    },
    multiple: {
        long: {
            de: "Minuten",
            en: "Minutes",
            fr: "Minutes",
            it: "Minuti"
        },
        short: {
            de: "Min",
            en: "min",
            fr: "min.",
            it: "mins"
        }
    }
}, v = {
    single: {
        long: {
            de: "Stunde",
            en: "Hour",
            fr: "Heure",
            it: "Ora"
        },
        short: {
            de: "Std.",
            en: "h",
            fr: "ore",
            it: "hrs"
        }
    },
    multiple: {
        long: {
            de: "Stunden",
            en: "Hours",
            fr: "Heures",
            it: "Ore"
        },
        short: {
            de: "Std.",
            en: "h",
            fr: "ore",
            it: "hrs"
        }
    }
}, i18n_C = {
    single: {
        long: {
            de: "Tag",
            en: "Day",
            fr: "Jour",
            it: "Giorno"
        }
    },
    multiple: {
        long: {
            de: "Tage",
            en: "Days",
            fr: "Jours",
            it: "Giorni"
        }
    }
}, z = {
    de: "Gleis\xe4nderung im Verlauf dieser Verbindung",
    en: "Track change in the course of this connection",
    fr: "Changement de voie sur le parcours de cette connexion",
    it: "Cambiamento di binario nel corso di questa connessione"
}, S = {
    de: "Reisedauer",
    en: "Travel time",
    fr: "Dur\xe9e du voyage",
    it: "Durata del viaggio"
}, T = {
    de: "Reisehinweise",
    en: "Travelhints",
    fr: "Indications sur le voyage",
    it: "Idiicazioni di viaggio"
}, D = {
    de: "Echtzeitinformationen",
    en: "Real time information",
    fr: "Informations en temps r\xe9el",
    it: "Informazioni in tempo reale"
}, w = {
    de: "mal umsteigen",
    en: "changes",
    fr: "changement(s) de train",
    it: "cambi"
}, i18n_b = {
    de: "neu",
    en: "new",
    fr: "nouveau",
    it: "nuovo"
}, P = {
    long: {
        de: "Auf Gleis",
        en: "on platform",
        fr: "sur la voie",
        it: "sulla piattaforma"
    },
    short: {
        de: "Gl.",
        en: "Pl.",
        fr: "Voie",
        it: "Bin."
    }
}, M = {
    long: {
        de: "Von Kante",
        en: "from Stand",
        fr: "\xe0 partir de la Quai",
        it: "Dalla Corsia"
    },
    short: {
        de: "Kante",
        en: "Stand",
        fr: "Quai",
        it: "Corsia."
    }
}, A = {
    long: {
        de: "Von Steg",
        en: "from Pier",
        fr: "\xe0 partir de la Imbarco",
        it: "Dalla Corsia"
    },
    short: {
        de: "Steg",
        en: "Pier",
        fr: "Quai",
        it: "Imbarco."
    }
}, F = {
    de: "Sparbillette",
    en: "Supersaver tickets",
    fr: "Billets d\xe9griff\xe9s",
    it: "Biglietti risparmio"
}, x = {
    none: {
        de: "Keine Belegungsprognose verf\xfcgbar",
        en: "No occupancy forecast available",
        fr: "Aucune pr\xe9vision d'occupation disponible",
        it: "Nessuna previsione di occupazione disponibile"
    },
    low: {
        de: "Tiefe bis mittlere Belegung erwartet",
        en: "Low to medium occupancy expected",
        fr: "On s'attend \xe0 un taux d'occupation faible \xe0 moyen",
        it: "Si prevede un'occupazione medio-bassa"
    },
    medium: {
        de: "Hohe Belegung erwartet",
        en: "High occupancy expected",
        fr: "Un taux d'occupation \xe9lev\xe9 est attendu",
        it: "Ci si aspetta un'alta occupazione"
    },
    high: {
        de: "Sehr hohe Belegung erwartet",
        en: "Very high occupancy expected",
        fr: "Un taux d'occupation tr\xe8s \xe9lev\xe9 est attendu",
        it: "Ci si aspetta un'occupazione molto alta"
    }
}, y = {
    funicular: {
        de: "Seilbahn/Zahnradbahn",
        en: "Funicular/Cog railway",
        fr: "Funiculaire/Chemin de fer \xe0 cr\xe9maill\xe8re",
        it: "Funivia/Ferrovia a cremagliera"
    },
    ec_id: {
        de: "EC/IC",
        en: "EC/IC",
        fr: "EC/IC",
        it: "EC/IC"
    },
    bus: {
        de: "Bus",
        en: "Bus",
        fr: "Bus",
        it: "Bus"
    },
    re: {
        de: "RE",
        en: "RE",
        fr: "RE",
        it: "RE"
    },
    arz_ext: {
        de: "ARZ/EXT",
        en: "ARZ/EXT",
        fr: "ARZ/EXT",
        it: "ARZ/EXT"
    },
    ice_tgv_rjx: {
        de: "ICE/TGV/RJX",
        en: "ICE/TGV/RJX",
        fr: "ICE/TGV/RJX",
        it: "ICE/TGV/RJX"
    },
    ir_pe: {
        de: "IR/PE",
        en: "IR/PE",
        fr: "IR/PE",
        it: "IR/PE"
    },
    s_sn_r: {
        de: "S/SN/R",
        en: "S/SN/R",
        fr: "S/SN/R",
        it: "S/SN/R"
    },
    tramway: {
        de: "Tram/Metro",
        en: "Tramway/Underground",
        fr: "Tram/M\xe9tro",
        it: "Tram/Metro"
    },
    ship: {
        de: "Schiff",
        en: "Ship",
        fr: "Bateau",
        it: "Battello"
    },
    train: {
        de: "Zug",
        en: "Train",
        fr: "Train",
        it: "Treno"
    }
}, $ = {
    de: "(optional)",
    en: "(optional)",
    fr: "(facultatif)",
    it: "(facoltativo)"
}, E = {
    de: "Linkziel \xf6ffnet in neuem Fenster.",
    en: "Link target opens in a new window.",
    fr: "Le lien s'ouvre dans une nouvelle fen\xeatre.",
    it: "L'obiettivo del link si apre in una nuova finestra."
}, I = {
    de: "Minuten Fussweg nach Ankunft:",
    en: "minutes of walking time after arrival:",
    fr: "minutes de trajet \xe0 pied apr\xe8s l’arriv\xe9e:",
    it: "minuti a piedi all’arrivo:"
}, N = {
    de: "Minuten Fussweg vor Abfahrt:",
    en: "minutes of walking time before departure:",
    fr: "minutes trajet \xe0 pied avant le d\xe9part:",
    it: "minuti a piedi prima della partenza:"
}, R = {
    de: "Meldung schliessen",
    en: "Close message",
    fr: "Fermer message",
    it: "Chiudere il messaggio"
}, k = {
    de: "Nachricht schliessen",
    en: "Close message",
    fr: "Fermer message",
    it: "Chiudere il messaggio"
}, L = {
    de: "Dialog",
    en: "Dialog",
    fr: "Dialogue",
    it: "Dialogo"
}, Z = {
    de: "\xdcbergelagertes Fenster schliessen",
    en: "Close secondary window",
    fr: "Fermer la fen\xeatre superpos\xe9e",
    it: "Chiudere la finestra sovrapposta"
}, B = {
    de: "Navigation schliessen",
    en: "Close navigation",
    fr: "Fermer la navigation",
    it: "Chiudere la navigazione"
}, W = {
    de: "Hinweis schliessen",
    en: "Close note",
    fr: "Fermer la note",
    it: "Chiudere la nota"
}, J = {
    de: "Zur\xfcck",
    en: "Go back",
    fr: "Retourner",
    it: "Vai indietro"
}, G = {
    de: "Mehr erfahren",
    en: "Find out more",
    fr: "En savoir plus",
    it: "Per saperne di pi\xf9"
}, V = {
    de: "Heute",
    en: "Today",
    fr: "Aujourd’hui",
    it: "Oggi"
}, j = {
    de: "Zum n\xe4chsten Monat wechseln",
    en: "Change to the next month",
    fr: "Passer au mois suivant",
    it: "Passare al mese successivo"
}, H = {
    de: "Zum letzten Monat wechseln",
    en: "Change to the previous month",
    fr: "Passer au mois pr\xe9c\xe9dent",
    it: "Passare al mese precedente"
}, K = {
    de: "N\xe4chster Tag",
    en: "Next day",
    fr: "Le prochain jour",
    it: "Giorno successivo"
}, O = {
    de: "Vorheriger Tag",
    en: "Previous day",
    fr: "Jour pr\xe9c\xe9dent",
    it: "Giorno precedente"
}, Y = {
    de: "Jahr und Monat ausw\xe4hlen",
    en: "Choose year and month",
    fr: "Choisissez l'ann\xe9e et le mois",
    it: "Seleziona anno e mese"
}, X = {
    de: "Datum ausw\xe4hlen",
    en: "Choose date",
    fr: "Choisir une date",
    it: "Seleziona una data"
}, i18n_ = (e)=>({
        de: "Wechsel zu den n\xe4chsten ".concat(e, " Jahren"),
        en: "Change to the next ".concat(e, " years"),
        fr: "Passer aux ".concat(e, " prochaines ann\xe9es"),
        it: "Passare ai successivi ".concat(e, " anni")
    }), Q = (e)=>({
        de: "Wechsel zu den vorherigen ".concat(e, " Jahren"),
        en: "Change to the previous ".concat(e, " years"),
        fr: "Passage aux ".concat(e, " pr\xe9c\xe9dentes ann\xe9es"),
        it: "Passare ai precedenti ".concat(e, " anni")
    }), U = {
    de: "Zum n\xe4chsten Jahr wechseln",
    en: "Change to the next year",
    fr: "Passer \xe0 l'ann\xe9e suivante",
    it: "Passare all'anno successivo"
}, q = {
    de: "Zum letzten Jahr wechseln",
    en: "Change to the previous year",
    fr: "Passer \xe0 l'ann\xe9e pr\xe9c\xe9dent",
    it: "Passare all'anno precedente"
}, ee = (e)=>({
        de: "Zum n\xe4chsten Tag wechseln, derzeit ausgew\xe4hlt ".concat(e, "."),
        en: "Change to the next day, currently selected ".concat(e, "."),
        fr: "Passer au jour suivant, actuellement s\xe9lectionn\xe9 ".concat(e, "."),
        it: "Passare al giorno successivo, attualmente selezionato ".concat(e, ".")
    }), ne = (e)=>({
        de: "Zum vorherigen Tag wechseln, derzeit ausgew\xe4hlt ".concat(e, "."),
        en: "Change to the previous day, currently selected ".concat(e, "."),
        fr: "Passer au jour pr\xe9c\xe9dent, actuellement s\xe9lectionn\xe9 ".concat(e, "."),
        it: "Passare al giorno precedente, attualmente selezionato ".concat(e, ".")
    }), ie = {
    de: "Kalender anzeigen",
    en: "Show calendar",
    fr: "Afficher le calendrier",
    it: "Visualizzare calendario"
}, te = {
    de: "TT.MM.JJJJ",
    en: "DD.MM.YYYY",
    fr: "JJ.MM.AAAA",
    it: "GG.MM.AAAA"
}, ae = {
    de: "Datum ge\xe4ndert auf",
    en: "Date changed to",
    fr: "Date modifi\xe9e au",
    it: "Data modificata in"
}, re = {
    de: "Verbindung von",
    en: "Connection from",
    fr: "Liaison de",
    it: "Collegamento da"
}, oe = {
    de: "nach",
    en: "to",
    fr: "\xe0",
    it: "a"
}, se = (e)=>({
        de: "und zur\xfcck nach ".concat(e, "."),
        en: "and back to ".concat(e, "."),
        fr: "et retour \xe0 ".concat(e, "."),
        it: "e ritorno a ".concat(e, ".")
    }), ce = {
    de: "erweitert",
    en: "expanded",
    fr: "est tir\xe9",
    it: "esapnso"
}, le = {
    de: "reduziert",
    en: "collapsed",
    fr: "condens\xe9",
    it: "compresso"
}, de = {
    de: "Karte zeigen",
    en: "Show map",
    fr: "Afficher la carte",
    it: "Mostra la mappa"
}, ue = {
    de: "Mehr Breadcrumbs anzeigen",
    en: "Show more breadcrumbs",
    fr: "Afficher plus breadcrumbs",
    it: "Mostra pi\xf9 breadcrumbs"
}, fe = {
    de: "Zeit ge\xe4ndert zu",
    en: "Time changed to",
    fr: "Heure modifi\xe9e:",
    it: "Orario modificata alle"
}, he = {
    de: "Feldinhalt l\xf6schen",
    en: "Clear input value",
    fr: "Effacer la valeur d’entr\xe9e",
    it: "Cancella il valore dell’input"
}, ge = {
    de: "Datei ausw\xe4hlen",
    en: "Choose a file",
    fr: "Choisissez un fichier",
    it: "Scegli un file"
}, me = {
    de: "Ziehe deine Dateien hier hin (Drag & Drop)",
    en: "Drag & Drop your files here",
    fr: "Faites glisser et d\xe9posez vos fichiers ici",
    it: "Trascina e rilascia i tuoi file qui"
}, pe = {
    de: "Datei entfernen",
    en: "Remove file",
    fr: "Effacer le fichier",
    it: "Rimuovi il file"
}, ve = (e)=>e && e.length > 0 ? {
        de: "Aktuell ausgew\xe4hlte Datei: ".concat(e.join(", "), "."),
        en: "Currently selected files: ".concat(e.join(", "), "."),
        fr: "Fichier actuellement s\xe9lectionn\xe9: ".concat(e.join(", "), "."),
        it: "File attualmente selezionato: ".concat(e.join(", "), ".")
    } : {
        de: "Keine Datei ausgew\xe4hlt.",
        en: "No files selected.",
        fr: "Nessun fichier s\xe9lectionn\xe9.",
        it: "Nessun file selezionato."
    };


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/screen-reader-only.js

function _templateObject() {
    const data = (0,esm_tagged_template_literal._)([
        ":host{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function _templateObject1() {
    const data = (0,esm_tagged_template_literal._)([
        "<slot></slot>"
    ]);
    _templateObject1 = function() {
        return data;
    };
    return data;
}


const screen_reader_only_b = (0,lit/* css */.iv)(_templateObject());
var screen_reader_only_d = Object.defineProperty, screen_reader_only_f = Object.getOwnPropertyDescriptor, screen_reader_only_h = (p, r, s, t)=>{
    for(var e = t > 1 ? void 0 : t ? screen_reader_only_f(r, s) : r, o = p.length - 1, l; o >= 0; o--)(l = p[o]) && (e = (t ? l(r, s, e) : l(e)) || e);
    return t && e && screen_reader_only_d(r, s, e), e;
};
let screen_reader_only_n = class extends lit/* LitElement */.oi {
    render() {
        return (0,lit/* html */.dy)(_templateObject1());
    }
};
screen_reader_only_n.styles = screen_reader_only_b;
screen_reader_only_n = screen_reader_only_h([
    (0,decorators/* customElement */.Mo)("sbb-screen-reader-only")
], screen_reader_only_n);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/core/base-elements.js

function base_elements_templateObject() {
    const data = (0,esm_tagged_template_literal._)([
        '\n      <span class="sbb-action-base ',
        '">\n        ',
        "\n      </span>\n    "
    ]);
    base_elements_templateObject = function() {
        return data;
    };
    return data;
}
function base_elements_templateObject1() {
    const data = (0,esm_tagged_template_literal._)([
        "<sbb-screen-reader-only\n              >. ",
        "</sbb-screen-reader-only\n            >"
    ]);
    base_elements_templateObject1 = function() {
        return data;
    };
    return data;
}
function _templateObject2() {
    const data = (0,esm_tagged_template_literal._)([
        '\n      <a\n        class="sbb-action-base ',
        '"\n        role="presentation"\n        tabindex="-1"\n        href=',
        "\n        ?download=",
        "\n        target=",
        "\n        rel=",
        "\n      >\n        ",
        "\n        ",
        "\n      </a>\n    "
    ]);
    _templateObject2 = function() {
        return data;
    };
    return data;
}








var base_elements_P = Object.defineProperty, base_elements_A = Object.getOwnPropertyDescriptor, base_elements_S = (e, t, i, s)=>{
    for(var r = s > 1 ? void 0 : s ? base_elements_A(t, i) : t, a = e.length - 1, n; a >= 0; a--)(n = e[a]) && (r = (s ? n(t, i, r) : n(r)) || r);
    return s && r && base_elements_P(t, i, r), r;
};
let base_elements_d = class extends lit/* LitElement */.oi {
    setupBaseEventHandlers() {
        this.addEventListener("click", (e)=>{
            const t = this;
            (t.disabled || t.formDisabled) && (e.preventDefault(), e.stopImmediatePropagation());
        }, // capture is necessary here, as this event handler needs to be executed before any other
        // in order to stop immediate propagation in the disabled case.
        {
            capture: !0
        }), this.addEventListener("keypress", (e)=>{
            (e.key === "Enter" || e.key === "\n") && this.dispatchClickEvent(e);
        }, {
            passive: !0
        });
    }
    dispatchClickEvent(e) {
        const { altKey: t, ctrlKey: i, metaKey: s, shiftKey: r } = e;
        e.target.dispatchEvent(new PointerEvent("click", {
            bubbles: !0,
            cancelable: !0,
            composed: !0,
            pointerId: -1,
            pointerType: "",
            altKey: t,
            ctrlKey: i,
            metaKey: s,
            shiftKey: r
        }));
    }
    /** Override this method to render the component template. */ renderTemplate() {
        throw new Error("Implementation needed!");
    }
    /** Default render method for button-like components. */ render() {
        var _this_localName;
        return (0,lit/* html */.dy)(base_elements_templateObject(), (_this_localName = this.localName) !== null && _this_localName !== void 0 ? _this_localName : (0,dom/* getLocalName */.$Q)(this), this.renderTemplate());
    }
};
base_elements_d = base_elements_S([
    (0,core_decorators/* hostAttributes */.f)({
        dir: (0,dom/* getDocumentWritingMode */.e_)(),
        "data-action": ""
    })
], base_elements_d);
var base_elements_k = Object.defineProperty, base_elements_D = Object.getOwnPropertyDescriptor, base_elements_c = (e, t, i, s)=>{
    for(var r = s > 1 ? void 0 : s ? base_elements_D(t, i) : t, a = e.length - 1, n; a >= 0; a--)(n = e[a]) && (r = (s ? n(t, i, r) : n(r)) || r);
    return s && r && base_elements_k(t, i, r), r;
};
let base_elements_l = class extends base_elements_d {
    set name(e) {
        this.setAttribute("name", "".concat(e));
    }
    get name() {
        var _this_getAttribute;
        return (_this_getAttribute = this.getAttribute("name")) !== null && _this_getAttribute !== void 0 ? _this_getAttribute : "";
    }
    set value(e) {
        this.setAttribute("value", "".concat(e));
    }
    get value() {
        var _this_getAttribute;
        return (_this_getAttribute = this.getAttribute("value")) !== null && _this_getAttribute !== void 0 ? _this_getAttribute : "";
    }
    constructor(){
        if (super(), this.type = "button", this._handleButtonClick = async (e)=>{
            if (this.type === "button" || await (0,eventing/* isEventPrevented */.Lu)(e)) return;
            const t = this.form ? this.ownerDocument.querySelector("form#".concat(this.form)) : this.closest("form");
            if (t) this.type === "submit" ? t.requestSubmit() : this.type === "reset" && t.reset();
            else return;
        }, this._preventScrollOnSpaceKeydown = (e)=>{
            e.key === " " && (e.preventDefault(), e.target.toggleAttribute("data-active", !0));
        }, this._removeActiveMarker = (e)=>{
            e.target.removeAttribute("data-active");
        }, this._dispatchClickEventOnSpaceKeyup = (e)=>{
            e.key === " " && (this._removeActiveMarker(e), this.dispatchClickEvent(e));
        }, !lit/* isServer */.sk) {
            this.setupBaseEventHandlers();
            const e = {
                passive: !0
            };
            this.addEventListener("click", this._handleButtonClick), this.addEventListener("keydown", this._preventScrollOnSpaceKeydown), this.addEventListener("keyup", this._dispatchClickEventOnSpaceKeyup, e), this.addEventListener("blur", this._removeActiveMarker, e);
        }
    }
};
base_elements_c([
    (0,decorators/* property */.Cb)()
], base_elements_l.prototype, "type", 2);
base_elements_c([
    (0,decorators/* property */.Cb)()
], base_elements_l.prototype, "name", 1);
base_elements_c([
    (0,decorators/* property */.Cb)()
], base_elements_l.prototype, "value", 1);
base_elements_c([
    (0,decorators/* property */.Cb)()
], base_elements_l.prototype, "form", 2);
base_elements_l = base_elements_c([
    (0,core_decorators/* hostAttributes */.f)({
        role: "button",
        tabindex: "0",
        "data-button": ""
    })
], base_elements_l);
var base_elements_K = Object.defineProperty, base_elements_C = Object.getOwnPropertyDescriptor, base_elements_h = (e, t, i, s)=>{
    for(var r = s > 1 ? void 0 : s ? base_elements_C(t, i) : t, a = e.length - 1, n; a >= 0; a--)(n = e[a]) && (r = (s ? n(t, i, r) : n(r)) || r);
    return s && r && base_elements_K(t, i, r), r;
};
let base_elements_p = class extends base_elements_d {
    /**
   * Trigger an anchor element click after the event has finished the bubbling phase and
   * preventDefault() has not been called for the event.
   */ async _triggerAnchorWhenNecessary(e) {
        var v, f;
        const t = e.target, i = e.composedPath()[0];
        if (!this.href || !t.localName.startsWith("sbb-") || t !== i || await (0,eventing/* isEventPrevented */.Lu)(e)) return;
        const { altKey: s, ctrlKey: r, metaKey: a, shiftKey: n } = e;
        (f = (v = t.shadowRoot) == null ? void 0 : v.querySelector("a")) == null || f.dispatchEvent(// We need to use a MouseEvent here, as PointerEvent does not work on Firefox.
        new MouseEvent("click", {
            altKey: s,
            ctrlKey: r,
            metaKey: a,
            shiftKey: n
        }));
    }
    /** Default render method for link-like components. Can be overridden if the LinkRenderVariables are not needed. */ render() {
        var _this_localName, _this_href, _this_target;
        return (0,lit/* html */.dy)(_templateObject2(), (_this_localName = this.localName) !== null && _this_localName !== void 0 ? _this_localName : (0,dom/* getLocalName */.$Q)(this), (_this_href = this.href) !== null && _this_href !== void 0 ? _this_href : lit/* nothing */.Ld, this.download, (_this_target = this.target) !== null && _this_target !== void 0 ? _this_target : lit/* nothing */.Ld, this._evaluateRelAttribute(), this.renderTemplate(), this.href && this.target === "_blank" ? (0,lit/* html */.dy)(base_elements_templateObject1(), E[this.language.current]) : lit/* nothing */.Ld);
    }
    constructor(){
        super(), this.language = new controllers/* SbbLanguageController */.RR(this), this._evaluateRelAttribute = ()=>this.rel ? this.rel : this.target === "_blank" ? "external noopener nofollow" : lit/* nothing */.Ld, lit/* isServer */.sk || (this.setupBaseEventHandlers(), this.addEventListener("click", this._triggerAnchorWhenNecessary));
    }
};
base_elements_h([
    (0,decorators/* property */.Cb)()
], base_elements_p.prototype, "href", 2);
base_elements_h([
    (0,decorators/* property */.Cb)()
], base_elements_p.prototype, "target", 2);
base_elements_h([
    (0,decorators/* property */.Cb)()
], base_elements_p.prototype, "rel", 2);
base_elements_h([
    (0,decorators/* property */.Cb)({
        type: Boolean
    })
], base_elements_p.prototype, "download", 2);
base_elements_p = base_elements_h([
    (0,core_decorators/* hostAttributes */.f)({
        role: "link",
        tabindex: "0",
        "data-link": ""
    })
], base_elements_p);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/core/mixins.js

function mixins_templateObject() {
    const data = _tagged_template_literal([
        "<li><slot name=",
        "></slot></li>"
    ]);
    mixins_templateObject = function() {
        return data;
    };
    return data;
}
function mixins_templateObject1() {
    const data = _tagged_template_literal([
        "\n          <ul\n            class=",
        "\n            aria-label=",
        "\n            aria-labelledby=",
        "\n          >\n            ",
        "\n          </ul>\n          ",
        "\n        "
    ]);
    mixins_templateObject1 = function() {
        return data;
    };
    return data;
}
function mixins_templateObject2() {
    const data = _tagged_template_literal([
        "<sbb-screen-reader-only>",
        "</sbb-screen-reader-only>\n          <span class=",
        ">\n            <span><slot name=",
        "></slot></span>\n          </span>\n          ",
        " "
    ]);
    mixins_templateObject2 = function() {
        return data;
    };
    return data;
}
function _templateObject3() {
    const data = _tagged_template_literal([
        "<span hidden><slot></slot></span>"
    ]);
    _templateObject3 = function() {
        return data;
    };
    return data;
}






var mixins_S = Object.defineProperty, mixins_E = Object.getOwnPropertyDescriptor, mixins_k = (a, r, s, t)=>{
    for(var e = mixins_E(r, s), i = a.length - 1, n; i >= 0; i--)(n = a[i]) && (e = n(r, s, e) || e);
    return e && mixins_S(r, s, e), e;
};
const mixins_y = (a)=>{
    class r extends a {
        set disabled(t) {
            this._disabled = !!t;
        }
        get disabled() {
            return this._disabled || this.isDisabledExternally();
        }
        /**
     * Will be used as 'or' check to the current disabled state.
     * Can e.g. be used to read disabled state of a group.
     */ isDisabledExternally() {
            return !1;
        }
        constructor(){
            super(...arguments), this._disabled = !1;
        }
    }
    return mixins_k([
        (0,decorators/* property */.Cb)({
            reflect: !0,
            type: Boolean
        })
    ], r.prototype, "disabled"), r;
}, mixins_X = (a)=>{
    class r extends mixins_y(a) {
        willUpdate(t) {
            super.willUpdate(t), t.has("disabled") && (this.disabled ? (this.setAttribute("aria-disabled", "true"), this.removeAttribute("tabindex")) : (this.removeAttribute("aria-disabled"), this.setAttribute("tabindex", "0")));
        }
    }
    return r;
};
var mixins_x = Object.defineProperty, mixins_w = Object.getOwnPropertyDescriptor, mixins_d = (a, r, s, t)=>{
    for(var e = t > 1 ? void 0 : t ? mixins_w(r, s) : r, i = a.length - 1, n; i >= 0; i--)(n = a[i]) && (e = (t ? n(r, s, e) : n(e)) || e);
    return t && e && mixins_x(r, s, e), e;
};
const mixins_$ = (a)=>{
    const s = class s extends a {
        /**
     * Returns the form owner of internals target element.
     */ get form() {
            return this.internals.form;
        }
        set name(e) {
            this.setAttribute("name", "".concat(e));
        }
        get name() {
            var _this_getAttribute;
            return (_this_getAttribute = this.getAttribute("name")) !== null && _this_getAttribute !== void 0 ? _this_getAttribute : "";
        }
        /** @internal */ get type() {
            return this.localName;
        }
        set value(e) {
            this._value = e, this.updateFormValue();
        }
        get value() {
            return this._value;
        }
        /**
     * Returns the ValidityState object for internals target element.
     *
     * @internal
     */ get validity() {
            return this.internals.validity;
        }
        /**
     * Returns the error message that would be shown to the user
     * if internals target element was to be checked for validity.
     *
     * @internal
     */ get validationMessage() {
            return this.internals.validationMessage;
        }
        /**
     * Returns true if internals target element will be validated
     * when the form is submitted; false otherwise.
     *
     * @internal
     */ get willValidate() {
            return this.internals.willValidate;
        }
        /**
     * Returns true if internals target element has no validity problems; false otherwise.
     * Fires an invalid event at the element in the latter case.
     *
     * @internal
     */ checkValidity() {
            return this.internals.checkValidity();
        }
        /**
     * Returns true if internals target element has no validity problems; otherwise,
     * returns false, fires an invalid event at the element,
     * and (if the event isn't canceled) reports the problem to the user.
     *
     * @internal
     */ reportValidity() {
            return this.internals.reportValidity();
        }
        /**
     * Is called whenever a surrounding form / fieldset changes disabled state.
     * @param disabled
     *
     * @internal
     */ formDisabledCallback(e) {
            this.formDisabled = e;
        }
        /** Should be called when form value is changed. */ updateFormValue() {
            this.internals.setFormValue(this.value);
        }
        constructor(){
            super(...arguments), this._value = null, this.internals = this.attachInternals(), this.formDisabled = !1;
        }
    };
    s.formAssociated = !0;
    let r = s;
    return mixins_d([
        l()
    ], r.prototype, "name", 1), mixins_d([
        l()
    ], r.prototype, "value", 1), mixins_d([
        _()
    ], r.prototype, "formDisabled", 2), r;
};
var mixins_R = Object.defineProperty, mixins_A = Object.getOwnPropertyDescriptor, mixins_P = (a, r, s, t)=>{
    for(var e = mixins_A(r, s), i = a.length - 1, n; i >= 0; i--)(n = a[i]) && (e = n(r, s, e) || e);
    return e && mixins_R(r, s, e), e;
};
const mixins_O = (a)=>{
    class r extends a {
        set required(t) {
            this._required = !!t;
        }
        get required() {
            return this._required || this.isRequiredExternally();
        }
        async willUpdate(t) {
            super.willUpdate(t), t.has("required") && (this.internals.ariaRequired = "".concat(this.required));
        }
        /**
     * Will be used as 'or' check to the current required state.
     * Can e.g. be used to read required state of a group.
     */ isRequiredExternally() {
            return !1;
        }
        constructor(){
            super(...arguments), this._required = !1;
        }
    }
    return mixins_P([
        l({
            reflect: !0,
            type: Boolean
        })
    ], r.prototype, "required"), r;
};
var mixins_q = Object.defineProperty, mixins_L = Object.getOwnPropertyDescriptor, mixins_f = (a, r, s, t)=>{
    for(var e = t > 1 ? void 0 : t ? mixins_L(r, s) : r, i = a.length - 1, n; i >= 0; i--)(n = a[i]) && (e = (t ? n(r, s, e) : n(e)) || e);
    return t && e && mixins_q(r, s, e), e;
};
const mixins_z = (a)=>{
    let r = class extends mixins_y(mixins_O(mixins_$(a))) {
        set checked(s) {
            const t = typeof s == "object" ? s.attribute : !1;
            t && (s = s.value), this.hasUpdated && !t && (this._attributeMutationBlocked = !0), this._checked = !!s, this.updateFormValue();
        }
        get checked() {
            return this._checked;
        }
        connectedCallback() {
            super.connectedCallback(), this.addEventListener("click", this._handleUserInteraction), this.addEventListener("keydown", p), this.addEventListener("keyup", this._handleKeyboardInteraction);
        }
        disconnectedCallback() {
            super.disconnectedCallback(), this.removeEventListener("click", this._handleUserInteraction), this.removeEventListener("keydown", p), this.removeEventListener("keyup", this._handleKeyboardInteraction);
        }
        attributeChangedCallback(s, t, e) {
            (s !== "checked" || !this._attributeMutationBlocked) && super.attributeChangedCallback(s, t, e);
        }
        /**
     * Is called whenever the form is being reset.
     *
     * @internal
     */ formResetCallback() {
            this.checked = this.hasAttribute("checked"), this._attributeMutationBlocked = !1;
        }
        /**
     *  Called when the browser is trying to restore element’s state to state in which case
     *  reason is “restore”, or when the browser is trying to fulfill autofill on behalf of
     *  user in which case reason is “autocomplete”.
     *  In the case of “restore”, state is a string, File, or FormData object
     *  previously set as the second argument to setFormValue.
     *
     * @internal
     */ formStateRestoreCallback(s, t) {
            s && (this.checked = s === "true");
        }
        updateFormValue() {
            this.checked ? this.internals.setFormValue(this.value, "".concat(this.checked)) : this.internals.setFormValue(null);
        }
        constructor(){
            super(), this._attributeMutationBlocked = !1, this._checked = !1, this._handleKeyboardInteraction = (s)=>{
                s.key === " " && this._handleUserInteraction();
            }, this._handleUserInteraction = ()=>{
                var s;
                this.disabled || ((s = this.withUserInteraction) == null || s.call(this), this.checked = !this.checked, this._attributeMutationBlocked = !0, this.dispatchEvent(new InputEvent("input", {
                    composed: !0,
                    bubbles: !0
                })), this.dispatchEvent(new Event("change", {
                    bubbles: !0
                })), this.dispatchEvent(new CustomEvent("didChange", {
                    bubbles: !0
                })));
            }, this.internals.role = "checkbox";
        }
    };
    return mixins_f([
        l({
            type: Boolean,
            converter: {
                ...u,
                // We need to pass information to the setter so that we know it was called by attribute change.
                fromAttribute: (s, t)=>{
                    var i, n;
                    return {
                        value: (n = (i = u).fromAttribute) == null ? void 0 : n.call(i, s, t),
                        attribute: !0
                    };
                }
            }
        })
    ], r.prototype, "checked", 1), r = mixins_f([
        g({
            tabindex: "0"
        })
    ], r), r;
}, mixins_U = "litElementHydrateSupport", mixins_D = lit/* isServer */.sk || globalThis.testGroup === "e2e-ssr-non-hydrated", mixins_M = (a)=>{
    class r extends a {
        /**
     * Returns a Promise that resolves when the element has completed hydration.
     * The Promise value is a boolean that is `true` if the element required hydration
     * and `false` if not.
     *
     * @return A promise of a boolean that resolves to true once the hydration completed.
     * @internal
     */ get hydrationComplete() {
            return this._hydrationComplete;
        }
        createRenderRoot() {
            var t, e;
            if (this._hydrationRequired = !!this.shadowRoot && mixins_U in globalThis && (h || !mixins_D), !this._hydrationRequired) this._resolveHydration(!1);
            else {
                const i = (t = this.shadowRoot) == null ? void 0 : t.querySelectorAll("slot");
                i != null && i.length && (i.forEach((n)=>n.addEventListener("slotchange", this._handleBeforeHydrationSlotchange, {
                        capture: !0
                    })), this.hydrationComplete.then(()=>i.forEach((n)=>n.removeEventListener("slotchange", this._handleBeforeHydrationSlotchange)))), (e = this.recoverSsrState) == null || e.call(this);
            }
            return super.createRenderRoot();
        }
        willUpdate(t) {
            var e;
            super.willUpdate(t), h && ((e = this.recoverSsrState) == null || e.call(this));
        }
        update(t) {
            super.update(t), this._hydrationRequired && (this._hydrationRequired = !1, this._resolveHydration(!0));
        }
        /** Reads and removes an attribute with the given name. Either returns the attributte value or null. */ getAndRemoveAttribute(t) {
            const e = this.getAttribute(t);
            return this.removeAttribute(t), e;
        }
        constructor(){
            super(...arguments), this._hydrationRequired = !1, this._hydrationComplete = new Promise((t)=>this._resolveHydration = t), this._handleBeforeHydrationSlotchange = (t)=>{
                if (!this._hydrationRequired) return;
                t.stopImmediatePropagation();
                const e = t.target;
                this.hydrationComplete.then(()=>C(t, e));
            };
        }
    }
    return r;
};
var mixins_B = Object.defineProperty, mixins_H = (a, r, s, t)=>{
    for(var e = void 0, i = a.length - 1, n; i >= 0; i--)(n = a[i]) && (e = n(r, s, e) || e);
    return e && mixins_B(r, s, e), e;
};
const mixins_m = "data-ssr-child-count", mixins_v = "li", mixins_J = (a)=>{
    class r extends mixins_M(a) {
        connectedCallback() {
            var t;
            super.connectedCallback(), (t = this.shadowRoot) == null || t.addEventListener("slotchange", this._handleSlotchange, {
                passive: !0
            });
        }
        disconnectedCallback() {
            var t;
            super.disconnectedCallback(), (t = this.shadowRoot) == null || t.removeEventListener("slotchange", this._handleSlotchange);
        }
        /**
     * Renders list and list slots for slotted children or an amount of list slots
     * corresponding to the `data-ssr-child-count` attribute value.
     *
     * This is a possible optimization for SSR, as in an SSR Lit environment
     * other elements are not available, but might be available in the meta
     * framework wrapper (like e.g. React). This allows to provide the amount of
     * children to be passed via the `data-ssr-child-count` attribute value.
     */ renderList() {
            let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            const e = this.listSlotNames();
            var _this_localName, _this_localName1;
            return e.length >= 2 ? o(mixins_templateObject1(), t.class || ((_this_localName = this.localName) !== null && _this_localName !== void 0 ? _this_localName : b(this)), t.ariaLabel || c, t.ariaLabelledby || c, e.map((i)=>o(mixins_templateObject(), i)), this.renderHiddenSlot()) : e.length === 1 ? o(mixins_templateObject2(), t.ariaLabel, t.class || ((_this_localName1 = this.localName) !== null && _this_localName1 !== void 0 ? _this_localName1 : b(this)), e[0], this.renderHiddenSlot()) : this.renderHiddenSlot();
        }
        /**
     * Returns an array of list slot names with the length corresponding to the amount of matched
     * children or the `data-ssr-child-count` attribute value.
     *
     * This is a possible optimization for SSR, as in an SSR Lit environment
     * other elements are not available, but might be available in the meta
     * framework wrapper (like e.g. React). This allows to provide the amount of
     * children to be passed via the `data-ssr-child-count` attribute value.
     */ listSlotNames() {
            var _this_getAttribute;
            return (this.listChildren.length ? this.listChildren : Array.from({
                length: +((_this_getAttribute = this.getAttribute(mixins_m)) !== null && _this_getAttribute !== void 0 ? _this_getAttribute : 0)
            })).map((e, i)=>"".concat(mixins_v, "-").concat(i));
        }
        /**
     * Returns a hidden slot, which is intended as the children change detection.
     * When an element without a slot attribute is slotted to the element, it triggers
     * the slotchange event, which can be used to assign it to the appropriate named slot.
     */ renderHiddenSlot() {
            return o(_templateObject3());
        }
        constructor(){
            super(...arguments), this.listChildren = [], this._handleSlotchange = ()=>{
                var _this_children;
                const t = Array.from((_this_children = this.children) !== null && _this_children !== void 0 ? _this_children : []).filter((e)=>this.listChildLocalNames.includes(e.localName));
                t.length === this.listChildren.length && this.listChildren.every((e, i)=>t[i] === e) || (this.listChildren.filter((e)=>!t.includes(e)).forEach((e)=>e.removeAttribute("slot")), this.listChildren = t, this.listChildren.forEach((e, i)=>e.setAttribute("slot", "".concat(mixins_v, "-").concat(i))), this.removeAttribute(mixins_m));
            };
        }
    }
    return mixins_H([
        _()
    ], r.prototype, "listChildren"), r;
};
var mixins_I = Object.defineProperty, mixins_N = (a, r, s, t)=>{
    for(var e = void 0, i = a.length - 1, n; i >= 0; i--)(n = a[i]) && (e = n(r, s, e) || e);
    return e && mixins_I(r, s, e), e;
};
const mixins_Q = (a)=>{
    class r extends a {
        constructor(){
            super(...arguments), this.negative = !1;
        }
    }
    return mixins_N([
        (0,decorators/* property */.Cb)({
            reflect: !0,
            type: Boolean
        })
    ], r.prototype, "negative"), r;
}, mixins_W = (a)=>{
    class r extends a {
        startUpdate() {
            this._updatePromise = new Promise((t)=>this._updateResolve = t);
        }
        completeUpdate() {
            this._updateResolve();
        }
        async getUpdateComplete() {
            const t = await super.getUpdateComplete();
            return await this._updatePromise, t;
        }
        constructor(){
            super(...arguments), this._updatePromise = Promise.resolve(), this._updateResolve = ()=>{};
        }
    }
    return r;
};


// EXTERNAL MODULE: ./node_modules/lit/node_modules/lit-html/lit-html.js
var lit_html = __webpack_require__(2558);
;// CONCATENATED MODULE: ./node_modules/lit/node_modules/lit-html/static.js

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const e = Symbol.for(""), static_o = (t)=>{
    if ((t === null || t === void 0 ? void 0 : t.r) === e) return t === null || t === void 0 ? void 0 : t._$litStatic$;
}, static_i = (t)=>({
        _$litStatic$: t,
        r: e
    }), static_s = function(t) {
    for(var _len = arguments.length, r = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        r[_key - 1] = arguments[_key];
    }
    return {
        _$litStatic$: r.reduce((r, e, o)=>r + ((t)=>{
                if (void 0 !== t._$litStatic$) return t._$litStatic$;
                throw Error("Value passed to 'literal' function must be a 'literal' result: ".concat(t, ". Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security."));
            })(e) + t[o + 1], t[0]),
        r: e
    };
}, static_a = new Map, static_l = (t)=>function(r) {
        for(var _len = arguments.length, e = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            e[_key - 1] = arguments[_key];
        }
        const i = e.length;
        let s, l;
        const n = [], u = [];
        let c, $ = 0, f = !1;
        for(; $ < i;){
            for(c = r[$]; $ < i && void 0 !== (l = e[$], s = static_o(l));)c += s + r[++$], f = !0;
            $ !== i && u.push(l), n.push(c), $++;
        }
        if ($ === i && n.push(r[i]), f) {
            const t = n.join("$$lit$$");
            void 0 === (r = static_a.get(t)) && (n.raw = n, static_a.set(t, r = n)), e = u;
        }
        return t(r, ...e);
    }, static_n = static_l(lit_html/* html */.dy), static_u = static_l(lit_html/* svg */.YP);
 //# sourceMappingURL=static.js.map

;// CONCATENATED MODULE: ./node_modules/lit/static-html.js
 //# sourceMappingURL=static-html.js.map

// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/icon.js + 8 modules
var icon = __webpack_require__(7280);
;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/common.js

function common_templateObject() {
    const data = (0,esm_tagged_template_literal._)([
        "\n        ",
        '\n        <span class="sbb-button__label">\n          <slot></slot>\n        </span>\n      '
    ]);
    common_templateObject = function() {
        return data;
    };
    return data;
}
function common_templateObject1() {
    const data = (0,esm_tagged_template_literal._)([
        '*,:before,:after{box-sizing:border-box}:host{display:inline-block;outline:none!important;--sbb-button-icon-size: var(--sbb-size-icon-ui-small);--sbb-button-color-disabled-background: var(--sbb-color-milk);--sbb-button-color-disabled-border: var(--sbb-color-cloud);--sbb-button-color-disabled-text: var(--sbb-color-granite);--sbb-button-shadow-1-offset-y: var(--sbb-shadow-elevation-level-3-shadow-1-offset-y);--sbb-button-shadow-2-offset-y: var(--sbb-shadow-elevation-level-3-shadow-2-offset-y);--sbb-button-shadow-1-blur: var(--sbb-shadow-elevation-level-3-shadow-1-blur);--sbb-button-shadow-2-blur: var(--sbb-shadow-elevation-level-3-shadow-2-blur);--sbb-button-shadow-1-color: var(--sbb-color-red-alpha-20);--sbb-button-shadow-2-color: var(--sbb-color-red125-alpha-20);--sbb-button-border-width: var(--sbb-border-width-2x);--sbb-button-border-radius: var(--sbb-border-radius-infinity);--sbb-button-min-height: var(--sbb-size-element-m);--sbb-button-transition-duration: var( --sbb-disable-animation-time, var(--sbb-animation-duration-2x) );--sbb-button-transition-easing-function: var(--sbb-animation-easing);--sbb-button-padding-block-min: var(--sbb-spacing-fixed-1x);--sbb-button-padding-inline: var(--sbb-spacing-fixed-8x);--sbb-button-gap: var(--sbb-spacing-fixed-2x);--sbb-button-inset: 0;--sbb-button-box-shadow: transparent;--sbb-button-box-shadow-definition: var(--sbb-shadow-elevation-level-3-shadow-2-offset-x) var(--sbb-button-shadow-2-offset-y) var(--sbb-button-shadow-2-blur) var(--sbb-shadow-elevation-level-3-shadow-2-spread) var(--sbb-button-shadow-2-color), var(--sbb-shadow-elevation-level-3-shadow-1-offset-x) var(--sbb-button-shadow-1-offset-y) var(--sbb-button-shadow-1-blur) var(--sbb-shadow-elevation-level-3-shadow-1-spread) var(--sbb-button-shadow-1-color)}@media (min-width: 52.5rem){:host{--sbb-button-padding-inline: var(--sbb-spacing-fixed-10x)}}@media (forced-colors: active){:host{--sbb-button-color-default-border: CanvasText !important;--sbb-button-color-active-border: Highlight !important}}:host([negative]){--sbb-button-color-disabled-background: var(--sbb-color-anthracite);--sbb-button-color-disabled-border: var(--sbb-color-granite);--sbb-button-color-disabled-text: var(--sbb-color-aluminium)}:host([size=m]){--sbb-button-min-height: var(--sbb-size-element-s);--sbb-button-padding-inline: var(--sbb-spacing-fixed-5x)}@media (min-width: 52.5rem){:host([size=m]){--sbb-button-padding-inline: var(--sbb-spacing-fixed-8x)}}:host([size=s]){--sbb-button-min-height: var(--sbb-size-element-xs);--sbb-button-padding-inline: var(--sbb-spacing-fixed-4x)}@media (min-width: 52.5rem){:host([size=s]){--sbb-button-padding-inline: var(--sbb-spacing-fixed-5x)}}:host(:where([data-slot-names~=icon],[icon-name]):not([data-slot-names~=unnamed])){--sbb-button-padding-inline: 0}@media (forced-colors: active){:host([disabled]){--sbb-button-color-disabled-text: GrayText !important}}@media (any-hover: hover){:host(:not([disabled],:active,[data-active]):hover){--sbb-button-translate-y-content-hover: -.0625rem;--sbb-button-shadow-1-offset-y: calc( .5 * var(--sbb-shadow-elevation-level-3-shadow-1-offset-y) );--sbb-button-shadow-1-blur: calc(.5 * var(--sbb-shadow-elevation-level-3-shadow-1-blur));--sbb-button-shadow-2-blur: calc(.5 * var(--sbb-shadow-elevation-level-3-shadow-2-blur))}}@media (forced-colors: active){:host(:not([disabled],:active,[data-active]):hover){--sbb-button-color-hover-border: Highlight !important}}@media (forced-colors: active){:host([role=button]){--sbb-button-color-default-text: ButtonText !important;--sbb-button-color-hover-text: ButtonText !important;--sbb-button-color-active-text: ButtonText !important;--sbb-button-color-default-background: Canvas !important;--sbb-button-color-hover-background: Canvas !important;--sbb-button-color-active-background: Canvas !important;--sbb-button-color-disabled-background: Canvas !important}}.sbb-action-base{--sbb-text-font-size: var(--sbb-font-size-text-xs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);font-weight:700;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-decoration:none;width:100%;position:relative;display:flex;gap:var(--sbb-button-gap);align-items:center;justify-content:center;text-align:left;transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:color;min-height:var(--sbb-button-min-height);border-radius:var(--sbb-button-border-radius);padding-block:var(--sbb-button-padding-block-min);padding-inline:var(--sbb-button-padding-inline);color:var(--sbb-button-color-default-text);cursor:pointer;-webkit-user-select:none;user-select:none}.sbb-action-base:before{position:absolute;content:"";inset:var(--sbb-button-inset);border:var(--sbb-button-border-width) solid var(--sbb-button-color-default-border);border-radius:var(--sbb-button-border-radius);background-color:var(--sbb-button-color-default-background);transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:inset,background-color,border-color,box-shadow;box-shadow:var(--sbb-button-box-shadow)}:host([disabled]) .sbb-action-base:before{background-color:var(--sbb-button-color-disabled-background);border-color:var(--sbb-button-color-disabled-border)}:host(:is([data-focus-visible],:focus-visible:not([data-focus-origin=mouse],[data-focus-origin=touch]))) .sbb-action-base:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) solid var(--sbb-focus-outline-width)}@media (any-hover: hover){:host(:not([disabled],:active,[data-active]):hover) .sbb-action-base:before{inset:calc(var(--sbb-button-border-width) * -1);background-color:var(--sbb-button-color-hover-background);border-color:var(--sbb-button-color-hover-border)}}:host(:not([disabled]):is(:active,[data-active])) .sbb-action-base:before{color:var(--sbb-button-color-active-text);background-color:var(--sbb-button-color-active-background);border-color:var(--sbb-button-color-active-border)}:host(:where([data-slot-names~=icon],[icon-name]):not([data-slot-names~=unnamed])) .sbb-action-base{width:var(--sbb-button-min-height);justify-content:center}:host([disabled]) .sbb-action-base{color:var(--sbb-button-color-disabled-text);cursor:default;pointer-events:none;text-decoration:line-through}@media (any-hover: hover){:host(:not([disabled],:active,[data-active]):hover) .sbb-action-base{color:var(--sbb-button-color-hover-text)}}.sbb-button__label,::slotted([slot=icon]),sbb-icon{transition:transform var(--sbb-button-transition-duration) var(--sbb-button-transition-easing-function);transform:translateY(var(--sbb-button-translate-y-content-hover, 0rem))}.sbb-button__label{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:block}:host(:where([data-slot-names~=icon],[icon-name]):not([data-slot-names~=unnamed])) .sbb-button__label{display:none}'
    ]);
    common_templateObject1 = function() {
        return data;
    };
    return data;
}
function common_templateObject2() {
    const data = (0,esm_tagged_template_literal._)([
        ":host{--sbb-button-color-active-background: var(--sbb-color-red150);--sbb-button-color-active-border: var(--sbb-color-red150);--sbb-button-color-active-text: var(--sbb-color-cloud);--sbb-button-color-default-background: var(--sbb-color-red);--sbb-button-color-default-border: var(--sbb-color-red);--sbb-button-color-default-text: var(--sbb-color-white);--sbb-button-color-hover-background: var(--sbb-color-red125);--sbb-button-color-hover-border: var(--sbb-color-red125);--sbb-button-color-hover-text: var(--sbb-color-milk)}:host([negative]){--sbb-button-color-active-background: var(--sbb-color-cloud);--sbb-button-color-active-border: var(--sbb-color-cloud);--sbb-button-color-active-text: var(--sbb-color-red150);--sbb-button-color-default-background: var(--sbb-color-white);--sbb-button-color-default-border: var(--sbb-color-white);--sbb-button-color-default-text: var(--sbb-color-red);--sbb-button-color-hover-background: var(--sbb-color-milk);--sbb-button-color-hover-border: var(--sbb-color-milk);--sbb-button-color-hover-text: var(--sbb-color-red125);--sbb-button-shadow-1-color: var(--sbb-color-smoke-alpha-20);--sbb-button-shadow-2-color: var(--sbb-color-metal-alpha-20)}:host(:not([disabled],:active,[data-active])){--sbb-button-box-shadow: var(--sbb-button-box-shadow-definition)}"
    ]);
    common_templateObject2 = function() {
        return data;
    };
    return data;
}
function common_templateObject3() {
    const data = (0,esm_tagged_template_literal._)([
        ":host{--sbb-button-color-active-background: var(--sbb-color-milk);--sbb-button-color-active-border: var(--sbb-color-cloud);--sbb-button-color-active-text: var(--sbb-color-anthracite);--sbb-button-color-default-background: var(--sbb-color-white);--sbb-button-color-default-border: var(--sbb-color-cloud);--sbb-button-color-default-text: var(--sbb-color-charcoal);--sbb-button-color-hover-background: var(--sbb-color-white);--sbb-button-color-hover-border: var(--sbb-color-cloud);--sbb-button-color-hover-text: var(--sbb-color-iron);--sbb-button-shadow-1-color: var(--sbb-color-platinum-alpha-20);--sbb-button-shadow-2-color: var(--sbb-color-cement-alpha-20)}:host([negative]){--sbb-button-color-active-background: transparent;--sbb-button-color-active-border: var(--sbb-color-cloud);--sbb-button-color-active-text: var(--sbb-color-cloud);--sbb-button-color-default-background: transparent;--sbb-button-color-default-border: var(--sbb-color-white);--sbb-button-color-default-text: var(--sbb-color-white);--sbb-button-color-hover-background: transparent;--sbb-button-color-hover-border: var(--sbb-color-milk);--sbb-button-color-hover-text: var(--sbb-color-milk)}:host(:not([disabled],[negative],:active,[data-active])){--sbb-button-box-shadow: var(--sbb-button-box-shadow-definition)}"
    ]);
    common_templateObject3 = function() {
        return data;
    };
    return data;
}
function _templateObject4() {
    const data = (0,esm_tagged_template_literal._)([
        ":host{--sbb-button-color-active-background: var(--sbb-color-black);--sbb-button-color-active-border: var(--sbb-color-cloud);--sbb-button-color-active-text: var(--sbb-color-cloud);--sbb-button-color-default-background: var(--sbb-color-charcoal);--sbb-button-color-default-border: var(--sbb-color-cloud);--sbb-button-color-default-text: var(--sbb-color-white);--sbb-button-color-hover-background: var(--sbb-color-midnight);--sbb-button-color-hover-border: var(--sbb-color-cloud);--sbb-button-color-hover-text: var(--sbb-color-milk);--sbb-button-shadow-1-color: var(--sbb-color-platinum-alpha-20);--sbb-button-shadow-2-color: var(--sbb-color-cement-alpha-20)}:host(:not([disabled],:active,[data-active])){--sbb-button-box-shadow: var(--sbb-button-box-shadow-definition)}"
    ]);
    _templateObject4 = function() {
        return data;
    };
    return data;
}
function _templateObject5() {
    const data = (0,esm_tagged_template_literal._)([
        ":host{--sbb-button-color-active-background: var(--sbb-color-cloud);--sbb-button-color-active-border: var(--sbb-color-cloud);--sbb-button-color-active-text: var(--sbb-color-black);--sbb-button-color-default-background: transparent;--sbb-button-color-default-border: transparent;--sbb-button-color-default-text: var(--sbb-color-black);--sbb-button-color-hover-background: var(--sbb-color-milk);--sbb-button-color-hover-border: var(--sbb-color-milk);--sbb-button-color-hover-text: var(--sbb-color-black)}:host([negative]){--sbb-button-color-active-background: var(--sbb-color-iron);--sbb-button-color-active-border: var(--sbb-color-iron);--sbb-button-color-active-text: var(--sbb-color-white);--sbb-button-color-default-background: transparent;--sbb-button-color-default-border: transparent;--sbb-button-color-default-text: var(--sbb-color-white);--sbb-button-color-hover-background: var(--sbb-color-charcoal);--sbb-button-color-hover-border: var(--sbb-color-charcoal);--sbb-button-color-hover-text: var(--sbb-color-white)}"
    ]);
    _templateObject5 = function() {
        return data;
    };
    return data;
}







var common_f = Object.defineProperty, common_m = Object.getOwnPropertyDescriptor, common_l = (a, o, t, s)=>{
    for(var b = s > 1 ? void 0 : s ? common_m(o, t) : o, e = a.length - 1, n; e >= 0; e--)(n = a[e]) && (b = (s ? n(o, t, b) : n(b)) || b);
    return s && b && common_f(o, t, b), b;
};
const common_S = (a)=>{
    let o = class extends mixins_Q((0,icon/* SbbIconNameMixin */.qs)(a)) {
        renderTemplate() {
            return static_n(common_templateObject(), super.renderIconSlot());
        }
        constructor(...t){
            super(t), this.size = "l", new controllers/* SbbSlotStateController */.sL(this);
        }
    };
    return common_l([
        (0,decorators/* property */.Cb)({
            reflect: !0
        })
    ], o.prototype, "size", 2), o = common_l([
        (0,core_decorators/* hostAttributes */.f)({
            "data-sbb-button": ""
        })
    ], o), o;
}, common_ = (0,lit/* css */.iv)(common_templateObject1()), common_C = (0,lit/* css */.iv)(common_templateObject2()), common_B = (0,lit/* css */.iv)(common_templateObject3()), common_T = (0,lit/* css */.iv)(_templateObject4()), common_P = (0,lit/* css */.iv)(_templateObject5());


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/button-link.js




var button_link_v = Object.defineProperty, button_link_S = Object.getOwnPropertyDescriptor, button_link_ = (i, e, n, o)=>{
    for(var t = o > 1 ? void 0 : o ? button_link_S(e, n) : e, r = i.length - 1, m; r >= 0; r--)(m = i[r]) && (t = (o ? m(e, n, t) : m(t)) || t);
    return o && t && button_link_v(e, n, t), t;
};
let button_link_b = class extends common_S(mixins_X(base_elements_p)) {
};
button_link_b.styles = [
    common_,
    common_C
];
button_link_b = button_link_([
    (0,decorators/* customElement */.Mo)("sbb-button-link")
], button_link_b);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/button-link.js




const button_link_i = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-button-link",
    elementClass: button_link_b,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/button-static.js




var button_static_c = Object.defineProperty, button_static_S = Object.getOwnPropertyDescriptor, button_static_v = (s, e, r, o)=>{
    for(var t = o > 1 ? void 0 : o ? button_static_S(e, r) : e, m = s.length - 1, n; m >= 0; m--)(n = s[m]) && (t = (o ? n(e, r, t) : n(t)) || t);
    return o && t && button_static_c(e, r, t), t;
};
let button_static_b = class extends common_S(mixins_y(base_elements_d)) {
};
button_static_b.styles = [
    common_,
    common_C
];
button_static_b = button_static_v([
    (0,decorators/* customElement */.Mo)("sbb-button-static")
], button_static_b);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/button-static.js




const button_button_static_b = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-button-static",
    elementClass: button_static_b,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/button.js




var button_v = Object.defineProperty, button_S = Object.getOwnPropertyDescriptor, button_ = (l, e, r, o)=>{
    for(var t = o > 1 ? void 0 : o ? button_S(e, r) : e, n = l.length - 1, m; n >= 0; n--)(m = l[n]) && (t = (o ? m(e, r, t) : m(t)) || t);
    return o && t && button_v(e, r, t), t;
};
let button_b = class extends common_S(mixins_X(base_elements_l)) {
};
button_b.styles = [
    common_,
    common_C
];
button_b = button_([
    (0,decorators/* customElement */.Mo)("sbb-button")
], button_b);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/button.js




const button_a = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-button",
    elementClass: button_b,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/mini-button.js

function mini_button_templateObject() {
    const data = (0,esm_tagged_template_literal._)([
        '*,:before,:after{box-sizing:border-box}:host{display:block;outline:none!important}:host{display:inline-block;-webkit-tap-highlight-color:transparent;height:fit-content;outline:none!important;--sbb-button-color-default-background: var(--sbb-color-black-alpha-0);--sbb-button-color-default-border: var(--sbb-color-black-alpha-0);--sbb-button-color-default-text: var(--sbb-color-charcoal);--sbb-button-color-hover-background: var(--sbb-color-milk);--sbb-button-color-hover-border: var(--sbb-color-milk);--sbb-button-color-hover-text: var(--sbb-color-charcoal);--sbb-button-color-active-background: var(--sbb-color-cloud);--sbb-button-color-active-border: var(--sbb-color-cloud);--sbb-button-color-active-text: var(--sbb-color-charcoal);--sbb-button-color-disabled-background: var(--sbb-color-milk);--sbb-button-color-disabled-border: var(--sbb-color-milk);--sbb-button-color-disabled-text: var(--sbb-color-granite);--sbb-button-border-width: 0rem;--sbb-button-border-radius: var(--sbb-border-radius-infinity);--sbb-button-transition-duration: var( --sbb-disable-animation-time, var(--sbb-animation-duration-2x) );--sbb-button-transition-easing-function: var(--sbb-animation-easing);--sbb-button-inset: .0625rem}@media (forced-colors: active){:host{--sbb-button-color-default-text: ButtonText !important;--sbb-button-color-default-border: CanvasText !important;--sbb-button-color-active-text: ButtonText !important;--sbb-button-color-active-border: Highlight !important;--sbb-button-color-hover-text: ButtonText !important}}:host .sbb-mini-button{position:relative;transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:color;border-radius:var(--sbb-button-border-radius);color:var(--sbb-button-color-default-text);cursor:pointer;-webkit-user-select:none;user-select:none;display:var(--sbb-button-display)}:host .sbb-mini-button:before{position:absolute;content:"";inset:var(--sbb-button-inset);border:var(--sbb-button-border-width) solid var(--sbb-button-color-default-border);border-radius:var(--sbb-button-border-radius);background-color:var(--sbb-button-color-default-background);transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:inset,background-color,border-color}::slotted(sbb-icon),sbb-icon{transition:transform var(--sbb-button-transition-duration) var(--sbb-button-transition-easing-function);transform:translateY(var(--sbb-button-translate-y-content-hover, 0rem));display:flex}:host([negative]){--sbb-button-color-default-background: var(--sbb-color-black-alpha-0);--sbb-button-color-default-border: var(--sbb-color-black-alpha-0);--sbb-button-color-default-text: var(--sbb-color-milk);--sbb-button-color-hover-background: var(--sbb-color-charcoal);--sbb-button-color-hover-border: var(--sbb-color-charcoal);--sbb-button-color-hover-text: var(--sbb-color-milk);--sbb-button-color-active-background: var(--sbb-color-iron);--sbb-button-color-active-border: var(--sbb-color-iron);--sbb-button-color-active-text: var(--sbb-color-milk);--sbb-button-color-disabled-background: var(--sbb-color-black-alpha-0);--sbb-button-color-disabled-border: var(--sbb-color-black-alpha-0);--sbb-button-color-disabled-text: var(--sbb-color-smoke)}@media (forced-colors: active){:host(:is([disabled],[data-disabled])){--sbb-button-color-disabled-text: GrayText !important}}:host(:is([disabled],[data-disabled])) .sbb-mini-button{color:var(--sbb-button-color-disabled-text);cursor:default;pointer-events:none}:host(:is([disabled],[data-disabled])) .sbb-mini-button:before{background-color:var(--sbb-button-color-disabled-background);border-color:var(--sbb-button-color-disabled-border)}:host(:focus-visible:not([data-focus-origin=mouse],[data-focus-origin=touch])) .sbb-mini-button:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) solid var(--sbb-focus-outline-width)}@media (any-hover: hover){:host(:not([disabled],[data-disabled],:active,[data-active]):hover){--sbb-button-translate-y-content-hover: -.0625rem}}@media (forced-colors: active){:host(:not([disabled],[data-disabled],:active,[data-active]):hover){--sbb-button-color-hover-border: Highlight !important}}@media (any-hover: hover){:host(:not([disabled],[data-disabled],:active,[data-active]):hover) .sbb-mini-button:before{inset:calc(var(--sbb-button-border-width) * -1);background-color:var(--sbb-button-color-hover-background);border-color:var(--sbb-button-color-hover-border)}}@media (any-hover: hover){:host(:not([disabled],[data-disabled],:active,[data-active]):hover) .sbb-mini-button{color:var(--sbb-button-color-hover-text)}}:host(:not([disabled],[data-disabled]):is(:active,[data-active])) .sbb-mini-button:before{color:var(--sbb-button-color-active-text);background-color:var(--sbb-button-color-active-background);border-color:var(--sbb-button-color-active-border)}'
    ]);
    mini_button_templateObject = function() {
        return data;
    };
    return data;
}






const mini_button_m = (0,lit/* css */.iv)(mini_button_templateObject());
var mini_button_f = Object.defineProperty, mini_button_p = Object.getOwnPropertyDescriptor, mini_button_g = (s, t, r, b)=>{
    for(var o = b > 1 ? void 0 : b ? mini_button_p(t, r) : t, a = s.length - 1, e; a >= 0; a--)(e = s[a]) && (o = (b ? e(t, r, o) : e(o)) || o);
    return b && o && mini_button_f(t, r, o), o;
};
let mini_button_n = class extends mixins_Q((0,icon/* SbbIconNameMixin */.qs)(mixins_X(base_elements_l))) {
    renderTemplate() {
        return super.renderIconSlot();
    }
    constructor(){
        super(), new controllers/* SbbSlotStateController */.sL(this);
    }
};
mini_button_n.styles = mini_button_m;
mini_button_n = mini_button_g([
    (0,decorators/* customElement */.Mo)("sbb-mini-button")
], mini_button_n);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/mini-button.js




const mini_button_b = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-mini-button",
    elementClass: mini_button_n,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/secondary-button-link.js




var secondary_button_link_u = Object.defineProperty, secondary_button_link_S = Object.getOwnPropertyDescriptor, secondary_button_link_v = (l, t, n, o)=>{
    for(var e = o > 1 ? void 0 : o ? secondary_button_link_S(t, n) : t, r = l.length - 1, b; r >= 0; r--)(b = l[r]) && (e = (o ? b(t, n, e) : b(e)) || e);
    return o && e && secondary_button_link_u(t, n, e), e;
};
let secondary_button_link_m = class extends common_S(mixins_X(base_elements_p)) {
};
secondary_button_link_m.styles = [
    common_,
    common_B
];
secondary_button_link_m = secondary_button_link_v([
    (0,decorators/* customElement */.Mo)("sbb-secondary-button-link")
], secondary_button_link_m);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/secondary-button-link.js




const secondary_button_link_b = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-secondary-button-link",
    elementClass: secondary_button_link_m,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/secondary-button-static.js




var secondary_button_static_S = Object.defineProperty, secondary_button_static_u = Object.getOwnPropertyDescriptor, secondary_button_static_v = (s, e, r, o)=>{
    for(var t = o > 1 ? void 0 : o ? secondary_button_static_u(e, r) : e, n = s.length - 1, m; n >= 0; n--)(m = s[n]) && (t = (o ? m(e, r, t) : m(t)) || t);
    return o && t && secondary_button_static_S(e, r, t), t;
};
let secondary_button_static_b = class extends common_S(mixins_y(base_elements_d)) {
};
secondary_button_static_b.styles = [
    common_,
    common_B
];
secondary_button_static_b = secondary_button_static_v([
    (0,decorators/* customElement */.Mo)("sbb-secondary-button-static")
], secondary_button_static_b);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/secondary-button-static.js




const secondary_button_static_c = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-secondary-button-static",
    elementClass: secondary_button_static_b,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/secondary-button.js




var secondary_button_c = Object.defineProperty, secondary_button_S = Object.getOwnPropertyDescriptor, secondary_button_v = (s, e, n, o)=>{
    for(var t = o > 1 ? void 0 : o ? secondary_button_S(e, n) : e, r = s.length - 1, b; r >= 0; r--)(b = s[r]) && (t = (o ? b(e, n, t) : b(t)) || t);
    return o && t && secondary_button_c(e, n, t), t;
};
let secondary_button_m = class extends common_S(mixins_X(base_elements_l)) {
};
secondary_button_m.styles = [
    common_,
    common_B
];
secondary_button_m = secondary_button_v([
    (0,decorators/* customElement */.Mo)("sbb-secondary-button")
], secondary_button_m);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/secondary-button.js




const secondary_button_b = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-secondary-button",
    elementClass: secondary_button_m,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/tertiary-button-link.js




var tertiary_button_link_v = Object.defineProperty, tertiary_button_link_y = Object.getOwnPropertyDescriptor, tertiary_button_link_S = (i, e, o, r)=>{
    for(var t = r > 1 ? void 0 : r ? tertiary_button_link_y(e, o) : e, n = i.length - 1, b; n >= 0; n--)(b = i[n]) && (t = (r ? b(e, o, t) : b(t)) || t);
    return r && t && tertiary_button_link_v(e, o, t), t;
};
let tertiary_button_link_m = class extends common_S(mixins_X(base_elements_p)) {
};
tertiary_button_link_m.styles = [
    common_,
    common_T
];
tertiary_button_link_m = tertiary_button_link_S([
    (0,decorators/* customElement */.Mo)("sbb-tertiary-button-link")
], tertiary_button_link_m);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/tertiary-button-link.js




const tertiary_button_link_a = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-tertiary-button-link",
    elementClass: tertiary_button_link_m,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/tertiary-button-static.js




var tertiary_button_static_c = Object.defineProperty, tertiary_button_static_S = Object.getOwnPropertyDescriptor, tertiary_button_static_v = (i, e, o, r)=>{
    for(var t = r > 1 ? void 0 : r ? tertiary_button_static_S(e, o) : e, m = i.length - 1, n; m >= 0; m--)(n = i[m]) && (t = (r ? n(e, o, t) : n(t)) || t);
    return r && t && tertiary_button_static_c(e, o, t), t;
};
let tertiary_button_static_b = class extends common_S(mixins_y(base_elements_d)) {
};
tertiary_button_static_b.styles = [
    common_,
    common_T
];
tertiary_button_static_b = tertiary_button_static_v([
    (0,decorators/* customElement */.Mo)("sbb-tertiary-button-static")
], tertiary_button_static_b);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/tertiary-button-static.js




const tertiary_button_static_n = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-tertiary-button-static",
    elementClass: tertiary_button_static_b,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/tertiary-button.js




var tertiary_button_v = Object.defineProperty, tertiary_button_y = Object.getOwnPropertyDescriptor, tertiary_button_S = (i, e, o, r)=>{
    for(var t = r > 1 ? void 0 : r ? tertiary_button_y(e, o) : e, n = i.length - 1, b; n >= 0; n--)(b = i[n]) && (t = (r ? b(e, o, t) : b(t)) || t);
    return r && t && tertiary_button_v(e, o, t), t;
};
let tertiary_button_m = class extends common_S(mixins_X(base_elements_l)) {
};
tertiary_button_m.styles = [
    common_,
    common_T
];
tertiary_button_m = tertiary_button_S([
    (0,decorators/* customElement */.Mo)("sbb-tertiary-button")
], tertiary_button_m);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/tertiary-button.js




const tertiary_button_b = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-tertiary-button",
    elementClass: tertiary_button_m,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/transparent-button-link.js




var transparent_button_link_v = Object.defineProperty, transparent_button_link_S = Object.getOwnPropertyDescriptor, transparent_button_link_ = (s, e, r, n)=>{
    for(var t = n > 1 ? void 0 : n ? transparent_button_link_S(e, r) : e, o = s.length - 1, b; o >= 0; o--)(b = s[o]) && (t = (n ? b(e, r, t) : b(t)) || t);
    return n && t && transparent_button_link_v(e, r, t), t;
};
let transparent_button_link_m = class extends common_S(mixins_X(base_elements_p)) {
};
transparent_button_link_m.styles = [
    common_,
    common_P
];
transparent_button_link_m = transparent_button_link_([
    (0,decorators/* customElement */.Mo)("sbb-transparent-button-link")
], transparent_button_link_m);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/transparent-button-link.js




const transparent_button_link_p = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-transparent-button-link",
    elementClass: transparent_button_link_m,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/transparent-button-static.js




var transparent_button_static_c = Object.defineProperty, transparent_button_static_S = Object.getOwnPropertyDescriptor, transparent_button_static_v = (b, e, n, r)=>{
    for(var t = r > 1 ? void 0 : r ? transparent_button_static_S(e, n) : e, o = b.length - 1, m; o >= 0; o--)(m = b[o]) && (t = (r ? m(e, n, t) : m(t)) || t);
    return r && t && transparent_button_static_c(e, n, t), t;
};
let transparent_button_static_s = class extends common_S(mixins_y(base_elements_d)) {
};
transparent_button_static_s.styles = [
    common_,
    common_P
];
transparent_button_static_s = transparent_button_static_v([
    (0,decorators/* customElement */.Mo)("sbb-transparent-button-static")
], transparent_button_static_s);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/transparent-button-static.js




const transparent_button_static_p = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-transparent-button-static",
    elementClass: transparent_button_static_s,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/button/transparent-button.js




var transparent_button_v = Object.defineProperty, transparent_button_S = Object.getOwnPropertyDescriptor, transparent_button_ = (s, e, r, n)=>{
    for(var t = n > 1 ? void 0 : n ? transparent_button_S(e, r) : e, o = s.length - 1, b; o >= 0; o--)(b = s[o]) && (t = (n ? b(e, r, t) : b(t)) || t);
    return n && t && transparent_button_v(e, r, t), t;
};
let transparent_button_m = class extends common_S(mixins_X(base_elements_l)) {
};
transparent_button_m.styles = [
    common_,
    common_P
];
transparent_button_m = transparent_button_([
    (0,decorators/* customElement */.Mo)("sbb-transparent-button")
], transparent_button_m);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button/transparent-button.js




const transparent_button_p = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-transparent-button",
    elementClass: transparent_button_m,
    react: react
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/button.js
















/***/ }),

/***/ 9475:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: function() { return /* binding */ O; }
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8620);

/**
 * Copied from https://github.com/lit/lit/blob/main/packages/react/src/create-component.ts
 * TODO: Can be removed once https://github.com/lit/lit/issues/4023 or https://github.com/lit/lit/pull/4476 is solved.
 *
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const w = lit__WEBPACK_IMPORTED_MODULE_0__/* .isServer */ .sk, L = /* @__PURE__ */ new Set([
    "children",
    "localName",
    "ref",
    "style",
    "className",
    "id"
]), P = /* @__PURE__ */ new WeakMap(), M = (r, o, n)=>{
    let i = P.get(r);
    i === void 0 && P.set(r, i = /* @__PURE__ */ new Map());
    let s = i.get(o);
    n !== void 0 ? s === void 0 ? (i.set(o, s = {
        handleEvent: n
    }), r.addEventListener(o, s)) : s.handleEvent = n : s !== void 0 && (i.delete(o), r.removeEventListener(o, s));
}, g = (r, o, n, i, s)=>{
    const p = s == null ? void 0 : s[o];
    if (p !== void 0) {
        n !== i && M(r, p, n);
        return;
    }
    r[o] = n, n == null && o in HTMLElement.prototype && r.removeAttribute(o);
}, O = (param)=>{
    let { react: r, tagName: o, elementClass: n, events: i, displayName: s } = param;
    const p = new Set(Object.keys(i !== null && i !== void 0 ? i : {})), y = r.forwardRef((E, f)=>{
        var v;
        const d = r.useRef(/* @__PURE__ */ new Map()), u = r.useRef(null), l = {}, a = {}, m = n.elementProperties;
        for (const [e, t] of Object.entries(E)){
            if (L.has(e)) {
                l[e === "className" ? "class" : e] = t;
                continue;
            } else if (p.has(e) || e in n.prototype) {
                const c = m == null ? void 0 : m.get(e), b = (v = c == null ? void 0 : c.converter) == null ? void 0 : v.toAttribute;
                if (!c || c.attribute === !1 || typeof t == "object" && !b) {
                    a[e] = t;
                    continue;
                }
                const h = c.attribute === !0 ? e : c.attribute || e;
                c.type !== Boolean ? l[h] = b ? b(t) : t : (t && (l[h] = ""), a[e] = t);
                continue;
            }
            l[e] = t;
        }
        return w || (r.useLayoutEffect(()=>{
            if (u.current === null) return;
            const e = /* @__PURE__ */ new Map();
            for(const t in a)g(u.current, t, E[t], d.current.get(t), i), d.current.delete(t), e.set(t, E[t]);
            for (const [t, c] of d.current)g(u.current, t, void 0, c, i);
            d.current = e;
        }), r.useLayoutEffect(()=>{
            var e;
            (e = u.current) == null || e.removeAttribute("defer-hydration");
        }, [])), w ? (r.createElement.name === "litPatchedCreateElement" || globalThis.litSsrReactEnabled) && Object.keys(a).length && (l._$litProps$ = a) : l.suppressHydrationWarning = !0, r.createElement(o, {
            ...l,
            ref: r.useCallback((e)=>{
                u.current = e, typeof f == "function" ? f(e) : f !== null && (f.current = e);
            }, [
                f
            ])
        });
    });
    return y.displayName = s !== null && s !== void 0 ? s : n.name, y;
};



/***/ }),

/***/ 9705:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Y: function() { return /* reexport */ toggle_r; },
  D: function() { return /* reexport */ g; }
});

// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components-react/create-component-DnOg-u1x.js
var create_component_DnOg_u1x = __webpack_require__(9475);
// EXTERNAL MODULE: ./node_modules/lit/index.js + 2 modules
var lit = __webpack_require__(8620);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(2265);
// EXTERNAL MODULE: ./node_modules/@swc/helpers/esm/_tagged_template_literal.js
var _tagged_template_literal = __webpack_require__(8646);
// EXTERNAL MODULE: ./node_modules/lit/decorators.js + 3 modules
var decorators = __webpack_require__(7252);
// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/controllers.js
var controllers = __webpack_require__(2952);
// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/decorators.js
var core_decorators = __webpack_require__(9059);
// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/dom.js
var dom = __webpack_require__(3712);
// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/icon.js + 8 modules
var icon = __webpack_require__(7280);
;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/toggle/toggle-option.js

function _templateObject() {
    const data = (0,_tagged_template_literal._)([
        '*,:before,:after{box-sizing:border-box}:host{--sbb-toggle-option-cursor: pointer;--sbb-toggle-option-color: var(--sbb-color-anthracite);--sbb-toggle-option-icon-min-size: var(--sbb-size-icon-ui-small);--sbb-toggle-option-border-radius: var(--sbb-border-radius-infinity);--sbb-toggle-option-line-height: calc(1em * var(--sbb-typo-line-height-body-text));display:inline-block;min-width:var(--sbb-toggle-min-width);overflow:hidden;z-index:1}:host(:focus-visible:not([data-focus-origin=mouse],[data-focus-origin=touch])){outline:none!important}:host([checked]){--sbb-toggle-option-color: var(--sbb-color-charcoal)}:host([disabled]){--sbb-toggle-option-cursor: unset;--sbb-toggle-option-color: var(--sbb-color-granite)}input[type=radio]{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.sbb-toggle-option{--sbb-text-font-size: var(--sbb-font-size-text-xs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);font-weight:700;cursor:var(--sbb-toggle-option-cursor);display:flex;justify-content:center;align-items:center;height:var(--sbb-toggle-height);padding-inline:var(--sbb-toggle-padding-inline);border-radius:var(--sbb-toggle-option-border-radius);color:var(--sbb-toggle-option-color)}:host([data-slot-names~=unnamed]:where([data-slot-names~=icon],[icon-name])) .sbb-toggle-option{gap:var(--sbb-spacing-fixed-1x)}.sbb-toggle-option__label{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host(:focus-visible:not([data-focus-origin=mouse],[data-focus-origin=touch])) .sbb-toggle-option__label:before{content:"";position:absolute;pointer-events:none;inset:calc(var(--sbb-focus-outline-offset) * -2);border:var(--sbb-focus-outline-color) solid var(--sbb-focus-outline-width);border-radius:var(--sbb-toggle-option-border-radius)}sbb-icon,::slotted(sbb-icon){min-width:var(--sbb-toggle-option-icon-min-size);min-height:var(--sbb-toggle-option-icon-min-size)}'
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function _templateObject1() {
    const data = (0,_tagged_template_literal._)([
        '\n      <input\n        type="radio"\n        id="sbb-toggle-option-id"\n        aria-hidden="true"\n        tabindex="-1"\n        ?disabled=',
        "\n        .checked=",
        "\n        .value=",
        "\n        @click=",
        '\n      />\n      <label class="sbb-toggle-option" for="sbb-toggle-option-id">\n        ',
        '\n        <span class="sbb-toggle-option__label">\n          <slot></slot>\n        </span>\n      </label>\n    '
    ]);
    _templateObject1 = function() {
        return data;
    };
    return data;
}






const y = (0,lit/* css */.iv)(_templateObject());
var x = Object.defineProperty, w = Object.getOwnPropertyDescriptor, n = (e, t, i, l)=>{
    for(var o = l > 1 ? void 0 : l ? w(t, i) : t, r = e.length - 1, b; r >= 0; r--)(b = e[r]) && (o = (l ? b(t, i, o) : b(o)) || o);
    return l && o && x(t, i, o), o;
};
let s = class extends (0,icon/* SbbIconNameMixin */.qs)(lit/* LitElement */.oi) {
    set value(e) {
        this._value = "".concat(e);
    }
    get value() {
        return this._value;
    }
    connectedCallback() {
        var t;
        super.connectedCallback();
        const e = this._abort.signal;
        var _ref;
        this.addEventListener("input", ()=>this._handleInput(), {
            signal: e
        }), this.addEventListener("click", ()=>{
            var i;
            return (i = this.shadowRoot.querySelector("label")) == null ? void 0 : i.click();
        }, {
            signal: e
        }), this._toggle = (_ref = (t = this.closest) == null ? void 0 : t.call(this, "sbb-toggle")) !== null && _ref !== void 0 ? _ref : void 0, this._verifyTabindex();
    }
    willUpdate(e) {
        super.willUpdate(e), e.has("checked") && (this.setAttribute("aria-checked", "".concat(this.checked)), this._verifyTabindex(), this.checked && this._uncheckOtherOptions()), e.has("disabled") && this._handleDisabledChange();
    }
    _uncheckOtherOptions() {
        var e;
        (e = this._toggle) == null || e.options.filter((t)=>t !== this).forEach((t)=>t.checked = !1);
    }
    _handleDisabledChange() {
        this._toggle && (this._toggle.disabled && !this.disabled ? this.disabled = !0 : !this._toggle.disabled && this.disabled && (this.disabled = !1)), (0,dom/* setOrRemoveAttribute */.Ev)(this, "aria-disabled", this.disabled ? "true" : null), this._verifyTabindex();
    }
    _handleInput() {
        this.disabled || (this.checked = !0, this._uncheckOtherOptions());
    }
    _verifyTabindex() {
        this.tabIndex = this.checked && !this.disabled ? 0 : -1;
    }
    render() {
        return (0,lit/* html */.dy)(_templateObject1(), this.disabled, this.checked || lit/* nothing */.Ld, this.value || lit/* nothing */.Ld, (e)=>e.stopPropagation(), this.renderIconSlot());
    }
    constructor(){
        super(), this.checked = !1, this.disabled = !1, this._value = "", this._abort = new controllers/* SbbConnectedAbortController */.v7(this), new controllers/* SbbSlotStateController */.sL(this);
    }
};
s.styles = y;
n([
    (0,decorators/* property */.Cb)({
        reflect: !0,
        type: Boolean
    })
], s.prototype, "checked", 2);
n([
    (0,decorators/* property */.Cb)({
        reflect: !0,
        type: Boolean
    })
], s.prototype, "disabled", 2);
n([
    (0,decorators/* property */.Cb)()
], s.prototype, "value", 1);
s = n([
    (0,decorators/* customElement */.Mo)("sbb-toggle-option"),
    (0,core_decorators/* hostAttributes */.f)({
        role: "radio"
    })
], s);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/toggle/toggle-option.js




const g = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-toggle-option",
    elementClass: s,
    react: react
});


// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/eventing.js
var eventing = __webpack_require__(9142);
;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/core/a11y.js


function d() {
    return (0,dom/* getDocumentWritingMode */.e_)() === "rtl" ? {
        prevKey: "ArrowRight",
        nextKey: "ArrowLeft"
    } : {
        prevKey: "ArrowLeft",
        nextKey: "ArrowRight"
    };
}
function R(t) {
    return [
        "ArrowRight",
        "ArrowLeft",
        "ArrowUp",
        "ArrowDown"
    ].includes(t.key);
}
function U(t) {
    return t.key === "ArrowUp" || t.key === d().prevKey;
}
function V(t) {
    return t.key === "ArrowDown" || t.key === d().nextKey;
}
function B(t) {
    return R(t) || [
        "PageUp",
        "PageDown",
        "Home",
        "End"
    ].includes(t.key);
}
function f(t, e, o) {
    return (t + o + e) % e;
}
function A(t) {
    return t - 1;
}
const a11y_y = 0;
function W(t, e, o) {
    const { prevKey: s, nextKey: r } = d();
    return t.key === s || t.key === "ArrowUp" ? e < a11y_y ? A(o) : f(e, o, -1) : t.key === r || t.key === "ArrowDown" ? e >= o ? a11y_y : f(e, o, 1) : e;
}
function E(t) {
    return t.buttons === 0 || t.detail === 0;
}
function M(t) {
    const e = t.touches && t.touches[0] || t.changedTouches && t.changedTouches[0];
    return !!e && e.identifier === -1 && (e.radiusX == null || e.radiusX === 1) && (e.radiusY == null || e.radiusY === 1);
}
const k = 16, v = 17, T = 18, K = 91, L = 224, C = {
    ignoreKeys: [
        T,
        v,
        L,
        K,
        k
    ]
}, a11y_x = 650, l = {
    passive: !0,
    capture: !0
};
class F {
    /** The most recently detected input modality. */ get mostRecentModality() {
        return this._mostRecentModality;
    }
    reset() {
        this._mostRecentModality = "mouse", this._mostRecentTarget = null, this._lastTouchMs = 0;
    }
    /**
   * The most recently detected input modality event target. Is null if no input modality has been
   * detected or if the associated event target is null for some unknown reason.
   */ get mostRecentTarget() {
        return this._mostRecentTarget;
    }
    constructor(){
        this._mostRecentModality = "mouse", this._mostRecentTarget = null, this._options = {
            ...C
        }, this._lastTouchMs = 0, this._onKeydown = (e)=>{
            var o, s;
            (s = (o = this._options) == null ? void 0 : o.ignoreKeys) != null && s.some((r)=>r === e.keyCode) || (this._mostRecentModality = "keyboard", this._mostRecentTarget = (0,eventing/* getEventTarget */.NI)(e));
        }, this._onMousedown = (e)=>{
            Date.now() - this._lastTouchMs < a11y_x || (this._mostRecentModality = E(e) ? "keyboard" : "mouse", this._mostRecentTarget = (0,eventing/* getEventTarget */.NI)(e));
        }, this._onTouchstart = (e)=>{
            if (M(e)) {
                this._mostRecentModality = "keyboard", this._mostRecentTarget = (0,eventing/* getEventTarget */.NI)(e);
                return;
            }
            this._lastTouchMs = Date.now(), this._mostRecentModality = "touch", this._mostRecentTarget = (0,eventing/* getEventTarget */.NI)(e);
        }, (0,dom/* isBrowser */.jU)() && (document.addEventListener("keydown", this._onKeydown, l), document.addEventListener("mousedown", this._onMousedown, l), document.addEventListener("touchstart", this._onTouchstart, l));
    }
}
const m = new F();
function Y(t) {
    if (!t) return;
    const e = m.mostRecentModality;
    t && e !== null && t.addEventListener("focus", ()=>{
        t.setAttribute("data-focus-origin", e), t.addEventListener("blur", ()=>t.removeAttribute("data-focus-origin"), {
            once: !0
        });
    }, {
        once: !0
    });
}
class X {
    hostConnected() {
        this._host.addEventListener("focusin", this._focusinHandler), this._host.addEventListener("focusout", this._focusoutHandler);
    }
    hostDisconnected() {
        this._host.removeEventListener("focusin", this._focusinHandler), this._host.removeEventListener("focusout", this._focusoutHandler);
    }
    constructor(e){
        this._host = e, this._focusinHandler = ()=>{
            this._host.toggleAttribute("data-has-visible-focus-within", m.mostRecentModality === "keyboard");
        }, this._focusoutHandler = ()=>{
            this._host.removeAttribute("data-has-visible-focus-within");
        }, this._host.addController(this);
    }
}
function S(t) {
    return !!(t.offsetWidth || t.offsetHeight || typeof t.getClientRects == "function" && t.getClientRects().length);
}
class D {
    /**
   * Gets whether an element is visible for the purposes of interactivity.
   *
   * This will capture states like `display: none` and `visibility: hidden`, but not things like
   * being clipped by an `overflow: hidden` parent or being outside the viewport.
   *
   * @returns Whether the element is visible.
   */ isVisible(e) {
        return S(e) && getComputedStyle(e).visibility === "visible";
    }
}
class I {
    isVisible() {
        return !0;
    }
}
const H = typeof getComputedStyle > "u" || getComputedStyle(document.documentElement).visibility === "" ? new I() : new D(), N = [
    "button",
    "[href]",
    "input",
    "select",
    "textarea",
    "details",
    "summary:not(:disabled)",
    "[tabindex]"
].map((t)=>"".concat(t, ':not([disabled],[tabindex="-1"])')).join(",");
function a11y_g(t, e) {
    const o = /* @__PURE__ */ new Set();
    function s(r, c) {
        var i;
        for (const n of r)if (!(c && !c(n))) {
            if (n.nodeName === "SLOT") {
                s(Array.from(n.assignedElements()), c);
                continue;
            }
            var _ref;
            if (n.matches(N) && ((_ref = e == null ? void 0 : e.includeInvisibleElements) !== null && _ref !== void 0 ? _ref : H.isVisible(n)) && o.add(n), e != null && e.findFirstFocusable && o.size > 0) break;
            if (n.children.length || (i = n.shadowRoot) != null && i.children.length) {
                const u = Array.from(n.children).length ? Array.from(n.children) : Array.from(n.shadowRoot.children);
                s(u, c);
            }
        }
    }
    return s(t, e == null ? void 0 : e.filter), [
        ...o
    ];
}
function j(t, e) {
    const o = a11y_g(t, {
        filter: e,
        findFirstFocusable: !0
    });
    return o.length ? o[0] : null;
}
class G {
    /**
   * @param element in which the focus should be trapped.
   * @param options options object.
   * @param options.filter filter function which is applied during searching for focusable element. If an element is filtered, also child elements are filtered.
   * @param options.postFilter filter function which is applied after collecting focusable elements.
   */ trap(e, o) {
        e.addEventListener("keydown", (s)=>{
            if (s.key !== "Tab") return;
            var _ref;
            const r = Array.from(e.shadowRoot.children || []), i = a11y_g(r, {
                filter: o == null ? void 0 : o.filter
            }).filter((_ref = o == null ? void 0 : o.postFilter) !== null && _ref !== void 0 ? _ref : ()=>!0);
            if (!i.length) return;
            const n = i[0], u = i[i.length - 1], [h, b] = s.shiftKey ? [
                n,
                u
            ] : [
                u,
                n
            ];
            (n.getRootNode().activeElement === h || u.getRootNode().activeElement === h) && (b.focus(), s.preventDefault());
        }, {
            signal: this._controller.signal
        });
    }
    disconnect() {
        this._controller.abort(), this._controller = new AbortController();
    }
    constructor(){
        this._controller = new AbortController();
    }
}


// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/observers.js
var observers = __webpack_require__(337);
;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/toggle/toggle.js

function toggle_templateObject() {
    const data = (0,_tagged_template_literal._)([
        '*,:before,:after{box-sizing:border-box}:host{--sbb-toggle-width: fit-content;--sbb-toggle-min-width: calc( var(--sbb-toggle-padding-inline) * 2 + var(--sbb-size-icon-ui-small) );--sbb-toggle-selected-option-border-color: var(--sbb-color-smoke);--sbb-toggle-padding-inline: var(--sbb-spacing-responsive-xxxs);--sbb-toggle-animation-duration: var( --sbb-disable-animation-time, var(--sbb-animation-duration-6x) );--sbb-toggle-height: 1.75rem;--sbb-toggle-border-width: var(--sbb-border-width-1x);--sbb-toggle-border-style: solid;--sbb-toggle-border-radius: var(--sbb-border-radius-infinity);display:block}@media (min-width: 52.5rem){:host{--sbb-toggle-height: 2rem}}@media (forced-colors: active){:host{--sbb-toggle-selected-option-border-color: Highlight;--sbb-toggle-border-width: var(--sbb-border-width-2x)}}:host([even]){--sbb-toggle-width: 100%}:host([even]) ::slotted(sbb-toggle-option){width:50%}:host([disabled]){--sbb-toggle-selected-option-border-color: var(--sbb-color-graphite);--sbb-toggle-border-style: dashed}@media (forced-colors: active){:host([disabled]){--sbb-toggle-border-style: solid;--sbb-toggle-selected-option-border-color: GrayText}}:host([size=m]){--sbb-toggle-padding-inline: var(--sbb-spacing-responsive-s);--sbb-toggle-height: 2.75rem}@media (min-width: 52.5rem){:host([size=m]){--sbb-toggle-height: 3.25rem}}:host([data-disable-animation-on-resizing]){--sbb-disable-animation-time: .1ms;--sbb-disable-animation-zero-time: 0s}.sbb-toggle{--sbb-text-font-size: var(--sbb-font-size-text-m);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);position:relative;display:flex;align-items:center;width:var(--sbb-toggle-width);max-width:100%;min-width:calc(var(--sbb-toggle-min-width) * 2);height:var(--sbb-toggle-height);-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;background:var(--sbb-color-cloud);border-radius:var(--sbb-toggle-border-radius)}.sbb-toggle:after{content:"";padding-inline:var(--sbb-toggle-padding-inline);display:inline-block;opacity:1;background-color:var(--sbb-color-white);border:var(--sbb-toggle-border-width) var(--sbb-toggle-border-style) var(--sbb-toggle-selected-option-border-color);border-radius:var(--sbb-toggle-border-radius);position:absolute;max-width:100%;min-width:var(--sbb-toggle-min-width);inset-block:calc(-2 * var(--sbb-toggle-border-width));inset-inline:calc(var(--sbb-toggle-option-left) - .125rem) calc(var(--sbb-toggle-option-right) - .125rem);transition-duration:var(--sbb-toggle-animation-duration);transition-timing-function:ease;transition-property:opacity,inset-inline-end,inset-inline-start}@media (forced-colors: active){.sbb-toggle{outline:var(--sbb-toggle-border-width) solid CanvasText}}'
    ]);
    toggle_templateObject = function() {
        return data;
    };
    return data;
}
function toggle_templateObject1() {
    const data = (0,_tagged_template_literal._)([
        '\n      <div class="sbb-toggle">\n        <slot @slotchange=',
        "></slot>\n      </div>\n    "
    ]);
    toggle_templateObject1 = function() {
        return data;
    };
    return data;
}








const z = (0,lit/* css */.iv)(toggle_templateObject());
var P = Object.defineProperty, toggle_E = Object.getOwnPropertyDescriptor, b = (e, t, s, i)=>{
    for(var o = i > 1 ? void 0 : i ? toggle_E(t, s) : t, n = e.length - 1, l; n >= 0; n--)(l = e[n]) && (o = (i ? l(t, s, o) : l(o)) || o);
    return i && o && P(t, s, o), o;
};
let r = class extends lit/* LitElement */.oi {
    set disabled(e) {
        this._disabled = e, this._updateDisabled();
    }
    get disabled() {
        return this._disabled;
    }
    set value(e) {
        lit/* isServer */.sk ? this._value = e : this._valueChanged(e);
    }
    get value() {
        var e, t;
        var _this__value, _ref, _ref1;
        return lit/* isServer */.sk ? (_this__value = this._value) !== null && _this__value !== void 0 ? _this__value : "" : (_ref1 = (_ref = (e = this.options.find((s)=>s.checked)) == null ? void 0 : e.value) !== null && _ref !== void 0 ? _ref : (t = this.options[0]) == null ? void 0 : t.value) !== null && _ref1 !== void 0 ? _ref1 : "";
    }
    /** The child instances of sbb-toggle-option as an array. */ get options() {
        var e;
        var _ref;
        return Array.from((_ref = (e = this.querySelectorAll) == null ? void 0 : e.call(this, "sbb-toggle-option")) !== null && _ref !== void 0 ? _ref : []);
    }
    _valueChanged(e) {
        var _t_find, _ref;
        const t = this.options, s = (_ref = (_t_find = t.find((i)=>e === ("value" in i ? i.value : i.getAttribute("value")))) !== null && _t_find !== void 0 ? _t_find : t.find((i)=>i.checked)) !== null && _ref !== void 0 ? _ref : t[0];
        s && (s.checked || (s.checked = !0), this._setCheckedPillPosition(!1));
    }
    _updateDisabled() {
        for (const e of this.options)e.disabled = this.disabled;
    }
    _setCheckedPillPosition(e) {
        var g, h;
        if (!this._loaded) return;
        const t = this.options, s = this.shadowRoot.querySelector(".sbb-toggle");
        if (t.every((d)=>!d.checked) || t.every((d)=>!d.clientWidth) || !s) return;
        this.toggleAttribute("data-disable-animation-on-resizing", e);
        const i = t[0], o = i.checked, n = i.checked ? "0px" : "".concat(i.clientWidth, "px"), l = o ? "".concat(s.clientWidth - i.clientWidth, "px") : "0px";
        (g = this.style) == null || g.setProperty("--sbb-toggle-option-left", n), (h = this.style) == null || h.setProperty("--sbb-toggle-option-right", l);
    }
    connectedCallback() {
        super.connectedCallback();
        const e = this._abort.signal;
        this.addEventListener("input", ()=>this._handleInput(), {
            signal: e,
            passive: !0
        }), this.addEventListener("keydown", (t)=>this._handleKeyDown(t), {
            signal: e
        }), this.options.forEach((t)=>this._toggleResizeObserver.observe(t)), this._updateToggle();
    }
    async firstUpdated(e) {
        super.firstUpdated(e), await this.updateComplete, this._loaded = !0;
    }
    disconnectedCallback() {
        super.disconnectedCallback(), this._toggleResizeObserver.disconnect();
    }
    _updateToggle() {
        this._valueChanged(this.value), this._updateDisabled();
    }
    _handleInput() {
        this._setCheckedPillPosition(!1), this._change.emit(), this._didChange.emit();
    }
    _handleKeyDown(e) {
        const t = this.options.filter((s)=>!s.disabled && H.isVisible(s));
        if (!(!t || // don't trap nested handling
        e.target !== this && e.target.parentElement !== this) && R(e)) {
            const s = t.findIndex((o)=>o.checked), i = W(e, s, t.length);
            t[i].checked || (t[i].checked = !0, t[i].focus(), t[i].dispatchEvent(new InputEvent("input", {
                bubbles: !0,
                composed: !0
            }))), e.preventDefault();
        }
    }
    render() {
        return (0,lit/* html */.dy)(toggle_templateObject1(), this._updateToggle);
    }
    constructor(){
        super(...arguments), this._disabled = !1, this.even = !1, this.size = "m", this._value = null, this._loaded = !1, this._toggleResizeObserver = new observers/* AgnosticResizeObserver */.GJ(()=>this._setCheckedPillPosition(!0)), this._didChange = new eventing/* EventEmitter */.vp(this, r.events.didChange, {
            bubbles: !0,
            composed: !0
        }), this._change = new eventing/* EventEmitter */.vp(this, r.events.change, {
            bubbles: !0,
            composed: !0
        }), this._abort = new controllers/* SbbConnectedAbortController */.v7(this);
    }
};
r.styles = z;
r.events = {
    didChange: "didChange",
    change: "change"
};
b([
    (0,decorators/* property */.Cb)({
        reflect: !0,
        type: Boolean
    })
], r.prototype, "disabled", 1);
b([
    (0,decorators/* property */.Cb)({
        reflect: !0,
        type: Boolean
    })
], r.prototype, "even", 2);
b([
    (0,decorators/* property */.Cb)({
        reflect: !0
    })
], r.prototype, "size", 2);
b([
    (0,decorators/* property */.Cb)()
], r.prototype, "value", 1);
r = b([
    (0,decorators/* customElement */.Mo)("sbb-toggle"),
    (0,core_decorators/* hostAttributes */.f)({
        role: "radiogroup"
    })
], r);


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/toggle/toggle.js




const toggle_r = (0,create_component_DnOg_u1x.c)({
    tagName: "sbb-toggle",
    elementClass: r,
    react: react,
    events: {
        onDidChange: "didChange",
        onChange: "change"
    }
});


;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components-react/toggle.js





/***/ }),

/***/ 2169:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: function() { return /* binding */ o; }
/* harmony export */ });
/* unused harmony export mergeConfig */
function o() {
    return "sbbConfig" in globalThis || (globalThis.sbbConfig = {}), globalThis.sbbConfig;
}
function g(i) {
    const n = o();
    Object.assign(n, i);
}



/***/ }),

/***/ 2952:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RR: function() { return /* binding */ h; },
/* harmony export */   sL: function() { return /* binding */ C; },
/* harmony export */   v7: function() { return /* binding */ b; }
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2169);
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3712);
/* harmony import */ var _observers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(337);



class b {
    get signal() {
        var t;
        return (t = this._abortController) == null ? void 0 : t.signal;
    }
    hostConnected() {
        this._abortController || (this._abortController = new AbortController());
    }
    hostDisconnected() {
        var t;
        (t = this._abortController) == null || t.abort(), this._abortController = void 0;
    }
    constructor(t){
        this._host = t, this._abortController = new AbortController(), this._host.addController(this);
    }
}
const e = class e {
    /** Get the current language. */ static get current() {
        var _d_language;
        const s = (((_d_language = (0,_config_js__WEBPACK_IMPORTED_MODULE_2__/* .readConfig */ .z)().language) !== null && _d_language !== void 0 ? _d_language : (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__/* .isBrowser */ .jU)() ? document.documentElement.getAttribute("lang") : e._defaultLanguage) || e._defaultLanguage).split("-")[0];
        return e._supportedLocales.includes(s) ? s : e._defaultLanguage;
    }
    /** Get the current language. */ get current() {
        return e.current;
    }
    /** Add a language change handler. */ withHandler(t) {
        return this._handlers.unshift(t), this;
    }
    hostConnected() {
        e._listeners.size || e._observer.observe(document.documentElement, e._observerConfig), e._listeners.add(this), this._previousLanguage !== this.current && this._callHandlers(this._previousLanguage !== void 0);
    }
    hostDisconnected() {
        this._previousLanguage = this.current, e._listeners.delete(this), e._listeners.size || e._observer.disconnect();
    }
    _callHandlers() {
        let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
        this._handlers.forEach((s)=>s()), t && this._host.requestUpdate();
    }
    constructor(t){
        this._host = t, this._handlers = [], this._host.addController(this);
    }
};
e._defaultLanguage = "en", e._supportedLocales = [
    "en",
    "de",
    "fr",
    "it"
], e._listeners = /* @__PURE__ */ new Set(), e._observer = new _observers_js__WEBPACK_IMPORTED_MODULE_1__/* .AgnosticMutationObserver */ .xB((t)=>{
    t[0].oldValue !== document.documentElement.getAttribute("lang") && e._listeners.forEach((s)=>s._callHandlers());
}), e._observerConfig = {
    attributeFilter: [
        "lang"
    ],
    attributeOldValue: !0
};
let h = e;
class C {
    hostConnected() {
        var t;
        this._syncSlots(...this._host.querySelectorAll("slot")), (t = this._host.shadowRoot) == null || t.addEventListener("slotchange", this._slotchangeHandler);
    }
    hostDisconnected() {
        var t;
        (t = this._host.shadowRoot) == null || t.removeEventListener("slotchange", this._slotchangeHandler);
    }
    _syncSlots() {
        for(var _len = arguments.length, t = new Array(_len), _key = 0; _key < _len; _key++){
            t[_key] = arguments[_key];
        }
        var n;
        for (const r of t){
            const i = r.name || "unnamed";
            r.assignedNodes().some((l)=>{
                var a;
                return "tagName" in l || ((a = l.textContent) == null ? void 0 : a.trim());
            }) ? this.slots.add(i) : this.slots.delete(i);
        }
        const s = this._host.getAttribute("data-slot-names"), o = [
            ...this.slots
        ].sort().join(" ");
        o ? this._host.getAttribute("data-slot-names") !== o && this._host.setAttribute("data-slot-names", o) : this._host.removeAttribute("data-slot-names"), o !== s && ((n = this._onChangeCallback) == null || n.call(this));
    }
    constructor(t, s = null){
        this._host = t, this._onChangeCallback = s, this.slots = /* @__PURE__ */ new Set(), this._slotchangeHandler = (o)=>{
            this._syncSlots(o.target);
        }, this._host.addController(this);
    }
}



/***/ }),

/***/ 9059:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   f: function() { return /* binding */ f; }
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8620);

function l(o, t) {
    for (const [e, r] of Object.entries(t))r ? o.setAttribute(e, r) : o.toggleAttribute(e, r !== null);
}
const f = (o)=>(t)=>t.addInitializer((e)=>{
            lit__WEBPACK_IMPORTED_MODULE_0__/* .isServer */ .sk ? l(e, o) : e.addController({
                hostConnected () {
                    l(e, o), e.removeController(this);
                },
                hostUpdate () {
                    l(e, o), e.removeController(this);
                }
            });
        });



/***/ }),

/***/ 3712:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $Q: function() { return /* binding */ C; },
/* harmony export */   Ev: function() { return /* binding */ B; },
/* harmony export */   e_: function() { return /* binding */ I; },
/* harmony export */   jU: function() { return /* binding */ e; }
/* harmony export */ });
/* unused harmony exports ACTION_ELEMENTS, SbbScrollHandler, breakpoints, findInput, findReferencedElement, hostContext, isAndroid, isBlink, isBreakpoint, isChromium, isEdge, isFirefox, isIOS, isNextjs, isSafari, isTrident, isWebkit, pageScrollDisabled */
let a;
try {
    a = typeof Intl < "u" && Intl.v8BreakIterator;
} catch (e) {
    a = !1;
}
const e = ()=>typeof document == "object" && !!document, l = ()=>e() && /(edge)/i.test(navigator.userAgent), c = ()=>e() && /(msie|trident)/i.test(navigator.userAgent), y = ()=>e() && !!(window.chrome || a) && typeof CSS < "u" && !l() && !c(), g = ()=>e() && /AppleWebKit/i.test(navigator.userAgent) && !y() && !l() && !c(), w = ()=>e() && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window), v = ()=>e() && /(firefox|minefield)/i.test(navigator.userAgent), A = ()=>e() && /android/i.test(navigator.userAgent) && !c(), E = ()=>e() && /safari/i.test(navigator.userAgent) && g(), p = ()=>!!globalThis.next, S = ()=>{
    var t, n;
    return (n = (t = navigator.userAgentData) == null ? void 0 : t.brands) == null ? void 0 : n.some((o)=>o.brand == "Chromium");
}, x = (/* unused pure expression or super */ null && ([
    "zero",
    "micro",
    "small",
    "medium",
    "wide",
    "large",
    "ultra"
]));
function k(t, n, o) {
    if (!e()) return !1;
    const i = getComputedStyle(document.documentElement), s = t ? i.getPropertyValue("--sbb-breakpoint-".concat(t, "-min")) : "", r = n ? "".concat(parseFloat(i.getPropertyValue("--sbb-breakpoint-".concat(n, "-").concat(o != null && o.includeMaxBreakpoint ? "max" : "min"))) - (o != null && o.includeMaxBreakpoint ? 0 : 0.0625), "rem") : "", b = s && "(min-width: ".concat(s, ")"), m = r && "(max-width: ".concat(r, ")"), f = s && r && " and ";
    return window.matchMedia("".concat(b).concat(f).concat(m)).matches;
}
function h(t) {
    if (e()) {
        if (typeof t == "string") return document.getElementById(t);
        if (t instanceof window.Element) return t;
    } else return null;
    return null;
}
const I = ()=>e() && document.documentElement.getAttribute("dir") || "ltr";
function $(t, n) {
    if (!e()) return null;
    var _n_parentElement;
    for(n = (_n_parentElement = n.parentElement) !== null && _n_parentElement !== void 0 ? _n_parentElement : n.getRootNode().host; n && n !== document && n !== window;){
        const o = n.closest(t);
        if (o) return o;
        n = n.getRootNode().host;
    }
    return null;
}
const M = "a,button,sbb-teaser-hero,sbb-teaser";
function _(t, n) {
    var o;
    if (!n) {
        const i = (o = t.closest) == null ? void 0 : o.call(t, "sbb-form-field");
        return i == null ? void 0 : i.querySelector("input");
    }
    return h(n);
}
function B(t, n, o) {
    o ? t.setAttribute(n, o) : t.removeAttribute(n);
}
function u() {
    return document.body.hasAttribute("data-sbb-scroll-disabled");
}
class W {
    disableScroll() {
        if (u()) return;
        this._position = document.body.style.position, this._overflow = document.body.style.overflow, this._marginInlineEnd = document.body.style.marginInlineEnd;
        const n = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden", document.body.style.position = "relative", document.body.style.marginInlineEnd = "".concat(n, "px"), document.body.style.setProperty("--sbb-scrollbar-width", "".concat(n, "px")), document.body.toggleAttribute("data-sbb-scroll-disabled", !0);
    }
    enableScroll() {
        u() && (document.body.style.position = this._position || "", document.body.style.overflow = this._overflow || "", document.body.style.marginInlineEnd = this._marginInlineEnd || "", document.body.style.setProperty("--sbb-scrollbar-width", "0"), document.body.removeAttribute("data-sbb-scroll-disabled"));
    }
}
const d = /* @__PURE__ */ new Map();
function C(t) {
    if (d.has(t.constructor)) return d.get(t.constructor);
    const n = // eslint-disable-next-line @typescript-eslint/naming-convention
    customElements.__definitions;
    for (const [o, i] of n)if (i.ctor === t.constructor) return d.set(t.constructor, o), o;
    throw new Error("Given element ".concat(t.constructor.name, " has not been registered yet."));
}



/***/ }),

/***/ 9142:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Lu: function() { return /* binding */ f; },
/* harmony export */   NI: function() { return /* binding */ u; },
/* harmony export */   vp: function() { return /* binding */ l; }
/* harmony export */ });
/* unused harmony exports HandlerRepository, composedPathHasAttribute, formElementHandlerAspect, forwardEventToHost, preventScrollOnSpacebarPress, throttle */
function a(t, e) {
    let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
    const n = t.composedPath();
    let s = n.findIndex((r)=>r === o);
    return s === -1 && (s = void 0), n.slice(0, s).find((r)=>r instanceof window.HTMLElement && r.hasAttribute(e));
}
const c = {
    bubbles: !0,
    cancelable: !0,
    composed: !0
};
class l {
    /**
   * Dispatches an event.
   * @param detail The detail to dispatch with the event.
   * @returns true when the event was successfully emitted or false,
   *  if preventDefault() was called. Always returns true in SSR.
   */ emit(e) {
        var o, n;
        var _ref;
        return (_ref = (n = (o = this._element).dispatchEvent) == null ? void 0 : n.call(o, new CustomEvent(this._eventName, {
            ...this._options,
            detail: e
        }))) !== null && _ref !== void 0 ? _ref : !0;
    }
    constructor(e, o, n = c){
        this._element = e, this._eventName = o, this._options = n;
    }
}
function u(t) {
    return t.composedPath ? t.composedPath()[0] : t.target;
}
function i(t) {
    t.key === " " && t.preventDefault();
}
const d = (param)=>{
    let { host: t, signal: e } = param;
    t.addEventListener("keydown", i, {
        signal: e
    });
};
function h(t, e) {
    const o = Object.getPrototypeOf(t).constructor, n = new o(t.type, t);
    e.dispatchEvent(n);
}
class p {
    connect() {
        var o;
        (o = this._controller) == null || o.abort(), this._controller = new AbortController();
        const e = {
            host: this._host,
            signal: this._controller.signal
        };
        for (const n of this._aspects)n(e);
    }
    disconnect() {
        var e;
        (e = this._controller) == null || e.abort();
    }
    constructor(e, ...o){
        this._host = e, this._aspects = o;
    }
}
async function f(t) {
    return await new Promise((e)=>setTimeout(e)), t.defaultPrevented;
}
const m = (t, e)=>{
    let o = !1;
    return function() {
        for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++){
            s[_key] = arguments[_key];
        }
        o || (t(...s), o = !0, setTimeout(()=>{
            o = !1;
        }, e));
    };
};



/***/ }),

/***/ 337:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GJ: function() { return /* binding */ b; },
/* harmony export */   xB: function() { return /* binding */ c; }
/* harmony export */ });
/* unused harmony exports AgnosticIntersectionObserver, NodeIntersectionObserver, NodeMutationObserver, NodeResizeObserver */
class s {
    disconnect() {}
    observe() {}
    takeRecords() {}
    unobserve() {}
}
const i = typeof IntersectionObserver > "u" ? s : IntersectionObserver;
class r {
    disconnect() {}
    observe(n, o) {}
    takeRecords() {
        return [];
    }
}
const c = typeof MutationObserver > "u" ? r : MutationObserver;
class t {
    disconnect() {}
    observe() {}
    unobserve() {}
}
const b = typeof ResizeObserver > "u" ? t : ResizeObserver;



/***/ }),

/***/ 7280:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  qs: function() { return /* binding */ J; }
});

// UNUSED EXPORTS: SbbIconBase, SbbIconElement, getSvgContent, isValid, validateContent

// EXTERNAL MODULE: ./node_modules/@swc/helpers/esm/_tagged_template_literal.js
var _tagged_template_literal = __webpack_require__(8646);
// EXTERNAL MODULE: ./node_modules/lit/decorators.js + 3 modules
var decorators = __webpack_require__(7252);
// EXTERNAL MODULE: ./node_modules/lit/index.js + 2 modules
var lit = __webpack_require__(8620);
// EXTERNAL MODULE: ./node_modules/lit/node_modules/lit-html/lit-html.js
var lit_html = __webpack_require__(2558);
;// CONCATENATED MODULE: ./node_modules/lit/node_modules/lit-html/directive.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const t = {
    ATTRIBUTE: 1,
    CHILD: 2,
    PROPERTY: 3,
    BOOLEAN_ATTRIBUTE: 4,
    EVENT: 5,
    ELEMENT: 6
}, e = (t)=>function() {
        for(var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++){
            e[_key] = arguments[_key];
        }
        return {
            _$litDirective$: t,
            values: e
        };
    };
class i {
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AT(t, e, i) {
        this._$Ct = t, this._$AM = e, this._$Ci = i;
    }
    _$AS(t, e) {
        return this.update(t, e);
    }
    update(t, e) {
        return this.render(...e);
    }
    constructor(t){}
}
 //# sourceMappingURL=directive.js.map

;// CONCATENATED MODULE: ./node_modules/lit/node_modules/lit-html/directives/unsafe-html.js


/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class unsafe_html_e extends i {
    render(r) {
        if (r === lit_html/* nothing */.Ld || null == r) return this._t = void 0, this.it = r;
        if (r === lit_html/* noChange */.Jb) return r;
        if ("string" != typeof r) throw Error(this.constructor.directiveName + "() called with a non-string value");
        if (r === this.it) return this._t;
        this.it = r;
        const s = [
            r
        ];
        return s.raw = s, this._t = {
            _$litType$: this.constructor.resultType,
            strings: s,
            values: []
        };
    }
    constructor(i){
        if (super(i), this.it = lit_html/* nothing */.Ld, i.type !== t.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
    }
}
unsafe_html_e.directiveName = "unsafeHTML", unsafe_html_e.resultType = 1;
const unsafe_html_o = e(unsafe_html_e);
 //# sourceMappingURL=unsafe-html.js.map

;// CONCATENATED MODULE: ./node_modules/lit/directives/unsafe-html.js
 //# sourceMappingURL=unsafe-html.js.map

;// CONCATENATED MODULE: ./node_modules/lit/node_modules/lit-html/directive-helpers.js

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const { I: directive_helpers_t } = lit_html._$LH, directive_helpers_i = (o)=>null === o || "object" != typeof o && "function" != typeof o, n = {
    HTML: 1,
    SVG: 2
}, directive_helpers_e = (o, t)=>void 0 === t ? void 0 !== (o === null || o === void 0 ? void 0 : o._$litType$) : (o === null || o === void 0 ? void 0 : o._$litType$) === t, l = (o)=>{
    var _o__$litType$;
    return null != (o === null || o === void 0 ? void 0 : (_o__$litType$ = o._$litType$) === null || _o__$litType$ === void 0 ? void 0 : _o__$litType$.h);
}, c = (o)=>void 0 !== (o === null || o === void 0 ? void 0 : o._$litDirective$), d = (o)=>o === null || o === void 0 ? void 0 : o._$litDirective$, directive_helpers_f = (o)=>void 0 === o.strings, s = ()=>document.createComment(""), r = (o, i, n)=>{
    const e = o._$AA.parentNode, l = void 0 === i ? o._$AB : i._$AA;
    if (void 0 === n) {
        const i = e.insertBefore(s(), l), c = e.insertBefore(s(), l);
        n = new directive_helpers_t(i, c, o, o.options);
    } else {
        const t = n._$AB.nextSibling, i = n._$AM, c = i !== o;
        if (c) {
            var _n__$AQ;
            let t;
            (_n__$AQ = n._$AQ) === null || _n__$AQ === void 0 ? void 0 : _n__$AQ.call(n, o), n._$AM = o, void 0 !== n._$AP && (t = o._$AU) !== i._$AU && n._$AP(t);
        }
        if (t !== l || c) {
            let o = n._$AA;
            for(; o !== t;){
                const t = o.nextSibling;
                e.insertBefore(o, l), o = t;
            }
        }
    }
    return n;
}, v = function(o, t) {
    let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : o;
    return o._$AI(t, i), o;
}, u = {}, m = function(o) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : u;
    return o._$AH = t;
}, p = (o)=>o._$AH, h = (o)=>{
    var _o__$AP;
    (_o__$AP = o._$AP) === null || _o__$AP === void 0 ? void 0 : _o__$AP.call(o, !1, !0);
    let t = o._$AA;
    const i = o._$AB.nextSibling;
    for(; t !== i;){
        const o = t.nextSibling;
        t.remove(), t = o;
    }
}, j = (o)=>{
    o._$AR();
};
 //# sourceMappingURL=directive-helpers.js.map

;// CONCATENATED MODULE: ./node_modules/lit/node_modules/lit-html/async-directive.js



/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const async_directive_s = (i, t)=>{
    var _i__$AO;
    const e = i._$AN;
    if (void 0 === e) return !1;
    for (const i of e)(_i__$AO = i._$AO) === null || _i__$AO === void 0 ? void 0 : _i__$AO.call(i, t, !1), async_directive_s(i, t);
    return !0;
}, o = (i)=>{
    let t, e;
    do {
        if (void 0 === (t = i._$AM)) break;
        e = t._$AN, e.delete(i), i = t;
    }while (0 === (e === null || e === void 0 ? void 0 : e.size));
}, async_directive_r = (i)=>{
    for(let t; t = i._$AM; i = t){
        let e = t._$AN;
        if (void 0 === e) t._$AN = e = new Set;
        else if (e.has(i)) break;
        e.add(i), async_directive_c(t);
    }
};
function async_directive_h(i) {
    void 0 !== this._$AN ? (o(this), this._$AM = i, async_directive_r(this)) : this._$AM = i;
}
function async_directive_n(i) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    const r = this._$AH, h = this._$AN;
    if (void 0 !== h && 0 !== h.size) if (t) if (Array.isArray(r)) for(let i = e; i < r.length; i++)async_directive_s(r[i], !1), o(r[i]);
    else null != r && (async_directive_s(r, !1), o(r));
    else async_directive_s(this, i);
}
const async_directive_c = (i)=>{
    var _i, _i1;
    var __$AP, __$AQ;
    i.type == t.CHILD && ((__$AP = (_i = i)._$AP) !== null && __$AP !== void 0 ? __$AP : _i._$AP = async_directive_n, (__$AQ = (_i1 = i)._$AQ) !== null && __$AQ !== void 0 ? __$AQ : _i1._$AQ = async_directive_h);
};
class f extends i {
    _$AT(i, t, e) {
        super._$AT(i, t, e), async_directive_r(this), this.isConnected = i._$AU;
    }
    _$AO(i) {
        let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
        var _this_reconnected, _this, _this_disconnected, _this1;
        i !== this.isConnected && (this.isConnected = i, i ? (_this_reconnected = (_this = this).reconnected) === null || _this_reconnected === void 0 ? void 0 : _this_reconnected.call(_this) : (_this_disconnected = (_this1 = this).disconnected) === null || _this_disconnected === void 0 ? void 0 : _this_disconnected.call(_this1)), t && (async_directive_s(this, i), o(this));
    }
    setValue(t) {
        if (directive_helpers_f(this._$Ct)) this._$Ct._$AI(t, this);
        else {
            const i = [
                ...this._$Ct._$AH
            ];
            i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
        }
    }
    disconnected() {}
    reconnected() {}
    constructor(){
        super(...arguments), this._$AN = void 0;
    }
}
 //# sourceMappingURL=async-directive.js.map

;// CONCATENATED MODULE: ./node_modules/lit/node_modules/lit-html/directives/private-async-helpers.js
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const private_async_helpers_t = async (t, s)=>{
    for await (const i of t)if (!1 === await s(i)) return;
};
class private_async_helpers_s {
    disconnect() {
        this.Y = void 0;
    }
    reconnect(t) {
        this.Y = t;
    }
    deref() {
        return this.Y;
    }
    constructor(t){
        this.Y = t;
    }
}
class private_async_helpers_i {
    get() {
        return this.Z;
    }
    pause() {
        var _this_Z;
        (_this_Z = this.Z) !== null && _this_Z !== void 0 ? _this_Z : this.Z = new Promise((t)=>this.q = t);
    }
    resume() {
        var _this_q, _this;
        (_this_q = (_this = this).q) === null || _this_q === void 0 ? void 0 : _this_q.call(_this), this.Z = this.q = void 0;
    }
    constructor(){
        this.Z = void 0, this.q = void 0;
    }
}
 //# sourceMappingURL=private-async-helpers.js.map

;// CONCATENATED MODULE: ./node_modules/lit/node_modules/lit-html/directives/until.js





/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const until_n = (t)=>!directive_helpers_i(t) && "function" == typeof t.then, until_h = 1073741823;
class until_c extends f {
    render() {
        for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++){
            s[_key] = arguments[_key];
        }
        var _s_find;
        return (_s_find = s.find((t)=>!until_n(t))) !== null && _s_find !== void 0 ? _s_find : lit_html/* noChange */.Jb;
    }
    update(s, i) {
        const e = this._$Cbt;
        let r = e.length;
        this._$Cbt = i;
        const o = this._$CK, c = this._$CX;
        this.isConnected || this.disconnected();
        for(let t = 0; t < i.length && !(t > this._$Cwt); t++){
            const s = i[t];
            if (!until_n(s)) return this._$Cwt = t, s;
            t < r && s === e[t] || (this._$Cwt = until_h, r = 0, Promise.resolve(s).then(async (t)=>{
                for(; c.get();)await c.get();
                const i = o.deref();
                if (void 0 !== i) {
                    const e = i._$Cbt.indexOf(s);
                    e > -1 && e < i._$Cwt && (i._$Cwt = e, i.setValue(t));
                }
            }));
        }
        return lit_html/* noChange */.Jb;
    }
    disconnected() {
        this._$CK.disconnect(), this._$CX.pause();
    }
    reconnected() {
        this._$CK.reconnect(this), this._$CX.resume();
    }
    constructor(){
        super(...arguments), this._$Cwt = until_h, this._$Cbt = [], this._$CK = new private_async_helpers_s(this), this._$CX = new private_async_helpers_i;
    }
}
const until_m = e(until_c);
 //# sourceMappingURL=until.js.map

;// CONCATENATED MODULE: ./node_modules/lit/directives/until.js
 //# sourceMappingURL=until.js.map

// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/decorators.js
var core_decorators = __webpack_require__(9059);
// EXTERNAL MODULE: ./node_modules/@sbb-esta/lyne-components/core/config.js
var config = __webpack_require__(2169);
;// CONCATENATED MODULE: ./node_modules/@sbb-esta/lyne-components/icon.js

function _templateObject() {
    const data = (0,_tagged_template_literal._)([
        "*,:before,:after{box-sizing:border-box}:host{display:inline-block;line-height:0;-webkit-tap-highlight-color:transparent}:host([data-empty]){--sbb-icon-default-dimension: 0}:host([data-empty][data-namespace=default][name$=-small]){--sbb-icon-default-dimension: var(--sbb-size-icon-ui-small)}:host([data-empty][data-namespace=default][name$=-medium]){--sbb-icon-default-dimension: var(--sbb-size-icon-ui-medium)}:host([data-empty][data-namespace=default][name$=-large]){--sbb-icon-default-dimension: var(--sbb-size-icon-ui-large)}svg{width:var(--sbb-icon-svg-width, var(--sbb-icon-default-dimension));height:var(--sbb-icon-svg-height, var(--sbb-icon-default-dimension));stroke:var(--sbb-icon-svg-stroke-color);stroke-width:var(--sbb-icon-svg-stroke-width)}svg:not(.color-immutable) [fill]:not([fill=none]){fill:currentcolor}svg:not(.color-immutable) [stroke]:not([stroke=none]){stroke:currentcolor}svg:not(.color-immutable)>:where(path,polygon,polyline):where(:not([stroke]):not([fill])),svg:not(.color-immutable) :where(:not([stroke]):not([fill])) :where(path,polygon,polyline):where(:not([stroke]):not([fill])){fill:currentcolor}"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
function _templateObject1() {
    const data = (0,_tagged_template_literal._)([
        '<svg width="0" height="0"></svg>'
    ]);
    _templateObject1 = function() {
        return data;
    };
    return data;
}
function _templateObject2() {
    const data = (0,_tagged_template_literal._)([
        '<span class="sbb-icon-inner"\n      >',
        "</span\n    >"
    ]);
    _templateObject2 = function() {
        return data;
    };
    return data;
}
function _templateObject3() {
    const data = (0,_tagged_template_literal._)([
        "<sbb-icon name=",
        " class=",
        "></sbb-icon>"
    ]);
    _templateObject3 = function() {
        return data;
    };
    return data;
}
function _templateObject4() {
    const data = (0,_tagged_template_literal._)([
        '\n        <slot name="icon">\n          ',
        "\n        </slot>\n      "
    ]);
    _templateObject4 = function() {
        return data;
    };
    return data;
}






const E = (e)=>typeof e == "string", _ = (e)=>{
    if (e.nodeType === 1) {
        if (e.nodeName.toLowerCase() === "script") return !1;
        for(let t = 0; t < e.attributes.length; t++){
            const o = e.attributes[t].name;
            if (E(o) && o.toLowerCase().indexOf("on") === 0) return !1;
        }
        for(let t = 0; t < e.childNodes.length; t++)if (!_(e.childNodes[t])) return !1;
    }
    return !0;
}, P = function(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    const r = document.createElement("div");
    r.innerHTML = e;
    for(let i = r.childNodes.length - 1; i >= 0; i--)r.childNodes[i].nodeName.toLowerCase() !== "svg" && r.removeChild(r.childNodes[i]);
    const s = r.firstElementChild;
    return s && s.nodeName.toLowerCase() === "svg" && (o && !s.classList.contains("color-immutable") && s.classList.add("color-immutable"), t === !1 || _(s)) ? r.innerHTML : "";
}, icon_m = "https://icons.app.sbb.ch/", C = /* @__PURE__ */ new Map().set("default", "".concat(icon_m, "icons/")).set("picto", "".concat(icon_m, "picto/")), icon_v = /* @__PURE__ */ new Map(), O = (e, t, o)=>{
    var p;
    var _L_icon, _ref;
    const r = (_L_icon = (0,config/* readConfig */.z)().icon) !== null && _L_icon !== void 0 ? _L_icon : {}, s = (_ref = (p = r.namespaces) == null ? void 0 : p.get(e)) !== null && _ref !== void 0 ? _ref : C.get(e);
    if (s === void 0) throw Error('Unable to find the namespace "'.concat(e, '". Please register your custom namespace.'));
    const i = "".concat(s).concat(t, ".svg");
    let a = icon_v.get(i);
    var _r_interceptor;
    if (!a) if (typeof fetch < "u" && typeof document < "u") a = ((_r_interceptor = r.interceptor) !== null && _r_interceptor !== void 0 ? _r_interceptor : (l)=>l.request())({
        namespace: e,
        name: t,
        url: i,
        request: ()=>fetch(i).then((l)=>{
                if (l.ok) return l.text().then((c)=>(c && (c = P(c, o)), c));
                throw new Error("Failed to load icon " + e + ":" + t);
            }).catch((l)=>{
                throw Error(l);
            })
    }), icon_v.set(i, a);
    else return Promise.resolve("");
    return a;
}, x = (0,lit/* css */.iv)(_templateObject());
var z = Object.defineProperty, M = Object.getOwnPropertyDescriptor, icon_d = (e, t, o, r)=>{
    for(var s = r > 1 ? void 0 : r ? M(t, o) : t, i = e.length - 1, a; i >= 0; i--)(a = e[i]) && (s = (r ? a(t, o, s) : a(s)) || s);
    return r && s && z(t, o, s), s;
};
let icon_n = class extends lit/* LitElement */.oi {
    async loadSvgIcon(e) {
        if (!e) return;
        const [t, o] = this._splitIconName(e);
        this._svgNamespace = t, this.setAttribute("data-namespace", this._svgNamespace);
        const r = this.fetchSvgIcon(this._svgNamespace, o);
        this._svgIcon = r.then((s)=>unsafe_html_o(s));
        try {
            this.toggleAttribute("data-empty", !await r);
        } catch (e) {
            this.toggleAttribute("data-empty", !0);
        }
    }
    async fetchSvgIcon(e, t) {
        return await O(e, t, !this.noSanitize);
    }
    _splitIconName(e) {
        if (!e) return [
            "",
            ""
        ];
        const t = e.split(":");
        switch(t.length){
            case 1:
                return [
                    icon_n._defaultNamespace,
                    t[0]
                ];
            case 2:
                return t;
            default:
                throw Error('Invalid icon name: "'.concat(e, '"'));
        }
    }
    firstUpdated(e) {
        var _this_getAttribute;
        super.firstUpdated(e), this.setAttribute("role", (_this_getAttribute = this.getAttribute("role")) !== null && _this_getAttribute !== void 0 ? _this_getAttribute : "img");
    }
    render() {
        return (0,lit/* html */.dy)(_templateObject2(), until_m(this._svgIcon, // To reserve space, we need an empty svg to apply dimension to.
        (0,lit/* html */.dy)(_templateObject1())));
    }
    constructor(){
        super(...arguments), this._svgNamespace = icon_n._defaultNamespace, this.noSanitize = !1;
    }
};
icon_n.styles = x;
icon_n._defaultNamespace = "default";
icon_d([
    (0,decorators/* state */.SB)()
], icon_n.prototype, "_svgNamespace", 2);
icon_d([
    (0,decorators/* state */.SB)()
], icon_n.prototype, "_svgIcon", 2);
icon_d([
    (0,decorators/* property */.Cb)({
        attribute: "no-sanitize",
        type: Boolean
    })
], icon_n.prototype, "noSanitize", 2);
icon_n = icon_d([
    (0,core_decorators/* hostAttributes */.f)({
        "data-namespace": icon_n._defaultNamespace,
        "data-empty": ""
    })
], icon_n);
var U = Object.defineProperty, icon_j = Object.getOwnPropertyDescriptor, w = (e, t, o, r)=>{
    for(var s = r > 1 ? void 0 : r ? icon_j(t, o) : t, i = e.length - 1, a; i >= 0; i--)(a = e[i]) && (s = (r ? a(t, o, s) : a(s)) || s);
    return r && s && U(t, o, s), s;
};
let icon_f = class extends icon_n {
    async fetchSvgIcon(e, t) {
        return this.getAttribute("aria-label") === this._defaultAriaLabel && this.removeAttribute("aria-label"), this._defaultAriaLabel = "Icon ".concat(t.replace(/-/g, " ")), this.getAttribute("aria-hidden") === "false" && !this.hasAttribute("aria-label") && t && this.setAttribute("aria-label", this._defaultAriaLabel), super.fetchSvgIcon(e, t);
    }
    willUpdate(e) {
        super.willUpdate(e), e.has("name") && this.loadSvgIcon(this.name);
    }
    firstUpdated(e) {
        super.firstUpdated(e), this.hasAttribute("aria-hidden") || this.setAttribute("aria-hidden", "true");
    }
    constructor(){
        super(...arguments), this._defaultAriaLabel = "";
    }
};
w([
    (0,decorators/* property */.Cb)({
        reflect: !0
    })
], icon_f.prototype, "name", 2);
icon_f = w([
    (0,decorators/* customElement */.Mo)("sbb-icon")
], icon_f);
var T = Object.defineProperty, q = (e, t, o, r)=>{
    for(var s = void 0, i = e.length - 1, a; i >= 0; i--)(a = e[i]) && (s = a(t, o, s) || s);
    return s && T(t, o, s), s;
};
const J = (e)=>{
    class t extends e {
        renderIconSlot(r) {
            return (0,lit/* html */.dy)(_templateObject4(), this.iconName ? (0,lit/* html */.dy)(_templateObject3(), this.iconName, r || lit/* nothing */.Ld) : lit/* nothing */.Ld);
        }
    }
    return q([
        (0,decorators/* property */.Cb)({
            attribute: "icon-name",
            reflect: !0
        })
    ], t.prototype, "iconName"), t;
};



/***/ }),

/***/ 8646:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: function() { return /* binding */ _tagged_template_literal; }
/* harmony export */ });
/* unused harmony export _tagged_template_literal */
function _tagged_template_literal(strings, raw) {
    if (!raw) raw = strings.slice(0);

    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}



/***/ }),

/***/ 7252:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Mo: function() { return /* reexport */ t; },
  Cb: function() { return /* reexport */ n; },
  SB: function() { return /* reexport */ state_r; }
});

// UNUSED EXPORTS: eventOptions, query, queryAll, queryAssignedElements, queryAssignedNodes, queryAsync, standardProperty

;// CONCATENATED MODULE: ./node_modules/lit/node_modules/@lit/reactive-element/decorators/custom-element.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const t = (t)=>(e, o)=>{
        void 0 !== o ? o.addInitializer(()=>{
            customElements.define(t, e);
        }) : customElements.define(t, e);
    };
 //# sourceMappingURL=custom-element.js.map

// EXTERNAL MODULE: ./node_modules/lit/node_modules/@lit/reactive-element/reactive-element.js + 1 modules
var reactive_element = __webpack_require__(9450);
;// CONCATENATED MODULE: ./node_modules/lit/node_modules/@lit/reactive-element/decorators/property.js

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const o = {
    attribute: !0,
    type: String,
    converter: reactive_element/* defaultConverter */.Ts,
    reflect: !1,
    hasChanged: reactive_element/* notEqual */.Qu
}, r = function() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : o, e = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0;
    const { kind: n, metadata: i } = r;
    let s = globalThis.litPropertyMetadata.get(i);
    if (void 0 === s && globalThis.litPropertyMetadata.set(i, s = new Map), s.set(r.name, t), "accessor" === n) {
        const { name: o } = r;
        return {
            set (r) {
                const n = e.get.call(this);
                e.set.call(this, r), this.requestUpdate(o, n, t);
            },
            init (e) {
                return void 0 !== e && this.P(o, void 0, t), e;
            }
        };
    }
    if ("setter" === n) {
        const { name: o } = r;
        return function(r) {
            const n = this[o];
            e.call(this, r), this.requestUpdate(o, n, t);
        };
    }
    throw Error("Unsupported decorator location: " + n);
};
function n(t) {
    return (e, o)=>"object" == typeof o ? r(t, e, o) : ((t, e, o)=>{
            const r = e.hasOwnProperty(o);
            return e.constructor.createProperty(o, r ? {
                ...t,
                wrapped: !0
            } : t), r ? Object.getOwnPropertyDescriptor(e, o) : void 0;
        })(t, e, o);
}
 //# sourceMappingURL=property.js.map

;// CONCATENATED MODULE: ./node_modules/lit/node_modules/@lit/reactive-element/decorators/state.js

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function state_r(r) {
    return n({
        ...r,
        state: !0,
        attribute: !1
    });
}
 //# sourceMappingURL=state.js.map

;// CONCATENATED MODULE: ./node_modules/lit/decorators.js








 //# sourceMappingURL=decorators.js.map


/***/ }),

/***/ 8620:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  oi: function() { return /* reexport */ s; },
  iv: function() { return /* reexport */ reactive_element/* css */.iv; },
  dy: function() { return /* reexport */ lit_html/* html */.dy; },
  sk: function() { return /* reexport */ is_server_o; },
  Ld: function() { return /* reexport */ lit_html/* nothing */.Ld; }
});

// UNUSED EXPORTS: CSSResult, ReactiveElement, _$LE, _$LH, adoptStyles, defaultConverter, getCompatibleStyle, noChange, notEqual, render, supportsAdoptingStyleSheets, svg, unsafeCSS

// EXTERNAL MODULE: ./node_modules/lit/node_modules/@lit/reactive-element/reactive-element.js + 1 modules
var reactive_element = __webpack_require__(9450);
// EXTERNAL MODULE: ./node_modules/lit/node_modules/lit-html/lit-html.js
var lit_html = __webpack_require__(2558);
;// CONCATENATED MODULE: ./node_modules/lit/node_modules/lit-element/lit-element.js
var _globalThis_litElementHydrateSupport, _globalThis;
var _globalThis1;




/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class s extends reactive_element/* ReactiveElement */.fl {
    createRenderRoot() {
        var _this_renderOptions;
        const t = super.createRenderRoot();
        var _renderBefore;
        return (_renderBefore = (_this_renderOptions = this.renderOptions).renderBefore) !== null && _renderBefore !== void 0 ? _renderBefore : _this_renderOptions.renderBefore = t.firstChild, t;
    }
    update(t) {
        const i = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = (0,lit_html/* render */.sY)(i, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
        var _this__$Do;
        super.connectedCallback(), (_this__$Do = this._$Do) === null || _this__$Do === void 0 ? void 0 : _this__$Do.setConnected(!0);
    }
    disconnectedCallback() {
        var _this__$Do;
        super.disconnectedCallback(), (_this__$Do = this._$Do) === null || _this__$Do === void 0 ? void 0 : _this__$Do.setConnected(!1);
    }
    render() {
        return lit_html/* noChange */.Jb;
    }
    constructor(){
        super(...arguments), this.renderOptions = {
            host: this
        }, this._$Do = void 0;
    }
}
s._$litElement$ = !0, s["finalized", "finalized"] = !0, (_globalThis_litElementHydrateSupport = (_globalThis = globalThis).litElementHydrateSupport) === null || _globalThis_litElementHydrateSupport === void 0 ? void 0 : _globalThis_litElementHydrateSupport.call(_globalThis, {
    LitElement: s
});
const r = globalThis.litElementPolyfillSupport;
r === null || r === void 0 ? void 0 : r({
    LitElement: s
});
const o = {
    _$AK: (t, e, i)=>{
        t._$AK(e, i);
    },
    _$AL: (t)=>t._$AL
};
var _litElementVersions;
((_litElementVersions = (_globalThis1 = globalThis).litElementVersions) !== null && _litElementVersions !== void 0 ? _litElementVersions : _globalThis1.litElementVersions = []).push("4.0.5");
 //# sourceMappingURL=lit-element.js.map

;// CONCATENATED MODULE: ./node_modules/lit/node_modules/lit-html/is-server.js
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const is_server_o = !1;
 //# sourceMappingURL=is-server.js.map

;// CONCATENATED MODULE: ./node_modules/lit/index.js



 //# sourceMappingURL=index.js.map


/***/ }),

/***/ 9450:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  fl: function() { return /* binding */ b; },
  iv: function() { return /* reexport */ i; },
  Ts: function() { return /* binding */ u; },
  Qu: function() { return /* binding */ f; }
});

// UNUSED EXPORTS: CSSResult, adoptStyles, getCompatibleStyle, supportsAdoptingStyleSheets, unsafeCSS

;// CONCATENATED MODULE: ./node_modules/lit/node_modules/@lit/reactive-element/css-tag.js
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const t = globalThis, e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s = Symbol(), o = new WeakMap;
class n {
    get styleSheet() {
        let t = this.o;
        const s = this.t;
        if (e && void 0 === t) {
            const e = void 0 !== s && 1 === s.length;
            e && (t = o.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet).replaceSync(this.cssText), e && o.set(s, t));
        }
        return t;
    }
    toString() {
        return this.cssText;
    }
    constructor(t, e, o){
        if (this._$cssResult$ = !0, o !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t, this.t = e;
    }
}
const r = (t)=>new n("string" == typeof t ? t : t + "", void 0, s), i = function(t) {
    for(var _len = arguments.length, e = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        e[_key - 1] = arguments[_key];
    }
    const o = 1 === t.length ? t[0] : e.reduce((e, s, o)=>e + ((t)=>{
            if (!0 === t._$cssResult$) return t.cssText;
            if ("number" == typeof t) return t;
            throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
        })(s) + t[o + 1], t[0]);
    return new n(o, t, s);
}, S = (s, o)=>{
    if (e) s.adoptedStyleSheets = o.map((t)=>t instanceof CSSStyleSheet ? t : t.styleSheet);
    else for (const e of o){
        const o = document.createElement("style"), n = t.litNonce;
        void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
    }
}, c = e ? (t)=>t : (t)=>t instanceof CSSStyleSheet ? ((t)=>{
        let e = "";
        for (const s of t.cssRules)e += s.cssText;
        return r(e);
    })(t) : t;
 //# sourceMappingURL=css-tag.js.map

;// CONCATENATED MODULE: ./node_modules/lit/node_modules/@lit/reactive-element/reactive-element.js
var _Symbol, _a, _a1;


/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const { is: reactive_element_i, defineProperty: reactive_element_e, getOwnPropertyDescriptor: reactive_element_r, getOwnPropertyNames: h, getOwnPropertySymbols: reactive_element_o, getPrototypeOf: reactive_element_n } = Object, a = globalThis, reactive_element_c = a.trustedTypes, l = reactive_element_c ? reactive_element_c.emptyScript : "", p = a.reactiveElementPolyfillSupport, d = (t, s)=>t, u = {
    toAttribute (t, s) {
        switch(s){
            case Boolean:
                t = t ? l : null;
                break;
            case Object:
            case Array:
                t = null == t ? t : JSON.stringify(t);
        }
        return t;
    },
    fromAttribute (t, s) {
        let i = t;
        switch(s){
            case Boolean:
                i = null !== t;
                break;
            case Number:
                i = null === t ? null : Number(t);
                break;
            case Object:
            case Array:
                try {
                    i = JSON.parse(t);
                } catch (t) {
                    i = null;
                }
        }
        return i;
    }
}, f = (t, s)=>!reactive_element_i(t, s), y = {
    attribute: !0,
    type: String,
    converter: u,
    reflect: !1,
    hasChanged: f
};
var _metadata, _litPropertyMetadata;
(_metadata = (_Symbol = Symbol).metadata) !== null && _metadata !== void 0 ? _metadata : _Symbol.metadata = Symbol("metadata"), (_litPropertyMetadata = (_a = a).litPropertyMetadata) !== null && _litPropertyMetadata !== void 0 ? _litPropertyMetadata : _a.litPropertyMetadata = new WeakMap;
class b extends HTMLElement {
    static addInitializer(t) {
        var _this_l;
        this._$Ei(), ((_this_l = this.l) !== null && _this_l !== void 0 ? _this_l : this.l = []).push(t);
    }
    static get observedAttributes() {
        return this.finalize(), this._$Eh && [
            ...this._$Eh.keys()
        ];
    }
    static createProperty(t) {
        let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : y;
        if (s.state && (s.attribute = !1), this._$Ei(), this.elementProperties.set(t, s), !s.noAccessor) {
            const i = Symbol(), r = this.getPropertyDescriptor(t, i, s);
            void 0 !== r && reactive_element_e(this.prototype, t, r);
        }
    }
    static getPropertyDescriptor(t, s, i) {
        var _r;
        const { get: e, set: h } = (_r = reactive_element_r(this.prototype, t)) !== null && _r !== void 0 ? _r : {
            get () {
                return this[s];
            },
            set (t) {
                this[s] = t;
            }
        };
        return {
            get () {
                return e === null || e === void 0 ? void 0 : e.call(this);
            },
            set (s) {
                const r = e === null || e === void 0 ? void 0 : e.call(this);
                h.call(this, s), this.requestUpdate(t, r, i);
            },
            configurable: !0,
            enumerable: !0
        };
    }
    static getPropertyOptions(t) {
        var _this_elementProperties_get;
        return (_this_elementProperties_get = this.elementProperties.get(t)) !== null && _this_elementProperties_get !== void 0 ? _this_elementProperties_get : y;
    }
    static _$Ei() {
        if (this.hasOwnProperty(d("elementProperties"))) return;
        const t = reactive_element_n(this);
        t.finalize(), void 0 !== t.l && (this.l = [
            ...t.l
        ]), this.elementProperties = new Map(t.elementProperties);
    }
    static finalize() {
        if (this.hasOwnProperty(d("finalized"))) return;
        if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(d("properties"))) {
            const t = this.properties, s = [
                ...h(t),
                ...reactive_element_o(t)
            ];
            for (const i of s)this.createProperty(i, t[i]);
        }
        const t = this[Symbol.metadata];
        if (null !== t) {
            const s = litPropertyMetadata.get(t);
            if (void 0 !== s) for (const [t, i] of s)this.elementProperties.set(t, i);
        }
        this._$Eh = new Map;
        for (const [t, s] of this.elementProperties){
            const i = this._$Eu(t, s);
            void 0 !== i && this._$Eh.set(i, t);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s) {
        const i = [];
        if (Array.isArray(s)) {
            const e = new Set(s.flat(1 / 0).reverse());
            for (const s of e)i.unshift(c(s));
        } else void 0 !== s && i.push(c(s));
        return i;
    }
    static _$Eu(t, s) {
        const i = s.attribute;
        return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
    }
    _$Ev() {
        var _this_constructor_l;
        this._$ES = new Promise((t)=>this.enableUpdating = t), this._$AL = new Map, this._$E_(), this.requestUpdate(), (_this_constructor_l = this.constructor.l) === null || _this_constructor_l === void 0 ? void 0 : _this_constructor_l.forEach((t)=>t(this));
    }
    addController(t) {
        var _t_hostConnected;
        var _this__$EO;
        ((_this__$EO = this._$EO) !== null && _this__$EO !== void 0 ? _this__$EO : this._$EO = new Set).add(t), void 0 !== this.renderRoot && this.isConnected && ((_t_hostConnected = t.hostConnected) === null || _t_hostConnected === void 0 ? void 0 : _t_hostConnected.call(t));
    }
    removeController(t) {
        var _this__$EO;
        (_this__$EO = this._$EO) === null || _this__$EO === void 0 ? void 0 : _this__$EO.delete(t);
    }
    _$E_() {
        const t = new Map, s = this.constructor.elementProperties;
        for (const i of s.keys())this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
        t.size > 0 && (this._$Ep = t);
    }
    createRenderRoot() {
        var _this_shadowRoot;
        const t = (_this_shadowRoot = this.shadowRoot) !== null && _this_shadowRoot !== void 0 ? _this_shadowRoot : this.attachShadow(this.constructor.shadowRootOptions);
        return S(t, this.constructor.elementStyles), t;
    }
    connectedCallback() {
        var _this__$EO;
        var _this_renderRoot;
        (_this_renderRoot = this.renderRoot) !== null && _this_renderRoot !== void 0 ? _this_renderRoot : this.renderRoot = this.createRenderRoot(), this.enableUpdating(!0), (_this__$EO = this._$EO) === null || _this__$EO === void 0 ? void 0 : _this__$EO.forEach((t)=>{
            var _t_hostConnected;
            return (_t_hostConnected = t.hostConnected) === null || _t_hostConnected === void 0 ? void 0 : _t_hostConnected.call(t);
        });
    }
    enableUpdating(t) {}
    disconnectedCallback() {
        var _this__$EO;
        (_this__$EO = this._$EO) === null || _this__$EO === void 0 ? void 0 : _this__$EO.forEach((t)=>{
            var _t_hostDisconnected;
            return (_t_hostDisconnected = t.hostDisconnected) === null || _t_hostDisconnected === void 0 ? void 0 : _t_hostDisconnected.call(t);
        });
    }
    attributeChangedCallback(t, s, i) {
        this._$AK(t, i);
    }
    _$EC(t, s) {
        const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
        if (void 0 !== e && !0 === i.reflect) {
            var _i_converter;
            const r = (void 0 !== ((_i_converter = i.converter) === null || _i_converter === void 0 ? void 0 : _i_converter.toAttribute) ? i.converter : u).toAttribute(s, i.type);
            this._$Em = t, null == r ? this.removeAttribute(e) : this.setAttribute(e, r), this._$Em = null;
        }
    }
    _$AK(t, s) {
        const i = this.constructor, e = i._$Eh.get(t);
        if (void 0 !== e && this._$Em !== e) {
            var _t_converter;
            const t = i.getPropertyOptions(e), r = "function" == typeof t.converter ? {
                fromAttribute: t.converter
            } : void 0 !== ((_t_converter = t.converter) === null || _t_converter === void 0 ? void 0 : _t_converter.fromAttribute) ? t.converter : u;
            this._$Em = e, this[e] = r.fromAttribute(s, t.type), this._$Em = null;
        }
    }
    requestUpdate(t, s, i) {
        if (void 0 !== t) {
            var _i_hasChanged;
            if (i !== null && i !== void 0 ? i : i = this.constructor.getPropertyOptions(t), !((_i_hasChanged = i.hasChanged) !== null && _i_hasChanged !== void 0 ? _i_hasChanged : f)(this[t], s)) return;
            this.P(t, s, i);
        }
        !1 === this.isUpdatePending && (this._$ES = this._$ET());
    }
    P(t, s, i) {
        var _this__$Ej;
        this._$AL.has(t) || this._$AL.set(t, s), !0 === i.reflect && this._$Em !== t && ((_this__$Ej = this._$Ej) !== null && _this__$Ej !== void 0 ? _this__$Ej : this._$Ej = new Set).add(t);
    }
    async _$ET() {
        this.isUpdatePending = !0;
        try {
            await this._$ES;
        } catch (t) {
            Promise.reject(t);
        }
        const t = this.scheduleUpdate();
        return null != t && await t, !this.isUpdatePending;
    }
    scheduleUpdate() {
        return this.performUpdate();
    }
    performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
            var _this_renderRoot;
            if ((_this_renderRoot = this.renderRoot) !== null && _this_renderRoot !== void 0 ? _this_renderRoot : this.renderRoot = this.createRenderRoot(), this._$Ep) {
                for (const [t, s] of this._$Ep)this[t] = s;
                this._$Ep = void 0;
            }
            const t = this.constructor.elementProperties;
            if (t.size > 0) for (const [s, i] of t)!0 !== i.wrapped || this._$AL.has(s) || void 0 === this[s] || this.P(s, this[s], i);
        }
        let t = !1;
        const s = this._$AL;
        try {
            var _this__$EO;
            t = this.shouldUpdate(s), t ? (this.willUpdate(s), (_this__$EO = this._$EO) === null || _this__$EO === void 0 ? void 0 : _this__$EO.forEach((t)=>{
                var _t_hostUpdate;
                return (_t_hostUpdate = t.hostUpdate) === null || _t_hostUpdate === void 0 ? void 0 : _t_hostUpdate.call(t);
            }), this.update(s)) : this._$EU();
        } catch (s) {
            throw t = !1, this._$EU(), s;
        }
        t && this._$AE(s);
    }
    willUpdate(t) {}
    _$AE(t) {
        var _this__$EO;
        (_this__$EO = this._$EO) === null || _this__$EO === void 0 ? void 0 : _this__$EO.forEach((t)=>{
            var _t_hostUpdated;
            return (_t_hostUpdated = t.hostUpdated) === null || _t_hostUpdated === void 0 ? void 0 : _t_hostUpdated.call(t);
        }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
    }
    _$EU() {
        this._$AL = new Map, this.isUpdatePending = !1;
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this._$ES;
    }
    shouldUpdate(t) {
        return !0;
    }
    update(t) {
        this._$Ej && (this._$Ej = this._$Ej.forEach((t)=>this._$EC(t, this[t]))), this._$EU();
    }
    updated(t) {}
    firstUpdated(t) {}
    constructor(){
        super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
    }
}
var _reactiveElementVersions;
b.elementStyles = [], b.shadowRootOptions = {
    mode: "open"
}, b[d("elementProperties")] = new Map, b[d("finalized")] = new Map, p === null || p === void 0 ? void 0 : p({
    ReactiveElement: b
}), ((_reactiveElementVersions = (_a1 = a).reactiveElementVersions) !== null && _reactiveElementVersions !== void 0 ? _reactiveElementVersions : _a1.reactiveElementVersions = []).push("2.0.4");
 //# sourceMappingURL=reactive-element.js.map


/***/ }),

/***/ 2558:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Jb: function() { return /* binding */ w; },
/* harmony export */   Ld: function() { return /* binding */ T; },
/* harmony export */   YP: function() { return /* binding */ b; },
/* harmony export */   _$LH: function() { return /* binding */ z; },
/* harmony export */   dy: function() { return /* binding */ x; },
/* harmony export */   sY: function() { return /* binding */ j; }
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var _t;
const t = globalThis, i = t.trustedTypes, s = i ? i.createPolicy("lit-html", {
    createHTML: (t)=>t
}) : void 0, e = "$lit$", h = "lit$".concat(Math.random().toFixed(9).slice(2), "$"), o = "?" + h, n = "<".concat(o, ">"), r = document, l = ()=>r.createComment(""), c = (t)=>null === t || "object" != typeof t && "function" != typeof t, a = Array.isArray, u = (t)=>a(t) || "function" == typeof (t === null || t === void 0 ? void 0 : t[Symbol.iterator]), d = "[ 	\n\f\r]", f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, _ = />/g, m = RegExp(">|".concat(d, "(?:([^\\s\"'>=/]+)(").concat(d, "*=").concat(d, "*(?:[^ 	\n\f\r\"'`<>=]|(\"|')|))|$)"), "g"), p = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y = (t)=>function(i) {
        for(var _len = arguments.length, s = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            s[_key - 1] = arguments[_key];
        }
        return {
            _$litType$: t,
            strings: i,
            values: s
        };
    }, x = y(1), b = y(2), w = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), A = new WeakMap, E = r.createTreeWalker(r, 129);
function C(t, i) {
    if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== s ? s.createHTML(i) : i;
}
const P = (t, i)=>{
    const s = t.length - 1, o = [];
    let r, l = 2 === i ? "<svg>" : "", c = f;
    for(let i = 0; i < s; i++){
        const s = t[i];
        let a, u, d = -1, y = 0;
        for(; y < s.length && (c.lastIndex = y, u = c.exec(s), null !== u);)y = c.lastIndex, c === f ? "!--" === u[1] ? c = v : void 0 !== u[1] ? c = _ : void 0 !== u[2] ? ($.test(u[2]) && (r = RegExp("</" + u[2], "g")), c = m) : void 0 !== u[3] && (c = m) : c === m ? ">" === u[0] ? (c = r !== null && r !== void 0 ? r : f, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? m : '"' === u[3] ? g : p) : c === g || c === p ? c = m : c === v || c === _ ? c = f : (c = m, r = void 0);
        const x = c === m && t[i + 1].startsWith("/>") ? " " : "";
        l += c === f ? s + n : d >= 0 ? (o.push(a), s.slice(0, d) + e + s.slice(d) + h + x) : s + h + (-2 === d ? i : x);
    }
    return [
        C(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : "")),
        o
    ];
};
class V {
    static createElement(t, i) {
        const s = r.createElement("template");
        return s.innerHTML = t, s;
    }
    constructor({ strings: t, _$litType$: s }, n){
        let r;
        this.parts = [];
        let c = 0, a = 0;
        const u = t.length - 1, d = this.parts, [f, v] = P(t, s);
        if (this.el = V.createElement(f, n), E.currentNode = this.el.content, 2 === s) {
            const t = this.el.content.firstChild;
            t.replaceWith(...t.childNodes);
        }
        for(; null !== (r = E.nextNode()) && d.length < u;){
            if (1 === r.nodeType) {
                if (r.hasAttributes()) for (const t of r.getAttributeNames())if (t.endsWith(e)) {
                    const i = v[a++], s = r.getAttribute(t).split(h), e = /([.?@])?(.*)/.exec(i);
                    d.push({
                        type: 1,
                        index: c,
                        name: e[2],
                        strings: s,
                        ctor: "." === e[1] ? k : "?" === e[1] ? H : "@" === e[1] ? I : R
                    }), r.removeAttribute(t);
                } else t.startsWith(h) && (d.push({
                    type: 6,
                    index: c
                }), r.removeAttribute(t));
                if ($.test(r.tagName)) {
                    const t = r.textContent.split(h), s = t.length - 1;
                    if (s > 0) {
                        r.textContent = i ? i.emptyScript : "";
                        for(let i = 0; i < s; i++)r.append(t[i], l()), E.nextNode(), d.push({
                            type: 2,
                            index: ++c
                        });
                        r.append(t[s], l());
                    }
                }
            } else if (8 === r.nodeType) if (r.data === o) d.push({
                type: 2,
                index: c
            });
            else {
                let t = -1;
                for(; -1 !== (t = r.data.indexOf(h, t + 1));)d.push({
                    type: 7,
                    index: c
                }), t += h.length - 1;
            }
            c++;
        }
    }
}
function N(t, i) {
    let s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : t, e = arguments.length > 3 ? arguments[3] : void 0;
    var _s__$Co, _h__$AO;
    var _s;
    if (i === w) return i;
    let h = void 0 !== e ? (_s__$Co = s._$Co) === null || _s__$Co === void 0 ? void 0 : _s__$Co[e] : s._$Cl;
    const o = c(i) ? void 0 : i._$litDirective$;
    var __$Co;
    return (h === null || h === void 0 ? void 0 : h.constructor) !== o && (h === null || h === void 0 ? void 0 : (_h__$AO = h._$AO) === null || _h__$AO === void 0 ? void 0 : _h__$AO.call(h, !1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? ((__$Co = (_s = s)._$Co) !== null && __$Co !== void 0 ? __$Co : _s._$Co = [])[e] = h : s._$Cl = h), void 0 !== h && (i = N(t, h._$AS(t, i.values), h, e)), i;
}
class S {
    get parentNode() {
        return this._$AM.parentNode;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    u(t) {
        var _t_creationScope;
        const { el: { content: i }, parts: s } = this._$AD, e = ((_t_creationScope = t === null || t === void 0 ? void 0 : t.creationScope) !== null && _t_creationScope !== void 0 ? _t_creationScope : r).importNode(i, !0);
        E.currentNode = e;
        let h = E.nextNode(), o = 0, n = 0, l = s[0];
        for(; void 0 !== l;){
            if (o === l.index) {
                let i;
                2 === l.type ? i = new M(h, h.nextSibling, this, t) : 1 === l.type ? i = new l.ctor(h, l.name, l.strings, this, t) : 6 === l.type && (i = new L(h, this, t)), this._$AV.push(i), l = s[++n];
            }
            o !== (l === null || l === void 0 ? void 0 : l.index) && (h = E.nextNode(), o++);
        }
        return E.currentNode = r, e;
    }
    p(t) {
        let i = 0;
        for (const s of this._$AV)void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
    }
    constructor(t, i){
        this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
    }
}
class M {
    get _$AU() {
        var _this__$AM;
        var _this__$AM__$AU;
        return (_this__$AM__$AU = (_this__$AM = this._$AM) === null || _this__$AM === void 0 ? void 0 : _this__$AM._$AU) !== null && _this__$AM__$AU !== void 0 ? _this__$AM__$AU : this._$Cv;
    }
    get parentNode() {
        let t = this._$AA.parentNode;
        const i = this._$AM;
        return void 0 !== i && 11 === (t === null || t === void 0 ? void 0 : t.nodeType) && (t = i.parentNode), t;
    }
    get startNode() {
        return this._$AA;
    }
    get endNode() {
        return this._$AB;
    }
    _$AI(t) {
        let i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this;
        t = N(this, t, i), c(t) ? t === T || null == t || "" === t ? (this._$AH !== T && this._$AR(), this._$AH = T) : t !== this._$AH && t !== w && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : u(t) ? this.k(t) : this._(t);
    }
    S(t) {
        return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
        this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
    }
    _(t) {
        this._$AH !== T && c(this._$AH) ? this._$AA.nextSibling.data = t : this.T(r.createTextNode(t)), this._$AH = t;
    }
    $(t) {
        var _this__$AH;
        const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = V.createElement(C(s.h, s.h[0]), this.options)), s);
        if (((_this__$AH = this._$AH) === null || _this__$AH === void 0 ? void 0 : _this__$AH._$AD) === e) this._$AH.p(i);
        else {
            const t = new S(e, this), s = t.u(this.options);
            t.p(i), this.T(s), this._$AH = t;
        }
    }
    _$AC(t) {
        let i = A.get(t.strings);
        return void 0 === i && A.set(t.strings, i = new V(t)), i;
    }
    k(t) {
        a(this._$AH) || (this._$AH = [], this._$AR());
        const i = this._$AH;
        let s, e = 0;
        for (const h of t)e === i.length ? i.push(s = new M(this.S(l()), this.S(l()), this, this.options)) : s = i[e], s._$AI(h), e++;
        e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
    }
    _$AR() {
        let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this._$AA.nextSibling, i = arguments.length > 1 ? arguments[1] : void 0;
        var _this__$AP, _this;
        for((_this__$AP = (_this = this)._$AP) === null || _this__$AP === void 0 ? void 0 : _this__$AP.call(_this, !1, !0, i); t && t !== this._$AB;){
            const i = t.nextSibling;
            t.remove(), t = i;
        }
    }
    setConnected(t) {
        var _this__$AP, _this;
        void 0 === this._$AM && (this._$Cv = t, (_this__$AP = (_this = this)._$AP) === null || _this__$AP === void 0 ? void 0 : _this__$AP.call(_this, t));
    }
    constructor(t, i, s, e){
        var _e_isConnected;
        this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = (_e_isConnected = e === null || e === void 0 ? void 0 : e.isConnected) !== null && _e_isConnected !== void 0 ? _e_isConnected : !0;
    }
}
class R {
    get tagName() {
        return this.element.tagName;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t) {
        let i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this, s = arguments.length > 2 ? arguments[2] : void 0, e = arguments.length > 3 ? arguments[3] : void 0;
        const h = this.strings;
        let o = !1;
        if (void 0 === h) t = N(this, t, i, 0), o = !c(t) || t !== this._$AH && t !== w, o && (this._$AH = t);
        else {
            const e = t;
            let n, r;
            for(t = h[0], n = 0; n < h.length - 1; n++)r = N(this, e[s + n], i, n), r === w && (r = this._$AH[n]), o || (o = !c(r) || r !== this._$AH[n]), r === T ? t = T : t !== T && (t += (r !== null && r !== void 0 ? r : "") + h[n + 1]), this._$AH[n] = r;
        }
        o && !e && this.j(t);
    }
    j(t) {
        t === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t !== null && t !== void 0 ? t : "");
    }
    constructor(t, i, s, e, h){
        this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String), this.strings = s) : this._$AH = T;
    }
}
class k extends R {
    j(t) {
        this.element[this.name] = t === T ? void 0 : t;
    }
    constructor(){
        super(...arguments), this.type = 3;
    }
}
class H extends R {
    j(t) {
        this.element.toggleAttribute(this.name, !!t && t !== T);
    }
    constructor(){
        super(...arguments), this.type = 4;
    }
}
class I extends R {
    _$AI(t) {
        let i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this;
        var _N;
        if ((t = (_N = N(this, t, i, 0)) !== null && _N !== void 0 ? _N : T) === w) return;
        const s = this._$AH, e = t === T && s !== T || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== T && (s === T || e);
        e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
        var _this_options;
        var _this_options_host;
        "function" == typeof this._$AH ? this._$AH.call((_this_options_host = (_this_options = this.options) === null || _this_options === void 0 ? void 0 : _this_options.host) !== null && _this_options_host !== void 0 ? _this_options_host : this.element, t) : this._$AH.handleEvent(t);
    }
    constructor(t, i, s, e, h){
        super(t, i, s, e, h), this.type = 5;
    }
}
class L {
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t) {
        N(this, t);
    }
    constructor(t, i, s){
        this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
    }
}
const z = {
    P: e,
    A: h,
    C: o,
    M: 1,
    L: P,
    R: S,
    D: u,
    V: N,
    I: M,
    H: R,
    N: H,
    U: I,
    B: k,
    F: L
}, Z = t.litHtmlPolyfillSupport;
var _litHtmlVersions;
Z === null || Z === void 0 ? void 0 : Z(V, M), ((_litHtmlVersions = (_t = t).litHtmlVersions) !== null && _litHtmlVersions !== void 0 ? _litHtmlVersions : _t.litHtmlVersions = []).push("3.1.3");
const j = (t, i, s)=>{
    var _s_renderBefore;
    const e = (_s_renderBefore = s === null || s === void 0 ? void 0 : s.renderBefore) !== null && _s_renderBefore !== void 0 ? _s_renderBefore : i;
    let h = e._$litPart$;
    if (void 0 === h) {
        var _s_renderBefore1;
        const t = (_s_renderBefore1 = s === null || s === void 0 ? void 0 : s.renderBefore) !== null && _s_renderBefore1 !== void 0 ? _s_renderBefore1 : null;
        e._$litPart$ = h = new M(i.insertBefore(l(), t), t, void 0, s !== null && s !== void 0 ? s : {});
    }
    return h._$AI(t), h;
};
 //# sourceMappingURL=lit-html.js.map


/***/ })

}]);