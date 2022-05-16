(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [888],
    {
        /***/ 7689: /***/ function (module) {
            // this file was prevaled
            // This file needs to be a JavaScript file using CommonJS to be compatible with preval
            // Cache bust: 2022-03-24 12:00:00 GMT (This file is cached by our deployment tooling, update this timestamp to rebuild this file)
            module.exports = {
                theme: {
                    animation: {
                        easeOutCubic: "cubic-bezier(0.33, 1, 0.68, 1)",
                    },
                    borderWidths: [0, "1px"],
                    breakpoints: ["544px", "768px", "1012px", "1280px"],
                    fonts: {
                        normal: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
                        mono: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
                    },
                    fontSizes: [
                        "12px",
                        "14px",
                        "16px",
                        "20px",
                        "24px",
                        "32px",
                        "40px",
                        "48px",
                    ],
                    fontWeights: {
                        light: 300,
                        normal: 400,
                        semibold: 500,
                        bold: 600,
                    },
                    lineHeights: {
                        condensedUltra: 1,
                        condensed: 1.25,
                        default: 1.5,
                    },
                    radii: ["0", "3px", "6px", "100px"],
                    sizes: {
                        small: "544px",
                        medium: "768px",
                        large: "1012px",
                        xlarge: "1280px",
                    },
                    space: [
                        "0",
                        "4px",
                        "8px",
                        "16px",
                        "24px",
                        "32px",
                        "40px",
                        "48px",
                        "64px",
                        "80px",
                        "96px",
                        "112px",
                        "128px",
                    ],
                    colorSchemes: {
                        light: {
                            colors: {
                                canvasDefaultTransparent: "rgba(255,255,255,0)",
                                pageHeaderBg: "#f6f8fa",
                                marketingIcon: {
                                    primary: "#218bff",
                                    secondary: "#54aeff",
                                },
                                diffBlob: {
                                    addition: {
                                        numText: "#24292f",
                                        fg: "#24292f",
                                        numBg: "#CCFFD8",
                                        lineBg: "#E6FFEC",
                                        wordBg: "#ABF2BC",
                                    },
                                    deletion: {
                                        numText: "#24292f",
                                        fg: "#24292f",
                                        numBg: "#FFD7D5",
                                        lineBg: "#FFEBE9",
                                        wordBg: "rgba(255,129,130,0.4)",
                                    },
                                    hunk: {
                                        numBg: "rgba(84,174,255,0.4)",
                                    },
                                    expander: {
                                        icon: "#57606a",
                                    },
                                },
                                diffstat: {
                                    deletionBorder: "rgba(27,31,36,0.15)",
                                    additionBorder: "rgba(27,31,36,0.15)",
                                    additionBg: "#2da44e",
                                },
                                searchKeyword: {
                                    hl: "#fff8c5",
                                },
                                prettylights: {
                                    syntax: {
                                        comment: "#6e7781",
                                        constant: "#0550ae",
                                        entity: "#8250df",
                                        storageModifierImport: "#24292f",
                                        entityTag: "#116329",
                                        keyword: "#cf222e",
                                        string: "#0a3069",
                                        variable: "#953800",
                                        brackethighlighterUnmatched: "#82071e",
                                        invalidIllegalText: "#f6f8fa",
                                        invalidIllegalBg: "#82071e",
                                        carriageReturnText: "#f6f8fa",
                                        carriageReturnBg: "#cf222e",
                                        stringRegexp: "#116329",
                                        markupList: "#3b2300",
                                        markupHeading: "#0550ae",
                                        markupItalic: "#24292f",
                                        markupBold: "#24292f",
                                        markupDeletedText: "#82071e",
                                        markupDeletedBg: "#FFEBE9",
                                        markupInsertedText: "#116329",
                                        markupInsertedBg: "#dafbe1",
                                        markupChangedText: "#953800",
                                        markupChangedBg: "#ffd8b5",
                                        markupIgnoredText: "#eaeef2",
                                        markupIgnoredBg: "#0550ae",
                                        metaDiffRange: "#8250df",
                                        brackethighlighterAngle: "#57606a",
                                        sublimelinterGutterMark: "#8c959f",
                                        constantOtherReferenceLink: "#0a3069",
                                    },
                                },
                                codemirror: {
                                    text: "#24292f",
                                    bg: "#ffffff",
                                    guttersBg: "#ffffff",
                                    guttermarkerText: "#ffffff",
                                    guttermarkerSubtleText: "#6e7781",
                                    linenumberText: "#57606a",
                                    cursor: "#24292f",
                                    selectionBg: "rgba(84,174,255,0.4)",
                                    activelineBg: "rgba(234,238,242,0.5)",
                                    matchingbracketText: "#24292f",
                                    linesBg: "#ffffff",
                                    syntax: {
                                        comment: "#24292f",
                                        constant: "#0550ae",
                                        entity: "#8250df",
                                        keyword: "#cf222e",
                                        storage: "#cf222e",
                                        string: "#0a3069",
                                        support: "#0550ae",
                                        variable: "#953800",
                                    },
                                },
                                checks: {
                                    bg: "#24292f",
                                    textPrimary: "#f6f8fa",
                                    textSecondary: "#8c959f",
                                    textLink: "#54aeff",
                                    btnIcon: "#afb8c1",
                                    btnHoverIcon: "#f6f8fa",
                                    btnHoverBg: "rgba(255,255,255,0.125)",
                                    inputText: "#eaeef2",
                                    inputPlaceholderText: "#8c959f",
                                    inputFocusText: "#8c959f",
                                    inputBg: "#32383f",
                                    donutError: "#fa4549",
                                    donutPending: "#bf8700",
                                    donutSuccess: "#2da44e",
                                    donutNeutral: "#afb8c1",
                                    dropdownText: "#afb8c1",
                                    dropdownBg: "#32383f",
                                    dropdownBorder: "#424a53",
                                    dropdownShadow: "rgba(27,31,36,0.3)",
                                    dropdownHoverText: "#f6f8fa",
                                    dropdownHoverBg: "#424a53",
                                    dropdownBtnHoverText: "#f6f8fa",
                                    dropdownBtnHoverBg: "#32383f",
                                    scrollbarThumbBg: "#57606a",
                                    headerLabelText: "#d0d7de",
                                    headerLabelOpenText: "#f6f8fa",
                                    headerBorder: "#32383f",
                                    headerIcon: "#8c959f",
                                    lineText: "#d0d7de",
                                    lineNumText: "rgba(140,149,159,0.75)",
                                    lineTimestampText: "#8c959f",
                                    lineHoverBg: "#32383f",
                                    lineSelectedBg: "rgba(33,139,255,0.15)",
                                    lineSelectedNumText: "#54aeff",
                                    lineDtFmText: "#24292f",
                                    lineDtFmBg: "#9a6700",
                                    gateBg: "rgba(125,78,0,0.15)",
                                    gateText: "#d0d7de",
                                    gateWaitingText: "#d4a72c",
                                    stepHeaderOpenBg: "#32383f",
                                    stepErrorText: "#ff8182",
                                    stepWarningText: "#d4a72c",
                                    loglineText: "#8c959f",
                                    loglineNumText: "rgba(140,149,159,0.75)",
                                    loglineDebugText: "#c297ff",
                                    loglineErrorText: "#d0d7de",
                                    loglineErrorNumText: "#ff8182",
                                    loglineErrorBg: "rgba(164,14,38,0.15)",
                                    loglineWarningText: "#d0d7de",
                                    loglineWarningNumText: "#d4a72c",
                                    loglineWarningBg: "rgba(125,78,0,0.15)",
                                    loglineCommandText: "#54aeff",
                                    loglineSectionText: "#4ac26b",
                                    ansi: {
                                        black: "#24292f",
                                        blackBright: "#32383f",
                                        white: "#d0d7de",
                                        whiteBright: "#d0d7de",
                                        gray: "#8c959f",
                                        red: "#ff8182",
                                        redBright: "#ffaba8",
                                        green: "#4ac26b",
                                        greenBright: "#6fdd8b",
                                        yellow: "#d4a72c",
                                        yellowBright: "#eac54f",
                                        blue: "#54aeff",
                                        blueBright: "#80ccff",
                                        magenta: "#c297ff",
                                        magentaBright: "#d8b9ff",
                                        cyan: "#76e3ea",
                                        cyanBright: "#b3f0ff",
                                    },
                                },
                                project: {
                                    headerBg: "#24292f",
                                    sidebarBg: "#ffffff",
                                    gradientIn: "#ffffff",
                                    gradientOut: "rgba(255,255,255,0)",
                                },
                                mktg: {
                                    btn: {
                                        bg: "#1b1f23",
                                    },
                                },
                                avatar: {
                                    bg: "#ffffff",
                                    border: "rgba(27,31,36,0.15)",
                                    stackFade: "#afb8c1",
                                    stackFadeMore: "#d0d7de",
                                },
                                topicTag: {
                                    border: "rgba(0,0,0,0)",
                                },
                                counter: {
                                    border: "rgba(0,0,0,0)",
                                },
                                selectMenu: {
                                    backdropBorder: "rgba(0,0,0,0)",
                                    tapHighlight: "rgba(175,184,193,0.5)",
                                    tapFocusBg: "#b6e3ff",
                                },
                                header: {
                                    text: "rgba(255,255,255,0.7)",
                                    bg: "#24292f",
                                    divider: "#57606a",
                                    logo: "#ffffff",
                                },
                                headerSearch: {
                                    bg: "#24292f",
                                    border: "#57606a",
                                },
                                sidenav: {
                                    selectedBg: "#ffffff",
                                },
                                menu: {
                                    bgActive: "rgba(0,0,0,0)",
                                },
                                input: {
                                    disabledBg: "rgba(175,184,193,0.2)",
                                },
                                timeline: {
                                    badgeBg: "#eaeef2",
                                },
                                ansi: {
                                    black: "#24292f",
                                    blackBright: "#57606a",
                                    white: "#6e7781",
                                    whiteBright: "#8c959f",
                                    gray: "#6e7781",
                                    red: "#cf222e",
                                    redBright: "#a40e26",
                                    green: "#116329",
                                    greenBright: "#1a7f37",
                                    yellow: "#4d2d00",
                                    yellowBright: "#633c01",
                                    blue: "#0969da",
                                    blueBright: "#218bff",
                                    magenta: "#8250df",
                                    magentaBright: "#a475f9",
                                    cyan: "#1b7c83",
                                    cyanBright: "#3192aa",
                                },
                                btn: {
                                    text: "#24292f",
                                    bg: "#f6f8fa",
                                    border: "rgba(27,31,36,0.15)",
                                    hoverBg: "#f3f4f6",
                                    hoverBorder: "rgba(27,31,36,0.15)",
                                    activeBg: "hsla(220,14%,93%,1)",
                                    activeBorder: "rgba(27,31,36,0.15)",
                                    selectedBg: "hsla(220,14%,94%,1)",
                                    focusBg: "#f6f8fa",
                                    focusBorder: "rgba(27,31,36,0.15)",
                                    counterBg: "rgba(27,31,36,0.08)",
                                    primary: {
                                        text: "#ffffff",
                                        bg: "#2da44e",
                                        border: "rgba(27,31,36,0.15)",
                                        hoverBg: "#2c974b",
                                        hoverBorder: "rgba(27,31,36,0.15)",
                                        selectedBg: "hsla(137,55%,36%,1)",
                                        disabledText: "rgba(255,255,255,0.8)",
                                        disabledBg: "#94d3a2",
                                        disabledBorder: "rgba(27,31,36,0.15)",
                                        focusBg: "#2da44e",
                                        focusBorder: "rgba(27,31,36,0.15)",
                                        icon: "rgba(255,255,255,0.8)",
                                        counterBg: "rgba(255,255,255,0.2)",
                                    },
                                    outline: {
                                        text: "#0969da",
                                        hoverText: "#ffffff",
                                        hoverBg: "#0969da",
                                        hoverBorder: "rgba(27,31,36,0.15)",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "hsla(212,92%,42%,1)",
                                        selectedBorder: "rgba(27,31,36,0.15)",
                                        disabledText: "rgba(9,105,218,0.5)",
                                        disabledBg: "#f6f8fa",
                                        disabledCounterBg:
                                            "rgba(9,105,218,0.05)",
                                        focusBorder: "rgba(27,31,36,0.15)",
                                        counterBg: "rgba(9,105,218,0.1)",
                                    },
                                    danger: {
                                        text: "#cf222e",
                                        hoverText: "#ffffff",
                                        hoverBg: "#a40e26",
                                        hoverBorder: "rgba(27,31,36,0.15)",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "hsla(356,72%,44%,1)",
                                        selectedBorder: "rgba(27,31,36,0.15)",
                                        disabledText: "rgba(207,34,46,0.5)",
                                        disabledBg: "#f6f8fa",
                                        disabledCounterBg:
                                            "rgba(207,34,46,0.05)",
                                        focusBorder: "rgba(27,31,36,0.15)",
                                        counterBg: "rgba(207,34,46,0.1)",
                                        icon: "#cf222e",
                                        hoverIcon: "#ffffff",
                                    },
                                },
                                underlinenav: {
                                    icon: "#6e7781",
                                    borderHover: "rgba(175,184,193,0.2)",
                                },
                                actionListItem: {
                                    inlineDivider: "rgba(208,215,222,0.48)",
                                    default: {
                                        hoverBg: "rgba(208,215,222,0.32)",
                                        hoverBorder: "rgba(0,0,0,0)",
                                        activeBg: "rgba(208,215,222,0.48)",
                                        activeBorder: "rgba(0,0,0,0)",
                                        selectedBg: "rgba(208,215,222,0.24)",
                                    },
                                    danger: {
                                        hoverBg: "rgba(255,235,233,0.64)",
                                        activeBg: "#FFEBE9",
                                        hoverText: "#cf222e",
                                    },
                                },
                                switchTrack: {
                                    bg: "#eaeef2",
                                    border: "#afb8c1",
                                    checked: {
                                        bg: "#ddf4ff",
                                        hoverBg: "#b6e3ff",
                                        activeBg: "#80ccff",
                                        border: "#54aeff",
                                    },
                                },
                                switchKnob: {
                                    checked: {
                                        bg: "#0969da",
                                        disabledBg: "#6e7781",
                                    },
                                },
                                fg: {
                                    default: "#24292f",
                                    muted: "#57606a",
                                    subtle: "#6e7781",
                                    onEmphasis: "#ffffff",
                                },
                                canvas: {
                                    default: "#ffffff",
                                    overlay: "#ffffff",
                                    inset: "#f6f8fa",
                                    subtle: "#f6f8fa",
                                },
                                border: {
                                    default: "#d0d7de",
                                    muted: "hsla(210,18%,87%,1)",
                                    subtle: "rgba(27,31,36,0.15)",
                                },
                                neutral: {
                                    emphasisPlus: "#24292f",
                                    emphasis: "#6e7781",
                                    muted: "rgba(175,184,193,0.2)",
                                    subtle: "rgba(234,238,242,0.5)",
                                },
                                accent: {
                                    fg: "#0969da",
                                    emphasis: "#0969da",
                                    muted: "rgba(84,174,255,0.4)",
                                    subtle: "#ddf4ff",
                                },
                                success: {
                                    fg: "#1a7f37",
                                    emphasis: "#2da44e",
                                    muted: "rgba(74,194,107,0.4)",
                                    subtle: "#dafbe1",
                                },
                                attention: {
                                    fg: "#9a6700",
                                    emphasis: "#bf8700",
                                    muted: "rgba(212,167,44,0.4)",
                                    subtle: "#fff8c5",
                                },
                                severe: {
                                    fg: "#bc4c00",
                                    emphasis: "#bc4c00",
                                    muted: "rgba(251,143,68,0.4)",
                                    subtle: "#fff1e5",
                                },
                                danger: {
                                    fg: "#cf222e",
                                    emphasis: "#cf222e",
                                    muted: "rgba(255,129,130,0.4)",
                                    subtle: "#FFEBE9",
                                },
                                open: {
                                    fg: "#1a7f37",
                                    emphasis: "#2da44e",
                                    muted: "rgba(74,194,107,0.4)",
                                    subtle: "#dafbe1",
                                },
                                closed: {
                                    fg: "#cf222e",
                                    emphasis: "#cf222e",
                                    muted: "rgba(255,129,130,0.4)",
                                    subtle: "#FFEBE9",
                                },
                                done: {
                                    fg: "#8250df",
                                    emphasis: "#8250df",
                                    muted: "rgba(194,151,255,0.4)",
                                    subtle: "#fbefff",
                                },
                                sponsors: {
                                    fg: "#bf3989",
                                    emphasis: "#bf3989",
                                    muted: "rgba(255,128,200,0.4)",
                                    subtle: "#ffeff7",
                                },
                                primer: {
                                    fg: {
                                        disabled: "#8c959f",
                                    },
                                    canvas: {
                                        backdrop: "rgba(27,31,36,0.5)",
                                        sticky: "rgba(255,255,255,0.95)",
                                    },
                                    border: {
                                        active: "#FD8C73",
                                        contrast: "rgba(27,31,36,0.1)",
                                    },
                                },
                            },
                            shadows: {
                                mktg: {
                                    btn: {
                                        shadow: {
                                            outline:
                                                "rgb(0 0 0 / 15%) 0 0 0 1px inset",
                                            focus: "rgb(0 0 0 / 15%) 0 0 0 4px",
                                            hover: "0 3px 2px rgba(0, 0, 0, 0.07), 0 7px 5px rgba(0, 0, 0, 0.04), 0 12px 10px rgba(0, 0, 0, 0.03), 0 22px 18px rgba(0, 0, 0, 0.03), 0 42px 33px rgba(0, 0, 0, 0.02), 0 100px 80px rgba(0, 0, 0, 0.02)",
                                            hoverMuted:
                                                "rgb(0 0 0 / 70%) 0 0 0 2px inset",
                                        },
                                    },
                                },
                                avatar: {
                                    childShadow:
                                        "-2px -2px 0 rgba(255,255,255,0.8)",
                                },
                                overlay: {
                                    shadow: "0 1px 3px rgba(27,31,36,0.12), 0 8px 24px rgba(66,74,83,0.12)",
                                },
                                btn: {
                                    shadow: "0 1px 0 rgba(27,31,36,0.04)",
                                    insetShadow:
                                        "inset 0 1px 0 rgba(255,255,255,0.25)",
                                    focusShadow:
                                        "0 0 0 3px rgba(9,105,218,0.3)",
                                    shadowActive:
                                        "inset 0 0.15em 0.3em rgba(27,31,36,0.15)",
                                    shadowInputFocus:
                                        "0 0 0 0.2em rgba(9,105,218,0.3)",
                                    primary: {
                                        shadow: "0 1px 0 rgba(27,31,36,0.1)",
                                        insetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow:
                                            "inset 0 1px 0 rgba(0,45,17,0.2)",
                                        focusShadow:
                                            "0 0 0 3px rgba(45,164,78,0.4)",
                                    },
                                    outline: {
                                        hoverShadow:
                                            "0 1px 0 rgba(27,31,36,0.1)",
                                        hoverInsetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow:
                                            "inset 0 1px 0 rgba(0,33,85,0.2)",
                                        focusShadow:
                                            "0 0 0 3px rgba(5,80,174,0.4)",
                                    },
                                    danger: {
                                        hoverShadow:
                                            "0 1px 0 rgba(27,31,36,0.1)",
                                        hoverInsetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow:
                                            "inset 0 1px 0 rgba(76,0,20,0.2)",
                                        focusShadow:
                                            "0 0 0 3px rgba(164,14,38,0.4)",
                                    },
                                },
                                shadow: {
                                    small: "0 1px 0 rgba(27,31,36,0.04)",
                                    medium: "0 3px 6px rgba(140,149,159,0.15)",
                                    large: "0 8px 24px rgba(140,149,159,0.2)",
                                    extraLarge:
                                        "0 12px 28px rgba(140,149,159,0.3)",
                                },
                                primer: {
                                    shadow: {
                                        highlight:
                                            "inset 0 1px 0 rgba(255,255,255,0.25)",
                                        inset: "inset 0 1px 0 rgba(208,215,222,0.2)",
                                        focus: "0 0 0 3px rgba(9,105,218,0.3)",
                                    },
                                },
                            },
                        },
                        light_high_contrast: {
                            colors: {
                                canvasDefaultTransparent: "rgba(255,255,255,0)",
                                pageHeaderBg: "#ffffff",
                                marketingIcon: {
                                    primary: "#1168e3",
                                    secondary: "#368cf9",
                                },
                                diffBlob: {
                                    addition: {
                                        numText: "#0E1116",
                                        fg: "#ffffff",
                                        numBg: "#CCFFD8",
                                        lineBg: "#E6FFEC",
                                        wordBg: "#055d20",
                                    },
                                    deletion: {
                                        numText: "#0E1116",
                                        fg: "#ffffff",
                                        numBg: "#FFD7D5",
                                        lineBg: "#fff0ee",
                                        wordBg: "#a0111f",
                                    },
                                    hunk: {
                                        numBg: "#9cd7ff",
                                    },
                                    expander: {
                                        icon: "#0E1116",
                                    },
                                },
                                diffstat: {
                                    deletionBorder: "rgba(1,4,9,0.8)",
                                    additionBorder: "rgba(1,4,9,0.8)",
                                    additionBg: "#117f32",
                                },
                                searchKeyword: {
                                    hl: "#fcf7be",
                                },
                                prettylights: {
                                    syntax: {
                                        comment: "#66707B",
                                        constant: "#023b95",
                                        entity: "#622cbc",
                                        storageModifierImport: "#0E1116",
                                        entityTag: "#024c1a",
                                        keyword: "#a0111f",
                                        string: "#032563",
                                        variable: "#702c00",
                                        brackethighlighterUnmatched: "#6e011a",
                                        invalidIllegalText: "#FFFFFF",
                                        invalidIllegalBg: "#6e011a",
                                        carriageReturnText: "#FFFFFF",
                                        carriageReturnBg: "#a0111f",
                                        stringRegexp: "#024c1a",
                                        markupList: "#2e1800",
                                        markupHeading: "#023b95",
                                        markupItalic: "#0E1116",
                                        markupBold: "#0E1116",
                                        markupDeletedText: "#6e011a",
                                        markupDeletedBg: "#fff0ee",
                                        markupInsertedText: "#024c1a",
                                        markupInsertedBg: "#d2fedb",
                                        markupChangedText: "#702c00",
                                        markupChangedBg: "#ffc67b",
                                        markupIgnoredText: "#E7ECF0",
                                        markupIgnoredBg: "#023b95",
                                        metaDiffRange: "#622cbc",
                                        brackethighlighterAngle: "#4B535D",
                                        sublimelinterGutterMark: "#88929D",
                                        constantOtherReferenceLink: "#032563",
                                    },
                                },
                                codemirror: {
                                    text: "#0E1116",
                                    bg: "#ffffff",
                                    guttersBg: "#ffffff",
                                    guttermarkerText: "#ffffff",
                                    guttermarkerSubtleText: "#66707B",
                                    linenumberText: "#0E1116",
                                    cursor: "#0E1116",
                                    selectionBg: "#368cf9",
                                    activelineBg: "#E7ECF0",
                                    matchingbracketText: "#0E1116",
                                    linesBg: "#ffffff",
                                    syntax: {
                                        comment: "#0E1116",
                                        constant: "#023b95",
                                        entity: "#622cbc",
                                        keyword: "#a0111f",
                                        storage: "#a0111f",
                                        string: "#032563",
                                        support: "#023b95",
                                        variable: "#702c00",
                                    },
                                },
                                checks: {
                                    bg: "#0E1116",
                                    textPrimary: "#FFFFFF",
                                    textSecondary: "#88929D",
                                    textLink: "#368cf9",
                                    btnIcon: "#ACB6C0",
                                    btnHoverIcon: "#FFFFFF",
                                    btnHoverBg: "rgba(255,255,255,0.125)",
                                    inputText: "#E7ECF0",
                                    inputPlaceholderText: "#88929D",
                                    inputFocusText: "#88929D",
                                    inputBg: "#20252C",
                                    donutError: "#d5232c",
                                    donutPending: "#956400",
                                    donutSuccess: "#117f32",
                                    donutNeutral: "#ACB6C0",
                                    dropdownText: "#ACB6C0",
                                    dropdownBg: "#20252C",
                                    dropdownBorder: "#343B43",
                                    dropdownShadow: "rgba(1,4,9,0.3)",
                                    dropdownHoverText: "#FFFFFF",
                                    dropdownHoverBg: "#343B43",
                                    dropdownBtnHoverText: "#FFFFFF",
                                    dropdownBtnHoverBg: "#20252C",
                                    scrollbarThumbBg: "#4B535D",
                                    headerLabelText: "#CED5DC",
                                    headerLabelOpenText: "#FFFFFF",
                                    headerBorder: "#20252C",
                                    headerIcon: "#88929D",
                                    lineText: "#CED5DC",
                                    lineNumText: "rgba(136,146,157,0.75)",
                                    lineTimestampText: "#88929D",
                                    lineHoverBg: "#20252C",
                                    lineSelectedBg: "rgba(17,104,227,0.15)",
                                    lineSelectedNumText: "#368cf9",
                                    lineDtFmText: "#0E1116",
                                    lineDtFmBg: "#744500",
                                    gateBg: "rgba(96,55,0,0.15)",
                                    gateText: "#CED5DC",
                                    gateWaitingText: "#b58407",
                                    stepHeaderOpenBg: "#20252C",
                                    stepErrorText: "#ee5a5d",
                                    stepWarningText: "#b58407",
                                    loglineText: "#88929D",
                                    loglineNumText: "rgba(136,146,157,0.75)",
                                    loglineDebugText: "#a371f7",
                                    loglineErrorText: "#CED5DC",
                                    loglineErrorNumText: "#ee5a5d",
                                    loglineErrorBg: "rgba(134,6,29,0.15)",
                                    loglineWarningText: "#CED5DC",
                                    loglineWarningNumText: "#b58407",
                                    loglineWarningBg: "rgba(96,55,0,0.15)",
                                    loglineCommandText: "#368cf9",
                                    loglineSectionText: "#26a148",
                                    ansi: {
                                        black: "#0E1116",
                                        blackBright: "#20252C",
                                        white: "#CED5DC",
                                        whiteBright: "#CED5DC",
                                        gray: "#88929D",
                                        red: "#ee5a5d",
                                        redBright: "#ff8e8a",
                                        green: "#26a148",
                                        greenBright: "#43c663",
                                        yellow: "#b58407",
                                        yellowBright: "#d5a824",
                                        blue: "#368cf9",
                                        blueBright: "#67b3fd",
                                        magenta: "#a371f7",
                                        magentaBright: "#c49bff",
                                        cyan: "#76e3ea",
                                        cyanBright: "#b3f0ff",
                                    },
                                },
                                project: {
                                    headerBg: "#0E1116",
                                    sidebarBg: "#ffffff",
                                    gradientIn: "#ffffff",
                                    gradientOut: "rgba(255,255,255,0)",
                                },
                                mktg: {
                                    btn: {
                                        bg: "#1b1f23",
                                    },
                                },
                                avatar: {
                                    bg: "#ffffff",
                                    border: "rgba(1,4,9,0.8)",
                                    stackFade: "#ACB6C0",
                                    stackFadeMore: "#CED5DC",
                                },
                                topicTag: {
                                    border: "#0349b4",
                                },
                                counter: {
                                    border: "#20252C",
                                },
                                selectMenu: {
                                    backdropBorder: "rgba(0,0,0,0)",
                                    tapHighlight: "rgba(172,182,192,0.5)",
                                    tapFocusBg: "#9cd7ff",
                                },
                                header: {
                                    text: "rgba(255,255,255,0.7)",
                                    bg: "#0E1116",
                                    divider: "#ACB6C0",
                                    logo: "#ffffff",
                                },
                                headerSearch: {
                                    bg: "#0E1116",
                                    border: "#4B535D",
                                },
                                sidenav: {
                                    selectedBg: "#ffffff",
                                },
                                menu: {
                                    bgActive: "rgba(0,0,0,0)",
                                },
                                input: {
                                    disabledBg: "rgba(172,182,192,0.2)",
                                },
                                timeline: {
                                    badgeBg: "#E7ECF0",
                                },
                                ansi: {
                                    black: "#0E1116",
                                    blackBright: "#4B535D",
                                    white: "#66707B",
                                    whiteBright: "#88929D",
                                    gray: "#66707B",
                                    red: "#a0111f",
                                    redBright: "#86061d",
                                    green: "#024c1a",
                                    greenBright: "#055d20",
                                    yellow: "#3f2200",
                                    yellowBright: "#4e2c00",
                                    blue: "#0349b4",
                                    blueBright: "#1168e3",
                                    magenta: "#622cbc",
                                    magentaBright: "#844ae7",
                                    cyan: "#1b7c83",
                                    cyanBright: "#3192aa",
                                },
                                btn: {
                                    text: "#0E1116",
                                    bg: "#E7ECF0",
                                    border: "rgba(1,4,9,0.8)",
                                    hoverBg: "#CED5DC",
                                    hoverBorder: "rgba(1,4,9,0.8)",
                                    activeBg: "#ACB6C0",
                                    activeBorder: "rgba(1,4,9,0.8)",
                                    selectedBg: "#ACB6C0",
                                    focusBg: "#CED5DC",
                                    focusBorder: "rgba(1,4,9,0.8)",
                                    counterBg: "rgba(1,4,9,0.08)",
                                    primary: {
                                        text: "#ffffff",
                                        bg: "#055d20",
                                        border: "#013d14",
                                        hoverBg: "#024c1a",
                                        hoverBorder: "#013d14",
                                        selectedBg: "hsla(139,95%,13%,1)",
                                        disabledText: "rgba(255,255,255,0.8)",
                                        disabledBg: "#94d3a2",
                                        disabledBorder: "rgba(1,4,9,0.8)",
                                        focusBg: "#013d14",
                                        focusBorder: "#013d14",
                                        icon: "rgba(255,255,255,0.8)",
                                        counterBg: "rgba(255,255,255,0.2)",
                                    },
                                    outline: {
                                        text: "#023b95",
                                        hoverText: "#ffffff",
                                        hoverBg: "#0349b4",
                                        hoverBorder: "#022f7a",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "#022f7a",
                                        selectedBorder: "#022f7a",
                                        disabledText: "rgba(3,73,180,0.5)",
                                        disabledBg: "#E7ECF0",
                                        disabledCounterBg:
                                            "rgba(3,73,180,0.05)",
                                        focusBorder: "#022f7a",
                                        counterBg: "rgba(3,73,180,0.1)",
                                    },
                                    danger: {
                                        text: "#86061d",
                                        hoverText: "#ffffff",
                                        hoverBg: "#a0111f",
                                        hoverBorder: "#6e011a",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "#6e011a",
                                        selectedBorder: "#6e011a",
                                        disabledText: "rgba(160,17,31,0.5)",
                                        disabledBg: "#E7ECF0",
                                        disabledCounterBg:
                                            "rgba(160,17,31,0.05)",
                                        focusBorder: "#6e011a",
                                        counterBg: "rgba(160,17,31,0.1)",
                                        icon: "#86061d",
                                        hoverIcon: "#ffffff",
                                    },
                                },
                                underlinenav: {
                                    icon: "#66707B",
                                    borderHover: "rgba(172,182,192,0.2)",
                                },
                                actionListItem: {
                                    inlineDivider: "#88929D",
                                    default: {
                                        hoverBg: "#E7ECF0",
                                        hoverBorder: "#88929D",
                                        activeBg: "#CED5DC",
                                        activeBorder: "#20252C",
                                        selectedBg: "#CED5DC",
                                    },
                                    danger: {
                                        hoverBg: "#a0111f",
                                        activeBg: "#6e011a",
                                        hoverText: "#ffffff",
                                    },
                                },
                                switchTrack: {
                                    bg: "#ffffff",
                                    border: "#20252C",
                                    checked: {
                                        bg: "#dff7ff",
                                        hoverBg: "#9cd7ff",
                                        activeBg: "#67b3fd",
                                        border: "#0349b4",
                                    },
                                },
                                switchKnob: {
                                    checked: {
                                        bg: "#0349b4",
                                        disabledBg: "#66707B",
                                    },
                                },
                                fg: {
                                    default: "#0E1116",
                                    muted: "#0E1116",
                                    subtle: "#66707B",
                                    onEmphasis: "#ffffff",
                                },
                                canvas: {
                                    default: "#ffffff",
                                    overlay: "#ffffff",
                                    inset: "#ffffff",
                                    subtle: "#E7ECF0",
                                },
                                border: {
                                    default: "#20252C",
                                    muted: "#88929D",
                                    subtle: "rgba(1,4,9,0.8)",
                                },
                                neutral: {
                                    emphasisPlus: "#0E1116",
                                    emphasis: "#66707B",
                                    muted: "rgba(172,182,192,0.2)",
                                    subtle: "#E7ECF0",
                                },
                                accent: {
                                    fg: "#0349b4",
                                    emphasis: "#0349b4",
                                    muted: "#368cf9",
                                    subtle: "#dff7ff",
                                },
                                success: {
                                    fg: "#055d20",
                                    emphasis: "#055d20",
                                    muted: "#26a148",
                                    subtle: "#d2fedb",
                                },
                                attention: {
                                    fg: "#744500",
                                    emphasis: "#744500",
                                    muted: "#b58407",
                                    subtle: "#fcf7be",
                                },
                                severe: {
                                    fg: "#873800",
                                    emphasis: "#873800",
                                    muted: "#dc6d1a",
                                    subtle: "#fff2d5",
                                },
                                danger: {
                                    fg: "#a0111f",
                                    emphasis: "#a0111f",
                                    muted: "#ee5a5d",
                                    subtle: "#fff0ee",
                                },
                                open: {
                                    fg: "#055d20",
                                    emphasis: "#117f32",
                                    muted: "rgba(38,161,72,0.4)",
                                    subtle: "#d2fedb",
                                },
                                closed: {
                                    fg: "#a0111f",
                                    emphasis: "#a0111f",
                                    muted: "rgba(238,90,93,0.4)",
                                    subtle: "#fff0ee",
                                },
                                done: {
                                    fg: "#622cbc",
                                    emphasis: "#622cbc",
                                    muted: "#a371f7",
                                    subtle: "#faf0fe",
                                },
                                sponsors: {
                                    fg: "#971368",
                                    emphasis: "#971368",
                                    muted: "#ed4baf",
                                    subtle: "#feeff7",
                                },
                                primer: {
                                    fg: {
                                        disabled: "#88929D",
                                    },
                                    canvas: {
                                        backdrop: "rgba(1,4,9,0.5)",
                                        sticky: "rgba(255,255,255,0.95)",
                                    },
                                    border: {
                                        active: "#ef5b48",
                                        contrast: "rgba(1,4,9,0.1)",
                                    },
                                },
                            },
                            shadows: {
                                mktg: {
                                    btn: {
                                        shadow: {
                                            outline:
                                                "rgb(0 0 0 / 15%) 0 0 0 1px inset",
                                            focus: "rgb(0 0 0 / 15%) 0 0 0 4px",
                                            hover: "0 3px 2px rgba(0, 0, 0, 0.07), 0 7px 5px rgba(0, 0, 0, 0.04), 0 12px 10px rgba(0, 0, 0, 0.03), 0 22px 18px rgba(0, 0, 0, 0.03), 0 42px 33px rgba(0, 0, 0, 0.02), 0 100px 80px rgba(0, 0, 0, 0.02)",
                                            hoverMuted:
                                                "rgb(0 0 0 / 70%) 0 0 0 2px inset",
                                        },
                                    },
                                },
                                avatar: {
                                    childShadow:
                                        "-2px -2px 0 rgba(255,255,255,0.8)",
                                },
                                overlay: {
                                    shadow: "0 1px 3px rgba(1,4,9,0.12), 0 8px 24px rgba(52,59,67,0.12)",
                                },
                                btn: {
                                    shadow: "0 1px 0 rgba(1,4,9,0.04)",
                                    insetShadow:
                                        "inset 0 1px 0 rgba(255,255,255,0.25)",
                                    focusShadow: "0 0 0 3px rgba(3,73,180,0.3)",
                                    shadowActive:
                                        "inset 0 0.15em 0.3em rgba(1,4,9,0.15)",
                                    shadowInputFocus:
                                        "0 0 0 0.2em rgba(3,73,180,0.3)",
                                    primary: {
                                        shadow: "0 1px 0 rgba(1,4,9,0.1)",
                                        insetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow:
                                            "inset 0 1px 0 rgba(0,35,11,0.2)",
                                        focusShadow:
                                            "0 0 0 3px rgba(1,61,20,0.4)",
                                    },
                                    outline: {
                                        hoverShadow: "0 1px 0 rgba(1,4,9,0.1)",
                                        hoverInsetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow:
                                            "inset 0 1px 0 rgba(2,26,74,0.2)",
                                        focusShadow:
                                            "0 0 0 3px rgba(2,59,149,0.4)",
                                    },
                                    danger: {
                                        hoverShadow: "0 1px 0 rgba(1,4,9,0.1)",
                                        hoverInsetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow:
                                            "inset 0 1px 0 rgba(67,0,17,0.2)",
                                        focusShadow:
                                            "0 0 0 3px rgba(134,6,29,0.4)",
                                    },
                                },
                                shadow: {
                                    small: "0 1px 0 rgba(1,4,9,0.04)",
                                    medium: "0 3px 6px rgba(136,146,157,0.15)",
                                    large: "0 8px 24px rgba(136,146,157,0.2)",
                                    extraLarge:
                                        "0 12px 28px rgba(136,146,157,0.3)",
                                },
                                primer: {
                                    shadow: {
                                        highlight:
                                            "inset 0 1px 0 rgba(255,255,255,0.25)",
                                        inset: "inset 0 1px 0 rgba(206,213,220,0.2)",
                                        focus: "0 0 0 3px rgba(3,73,180,0.3)",
                                    },
                                },
                            },
                        },
                        light_colorblind: {
                            colors: {
                                canvasDefaultTransparent: "rgba(255,255,255,0)",
                                pageHeaderBg: "#f6f8fa",
                                marketingIcon: {
                                    primary: "#218bff",
                                    secondary: "#54aeff",
                                },
                                diffBlob: {
                                    addition: {
                                        numText: "#24292f",
                                        fg: "#24292f",
                                        numBg: "rgba(84,174,255,0.4)",
                                        lineBg: "rgba(221,244,255,0.5)",
                                        wordBg: "rgba(84,174,255,0.4)",
                                    },
                                    deletion: {
                                        numText: "#24292f",
                                        fg: "#24292f",
                                        numBg: "rgba(247,153,57,0.4)",
                                        lineBg: "rgba(255,245,232,0.5)",
                                        wordBg: "rgba(255,188,109,0.5)",
                                    },
                                    hunk: {
                                        numBg: "rgba(84,174,255,0.4)",
                                    },
                                    expander: {
                                        icon: "#57606a",
                                    },
                                },
                                diffstat: {
                                    deletionBorder: "rgba(27,31,36,0.15)",
                                    additionBorder: "rgba(27,31,36,0.15)",
                                    additionBg: "#218bff",
                                },
                                searchKeyword: {
                                    hl: "#fff8c5",
                                },
                                prettylights: {
                                    syntax: {
                                        comment: "#6e7781",
                                        constant: "#0550ae",
                                        entity: "#8250df",
                                        storageModifierImport: "#24292f",
                                        entityTag: "#0550ae",
                                        keyword: "#b35900",
                                        string: "#0a3069",
                                        variable: "#8a4600",
                                        brackethighlighterUnmatched: "#6f3800",
                                        invalidIllegalText: "#f6f8fa",
                                        invalidIllegalBg: "#6f3800",
                                        carriageReturnText: "#f6f8fa",
                                        carriageReturnBg: "#b35900",
                                        stringRegexp: "#0550ae",
                                        markupList: "#3b2300",
                                        markupHeading: "#0550ae",
                                        markupItalic: "#24292f",
                                        markupBold: "#24292f",
                                        markupDeletedText: "#6f3800",
                                        markupDeletedBg: "#fff5e8",
                                        markupInsertedText: "#0550ae",
                                        markupInsertedBg: "#ddf4ff",
                                        markupChangedText: "#8a4600",
                                        markupChangedBg: "#ffddb0",
                                        markupIgnoredText: "#eaeef2",
                                        markupIgnoredBg: "#0550ae",
                                        metaDiffRange: "#8250df",
                                        brackethighlighterAngle: "#57606a",
                                        sublimelinterGutterMark: "#8c959f",
                                        constantOtherReferenceLink: "#0a3069",
                                    },
                                },
                                codemirror: {
                                    text: "#24292f",
                                    bg: "#ffffff",
                                    guttersBg: "#ffffff",
                                    guttermarkerText: "#ffffff",
                                    guttermarkerSubtleText: "#6e7781",
                                    linenumberText: "#57606a",
                                    cursor: "#24292f",
                                    selectionBg: "rgba(84,174,255,0.4)",
                                    activelineBg: "rgba(234,238,242,0.5)",
                                    matchingbracketText: "#24292f",
                                    linesBg: "#ffffff",
                                    syntax: {
                                        comment: "#24292f",
                                        constant: "#0550ae",
                                        entity: "#8250df",
                                        keyword: "#b35900",
                                        storage: "#b35900",
                                        string: "#0a3069",
                                        support: "#0550ae",
                                        variable: "#8a4600",
                                    },
                                },
                                checks: {
                                    bg: "#24292f",
                                    textPrimary: "#f6f8fa",
                                    textSecondary: "#8c959f",
                                    textLink: "#54aeff",
                                    btnIcon: "#afb8c1",
                                    btnHoverIcon: "#f6f8fa",
                                    btnHoverBg: "rgba(255,255,255,0.125)",
                                    inputText: "#eaeef2",
                                    inputPlaceholderText: "#8c959f",
                                    inputFocusText: "#8c959f",
                                    inputBg: "#32383f",
                                    donutError: "#dd7815",
                                    donutPending: "#bf8700",
                                    donutSuccess: "#218bff",
                                    donutNeutral: "#afb8c1",
                                    dropdownText: "#afb8c1",
                                    dropdownBg: "#32383f",
                                    dropdownBorder: "#424a53",
                                    dropdownShadow: "rgba(27,31,36,0.3)",
                                    dropdownHoverText: "#f6f8fa",
                                    dropdownHoverBg: "#424a53",
                                    dropdownBtnHoverText: "#f6f8fa",
                                    dropdownBtnHoverBg: "#32383f",
                                    scrollbarThumbBg: "#57606a",
                                    headerLabelText: "#d0d7de",
                                    headerLabelOpenText: "#f6f8fa",
                                    headerBorder: "#32383f",
                                    headerIcon: "#8c959f",
                                    lineText: "#d0d7de",
                                    lineNumText: "rgba(140,149,159,0.75)",
                                    lineTimestampText: "#8c959f",
                                    lineHoverBg: "#32383f",
                                    lineSelectedBg: "rgba(33,139,255,0.15)",
                                    lineSelectedNumText: "#54aeff",
                                    lineDtFmText: "#24292f",
                                    lineDtFmBg: "#9a6700",
                                    gateBg: "rgba(125,78,0,0.15)",
                                    gateText: "#d0d7de",
                                    gateWaitingText: "#d4a72c",
                                    stepHeaderOpenBg: "#32383f",
                                    stepErrorText: "#f79939",
                                    stepWarningText: "#d4a72c",
                                    loglineText: "#8c959f",
                                    loglineNumText: "rgba(140,149,159,0.75)",
                                    loglineDebugText: "#c297ff",
                                    loglineErrorText: "#d0d7de",
                                    loglineErrorNumText: "#f79939",
                                    loglineErrorBg: "rgba(138,70,0,0.15)",
                                    loglineWarningText: "#d0d7de",
                                    loglineWarningNumText: "#d4a72c",
                                    loglineWarningBg: "rgba(125,78,0,0.15)",
                                    loglineCommandText: "#54aeff",
                                    loglineSectionText: "#54aeff",
                                    ansi: {
                                        black: "#24292f",
                                        blackBright: "#32383f",
                                        white: "#d0d7de",
                                        whiteBright: "#d0d7de",
                                        gray: "#8c959f",
                                        red: "#f79939",
                                        redBright: "#ffbc6d",
                                        green: "#54aeff",
                                        greenBright: "#80ccff",
                                        yellow: "#d4a72c",
                                        yellowBright: "#eac54f",
                                        blue: "#54aeff",
                                        blueBright: "#80ccff",
                                        magenta: "#c297ff",
                                        magentaBright: "#d8b9ff",
                                        cyan: "#76e3ea",
                                        cyanBright: "#b3f0ff",
                                    },
                                },
                                project: {
                                    headerBg: "#24292f",
                                    sidebarBg: "#ffffff",
                                    gradientIn: "#ffffff",
                                    gradientOut: "rgba(255,255,255,0)",
                                },
                                mktg: {
                                    btn: {
                                        bg: "#1b1f23",
                                    },
                                },
                                avatar: {
                                    bg: "#ffffff",
                                    border: "rgba(27,31,36,0.15)",
                                    stackFade: "#afb8c1",
                                    stackFadeMore: "#d0d7de",
                                },
                                topicTag: {
                                    border: "rgba(0,0,0,0)",
                                },
                                counter: {
                                    border: "rgba(0,0,0,0)",
                                },
                                selectMenu: {
                                    backdropBorder: "rgba(0,0,0,0)",
                                    tapHighlight: "rgba(175,184,193,0.5)",
                                    tapFocusBg: "#b6e3ff",
                                },
                                header: {
                                    text: "rgba(255,255,255,0.7)",
                                    bg: "#24292f",
                                    divider: "#57606a",
                                    logo: "#ffffff",
                                },
                                headerSearch: {
                                    bg: "#24292f",
                                    border: "#57606a",
                                },
                                sidenav: {
                                    selectedBg: "#ffffff",
                                },
                                menu: {
                                    bgActive: "rgba(0,0,0,0)",
                                },
                                input: {
                                    disabledBg: "rgba(175,184,193,0.2)",
                                },
                                timeline: {
                                    badgeBg: "#eaeef2",
                                },
                                ansi: {
                                    black: "#24292f",
                                    blackBright: "#57606a",
                                    white: "#6e7781",
                                    whiteBright: "#8c959f",
                                    gray: "#6e7781",
                                    red: "#b35900",
                                    redBright: "#8a4600",
                                    green: "#0550ae",
                                    greenBright: "#0969da",
                                    yellow: "#4d2d00",
                                    yellowBright: "#633c01",
                                    blue: "#0969da",
                                    blueBright: "#218bff",
                                    magenta: "#8250df",
                                    magentaBright: "#a475f9",
                                    cyan: "#1b7c83",
                                    cyanBright: "#3192aa",
                                },
                                btn: {
                                    text: "#24292f",
                                    bg: "#f6f8fa",
                                    border: "rgba(27,31,36,0.15)",
                                    hoverBg: "#f3f4f6",
                                    hoverBorder: "rgba(27,31,36,0.15)",
                                    activeBg: "hsla(220,14%,93%,1)",
                                    activeBorder: "rgba(27,31,36,0.15)",
                                    selectedBg: "hsla(220,14%,94%,1)",
                                    focusBg: "#f6f8fa",
                                    focusBorder: "rgba(27,31,36,0.15)",
                                    counterBg: "rgba(27,31,36,0.08)",
                                    primary: {
                                        text: "#ffffff",
                                        bg: "#218bff",
                                        border: "rgba(27,31,36,0.15)",
                                        hoverBg: "#0969da",
                                        hoverBorder: "rgba(27,31,36,0.15)",
                                        selectedBg: "hsla(212,92%,43%,1)",
                                        disabledText: "rgba(255,255,255,0.8)",
                                        disabledBg: "#80ccff",
                                        disabledBorder: "rgba(27,31,36,0.15)",
                                        focusBg: "#218bff",
                                        focusBorder: "rgba(27,31,36,0.15)",
                                        icon: "rgba(255,255,255,0.8)",
                                        counterBg: "rgba(255,255,255,0.2)",
                                    },
                                    outline: {
                                        text: "#0969da",
                                        hoverText: "#ffffff",
                                        hoverBg: "#0969da",
                                        hoverBorder: "rgba(27,31,36,0.15)",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "hsla(212,92%,42%,1)",
                                        selectedBorder: "rgba(27,31,36,0.15)",
                                        disabledText: "rgba(9,105,218,0.5)",
                                        disabledBg: "#f6f8fa",
                                        disabledCounterBg:
                                            "rgba(9,105,218,0.05)",
                                        focusBorder: "rgba(27,31,36,0.15)",
                                        counterBg: "rgba(9,105,218,0.1)",
                                    },
                                    danger: {
                                        text: "#b35900",
                                        hoverText: "#ffffff",
                                        hoverBg: "#8a4600",
                                        hoverBorder: "rgba(27,31,36,0.15)",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "hsla(30,100%,32%,1)",
                                        selectedBorder: "rgba(27,31,36,0.15)",
                                        disabledText: "rgba(179,89,0,0.5)",
                                        disabledBg: "#f6f8fa",
                                        disabledCounterBg:
                                            "rgba(179,89,0,0.05)",
                                        focusBorder: "rgba(27,31,36,0.15)",
                                        counterBg: "rgba(179,89,0,0.1)",
                                        icon: "#b35900",
                                        hoverIcon: "#ffffff",
                                    },
                                },
                                underlinenav: {
                                    icon: "#6e7781",
                                    borderHover: "rgba(175,184,193,0.2)",
                                },
                                actionListItem: {
                                    inlineDivider: "rgba(208,215,222,0.48)",
                                    default: {
                                        hoverBg: "rgba(208,215,222,0.32)",
                                        hoverBorder: "rgba(0,0,0,0)",
                                        activeBg: "rgba(208,215,222,0.48)",
                                        activeBorder: "rgba(0,0,0,0)",
                                        selectedBg: "rgba(208,215,222,0.24)",
                                    },
                                    danger: {
                                        hoverBg: "rgba(255,245,232,0.64)",
                                        activeBg: "#fff5e8",
                                        hoverText: "#b35900",
                                    },
                                },
                                switchTrack: {
                                    bg: "#eaeef2",
                                    border: "#afb8c1",
                                    checked: {
                                        bg: "#ddf4ff",
                                        hoverBg: "#b6e3ff",
                                        activeBg: "#80ccff",
                                        border: "#54aeff",
                                    },
                                },
                                switchKnob: {
                                    checked: {
                                        bg: "#0969da",
                                        disabledBg: "#6e7781",
                                    },
                                },
                                fg: {
                                    default: "#24292f",
                                    muted: "#57606a",
                                    subtle: "#6e7781",
                                    onEmphasis: "#ffffff",
                                },
                                canvas: {
                                    default: "#ffffff",
                                    overlay: "#ffffff",
                                    inset: "#f6f8fa",
                                    subtle: "#f6f8fa",
                                },
                                border: {
                                    default: "#d0d7de",
                                    muted: "hsla(210,18%,87%,1)",
                                    subtle: "rgba(27,31,36,0.15)",
                                },
                                neutral: {
                                    emphasisPlus: "#24292f",
                                    emphasis: "#6e7781",
                                    muted: "rgba(175,184,193,0.2)",
                                    subtle: "rgba(234,238,242,0.5)",
                                },
                                accent: {
                                    fg: "#0969da",
                                    emphasis: "#0969da",
                                    muted: "rgba(84,174,255,0.4)",
                                    subtle: "#ddf4ff",
                                },
                                success: {
                                    fg: "#0969da",
                                    emphasis: "#218bff",
                                    muted: "rgba(84,174,255,0.4)",
                                    subtle: "#ddf4ff",
                                },
                                attention: {
                                    fg: "#9a6700",
                                    emphasis: "#bf8700",
                                    muted: "rgba(212,167,44,0.4)",
                                    subtle: "#fff8c5",
                                },
                                severe: {
                                    fg: "#b35900",
                                    emphasis: "#b35900",
                                    muted: "rgba(247,153,57,0.4)",
                                    subtle: "#fff5e8",
                                },
                                danger: {
                                    fg: "#b35900",
                                    emphasis: "#b35900",
                                    muted: "rgba(247,153,57,0.4)",
                                    subtle: "#fff5e8",
                                },
                                open: {
                                    fg: "#b35900",
                                    emphasis: "#dd7815",
                                    muted: "rgba(247,153,57,0.4)",
                                    subtle: "#fff5e8",
                                },
                                closed: {
                                    fg: "#6e7781",
                                    emphasis: "#6e7781",
                                    muted: "rgba(175,184,193,0.4)",
                                    subtle: "#f6f8fa",
                                },
                                done: {
                                    fg: "#8250df",
                                    emphasis: "#8250df",
                                    muted: "rgba(194,151,255,0.4)",
                                    subtle: "#fbefff",
                                },
                                sponsors: {
                                    fg: "#bf3989",
                                    emphasis: "#bf3989",
                                    muted: "rgba(255,128,200,0.4)",
                                    subtle: "#ffeff7",
                                },
                                primer: {
                                    fg: {
                                        disabled: "#8c959f",
                                    },
                                    canvas: {
                                        backdrop: "rgba(27,31,36,0.5)",
                                        sticky: "rgba(255,255,255,0.95)",
                                    },
                                    border: {
                                        active: "#FD8C73",
                                        contrast: "rgba(27,31,36,0.1)",
                                    },
                                },
                            },
                            shadows: {
                                mktg: {
                                    btn: {
                                        shadow: {
                                            outline:
                                                "rgb(0 0 0 / 15%) 0 0 0 1px inset",
                                            focus: "rgb(0 0 0 / 15%) 0 0 0 4px",
                                            hover: "0 3px 2px rgba(0, 0, 0, 0.07), 0 7px 5px rgba(0, 0, 0, 0.04), 0 12px 10px rgba(0, 0, 0, 0.03), 0 22px 18px rgba(0, 0, 0, 0.03), 0 42px 33px rgba(0, 0, 0, 0.02), 0 100px 80px rgba(0, 0, 0, 0.02)",
                                            hoverMuted:
                                                "rgb(0 0 0 / 70%) 0 0 0 2px inset",
                                        },
                                    },
                                },
                                avatar: {
                                    childShadow:
                                        "-2px -2px 0 rgba(255,255,255,0.8)",
                                },
                                overlay: {
                                    shadow: "0 1px 3px rgba(27,31,36,0.12), 0 8px 24px rgba(66,74,83,0.12)",
                                },
                                btn: {
                                    shadow: "0 1px 0 rgba(27,31,36,0.04)",
                                    insetShadow:
                                        "inset 0 1px 0 rgba(255,255,255,0.25)",
                                    focusShadow:
                                        "0 0 0 3px rgba(9,105,218,0.3)",
                                    shadowActive:
                                        "inset 0 0.15em 0.3em rgba(27,31,36,0.15)",
                                    shadowInputFocus:
                                        "0 0 0 0.2em rgba(9,105,218,0.3)",
                                    primary: {
                                        shadow: "0 1px 0 rgba(27,31,36,0.1)",
                                        insetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow:
                                            "inset 0 1px 0 rgba(0,33,85,0.2)",
                                        focusShadow:
                                            "0 0 0 3px rgba(33,139,255,0.4)",
                                    },
                                    outline: {
                                        hoverShadow:
                                            "0 1px 0 rgba(27,31,36,0.1)",
                                        hoverInsetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow:
                                            "inset 0 1px 0 rgba(0,33,85,0.2)",
                                        focusShadow:
                                            "0 0 0 3px rgba(5,80,174,0.4)",
                                    },
                                    danger: {
                                        hoverShadow:
                                            "0 1px 0 rgba(27,31,36,0.1)",
                                        hoverInsetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow:
                                            "inset 0 1px 0 rgba(65,32,0,0.2)",
                                        focusShadow:
                                            "0 0 0 3px rgba(138,70,0,0.4)",
                                    },
                                },
                                shadow: {
                                    small: "0 1px 0 rgba(27,31,36,0.04)",
                                    medium: "0 3px 6px rgba(140,149,159,0.15)",
                                    large: "0 8px 24px rgba(140,149,159,0.2)",
                                    extraLarge:
                                        "0 12px 28px rgba(140,149,159,0.3)",
                                },
                                primer: {
                                    shadow: {
                                        highlight:
                                            "inset 0 1px 0 rgba(255,255,255,0.25)",
                                        inset: "inset 0 1px 0 rgba(208,215,222,0.2)",
                                        focus: "0 0 0 3px rgba(9,105,218,0.3)",
                                    },
                                },
                            },
                        },
                        dark: {
                            colors: {
                                canvasDefaultTransparent: "rgba(13,17,23,0)",
                                pageHeaderBg: "#0d1117",
                                marketingIcon: {
                                    primary: "#79c0ff",
                                    secondary: "#1f6feb",
                                },
                                diffBlob: {
                                    addition: {
                                        numText: "#c9d1d9",
                                        fg: "#c9d1d9",
                                        numBg: "rgba(63,185,80,0.3)",
                                        lineBg: "rgba(46,160,67,0.15)",
                                        wordBg: "rgba(46,160,67,0.4)",
                                    },
                                    deletion: {
                                        numText: "#c9d1d9",
                                        fg: "#c9d1d9",
                                        numBg: "rgba(248,81,73,0.3)",
                                        lineBg: "rgba(248,81,73,0.15)",
                                        wordBg: "rgba(248,81,73,0.4)",
                                    },
                                    hunk: {
                                        numBg: "rgba(56,139,253,0.4)",
                                    },
                                    expander: {
                                        icon: "#8b949e",
                                    },
                                },
                                diffstat: {
                                    deletionBorder: "rgba(240,246,252,0.1)",
                                    additionBorder: "rgba(240,246,252,0.1)",
                                    additionBg: "#3fb950",
                                },
                                searchKeyword: {
                                    hl: "rgba(210,153,34,0.4)",
                                },
                                prettylights: {
                                    syntax: {
                                        comment: "#8b949e",
                                        constant: "#79c0ff",
                                        entity: "#d2a8ff",
                                        storageModifierImport: "#c9d1d9",
                                        entityTag: "#7ee787",
                                        keyword: "#ff7b72",
                                        string: "#a5d6ff",
                                        variable: "#ffa657",
                                        brackethighlighterUnmatched: "#f85149",
                                        invalidIllegalText: "#f0f6fc",
                                        invalidIllegalBg: "#8e1519",
                                        carriageReturnText: "#f0f6fc",
                                        carriageReturnBg: "#b62324",
                                        stringRegexp: "#7ee787",
                                        markupList: "#f2cc60",
                                        markupHeading: "#1f6feb",
                                        markupItalic: "#c9d1d9",
                                        markupBold: "#c9d1d9",
                                        markupDeletedText: "#ffdcd7",
                                        markupDeletedBg: "#67060c",
                                        markupInsertedText: "#aff5b4",
                                        markupInsertedBg: "#033a16",
                                        markupChangedText: "#ffdfb6",
                                        markupChangedBg: "#5a1e02",
                                        markupIgnoredText: "#c9d1d9",
                                        markupIgnoredBg: "#1158c7",
                                        metaDiffRange: "#d2a8ff",
                                        brackethighlighterAngle: "#8b949e",
                                        sublimelinterGutterMark: "#484f58",
                                        constantOtherReferenceLink: "#a5d6ff",
                                    },
                                },
                                codemirror: {
                                    text: "#c9d1d9",
                                    bg: "#0d1117",
                                    guttersBg: "#0d1117",
                                    guttermarkerText: "#0d1117",
                                    guttermarkerSubtleText: "#6e7681",
                                    linenumberText: "#8b949e",
                                    cursor: "#c9d1d9",
                                    selectionBg: "rgba(56,139,253,0.4)",
                                    activelineBg: "rgba(110,118,129,0.1)",
                                    matchingbracketText: "#c9d1d9",
                                    linesBg: "#0d1117",
                                    syntax: {
                                        comment: "#8b949e",
                                        constant: "#79c0ff",
                                        entity: "#d2a8ff",
                                        keyword: "#ff7b72",
                                        storage: "#ff7b72",
                                        string: "#a5d6ff",
                                        support: "#79c0ff",
                                        variable: "#ffa657",
                                    },
                                },
                                checks: {
                                    bg: "#010409",
                                    textPrimary: "#c9d1d9",
                                    textSecondary: "#8b949e",
                                    textLink: "#58a6ff",
                                    btnIcon: "#8b949e",
                                    btnHoverIcon: "#c9d1d9",
                                    btnHoverBg: "rgba(110,118,129,0.1)",
                                    inputText: "#8b949e",
                                    inputPlaceholderText: "#6e7681",
                                    inputFocusText: "#c9d1d9",
                                    inputBg: "#161b22",
                                    donutError: "#f85149",
                                    donutPending: "#d29922",
                                    donutSuccess: "#2ea043",
                                    donutNeutral: "#8b949e",
                                    dropdownText: "#c9d1d9",
                                    dropdownBg: "#161b22",
                                    dropdownBorder: "#30363d",
                                    dropdownShadow: "rgba(1,4,9,0.3)",
                                    dropdownHoverText: "#c9d1d9",
                                    dropdownHoverBg: "rgba(110,118,129,0.1)",
                                    dropdownBtnHoverText: "#c9d1d9",
                                    dropdownBtnHoverBg: "rgba(110,118,129,0.1)",
                                    scrollbarThumbBg: "rgba(110,118,129,0.4)",
                                    headerLabelText: "#8b949e",
                                    headerLabelOpenText: "#c9d1d9",
                                    headerBorder: "#21262d",
                                    headerIcon: "#8b949e",
                                    lineText: "#8b949e",
                                    lineNumText: "#6e7681",
                                    lineTimestampText: "#6e7681",
                                    lineHoverBg: "rgba(110,118,129,0.1)",
                                    lineSelectedBg: "rgba(56,139,253,0.15)",
                                    lineSelectedNumText: "#58a6ff",
                                    lineDtFmText: "#ffffff",
                                    lineDtFmBg: "#9e6a03",
                                    gateBg: "rgba(187,128,9,0.15)",
                                    gateText: "#8b949e",
                                    gateWaitingText: "#d29922",
                                    stepHeaderOpenBg: "#161b22",
                                    stepErrorText: "#f85149",
                                    stepWarningText: "#d29922",
                                    loglineText: "#8b949e",
                                    loglineNumText: "#6e7681",
                                    loglineDebugText: "#a371f7",
                                    loglineErrorText: "#8b949e",
                                    loglineErrorNumText: "#6e7681",
                                    loglineErrorBg: "rgba(248,81,73,0.15)",
                                    loglineWarningText: "#8b949e",
                                    loglineWarningNumText: "#d29922",
                                    loglineWarningBg: "rgba(187,128,9,0.15)",
                                    loglineCommandText: "#58a6ff",
                                    loglineSectionText: "#3fb950",
                                    ansi: {
                                        black: "#0d1117",
                                        blackBright: "#161b22",
                                        white: "#b1bac4",
                                        whiteBright: "#b1bac4",
                                        gray: "#6e7681",
                                        red: "#ff7b72",
                                        redBright: "#ffa198",
                                        green: "#3fb950",
                                        greenBright: "#56d364",
                                        yellow: "#d29922",
                                        yellowBright: "#e3b341",
                                        blue: "#58a6ff",
                                        blueBright: "#79c0ff",
                                        magenta: "#bc8cff",
                                        magentaBright: "#d2a8ff",
                                        cyan: "#76e3ea",
                                        cyanBright: "#b3f0ff",
                                    },
                                },
                                project: {
                                    headerBg: "#0d1117",
                                    sidebarBg: "#161b22",
                                    gradientIn: "#161b22",
                                    gradientOut: "rgba(22,27,34,0)",
                                },
                                mktg: {
                                    btn: {
                                        bg: "#f6f8fa",
                                    },
                                },
                                avatar: {
                                    bg: "rgba(255,255,255,0.1)",
                                    border: "rgba(240,246,252,0.1)",
                                    stackFade: "#30363d",
                                    stackFadeMore: "#21262d",
                                },
                                topicTag: {
                                    border: "rgba(0,0,0,0)",
                                },
                                counter: {
                                    border: "rgba(0,0,0,0)",
                                },
                                selectMenu: {
                                    backdropBorder: "#484f58",
                                    tapHighlight: "rgba(48,54,61,0.5)",
                                    tapFocusBg: "#0c2d6b",
                                },
                                header: {
                                    text: "rgba(255,255,255,0.7)",
                                    bg: "#161b22",
                                    divider: "#8b949e",
                                    logo: "#f0f6fc",
                                },
                                headerSearch: {
                                    bg: "#0d1117",
                                    border: "#30363d",
                                },
                                sidenav: {
                                    selectedBg: "#21262d",
                                },
                                menu: {
                                    bgActive: "#161b22",
                                },
                                input: {
                                    disabledBg: "rgba(110,118,129,0)",
                                },
                                timeline: {
                                    badgeBg: "#21262d",
                                },
                                ansi: {
                                    black: "#484f58",
                                    blackBright: "#6e7681",
                                    white: "#b1bac4",
                                    whiteBright: "#ffffff",
                                    gray: "#6e7681",
                                    red: "#ff7b72",
                                    redBright: "#ffa198",
                                    green: "#3fb950",
                                    greenBright: "#56d364",
                                    yellow: "#d29922",
                                    yellowBright: "#e3b341",
                                    blue: "#58a6ff",
                                    blueBright: "#79c0ff",
                                    magenta: "#bc8cff",
                                    magentaBright: "#d2a8ff",
                                    cyan: "#39c5cf",
                                    cyanBright: "#56d4dd",
                                },
                                btn: {
                                    text: "#c9d1d9",
                                    bg: "#21262d",
                                    border: "rgba(240,246,252,0.1)",
                                    hoverBg: "#30363d",
                                    hoverBorder: "#8b949e",
                                    activeBg: "hsla(212,12%,18%,1)",
                                    activeBorder: "#6e7681",
                                    selectedBg: "#161b22",
                                    focusBg: "#21262d",
                                    focusBorder: "#8b949e",
                                    counterBg: "#30363d",
                                    primary: {
                                        text: "#ffffff",
                                        bg: "#238636",
                                        border: "rgba(240,246,252,0.1)",
                                        hoverBg: "#2ea043",
                                        hoverBorder: "rgba(240,246,252,0.1)",
                                        selectedBg: "#238636",
                                        disabledText: "rgba(255,255,255,0.5)",
                                        disabledBg: "rgba(35,134,54,0.6)",
                                        disabledBorder: "rgba(240,246,252,0.1)",
                                        focusBg: "#238636",
                                        focusBorder: "rgba(240,246,252,0.1)",
                                        icon: "#ffffff",
                                        counterBg: "rgba(255,255,255,0.2)",
                                    },
                                    outline: {
                                        text: "#58a6ff",
                                        hoverText: "#58a6ff",
                                        hoverBg: "#30363d",
                                        hoverBorder: "rgba(240,246,252,0.1)",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "#0d419d",
                                        selectedBorder: "rgba(240,246,252,0.1)",
                                        disabledText: "rgba(88,166,255,0.5)",
                                        disabledBg: "#0d1117",
                                        disabledCounterBg:
                                            "rgba(31,111,235,0.05)",
                                        focusBorder: "rgba(240,246,252,0.1)",
                                        counterBg: "rgba(31,111,235,0.1)",
                                    },
                                    danger: {
                                        text: "#f85149",
                                        hoverText: "#ffffff",
                                        hoverBg: "#da3633",
                                        hoverBorder: "#f85149",
                                        hoverIcon: "#ffffff",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "#b62324",
                                        selectedBorder: "#ff7b72",
                                        disabledText: "rgba(248,81,73,0.5)",
                                        disabledBg: "#0d1117",
                                        disabledCounterBg:
                                            "rgba(218,54,51,0.05)",
                                        focusBorder: "#f85149",
                                        counterBg: "rgba(218,54,51,0.1)",
                                        icon: "#f85149",
                                    },
                                },
                                underlinenav: {
                                    icon: "#6e7681",
                                    borderHover: "rgba(110,118,129,0.4)",
                                },
                                actionListItem: {
                                    inlineDivider: "rgba(48,54,61,0.48)",
                                    default: {
                                        hoverBg: "rgba(177,186,196,0.12)",
                                        hoverBorder: "rgba(0,0,0,0)",
                                        activeBg: "rgba(177,186,196,0.2)",
                                        activeBorder: "rgba(0,0,0,0)",
                                        selectedBg: "rgba(177,186,196,0.08)",
                                    },
                                    danger: {
                                        hoverBg: "rgba(248,81,73,0.16)",
                                        activeBg: "rgba(248,81,73,0.24)",
                                        hoverText: "#ff7b72",
                                    },
                                },
                                switchTrack: {
                                    bg: "#010409",
                                    border: "#6e7681",
                                    checked: {
                                        bg: "rgba(31,111,235,0.35)",
                                        hoverBg: "rgba(31,111,235,0.5)",
                                        activeBg: "rgba(31,111,235,0.65)",
                                        border: "#58a6ff",
                                    },
                                },
                                switchKnob: {
                                    checked: {
                                        bg: "#1f6feb",
                                        disabledBg: "#484f58",
                                    },
                                },
                                fg: {
                                    default: "#c9d1d9",
                                    muted: "#8b949e",
                                    subtle: "#6e7681",
                                    onEmphasis: "#ffffff",
                                },
                                canvas: {
                                    default: "#0d1117",
                                    overlay: "#161b22",
                                    inset: "#010409",
                                    subtle: "#161b22",
                                },
                                border: {
                                    default: "#30363d",
                                    muted: "#21262d",
                                    subtle: "rgba(240,246,252,0.1)",
                                },
                                neutral: {
                                    emphasisPlus: "#6e7681",
                                    emphasis: "#6e7681",
                                    muted: "rgba(110,118,129,0.4)",
                                    subtle: "rgba(110,118,129,0.1)",
                                },
                                accent: {
                                    fg: "#58a6ff",
                                    emphasis: "#1f6feb",
                                    muted: "rgba(56,139,253,0.4)",
                                    subtle: "rgba(56,139,253,0.15)",
                                },
                                success: {
                                    fg: "#3fb950",
                                    emphasis: "#238636",
                                    muted: "rgba(46,160,67,0.4)",
                                    subtle: "rgba(46,160,67,0.15)",
                                },
                                attention: {
                                    fg: "#d29922",
                                    emphasis: "#9e6a03",
                                    muted: "rgba(187,128,9,0.4)",
                                    subtle: "rgba(187,128,9,0.15)",
                                },
                                severe: {
                                    fg: "#db6d28",
                                    emphasis: "#bd561d",
                                    muted: "rgba(219,109,40,0.4)",
                                    subtle: "rgba(219,109,40,0.15)",
                                },
                                danger: {
                                    fg: "#f85149",
                                    emphasis: "#da3633",
                                    muted: "rgba(248,81,73,0.4)",
                                    subtle: "rgba(248,81,73,0.15)",
                                },
                                open: {
                                    fg: "#3fb950",
                                    emphasis: "#238636",
                                    muted: "rgba(46,160,67,0.4)",
                                    subtle: "rgba(46,160,67,0.15)",
                                },
                                closed: {
                                    fg: "#f85149",
                                    emphasis: "#da3633",
                                    muted: "rgba(248,81,73,0.4)",
                                    subtle: "rgba(248,81,73,0.15)",
                                },
                                done: {
                                    fg: "#a371f7",
                                    emphasis: "#8957e5",
                                    muted: "rgba(163,113,247,0.4)",
                                    subtle: "rgba(163,113,247,0.15)",
                                },
                                sponsors: {
                                    fg: "#db61a2",
                                    emphasis: "#bf4b8a",
                                    muted: "rgba(219,97,162,0.4)",
                                    subtle: "rgba(219,97,162,0.15)",
                                },
                                primer: {
                                    fg: {
                                        disabled: "#484f58",
                                    },
                                    canvas: {
                                        backdrop: "rgba(1,4,9,0.8)",
                                        sticky: "rgba(13,17,23,0.95)",
                                    },
                                    border: {
                                        active: "#F78166",
                                        contrast: "rgba(255,255,255,0.2)",
                                    },
                                },
                            },
                            shadows: {
                                checks: {
                                    inputShadow:
                                        "0 0 0 1px (obj) => get_1.default(obj, path)",
                                },
                                mktg: {
                                    btn: {
                                        shadow: {
                                            outline:
                                                "rgb(255 255 255 / 25%) 0 0 0 1px inset",
                                            focus: "rgb(255 255 255 / 25%) 0 0 0 4px",
                                            hover: "0 4px 7px rgba(0, 0, 0, 0.15), 0 100px 80px rgba(255, 255, 255, 0.02), 0 42px 33px rgba(255, 255, 255, 0.024), 0 22px 18px rgba(255, 255, 255, 0.028), 0 12px 10px rgba(255, 255, 255, 0.034), 0 7px 5px rgba(255, 255, 255, 0.04), 0 3px 2px rgba(255, 255, 255, 0.07)",
                                            hoverMuted:
                                                "rgb(255 255 255) 0 0 0 2px inset",
                                        },
                                    },
                                },
                                avatar: {
                                    childShadow: "-2px -2px 0 #0d1117",
                                },
                                overlay: {
                                    shadow: "0 0 0 1px #30363d, 0 16px 32px rgba(1,4,9,0.85)",
                                },
                                btn: {
                                    shadow: "0 0 transparent",
                                    insetShadow: "0 0 transparent",
                                    focusShadow:
                                        "0 0 0 3px rgba(139,148,158,0.3)",
                                    shadowActive:
                                        "inset 0 0.15em 0.3em rgba(1,4,9,0.15)",
                                    shadowInputFocus:
                                        "0 0 0 0.2em rgba(31,111,235,0.3)",
                                    primary: {
                                        shadow: "0 0 transparent",
                                        insetShadow: "0 0 transparent",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(46,164,79,0.4)",
                                    },
                                    outline: {
                                        hoverShadow: "0 1px 0 rgba(1,4,9,0.1)",
                                        hoverInsetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(17,88,199,0.4)",
                                    },
                                    danger: {
                                        hoverShadow: "0 0 transparent",
                                        hoverInsetShadow: "0 0 transparent",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(248,81,73,0.4)",
                                    },
                                },
                                shadow: {
                                    small: "0 0 transparent",
                                    medium: "0 3px 6px #010409",
                                    large: "0 8px 24px #010409",
                                    extraLarge: "0 12px 48px #010409",
                                },
                                primer: {
                                    shadow: {
                                        highlight: "0 0 transparent",
                                        inset: "0 0 transparent",
                                        focus: "0 0 0 3px #0c2d6b",
                                    },
                                },
                            },
                        },
                        dark_dimmed: {
                            colors: {
                                canvasDefaultTransparent: "rgba(34,39,46,0)",
                                pageHeaderBg: "#22272e",
                                marketingIcon: {
                                    primary: "#6cb6ff",
                                    secondary: "#316dca",
                                },
                                diffBlob: {
                                    addition: {
                                        numText: "#adbac7",
                                        fg: "#adbac7",
                                        numBg: "rgba(87,171,90,0.3)",
                                        lineBg: "rgba(70,149,74,0.15)",
                                        wordBg: "rgba(70,149,74,0.4)",
                                    },
                                    deletion: {
                                        numText: "#adbac7",
                                        fg: "#adbac7",
                                        numBg: "rgba(229,83,75,0.3)",
                                        lineBg: "rgba(229,83,75,0.15)",
                                        wordBg: "rgba(229,83,75,0.4)",
                                    },
                                    hunk: {
                                        numBg: "rgba(65,132,228,0.4)",
                                    },
                                    expander: {
                                        icon: "#768390",
                                    },
                                },
                                diffstat: {
                                    deletionBorder: "rgba(205,217,229,0.1)",
                                    additionBorder: "rgba(205,217,229,0.1)",
                                    additionBg: "#57ab5a",
                                },
                                searchKeyword: {
                                    hl: "rgba(198,144,38,0.4)",
                                },
                                prettylights: {
                                    syntax: {
                                        comment: "#768390",
                                        constant: "#6cb6ff",
                                        entity: "#dcbdfb",
                                        storageModifierImport: "#adbac7",
                                        entityTag: "#8ddb8c",
                                        keyword: "#f47067",
                                        string: "#96d0ff",
                                        variable: "#f69d50",
                                        brackethighlighterUnmatched: "#e5534b",
                                        invalidIllegalText: "#cdd9e5",
                                        invalidIllegalBg: "#922323",
                                        carriageReturnText: "#cdd9e5",
                                        carriageReturnBg: "#ad2e2c",
                                        stringRegexp: "#8ddb8c",
                                        markupList: "#eac55f",
                                        markupHeading: "#316dca",
                                        markupItalic: "#adbac7",
                                        markupBold: "#adbac7",
                                        markupDeletedText: "#ffd8d3",
                                        markupDeletedBg: "#78191b",
                                        markupInsertedText: "#b4f1b4",
                                        markupInsertedBg: "#1b4721",
                                        markupChangedText: "#ffddb0",
                                        markupChangedBg: "#682d0f",
                                        markupIgnoredText: "#adbac7",
                                        markupIgnoredBg: "#255ab2",
                                        metaDiffRange: "#dcbdfb",
                                        brackethighlighterAngle: "#768390",
                                        sublimelinterGutterMark: "#545d68",
                                        constantOtherReferenceLink: "#96d0ff",
                                    },
                                },
                                codemirror: {
                                    text: "#adbac7",
                                    bg: "#22272e",
                                    guttersBg: "#22272e",
                                    guttermarkerText: "#22272e",
                                    guttermarkerSubtleText: "#636e7b",
                                    linenumberText: "#768390",
                                    cursor: "#adbac7",
                                    selectionBg: "rgba(65,132,228,0.4)",
                                    activelineBg: "rgba(99,110,123,0.1)",
                                    matchingbracketText: "#adbac7",
                                    linesBg: "#22272e",
                                    syntax: {
                                        comment: "#768390",
                                        constant: "#6cb6ff",
                                        entity: "#dcbdfb",
                                        keyword: "#f47067",
                                        storage: "#f47067",
                                        string: "#96d0ff",
                                        support: "#6cb6ff",
                                        variable: "#f69d50",
                                    },
                                },
                                checks: {
                                    bg: "#1c2128",
                                    textPrimary: "#adbac7",
                                    textSecondary: "#768390",
                                    textLink: "#539bf5",
                                    btnIcon: "#768390",
                                    btnHoverIcon: "#adbac7",
                                    btnHoverBg: "rgba(99,110,123,0.1)",
                                    inputText: "#768390",
                                    inputPlaceholderText: "#636e7b",
                                    inputFocusText: "#adbac7",
                                    inputBg: "#2d333b",
                                    donutError: "#e5534b",
                                    donutPending: "#c69026",
                                    donutSuccess: "#46954a",
                                    donutNeutral: "#768390",
                                    dropdownText: "#adbac7",
                                    dropdownBg: "#2d333b",
                                    dropdownBorder: "#444c56",
                                    dropdownShadow: "rgba(28,33,40,0.3)",
                                    dropdownHoverText: "#adbac7",
                                    dropdownHoverBg: "rgba(99,110,123,0.1)",
                                    dropdownBtnHoverText: "#adbac7",
                                    dropdownBtnHoverBg: "rgba(99,110,123,0.1)",
                                    scrollbarThumbBg: "rgba(99,110,123,0.4)",
                                    headerLabelText: "#768390",
                                    headerLabelOpenText: "#adbac7",
                                    headerBorder: "#373e47",
                                    headerIcon: "#768390",
                                    lineText: "#768390",
                                    lineNumText: "#636e7b",
                                    lineTimestampText: "#636e7b",
                                    lineHoverBg: "rgba(99,110,123,0.1)",
                                    lineSelectedBg: "rgba(65,132,228,0.15)",
                                    lineSelectedNumText: "#539bf5",
                                    lineDtFmText: "#cdd9e5",
                                    lineDtFmBg: "#966600",
                                    gateBg: "rgba(174,124,20,0.15)",
                                    gateText: "#768390",
                                    gateWaitingText: "#c69026",
                                    stepHeaderOpenBg: "#2d333b",
                                    stepErrorText: "#e5534b",
                                    stepWarningText: "#c69026",
                                    loglineText: "#768390",
                                    loglineNumText: "#636e7b",
                                    loglineDebugText: "#986ee2",
                                    loglineErrorText: "#768390",
                                    loglineErrorNumText: "#636e7b",
                                    loglineErrorBg: "rgba(229,83,75,0.15)",
                                    loglineWarningText: "#768390",
                                    loglineWarningNumText: "#c69026",
                                    loglineWarningBg: "rgba(174,124,20,0.15)",
                                    loglineCommandText: "#539bf5",
                                    loglineSectionText: "#57ab5a",
                                    ansi: {
                                        black: "#22272e",
                                        blackBright: "#2d333b",
                                        white: "#909dab",
                                        whiteBright: "#909dab",
                                        gray: "#636e7b",
                                        red: "#f47067",
                                        redBright: "#ff938a",
                                        green: "#57ab5a",
                                        greenBright: "#6bc46d",
                                        yellow: "#c69026",
                                        yellowBright: "#daaa3f",
                                        blue: "#539bf5",
                                        blueBright: "#6cb6ff",
                                        magenta: "#b083f0",
                                        magentaBright: "#dcbdfb",
                                        cyan: "#76e3ea",
                                        cyanBright: "#b3f0ff",
                                    },
                                },
                                project: {
                                    headerBg: "#22272e",
                                    sidebarBg: "#2d333b",
                                    gradientIn: "#2d333b",
                                    gradientOut: "rgba(45,51,59,0)",
                                },
                                mktg: {
                                    btn: {
                                        bg: "#f6f8fa",
                                    },
                                },
                                avatar: {
                                    bg: "rgba(205,217,229,0.1)",
                                    border: "rgba(205,217,229,0.1)",
                                    stackFade: "#444c56",
                                    stackFadeMore: "#373e47",
                                },
                                topicTag: {
                                    border: "rgba(0,0,0,0)",
                                },
                                counter: {
                                    border: "rgba(0,0,0,0)",
                                },
                                selectMenu: {
                                    backdropBorder: "#545d68",
                                    tapHighlight: "rgba(68,76,86,0.5)",
                                    tapFocusBg: "#143d79",
                                },
                                header: {
                                    text: "rgba(205,217,229,0.7)",
                                    bg: "#2d333b",
                                    divider: "#768390",
                                    logo: "#cdd9e5",
                                },
                                headerSearch: {
                                    bg: "#22272e",
                                    border: "#444c56",
                                },
                                sidenav: {
                                    selectedBg: "#373e47",
                                },
                                menu: {
                                    bgActive: "#2d333b",
                                },
                                input: {
                                    disabledBg: "rgba(99,110,123,0)",
                                },
                                timeline: {
                                    badgeBg: "#373e47",
                                },
                                ansi: {
                                    black: "#545d68",
                                    blackBright: "#636e7b",
                                    white: "#909dab",
                                    whiteBright: "#cdd9e5",
                                    gray: "#636e7b",
                                    red: "#f47067",
                                    redBright: "#ff938a",
                                    green: "#57ab5a",
                                    greenBright: "#6bc46d",
                                    yellow: "#c69026",
                                    yellowBright: "#daaa3f",
                                    blue: "#539bf5",
                                    blueBright: "#6cb6ff",
                                    magenta: "#b083f0",
                                    magentaBright: "#dcbdfb",
                                    cyan: "#39c5cf",
                                    cyanBright: "#56d4dd",
                                },
                                btn: {
                                    text: "#adbac7",
                                    bg: "#373e47",
                                    border: "rgba(205,217,229,0.1)",
                                    hoverBg: "#444c56",
                                    hoverBorder: "#768390",
                                    activeBg: "hsla(213,12%,27%,1)",
                                    activeBorder: "#636e7b",
                                    selectedBg: "#2d333b",
                                    focusBg: "#373e47",
                                    focusBorder: "#768390",
                                    counterBg: "#444c56",
                                    primary: {
                                        text: "#ffffff",
                                        bg: "#347d39",
                                        border: "rgba(205,217,229,0.1)",
                                        hoverBg: "#46954a",
                                        hoverBorder: "rgba(205,217,229,0.1)",
                                        selectedBg: "#347d39",
                                        disabledText: "rgba(205,217,229,0.5)",
                                        disabledBg: "rgba(52,125,57,0.6)",
                                        disabledBorder: "rgba(205,217,229,0.1)",
                                        focusBg: "#347d39",
                                        focusBorder: "rgba(205,217,229,0.1)",
                                        icon: "#cdd9e5",
                                        counterBg: "rgba(205,217,229,0.2)",
                                    },
                                    outline: {
                                        text: "#539bf5",
                                        hoverText: "#539bf5",
                                        hoverBg: "#444c56",
                                        hoverBorder: "rgba(205,217,229,0.1)",
                                        hoverCounterBg: "rgba(205,217,229,0.2)",
                                        selectedText: "#cdd9e5",
                                        selectedBg: "#1b4b91",
                                        selectedBorder: "rgba(205,217,229,0.1)",
                                        disabledText: "rgba(83,155,245,0.5)",
                                        disabledBg: "#22272e",
                                        disabledCounterBg:
                                            "rgba(49,109,202,0.05)",
                                        focusBorder: "rgba(205,217,229,0.1)",
                                        counterBg: "rgba(49,109,202,0.1)",
                                    },
                                    danger: {
                                        text: "#e5534b",
                                        hoverText: "#cdd9e5",
                                        hoverBg: "#c93c37",
                                        hoverBorder: "#e5534b",
                                        hoverIcon: "#cdd9e5",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "#ad2e2c",
                                        selectedBorder: "#f47067",
                                        disabledText: "rgba(229,83,75,0.5)",
                                        disabledBg: "#22272e",
                                        disabledCounterBg:
                                            "rgba(201,60,55,0.05)",
                                        focusBorder: "#e5534b",
                                        counterBg: "rgba(201,60,55,0.1)",
                                        icon: "#e5534b",
                                    },
                                },
                                underlinenav: {
                                    icon: "#636e7b",
                                    borderHover: "rgba(99,110,123,0.4)",
                                },
                                actionListItem: {
                                    inlineDivider: "rgba(68,76,86,0.48)",
                                    default: {
                                        hoverBg: "rgba(144,157,171,0.12)",
                                        hoverBorder: "rgba(0,0,0,0)",
                                        activeBg: "rgba(144,157,171,0.2)",
                                        activeBorder: "rgba(0,0,0,0)",
                                        selectedBg: "rgba(144,157,171,0.08)",
                                    },
                                    danger: {
                                        hoverBg: "rgba(229,83,75,0.16)",
                                        activeBg: "rgba(229,83,75,0.24)",
                                        hoverText: "#f47067",
                                    },
                                },
                                switchTrack: {
                                    bg: "#1c2128",
                                    border: "#636e7b",
                                    checked: {
                                        bg: "rgba(49,109,202,0.35)",
                                        hoverBg: "rgba(49,109,202,0.5)",
                                        activeBg: "rgba(49,109,202,0.65)",
                                        border: "#539bf5",
                                    },
                                },
                                switchKnob: {
                                    checked: {
                                        bg: "#316dca",
                                        disabledBg: "#545d68",
                                    },
                                },
                                fg: {
                                    default: "#adbac7",
                                    muted: "#768390",
                                    subtle: "#636e7b",
                                    onEmphasis: "#cdd9e5",
                                },
                                canvas: {
                                    default: "#22272e",
                                    overlay: "#2d333b",
                                    inset: "#1c2128",
                                    subtle: "#2d333b",
                                },
                                border: {
                                    default: "#444c56",
                                    muted: "#373e47",
                                    subtle: "rgba(205,217,229,0.1)",
                                },
                                neutral: {
                                    emphasisPlus: "#636e7b",
                                    emphasis: "#636e7b",
                                    muted: "rgba(99,110,123,0.4)",
                                    subtle: "rgba(99,110,123,0.1)",
                                },
                                accent: {
                                    fg: "#539bf5",
                                    emphasis: "#316dca",
                                    muted: "rgba(65,132,228,0.4)",
                                    subtle: "rgba(65,132,228,0.15)",
                                },
                                success: {
                                    fg: "#57ab5a",
                                    emphasis: "#347d39",
                                    muted: "rgba(70,149,74,0.4)",
                                    subtle: "rgba(70,149,74,0.15)",
                                },
                                attention: {
                                    fg: "#c69026",
                                    emphasis: "#966600",
                                    muted: "rgba(174,124,20,0.4)",
                                    subtle: "rgba(174,124,20,0.15)",
                                },
                                severe: {
                                    fg: "#cc6b2c",
                                    emphasis: "#ae5622",
                                    muted: "rgba(204,107,44,0.4)",
                                    subtle: "rgba(204,107,44,0.15)",
                                },
                                danger: {
                                    fg: "#e5534b",
                                    emphasis: "#c93c37",
                                    muted: "rgba(229,83,75,0.4)",
                                    subtle: "rgba(229,83,75,0.15)",
                                },
                                open: {
                                    fg: "#57ab5a",
                                    emphasis: "#347d39",
                                    muted: "rgba(70,149,74,0.4)",
                                    subtle: "rgba(70,149,74,0.15)",
                                },
                                closed: {
                                    fg: "#e5534b",
                                    emphasis: "#c93c37",
                                    muted: "rgba(229,83,75,0.4)",
                                    subtle: "rgba(229,83,75,0.15)",
                                },
                                done: {
                                    fg: "#986ee2",
                                    emphasis: "#8256d0",
                                    muted: "rgba(152,110,226,0.4)",
                                    subtle: "rgba(152,110,226,0.15)",
                                },
                                sponsors: {
                                    fg: "#c96198",
                                    emphasis: "#ae4c82",
                                    muted: "rgba(201,97,152,0.4)",
                                    subtle: "rgba(201,97,152,0.15)",
                                },
                                primer: {
                                    fg: {
                                        disabled: "#545d68",
                                    },
                                    canvas: {
                                        backdrop: "rgba(28,33,40,0.8)",
                                        sticky: "rgba(34,39,46,0.95)",
                                    },
                                    border: {
                                        active: "#EC775C",
                                        contrast: "rgba(205,217,229,0.2)",
                                    },
                                },
                            },
                            shadows: {
                                checks: {
                                    inputShadow:
                                        "0 0 0 1px (obj) => get_1.default(obj, path)",
                                },
                                mktg: {
                                    btn: {
                                        shadow: {
                                            outline:
                                                "rgb(255 255 255 / 25%) 0 0 0 1px inset",
                                            focus: "rgb(255 255 255 / 25%) 0 0 0 4px",
                                            hover: "0 4px 7px rgba(0, 0, 0, 0.15), 0 100px 80px rgba(255, 255, 255, 0.02), 0 42px 33px rgba(255, 255, 255, 0.024), 0 22px 18px rgba(255, 255, 255, 0.028), 0 12px 10px rgba(255, 255, 255, 0.034), 0 7px 5px rgba(255, 255, 255, 0.04), 0 3px 2px rgba(255, 255, 255, 0.07)",
                                            hoverMuted:
                                                "rgb(255 255 255) 0 0 0 2px inset",
                                        },
                                    },
                                },
                                avatar: {
                                    childShadow: "-2px -2px 0 #22272e",
                                },
                                overlay: {
                                    shadow: "0 0 0 1px #444c56, 0 16px 32px rgba(28,33,40,0.85)",
                                },
                                btn: {
                                    shadow: "0 0 transparent",
                                    insetShadow: "0 0 transparent",
                                    focusShadow:
                                        "0 0 0 3px rgba(118,131,144,0.3)",
                                    shadowActive:
                                        "inset 0 0.15em 0.3em rgba(28,33,40,0.15)",
                                    shadowInputFocus:
                                        "0 0 0 0.2em rgba(49,109,202,0.3)",
                                    primary: {
                                        shadow: "0 0 transparent",
                                        insetShadow: "0 0 transparent",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(46,164,79,0.4)",
                                    },
                                    outline: {
                                        hoverShadow:
                                            "0 1px 0 rgba(28,33,40,0.1)",
                                        hoverInsetShadow:
                                            "inset 0 1px 0 rgba(205,217,229,0.03)",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(37,90,178,0.4)",
                                    },
                                    danger: {
                                        hoverShadow: "0 0 transparent",
                                        hoverInsetShadow: "0 0 transparent",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(229,83,75,0.4)",
                                    },
                                },
                                shadow: {
                                    small: "0 0 transparent",
                                    medium: "0 3px 6px #1c2128",
                                    large: "0 8px 24px #1c2128",
                                    extraLarge: "0 12px 48px #1c2128",
                                },
                                primer: {
                                    shadow: {
                                        highlight: "0 0 transparent",
                                        inset: "0 0 transparent",
                                        focus: "0 0 0 3px #143d79",
                                    },
                                },
                            },
                        },
                        dark_high_contrast: {
                            colors: {
                                canvasDefaultTransparent: "rgba(10,12,16,0)",
                                pageHeaderBg: "#0a0c10",
                                marketingIcon: {
                                    primary: "#91cbff",
                                    secondary: "#409eff",
                                },
                                diffBlob: {
                                    addition: {
                                        numText: "#f0f3f6",
                                        fg: "#0a0c10",
                                        numBg: "rgba(38,205,77,0.3)",
                                        lineBg: "rgba(9,180,58,0.15)",
                                        wordBg: "#09b43a",
                                    },
                                    deletion: {
                                        numText: "#f0f3f6",
                                        fg: "#0a0c10",
                                        numBg: "rgba(255,106,105,0.3)",
                                        lineBg: "rgba(255,106,105,0.15)",
                                        wordBg: "#ff6a69",
                                    },
                                    hunk: {
                                        numBg: "rgba(64,158,255,0.4)",
                                    },
                                    expander: {
                                        icon: "#f0f3f6",
                                    },
                                },
                                diffstat: {
                                    deletionBorder: "#ffb1af",
                                    additionBorder: "#4ae168",
                                    additionBg: "#26cd4d",
                                },
                                searchKeyword: {
                                    hl: "rgba(240,183,47,0.4)",
                                },
                                prettylights: {
                                    syntax: {
                                        comment: "#bdc4cc",
                                        constant: "#91cbff",
                                        entity: "#dbb7ff",
                                        storageModifierImport: "#f0f3f6",
                                        entityTag: "#72f088",
                                        keyword: "#ff9492",
                                        string: "#addcff",
                                        variable: "#ffb757",
                                        brackethighlighterUnmatched: "#ff6a69",
                                        invalidIllegalText: "#ffffff",
                                        invalidIllegalBg: "#e82a2f",
                                        carriageReturnText: "#ffffff",
                                        carriageReturnBg: "#ff4445",
                                        stringRegexp: "#72f088",
                                        markupList: "#fbd669",
                                        markupHeading: "#409eff",
                                        markupItalic: "#f0f3f6",
                                        markupBold: "#f0f3f6",
                                        markupDeletedText: "#ffdedb",
                                        markupDeletedBg: "#cc1421",
                                        markupInsertedText: "#acf7b6",
                                        markupInsertedBg: "#007728",
                                        markupChangedText: "#ffe1b4",
                                        markupChangedBg: "#a74c00",
                                        markupIgnoredText: "#f0f3f6",
                                        markupIgnoredBg: "#318bf8",
                                        metaDiffRange: "#dbb7ff",
                                        brackethighlighterAngle: "#bdc4cc",
                                        sublimelinterGutterMark: "#7a828e",
                                        constantOtherReferenceLink: "#addcff",
                                    },
                                },
                                codemirror: {
                                    text: "#f0f3f6",
                                    bg: "#0a0c10",
                                    guttersBg: "#0a0c10",
                                    guttermarkerText: "#0a0c10",
                                    guttermarkerSubtleText: "#9ea7b3",
                                    linenumberText: "#f0f3f6",
                                    cursor: "#f0f3f6",
                                    selectionBg: "rgba(64,158,255,0.4)",
                                    activelineBg: "rgba(158,167,179,0.1)",
                                    matchingbracketText: "#f0f3f6",
                                    linesBg: "#0a0c10",
                                    syntax: {
                                        comment: "#bdc4cc",
                                        constant: "#91cbff",
                                        entity: "#dbb7ff",
                                        keyword: "#ff9492",
                                        storage: "#ff9492",
                                        string: "#addcff",
                                        support: "#91cbff",
                                        variable: "#ffb757",
                                    },
                                },
                                checks: {
                                    bg: "#010409",
                                    textPrimary: "#f0f3f6",
                                    textSecondary: "#f0f3f6",
                                    textLink: "#71b7ff",
                                    btnIcon: "#f0f3f6",
                                    btnHoverIcon: "#f0f3f6",
                                    btnHoverBg: "rgba(158,167,179,0.1)",
                                    inputText: "#f0f3f6",
                                    inputPlaceholderText: "#9ea7b3",
                                    inputFocusText: "#f0f3f6",
                                    inputBg: "#272b33",
                                    donutError: "#ff6a69",
                                    donutPending: "#f0b72f",
                                    donutSuccess: "#09b43a",
                                    donutNeutral: "#bdc4cc",
                                    dropdownText: "#f0f3f6",
                                    dropdownBg: "#272b33",
                                    dropdownBorder: "#7a828e",
                                    dropdownShadow: "rgba(1,4,9,0.3)",
                                    dropdownHoverText: "#f0f3f6",
                                    dropdownHoverBg: "rgba(158,167,179,0.1)",
                                    dropdownBtnHoverText: "#f0f3f6",
                                    dropdownBtnHoverBg: "rgba(158,167,179,0.1)",
                                    scrollbarThumbBg: "rgba(158,167,179,0.4)",
                                    headerLabelText: "#f0f3f6",
                                    headerLabelOpenText: "#f0f3f6",
                                    headerBorder: "#7a828e",
                                    headerIcon: "#f0f3f6",
                                    lineText: "#f0f3f6",
                                    lineNumText: "#9ea7b3",
                                    lineTimestampText: "#9ea7b3",
                                    lineHoverBg: "rgba(158,167,179,0.1)",
                                    lineSelectedBg: "rgba(64,158,255,0.15)",
                                    lineSelectedNumText: "#71b7ff",
                                    lineDtFmText: "#0a0c10",
                                    lineDtFmBg: "#e09b13",
                                    gateBg: "rgba(224,155,19,0.15)",
                                    gateText: "#f0f3f6",
                                    gateWaitingText: "#f0b72f",
                                    stepHeaderOpenBg: "#272b33",
                                    stepErrorText: "#ff6a69",
                                    stepWarningText: "#f0b72f",
                                    loglineText: "#f0f3f6",
                                    loglineNumText: "#9ea7b3",
                                    loglineDebugText: "#b780ff",
                                    loglineErrorText: "#f0f3f6",
                                    loglineErrorNumText: "#9ea7b3",
                                    loglineErrorBg: "rgba(255,106,105,0.15)",
                                    loglineWarningText: "#f0f3f6",
                                    loglineWarningNumText: "#f0b72f",
                                    loglineWarningBg: "rgba(224,155,19,0.15)",
                                    loglineCommandText: "#71b7ff",
                                    loglineSectionText: "#26cd4d",
                                    ansi: {
                                        black: "#0a0c10",
                                        blackBright: "#272b33",
                                        white: "#d9dee3",
                                        whiteBright: "#d9dee3",
                                        gray: "#9ea7b3",
                                        red: "#ff9492",
                                        redBright: "#ffb1af",
                                        green: "#26cd4d",
                                        greenBright: "#4ae168",
                                        yellow: "#f0b72f",
                                        yellowBright: "#f7c843",
                                        blue: "#71b7ff",
                                        blueBright: "#91cbff",
                                        magenta: "#cb9eff",
                                        magentaBright: "#dbb7ff",
                                        cyan: "#76e3ea",
                                        cyanBright: "#b3f0ff",
                                    },
                                },
                                project: {
                                    headerBg: "#0a0c10",
                                    sidebarBg: "#272b33",
                                    gradientIn: "#272b33",
                                    gradientOut: "rgba(39,43,51,0)",
                                },
                                mktg: {
                                    btn: {
                                        bg: "#f6f8fa",
                                    },
                                },
                                avatar: {
                                    bg: "rgba(255,255,255,0.1)",
                                    border: "rgba(255,255,255,0.9)",
                                    stackFade: "#525964",
                                    stackFadeMore: "#272b33",
                                },
                                topicTag: {
                                    border: "#409eff",
                                },
                                counter: {
                                    border: "rgba(0,0,0,0)",
                                },
                                selectMenu: {
                                    backdropBorder: "#7a828e",
                                    tapHighlight: "rgba(82,89,100,0.5)",
                                    tapFocusBg: "#1e60d5",
                                },
                                header: {
                                    text: "rgba(255,255,255,0.7)",
                                    bg: "#272b33",
                                    divider: "#bdc4cc",
                                    logo: "#ffffff",
                                },
                                headerSearch: {
                                    bg: "#0a0c10",
                                    border: "#525964",
                                },
                                sidenav: {
                                    selectedBg: "#272b33",
                                },
                                menu: {
                                    bgActive: "#272b33",
                                },
                                input: {
                                    disabledBg: "rgba(158,167,179,0)",
                                },
                                timeline: {
                                    badgeBg: "#272b33",
                                },
                                ansi: {
                                    black: "#7a828e",
                                    blackBright: "#9ea7b3",
                                    white: "#d9dee3",
                                    whiteBright: "#ffffff",
                                    gray: "#9ea7b3",
                                    red: "#ff9492",
                                    redBright: "#ffb1af",
                                    green: "#26cd4d",
                                    greenBright: "#4ae168",
                                    yellow: "#f0b72f",
                                    yellowBright: "#f7c843",
                                    blue: "#71b7ff",
                                    blueBright: "#91cbff",
                                    magenta: "#cb9eff",
                                    magentaBright: "#dbb7ff",
                                    cyan: "#39c5cf",
                                    cyanBright: "#56d4dd",
                                },
                                btn: {
                                    text: "#f0f3f6",
                                    bg: "#272b33",
                                    border: "#7a828e",
                                    hoverBg: "#525964",
                                    hoverBorder: "#bdc4cc",
                                    activeBg: "hsla(217,10%,33%,1)",
                                    activeBorder: "#9ea7b3",
                                    selectedBg: "rgba(82,89,100,0.9)",
                                    focusBg: "#272b33",
                                    focusBorder: "#bdc4cc",
                                    counterBg: "#525964",
                                    primary: {
                                        text: "#0a0c10",
                                        bg: "#09b43a",
                                        border: "#4ae168",
                                        hoverBg: "#26cd4d",
                                        hoverBorder: "#4ae168",
                                        selectedBg: "#09b43a",
                                        disabledText: "rgba(10,12,16,0.5)",
                                        disabledBg: "rgba(9,180,58,0.6)",
                                        disabledBorder: "rgba(74,225,104,0.4)",
                                        focusBg: "#09b43a",
                                        focusBorder: "#7a828e",
                                        icon: "#0a0c10",
                                        counterBg: "rgba(1,4,9,0.15)",
                                    },
                                    outline: {
                                        text: "#71b7ff",
                                        hoverText: "#71b7ff",
                                        hoverBg: "#525964",
                                        hoverBorder: "#7a828e",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "#2672f3",
                                        selectedBorder: "#7a828e",
                                        disabledText: "rgba(113,183,255,0.5)",
                                        disabledBg: "#0a0c10",
                                        disabledCounterBg:
                                            "rgba(64,158,255,0.05)",
                                        focusBorder: "#7a828e",
                                        counterBg: "rgba(64,158,255,0.1)",
                                    },
                                    danger: {
                                        text: "#ff6a69",
                                        hoverText: "#0a0c10",
                                        hoverBg: "#ff6a69",
                                        hoverBorder: "#ff6a69",
                                        hoverIcon: "#0a0c10",
                                        hoverCounterBg: "rgba(1,4,9,0.15)",
                                        selectedText: "#ffffff",
                                        selectedBg: "#ff4445",
                                        selectedBorder: "#ff9492",
                                        disabledText: "rgba(255,106,105,0.5)",
                                        disabledBg: "#0a0c10",
                                        disabledCounterBg:
                                            "rgba(255,106,105,0.05)",
                                        focusBorder: "#ff6a69",
                                        counterBg: "rgba(1,4,9,0.15)",
                                        icon: "#ff6a69",
                                    },
                                },
                                underlinenav: {
                                    icon: "#f0f3f6",
                                    borderHover: "#bdc4cc",
                                },
                                actionListItem: {
                                    inlineDivider: "#7a828e",
                                    default: {
                                        hoverBg: "#272b33",
                                        hoverBorder: "#7a828e",
                                        activeBg: "#525964",
                                        activeBorder: "#9ea7b3",
                                        selectedBg: "#525964",
                                    },
                                    danger: {
                                        hoverBg: "#ff6a69",
                                        activeBg: "#ff4445",
                                        hoverText: "#0a0c10",
                                    },
                                },
                                switchTrack: {
                                    bg: "#010409",
                                    border: "#7a828e",
                                    checked: {
                                        bg: "rgba(64,158,255,0.35)",
                                        hoverBg: "rgba(64,158,255,0.5)",
                                        activeBg: "rgba(64,158,255,0.65)",
                                        border: "#409eff",
                                    },
                                },
                                switchKnob: {
                                    checked: {
                                        bg: "#409eff",
                                        disabledBg: "#7a828e",
                                    },
                                },
                                fg: {
                                    default: "#f0f3f6",
                                    muted: "#f0f3f6",
                                    subtle: "#9ea7b3",
                                    onEmphasis: "#0a0c10",
                                },
                                canvas: {
                                    default: "#0a0c10",
                                    overlay: "#272b33",
                                    inset: "#010409",
                                    subtle: "#272b33",
                                },
                                border: {
                                    default: "#7a828e",
                                    muted: "#7a828e",
                                    subtle: "#7a828e",
                                },
                                neutral: {
                                    emphasisPlus: "#ffffff",
                                    emphasis: "#9ea7b3",
                                    muted: "rgba(158,167,179,0.4)",
                                    subtle: "rgba(158,167,179,0.1)",
                                },
                                accent: {
                                    fg: "#71b7ff",
                                    emphasis: "#409eff",
                                    muted: "#409eff",
                                    subtle: "rgba(64,158,255,0.15)",
                                },
                                success: {
                                    fg: "#26cd4d",
                                    emphasis: "#09b43a",
                                    muted: "#09b43a",
                                    subtle: "rgba(9,180,58,0.15)",
                                },
                                attention: {
                                    fg: "#f0b72f",
                                    emphasis: "#e09b13",
                                    muted: "#e09b13",
                                    subtle: "rgba(224,155,19,0.15)",
                                },
                                severe: {
                                    fg: "#e7811d",
                                    emphasis: "#e7811d",
                                    muted: "#e7811d",
                                    subtle: "rgba(231,129,29,0.15)",
                                },
                                danger: {
                                    fg: "#ff6a69",
                                    emphasis: "#ff6a69",
                                    muted: "#ff6a69",
                                    subtle: "rgba(255,106,105,0.15)",
                                },
                                open: {
                                    fg: "#26cd4d",
                                    emphasis: "#09b43a",
                                    muted: "rgba(9,180,58,0.4)",
                                    subtle: "rgba(9,180,58,0.15)",
                                },
                                closed: {
                                    fg: "#ff6a69",
                                    emphasis: "#ff6a69",
                                    muted: "rgba(255,106,105,0.4)",
                                    subtle: "rgba(255,106,105,0.15)",
                                },
                                done: {
                                    fg: "#b780ff",
                                    emphasis: "#b87fff",
                                    muted: "#b780ff",
                                    subtle: "rgba(183,128,255,0.15)",
                                },
                                sponsors: {
                                    fg: "#ef6eb1",
                                    emphasis: "#ef6eb1",
                                    muted: "#ef6eb1",
                                    subtle: "rgba(239,110,177,0.15)",
                                },
                                primer: {
                                    fg: {
                                        disabled: "#7a828e",
                                    },
                                    canvas: {
                                        backdrop: "rgba(1,4,9,0.8)",
                                        sticky: "rgba(10,12,16,0.95)",
                                    },
                                    border: {
                                        active: "#FF967D",
                                        contrast: "rgba(255,255,255,0.2)",
                                    },
                                },
                            },
                            shadows: {
                                checks: {
                                    inputShadow:
                                        "0 0 0 1px (obj) => get_1.default(obj, path)",
                                },
                                mktg: {
                                    btn: {
                                        shadow: {
                                            outline:
                                                "rgb(255 255 255 / 25%) 0 0 0 1px inset",
                                            focus: "rgb(255 255 255 / 25%) 0 0 0 4px",
                                            hover: "0 4px 7px rgba(0, 0, 0, 0.15), 0 100px 80px rgba(255, 255, 255, 0.02), 0 42px 33px rgba(255, 255, 255, 0.024), 0 22px 18px rgba(255, 255, 255, 0.028), 0 12px 10px rgba(255, 255, 255, 0.034), 0 7px 5px rgba(255, 255, 255, 0.04), 0 3px 2px rgba(255, 255, 255, 0.07)",
                                            hoverMuted:
                                                "rgb(255 255 255) 0 0 0 2px inset",
                                        },
                                    },
                                },
                                avatar: {
                                    childShadow: "-2px -2px 0 #0a0c10",
                                },
                                overlay: {
                                    shadow: "0 0 0 1px #525964, 0 16px 32px rgba(1,4,9,0.85)",
                                },
                                btn: {
                                    shadow: "0 0 transparent",
                                    insetShadow: "0 0 transparent",
                                    focusShadow:
                                        "0 0 0 3px rgba(189,196,204,0.3)",
                                    shadowActive:
                                        "inset 0 0.15em 0.3em rgba(1,4,9,0.15)",
                                    shadowInputFocus:
                                        "0 0 0 0.2em rgba(64,158,255,0.3)",
                                    primary: {
                                        shadow: "0 0 transparent",
                                        insetShadow: "0 0 transparent",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(46,164,79,0.4)",
                                    },
                                    outline: {
                                        hoverShadow: "0 1px 0 rgba(1,4,9,0.1)",
                                        hoverInsetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(49,139,248,0.4)",
                                    },
                                    danger: {
                                        hoverShadow: "0 0 transparent",
                                        hoverInsetShadow: "0 0 transparent",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(255,106,105,0.4)",
                                    },
                                },
                                shadow: {
                                    small: "0 0 transparent",
                                    medium: "0 3px 6px #010409",
                                    large: "0 8px 24px #010409",
                                    extraLarge: "0 12px 48px #010409",
                                },
                                primer: {
                                    shadow: {
                                        highlight: "0 0 transparent",
                                        inset: "0 0 transparent",
                                        focus: "0 0 0 3px #1e60d5",
                                    },
                                },
                            },
                        },
                        dark_colorblind: {
                            colors: {
                                canvasDefaultTransparent: "rgba(13,17,23,0)",
                                pageHeaderBg: "#0d1117",
                                marketingIcon: {
                                    primary: "#79c0ff",
                                    secondary: "#1f6feb",
                                },
                                diffBlob: {
                                    addition: {
                                        numText: "#c9d1d9",
                                        fg: "#c9d1d9",
                                        numBg: "rgba(88,166,255,0.3)",
                                        lineBg: "rgba(56,139,253,0.15)",
                                        wordBg: "rgba(56,139,253,0.4)",
                                    },
                                    deletion: {
                                        numText: "#c9d1d9",
                                        fg: "#c9d1d9",
                                        numBg: "rgba(212,118,22,0.3)",
                                        lineBg: "rgba(212,118,22,0.15)",
                                        wordBg: "rgba(212,118,22,0.4)",
                                    },
                                    hunk: {
                                        numBg: "rgba(56,139,253,0.4)",
                                    },
                                    expander: {
                                        icon: "#8b949e",
                                    },
                                },
                                diffstat: {
                                    deletionBorder: "rgba(240,246,252,0.1)",
                                    additionBorder: "rgba(240,246,252,0.1)",
                                    additionBg: "#58a6ff",
                                },
                                searchKeyword: {
                                    hl: "rgba(210,153,34,0.4)",
                                },
                                prettylights: {
                                    syntax: {
                                        comment: "#8b949e",
                                        constant: "#79c0ff",
                                        entity: "#d2a8ff",
                                        storageModifierImport: "#c9d1d9",
                                        entityTag: "#a5d6ff",
                                        keyword: "#ec8e2c",
                                        string: "#a5d6ff",
                                        variable: "#fdac54",
                                        brackethighlighterUnmatched: "#d47616",
                                        invalidIllegalText: "#f0f6fc",
                                        invalidIllegalBg: "#6c3906",
                                        carriageReturnText: "#f0f6fc",
                                        carriageReturnBg: "#914d04",
                                        stringRegexp: "#a5d6ff",
                                        markupList: "#f2cc60",
                                        markupHeading: "#1f6feb",
                                        markupItalic: "#c9d1d9",
                                        markupBold: "#c9d1d9",
                                        markupDeletedText: "#ffe2bb",
                                        markupDeletedBg: "#4e2906",
                                        markupInsertedText: "#cae8ff",
                                        markupInsertedBg: "#0c2d6b",
                                        markupChangedText: "#ffe2bb",
                                        markupChangedBg: "#4e2906",
                                        markupIgnoredText: "#c9d1d9",
                                        markupIgnoredBg: "#1158c7",
                                        metaDiffRange: "#d2a8ff",
                                        brackethighlighterAngle: "#8b949e",
                                        sublimelinterGutterMark: "#484f58",
                                        constantOtherReferenceLink: "#a5d6ff",
                                    },
                                },
                                codemirror: {
                                    text: "#c9d1d9",
                                    bg: "#0d1117",
                                    guttersBg: "#0d1117",
                                    guttermarkerText: "#0d1117",
                                    guttermarkerSubtleText: "#6e7681",
                                    linenumberText: "#8b949e",
                                    cursor: "#c9d1d9",
                                    selectionBg: "rgba(56,139,253,0.4)",
                                    activelineBg: "rgba(110,118,129,0.1)",
                                    matchingbracketText: "#c9d1d9",
                                    linesBg: "#0d1117",
                                    syntax: {
                                        comment: "#8b949e",
                                        constant: "#79c0ff",
                                        entity: "#d2a8ff",
                                        keyword: "#ec8e2c",
                                        storage: "#ec8e2c",
                                        string: "#a5d6ff",
                                        support: "#79c0ff",
                                        variable: "#fdac54",
                                    },
                                },
                                checks: {
                                    bg: "#010409",
                                    textPrimary: "#c9d1d9",
                                    textSecondary: "#8b949e",
                                    textLink: "#58a6ff",
                                    btnIcon: "#8b949e",
                                    btnHoverIcon: "#c9d1d9",
                                    btnHoverBg: "rgba(110,118,129,0.1)",
                                    inputText: "#8b949e",
                                    inputPlaceholderText: "#6e7681",
                                    inputFocusText: "#c9d1d9",
                                    inputBg: "#161b22",
                                    donutError: "#d47616",
                                    donutPending: "#d29922",
                                    donutSuccess: "#388bfd",
                                    donutNeutral: "#8b949e",
                                    dropdownText: "#c9d1d9",
                                    dropdownBg: "#161b22",
                                    dropdownBorder: "#30363d",
                                    dropdownShadow: "rgba(1,4,9,0.3)",
                                    dropdownHoverText: "#c9d1d9",
                                    dropdownHoverBg: "rgba(110,118,129,0.1)",
                                    dropdownBtnHoverText: "#c9d1d9",
                                    dropdownBtnHoverBg: "rgba(110,118,129,0.1)",
                                    scrollbarThumbBg: "rgba(110,118,129,0.4)",
                                    headerLabelText: "#8b949e",
                                    headerLabelOpenText: "#c9d1d9",
                                    headerBorder: "#21262d",
                                    headerIcon: "#8b949e",
                                    lineText: "#8b949e",
                                    lineNumText: "#6e7681",
                                    lineTimestampText: "#6e7681",
                                    lineHoverBg: "rgba(110,118,129,0.1)",
                                    lineSelectedBg: "rgba(56,139,253,0.15)",
                                    lineSelectedNumText: "#58a6ff",
                                    lineDtFmText: "#ffffff",
                                    lineDtFmBg: "#9e6a03",
                                    gateBg: "rgba(187,128,9,0.15)",
                                    gateText: "#8b949e",
                                    gateWaitingText: "#d29922",
                                    stepHeaderOpenBg: "#161b22",
                                    stepErrorText: "#d47616",
                                    stepWarningText: "#d29922",
                                    loglineText: "#8b949e",
                                    loglineNumText: "#6e7681",
                                    loglineDebugText: "#a371f7",
                                    loglineErrorText: "#8b949e",
                                    loglineErrorNumText: "#6e7681",
                                    loglineErrorBg: "rgba(212,118,22,0.15)",
                                    loglineWarningText: "#8b949e",
                                    loglineWarningNumText: "#d29922",
                                    loglineWarningBg: "rgba(187,128,9,0.15)",
                                    loglineCommandText: "#58a6ff",
                                    loglineSectionText: "#58a6ff",
                                    ansi: {
                                        black: "#0d1117",
                                        blackBright: "#161b22",
                                        white: "#b1bac4",
                                        whiteBright: "#b1bac4",
                                        gray: "#6e7681",
                                        red: "#ec8e2c",
                                        redBright: "#fdac54",
                                        green: "#58a6ff",
                                        greenBright: "#79c0ff",
                                        yellow: "#d29922",
                                        yellowBright: "#e3b341",
                                        blue: "#58a6ff",
                                        blueBright: "#79c0ff",
                                        magenta: "#bc8cff",
                                        magentaBright: "#d2a8ff",
                                        cyan: "#76e3ea",
                                        cyanBright: "#b3f0ff",
                                    },
                                },
                                project: {
                                    headerBg: "#0d1117",
                                    sidebarBg: "#161b22",
                                    gradientIn: "#161b22",
                                    gradientOut: "rgba(22,27,34,0)",
                                },
                                mktg: {
                                    btn: {
                                        bg: "#f6f8fa",
                                    },
                                },
                                avatar: {
                                    bg: "rgba(255,255,255,0.1)",
                                    border: "rgba(240,246,252,0.1)",
                                    stackFade: "#30363d",
                                    stackFadeMore: "#21262d",
                                },
                                topicTag: {
                                    border: "rgba(0,0,0,0)",
                                },
                                counter: {
                                    border: "rgba(0,0,0,0)",
                                },
                                selectMenu: {
                                    backdropBorder: "#484f58",
                                    tapHighlight: "rgba(48,54,61,0.5)",
                                    tapFocusBg: "#0c2d6b",
                                },
                                header: {
                                    text: "rgba(255,255,255,0.7)",
                                    bg: "#161b22",
                                    divider: "#8b949e",
                                    logo: "#f0f6fc",
                                },
                                headerSearch: {
                                    bg: "#0d1117",
                                    border: "#30363d",
                                },
                                sidenav: {
                                    selectedBg: "#21262d",
                                },
                                menu: {
                                    bgActive: "#161b22",
                                },
                                input: {
                                    disabledBg: "rgba(110,118,129,0)",
                                },
                                timeline: {
                                    badgeBg: "#21262d",
                                },
                                ansi: {
                                    black: "#484f58",
                                    blackBright: "#6e7681",
                                    white: "#b1bac4",
                                    whiteBright: "#ffffff",
                                    gray: "#6e7681",
                                    red: "#ec8e2c",
                                    redBright: "#fdac54",
                                    green: "#58a6ff",
                                    greenBright: "#79c0ff",
                                    yellow: "#d29922",
                                    yellowBright: "#e3b341",
                                    blue: "#58a6ff",
                                    blueBright: "#79c0ff",
                                    magenta: "#bc8cff",
                                    magentaBright: "#d2a8ff",
                                    cyan: "#39c5cf",
                                    cyanBright: "#56d4dd",
                                },
                                btn: {
                                    text: "#c9d1d9",
                                    bg: "#21262d",
                                    border: "rgba(240,246,252,0.1)",
                                    hoverBg: "#30363d",
                                    hoverBorder: "#8b949e",
                                    activeBg: "hsla(212,12%,18%,1)",
                                    activeBorder: "#6e7681",
                                    selectedBg: "#161b22",
                                    focusBg: "#21262d",
                                    focusBorder: "#8b949e",
                                    counterBg: "#30363d",
                                    primary: {
                                        text: "#ffffff",
                                        bg: "#1f6feb",
                                        border: "rgba(240,246,252,0.1)",
                                        hoverBg: "#388bfd",
                                        hoverBorder: "rgba(240,246,252,0.1)",
                                        selectedBg: "#1f6feb",
                                        disabledText: "rgba(255,255,255,0.5)",
                                        disabledBg: "rgba(31,111,235,0.6)",
                                        disabledBorder: "rgba(240,246,252,0.1)",
                                        focusBg: "#1f6feb",
                                        focusBorder: "rgba(240,246,252,0.1)",
                                        icon: "#ffffff",
                                        counterBg: "rgba(255,255,255,0.2)",
                                    },
                                    outline: {
                                        text: "#58a6ff",
                                        hoverText: "#58a6ff",
                                        hoverBg: "#30363d",
                                        hoverBorder: "rgba(240,246,252,0.1)",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "#0d419d",
                                        selectedBorder: "rgba(240,246,252,0.1)",
                                        disabledText: "rgba(88,166,255,0.5)",
                                        disabledBg: "#0d1117",
                                        disabledCounterBg:
                                            "rgba(31,111,235,0.05)",
                                        focusBorder: "rgba(240,246,252,0.1)",
                                        counterBg: "rgba(31,111,235,0.1)",
                                    },
                                    danger: {
                                        text: "#d47616",
                                        hoverText: "#ffffff",
                                        hoverBg: "#b76100",
                                        hoverBorder: "#d47616",
                                        hoverIcon: "#ffffff",
                                        hoverCounterBg: "rgba(255,255,255,0.2)",
                                        selectedText: "#ffffff",
                                        selectedBg: "#914d04",
                                        selectedBorder: "#ec8e2c",
                                        disabledText: "rgba(212,118,22,0.5)",
                                        disabledBg: "#0d1117",
                                        disabledCounterBg:
                                            "rgba(183,97,0,0.05)",
                                        focusBorder: "#d47616",
                                        counterBg: "rgba(183,97,0,0.1)",
                                        icon: "#d47616",
                                    },
                                },
                                underlinenav: {
                                    icon: "#6e7681",
                                    borderHover: "rgba(110,118,129,0.4)",
                                },
                                actionListItem: {
                                    inlineDivider: "rgba(48,54,61,0.48)",
                                    default: {
                                        hoverBg: "rgba(177,186,196,0.12)",
                                        hoverBorder: "rgba(0,0,0,0)",
                                        activeBg: "rgba(177,186,196,0.2)",
                                        activeBorder: "rgba(0,0,0,0)",
                                        selectedBg: "rgba(177,186,196,0.08)",
                                    },
                                    danger: {
                                        hoverBg: "rgba(212,118,22,0.16)",
                                        activeBg: "rgba(212,118,22,0.24)",
                                        hoverText: "#ec8e2c",
                                    },
                                },
                                switchTrack: {
                                    bg: "#010409",
                                    border: "#6e7681",
                                    checked: {
                                        bg: "rgba(31,111,235,0.35)",
                                        hoverBg: "rgba(31,111,235,0.5)",
                                        activeBg: "rgba(31,111,235,0.65)",
                                        border: "#58a6ff",
                                    },
                                },
                                switchKnob: {
                                    checked: {
                                        bg: "#1f6feb",
                                        disabledBg: "#484f58",
                                    },
                                },
                                fg: {
                                    default: "#c9d1d9",
                                    muted: "#8b949e",
                                    subtle: "#6e7681",
                                    onEmphasis: "#ffffff",
                                },
                                canvas: {
                                    default: "#0d1117",
                                    overlay: "#161b22",
                                    inset: "#010409",
                                    subtle: "#161b22",
                                },
                                border: {
                                    default: "#30363d",
                                    muted: "#21262d",
                                    subtle: "rgba(240,246,252,0.1)",
                                },
                                neutral: {
                                    emphasisPlus: "#6e7681",
                                    emphasis: "#6e7681",
                                    muted: "rgba(110,118,129,0.4)",
                                    subtle: "rgba(110,118,129,0.1)",
                                },
                                accent: {
                                    fg: "#58a6ff",
                                    emphasis: "#1f6feb",
                                    muted: "rgba(56,139,253,0.4)",
                                    subtle: "rgba(56,139,253,0.15)",
                                },
                                success: {
                                    fg: "#58a6ff",
                                    emphasis: "#1f6feb",
                                    muted: "rgba(56,139,253,0.4)",
                                    subtle: "rgba(56,139,253,0.15)",
                                },
                                attention: {
                                    fg: "#d29922",
                                    emphasis: "#9e6a03",
                                    muted: "rgba(187,128,9,0.4)",
                                    subtle: "rgba(187,128,9,0.15)",
                                },
                                severe: {
                                    fg: "#d47616",
                                    emphasis: "#b76100",
                                    muted: "rgba(212,118,22,0.4)",
                                    subtle: "rgba(212,118,22,0.15)",
                                },
                                danger: {
                                    fg: "#d47616",
                                    emphasis: "#b76100",
                                    muted: "rgba(212,118,22,0.4)",
                                    subtle: "rgba(212,118,22,0.15)",
                                },
                                open: {
                                    fg: "#ec8e2c",
                                    emphasis: "#b76100",
                                    muted: "rgba(212,118,22,0.4)",
                                    subtle: "rgba(212,118,22,0.15)",
                                },
                                closed: {
                                    fg: "#8b949e",
                                    emphasis: "#6e7681",
                                    muted: "rgba(110,118,129,0.4)",
                                    subtle: "rgba(110,118,129,0.1)",
                                },
                                done: {
                                    fg: "#a371f7",
                                    emphasis: "#8957e5",
                                    muted: "rgba(163,113,247,0.4)",
                                    subtle: "rgba(163,113,247,0.15)",
                                },
                                sponsors: {
                                    fg: "#db61a2",
                                    emphasis: "#bf4b8a",
                                    muted: "rgba(219,97,162,0.4)",
                                    subtle: "rgba(219,97,162,0.15)",
                                },
                                primer: {
                                    fg: {
                                        disabled: "#484f58",
                                    },
                                    canvas: {
                                        backdrop: "rgba(1,4,9,0.8)",
                                        sticky: "rgba(13,17,23,0.95)",
                                    },
                                    border: {
                                        active: "#F78166",
                                        contrast: "rgba(255,255,255,0.2)",
                                    },
                                },
                            },
                            shadows: {
                                checks: {
                                    inputShadow:
                                        "0 0 0 1px (obj) => get_1.default(obj, path)",
                                },
                                mktg: {
                                    btn: {
                                        shadow: {
                                            outline:
                                                "rgb(255 255 255 / 25%) 0 0 0 1px inset",
                                            focus: "rgb(255 255 255 / 25%) 0 0 0 4px",
                                            hover: "0 4px 7px rgba(0, 0, 0, 0.15), 0 100px 80px rgba(255, 255, 255, 0.02), 0 42px 33px rgba(255, 255, 255, 0.024), 0 22px 18px rgba(255, 255, 255, 0.028), 0 12px 10px rgba(255, 255, 255, 0.034), 0 7px 5px rgba(255, 255, 255, 0.04), 0 3px 2px rgba(255, 255, 255, 0.07)",
                                            hoverMuted:
                                                "rgb(255 255 255) 0 0 0 2px inset",
                                        },
                                    },
                                },
                                avatar: {
                                    childShadow: "-2px -2px 0 #0d1117",
                                },
                                overlay: {
                                    shadow: "0 0 0 1px #30363d, 0 16px 32px rgba(1,4,9,0.85)",
                                },
                                btn: {
                                    shadow: "0 0 transparent",
                                    insetShadow: "0 0 transparent",
                                    focusShadow:
                                        "0 0 0 3px rgba(139,148,158,0.3)",
                                    shadowActive:
                                        "inset 0 0.15em 0.3em rgba(1,4,9,0.15)",
                                    shadowInputFocus:
                                        "0 0 0 0.2em rgba(31,111,235,0.3)",
                                    primary: {
                                        shadow: "0 0 transparent",
                                        insetShadow: "0 0 transparent",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(46,164,79,0.4)",
                                    },
                                    outline: {
                                        hoverShadow: "0 1px 0 rgba(1,4,9,0.1)",
                                        hoverInsetShadow:
                                            "inset 0 1px 0 rgba(255,255,255,0.03)",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(17,88,199,0.4)",
                                    },
                                    danger: {
                                        hoverShadow: "0 0 transparent",
                                        hoverInsetShadow: "0 0 transparent",
                                        selectedShadow: "0 0 transparent",
                                        focusShadow:
                                            "0 0 0 3px rgba(212,118,22,0.4)",
                                    },
                                },
                                shadow: {
                                    small: "0 0 transparent",
                                    medium: "0 3px 6px #010409",
                                    large: "0 8px 24px #010409",
                                    extraLarge: "0 12px 48px #010409",
                                },
                                primer: {
                                    shadow: {
                                        highlight: "0 0 transparent",
                                        inset: "0 0 transparent",
                                        focus: "0 0 0 3px #0c2d6b",
                                    },
                                },
                            },
                        },
                    },
                },
            };

            /***/
        },

        /***/ 9996: /***/ function (module) {
            "use strict";

            var isMergeableObject = function isMergeableObject(value) {
                return isNonNullObject(value) && !isSpecial(value);
            };

            function isNonNullObject(value) {
                return !!value && typeof value === "object";
            }

            function isSpecial(value) {
                var stringValue = Object.prototype.toString.call(value);

                return (
                    stringValue === "[object RegExp]" ||
                    stringValue === "[object Date]" ||
                    isReactElement(value)
                );
            }

            // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
            var canUseSymbol = typeof Symbol === "function" && Symbol.for;
            var REACT_ELEMENT_TYPE = canUseSymbol
                ? Symbol.for("react.element")
                : 0xeac7;

            function isReactElement(value) {
                return value.$$typeof === REACT_ELEMENT_TYPE;
            }

            function emptyTarget(val) {
                return Array.isArray(val) ? [] : {};
            }

            function cloneUnlessOtherwiseSpecified(value, options) {
                return options.clone !== false &&
                    options.isMergeableObject(value)
                    ? deepmerge(emptyTarget(value), value, options)
                    : value;
            }

            function defaultArrayMerge(target, source, options) {
                return target.concat(source).map(function (element) {
                    return cloneUnlessOtherwiseSpecified(element, options);
                });
            }

            function getMergeFunction(key, options) {
                if (!options.customMerge) {
                    return deepmerge;
                }
                var customMerge = options.customMerge(key);
                return typeof customMerge === "function"
                    ? customMerge
                    : deepmerge;
            }

            function getEnumerableOwnPropertySymbols(target) {
                return Object.getOwnPropertySymbols
                    ? Object.getOwnPropertySymbols(target).filter(function (
                          symbol
                      ) {
                          return target.propertyIsEnumerable(symbol);
                      })
                    : [];
            }

            function getKeys(target) {
                return Object.keys(target).concat(
                    getEnumerableOwnPropertySymbols(target)
                );
            }

            function propertyIsOnObject(object, property) {
                try {
                    return property in object;
                } catch (_) {
                    return false;
                }
            }

            // Protects from prototype poisoning and unexpected merging up the prototype chain.
            function propertyIsUnsafe(target, key) {
                return (
                    propertyIsOnObject(target, key) && // Properties are safe to merge if they don't exist in the target yet,
                    !(
                        Object.hasOwnProperty.call(target, key) && // unsafe if they exist up the prototype chain,
                        Object.propertyIsEnumerable.call(target, key)
                    )
                ); // and also unsafe if they're nonenumerable.
            }

            function mergeObject(target, source, options) {
                var destination = {};
                if (options.isMergeableObject(target)) {
                    getKeys(target).forEach(function (key) {
                        destination[key] = cloneUnlessOtherwiseSpecified(
                            target[key],
                            options
                        );
                    });
                }
                getKeys(source).forEach(function (key) {
                    if (propertyIsUnsafe(target, key)) {
                        return;
                    }

                    if (
                        propertyIsOnObject(target, key) &&
                        options.isMergeableObject(source[key])
                    ) {
                        destination[key] = getMergeFunction(key, options)(
                            target[key],
                            source[key],
                            options
                        );
                    } else {
                        destination[key] = cloneUnlessOtherwiseSpecified(
                            source[key],
                            options
                        );
                    }
                });
                return destination;
            }

            function deepmerge(target, source, options) {
                options = options || {};
                options.arrayMerge = options.arrayMerge || defaultArrayMerge;
                options.isMergeableObject =
                    options.isMergeableObject || isMergeableObject;
                // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
                // implementations can use it. The caller may not replace it.
                options.cloneUnlessOtherwiseSpecified =
                    cloneUnlessOtherwiseSpecified;

                var sourceIsArray = Array.isArray(source);
                var targetIsArray = Array.isArray(target);
                var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

                if (!sourceAndTargetTypesMatch) {
                    return cloneUnlessOtherwiseSpecified(source, options);
                } else if (sourceIsArray) {
                    return options.arrayMerge(target, source, options);
                } else {
                    return mergeObject(target, source, options);
                }
            }

            deepmerge.all = function deepmergeAll(array, options) {
                if (!Array.isArray(array)) {
                    throw new Error("first argument should be an array");
                }

                return array.reduce(function (prev, next) {
                    return deepmerge(prev, next, options);
                }, {});
            };

            var deepmerge_1 = deepmerge;

            module.exports = deepmerge_1;

            /***/
        },

        /***/ 5202: /***/ function () {
            (function (global, factory) {
                true ? factory() : 0;
            })(this, function () {
                "use strict";

                /**
                 * Applies the :focus-visible polyfill at the given scope.
                 * A scope in this case is either the top-level Document or a Shadow Root.
                 *
                 * @param {(Document|ShadowRoot)} scope
                 * @see https://github.com/WICG/focus-visible
                 */
                function applyFocusVisiblePolyfill(scope) {
                    var hadKeyboardEvent = true;
                    var hadFocusVisibleRecently = false;
                    var hadFocusVisibleRecentlyTimeout = null;

                    var inputTypesAllowlist = {
                        text: true,
                        search: true,
                        url: true,
                        tel: true,
                        email: true,
                        password: true,
                        number: true,
                        date: true,
                        month: true,
                        week: true,
                        time: true,
                        datetime: true,
                        "datetime-local": true,
                    };

                    /**
                     * Helper function for legacy browsers and iframes which sometimes focus
                     * elements like document, body, and non-interactive SVG.
                     * @param {Element} el
                     */
                    function isValidFocusTarget(el) {
                        if (
                            el &&
                            el !== document &&
                            el.nodeName !== "HTML" &&
                            el.nodeName !== "BODY" &&
                            "classList" in el &&
                            "contains" in el.classList
                        ) {
                            return true;
                        }
                        return false;
                    }

                    /**
                     * Computes whether the given element should automatically trigger the
                     * `focus-visible` class being added, i.e. whether it should always match
                     * `:focus-visible` when focused.
                     * @param {Element} el
                     * @return {boolean}
                     */
                    function focusTriggersKeyboardModality(el) {
                        var type = el.type;
                        var tagName = el.tagName;

                        if (
                            tagName === "INPUT" &&
                            inputTypesAllowlist[type] &&
                            !el.readOnly
                        ) {
                            return true;
                        }

                        if (tagName === "TEXTAREA" && !el.readOnly) {
                            return true;
                        }

                        if (el.isContentEditable) {
                            return true;
                        }

                        return false;
                    }

                    /**
                     * Add the `focus-visible` class to the given element if it was not added by
                     * the author.
                     * @param {Element} el
                     */
                    function addFocusVisibleClass(el) {
                        if (el.classList.contains("focus-visible")) {
                            return;
                        }
                        el.classList.add("focus-visible");
                        el.setAttribute("data-focus-visible-added", "");
                    }

                    /**
                     * Remove the `focus-visible` class from the given element if it was not
                     * originally added by the author.
                     * @param {Element} el
                     */
                    function removeFocusVisibleClass(el) {
                        if (!el.hasAttribute("data-focus-visible-added")) {
                            return;
                        }
                        el.classList.remove("focus-visible");
                        el.removeAttribute("data-focus-visible-added");
                    }

                    /**
                     * If the most recent user interaction was via the keyboard;
                     * and the key press did not include a meta, alt/option, or control key;
                     * then the modality is keyboard. Otherwise, the modality is not keyboard.
                     * Apply `focus-visible` to any current active element and keep track
                     * of our keyboard modality state with `hadKeyboardEvent`.
                     * @param {KeyboardEvent} e
                     */
                    function onKeyDown(e) {
                        if (e.metaKey || e.altKey || e.ctrlKey) {
                            return;
                        }

                        if (isValidFocusTarget(scope.activeElement)) {
                            addFocusVisibleClass(scope.activeElement);
                        }

                        hadKeyboardEvent = true;
                    }

                    /**
                     * If at any point a user clicks with a pointing device, ensure that we change
                     * the modality away from keyboard.
                     * This avoids the situation where a user presses a key on an already focused
                     * element, and then clicks on a different element, focusing it with a
                     * pointing device, while we still think we're in keyboard modality.
                     * @param {Event} e
                     */
                    function onPointerDown(e) {
                        hadKeyboardEvent = false;
                    }

                    /**
                     * On `focus`, add the `focus-visible` class to the target if:
                     * - the target received focus as a result of keyboard navigation, or
                     * - the event target is an element that will likely require interaction
                     *   via the keyboard (e.g. a text box)
                     * @param {Event} e
                     */
                    function onFocus(e) {
                        // Prevent IE from focusing the document or HTML element.
                        if (!isValidFocusTarget(e.target)) {
                            return;
                        }

                        if (
                            hadKeyboardEvent ||
                            focusTriggersKeyboardModality(e.target)
                        ) {
                            addFocusVisibleClass(e.target);
                        }
                    }

                    /**
                     * On `blur`, remove the `focus-visible` class from the target.
                     * @param {Event} e
                     */
                    function onBlur(e) {
                        if (!isValidFocusTarget(e.target)) {
                            return;
                        }

                        if (
                            e.target.classList.contains("focus-visible") ||
                            e.target.hasAttribute("data-focus-visible-added")
                        ) {
                            // To detect a tab/window switch, we look for a blur event followed
                            // rapidly by a visibility change.
                            // If we don't see a visibility change within 100ms, it's probably a
                            // regular focus change.
                            hadFocusVisibleRecently = true;
                            window.clearTimeout(hadFocusVisibleRecentlyTimeout);
                            hadFocusVisibleRecentlyTimeout = window.setTimeout(
                                function () {
                                    hadFocusVisibleRecently = false;
                                },
                                100
                            );
                            removeFocusVisibleClass(e.target);
                        }
                    }

                    /**
                     * If the user changes tabs, keep track of whether or not the previously
                     * focused element had .focus-visible.
                     * @param {Event} e
                     */
                    function onVisibilityChange(e) {
                        if (document.visibilityState === "hidden") {
                            // If the tab becomes active again, the browser will handle calling focus
                            // on the element (Safari actually calls it twice).
                            // If this tab change caused a blur on an element with focus-visible,
                            // re-apply the class when the user switches back to the tab.
                            if (hadFocusVisibleRecently) {
                                hadKeyboardEvent = true;
                            }
                            addInitialPointerMoveListeners();
                        }
                    }

                    /**
                     * Add a group of listeners to detect usage of any pointing devices.
                     * These listeners will be added when the polyfill first loads, and anytime
                     * the window is blurred, so that they are active when the window regains
                     * focus.
                     */
                    function addInitialPointerMoveListeners() {
                        document.addEventListener(
                            "mousemove",
                            onInitialPointerMove
                        );
                        document.addEventListener(
                            "mousedown",
                            onInitialPointerMove
                        );
                        document.addEventListener(
                            "mouseup",
                            onInitialPointerMove
                        );
                        document.addEventListener(
                            "pointermove",
                            onInitialPointerMove
                        );
                        document.addEventListener(
                            "pointerdown",
                            onInitialPointerMove
                        );
                        document.addEventListener(
                            "pointerup",
                            onInitialPointerMove
                        );
                        document.addEventListener(
                            "touchmove",
                            onInitialPointerMove
                        );
                        document.addEventListener(
                            "touchstart",
                            onInitialPointerMove
                        );
                        document.addEventListener(
                            "touchend",
                            onInitialPointerMove
                        );
                    }

                    function removeInitialPointerMoveListeners() {
                        document.removeEventListener(
                            "mousemove",
                            onInitialPointerMove
                        );
                        document.removeEventListener(
                            "mousedown",
                            onInitialPointerMove
                        );
                        document.removeEventListener(
                            "mouseup",
                            onInitialPointerMove
                        );
                        document.removeEventListener(
                            "pointermove",
                            onInitialPointerMove
                        );
                        document.removeEventListener(
                            "pointerdown",
                            onInitialPointerMove
                        );
                        document.removeEventListener(
                            "pointerup",
                            onInitialPointerMove
                        );
                        document.removeEventListener(
                            "touchmove",
                            onInitialPointerMove
                        );
                        document.removeEventListener(
                            "touchstart",
                            onInitialPointerMove
                        );
                        document.removeEventListener(
                            "touchend",
                            onInitialPointerMove
                        );
                    }

                    /**
                     * When the polfyill first loads, assume the user is in keyboard modality.
                     * If any event is received from a pointing device (e.g. mouse, pointer,
                     * touch), turn off keyboard modality.
                     * This accounts for situations where focus enters the page from the URL bar.
                     * @param {Event} e
                     */
                    function onInitialPointerMove(e) {
                        // Work around a Safari quirk that fires a mousemove on <html> whenever the
                        // window blurs, even if you're tabbing out of the page. ¯\_(ツ)_/¯
                        if (
                            e.target.nodeName &&
                            e.target.nodeName.toLowerCase() === "html"
                        ) {
                            return;
                        }

                        hadKeyboardEvent = false;
                        removeInitialPointerMoveListeners();
                    }

                    // For some kinds of state, we are interested in changes at the global scope
                    // only. For example, global pointer input, global key presses and global
                    // visibility change should affect the state at every scope:
                    document.addEventListener("keydown", onKeyDown, true);
                    document.addEventListener("mousedown", onPointerDown, true);
                    document.addEventListener(
                        "pointerdown",
                        onPointerDown,
                        true
                    );
                    document.addEventListener(
                        "touchstart",
                        onPointerDown,
                        true
                    );
                    document.addEventListener(
                        "visibilitychange",
                        onVisibilityChange,
                        true
                    );

                    addInitialPointerMoveListeners();

                    // For focus and blur, we specifically care about state changes in the local
                    // scope. This is because focus / blur events that originate from within a
                    // shadow root are not re-dispatched from the host element if it was already
                    // the active element in its own scope:
                    scope.addEventListener("focus", onFocus, true);
                    scope.addEventListener("blur", onBlur, true);

                    // We detect that a node is a ShadowRoot by ensuring that it is a
                    // DocumentFragment and also has a host property. This check covers native
                    // implementation and polyfill implementation transparently. If we only cared
                    // about the native implementation, we could just check if the scope was
                    // an instance of a ShadowRoot.
                    if (
                        scope.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
                        scope.host
                    ) {
                        // Since a ShadowRoot is a special kind of DocumentFragment, it does not
                        // have a root element to add a class to. So, we add this attribute to the
                        // host element instead:
                        scope.host.setAttribute("data-js-focus-visible", "");
                    } else if (scope.nodeType === Node.DOCUMENT_NODE) {
                        document.documentElement.classList.add(
                            "js-focus-visible"
                        );
                        document.documentElement.setAttribute(
                            "data-js-focus-visible",
                            ""
                        );
                    }
                }

                // It is important to wrap all references to global window and document in
                // these checks to support server-side rendering use cases
                // @see https://github.com/WICG/focus-visible/issues/199
                if (
                    typeof window !== "undefined" &&
                    typeof document !== "undefined"
                ) {
                    // Make the polyfill helper globally available. This can be used as a signal
                    // to interested libraries that wish to coordinate with the polyfill for e.g.,
                    // applying the polyfill to a shadow root:
                    window.applyFocusVisiblePolyfill =
                        applyFocusVisiblePolyfill;

                    // Notify interested libraries of the polyfill's presence, in case the
                    // polyfill was loaded lazily:
                    var event;

                    try {
                        event = new CustomEvent("focus-visible-polyfill-ready");
                    } catch (error) {
                        // IE11 does not support using CustomEvent as a constructor directly:
                        event = document.createEvent("CustomEvent");
                        event.initCustomEvent(
                            "focus-visible-polyfill-ready",
                            false,
                            false,
                            {}
                        );
                    }

                    window.dispatchEvent(event);
                }

                if (typeof document !== "undefined") {
                    // Apply the polyfill to the global document, so that no JavaScript
                    // coordination is required to use the polyfill in the top-level document:
                    applyFocusVisiblePolyfill(document);
                }
            });

            /***/
        },

        /***/ 8679: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var reactIs = __webpack_require__(1296);

            /**
             * Copyright 2015, Yahoo! Inc.
             * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
             */
            var REACT_STATICS = {
                childContextTypes: true,
                contextType: true,
                contextTypes: true,
                defaultProps: true,
                displayName: true,
                getDefaultProps: true,
                getDerivedStateFromError: true,
                getDerivedStateFromProps: true,
                mixins: true,
                propTypes: true,
                type: true,
            };
            var KNOWN_STATICS = {
                name: true,
                length: true,
                prototype: true,
                caller: true,
                callee: true,
                arguments: true,
                arity: true,
            };
            var FORWARD_REF_STATICS = {
                $$typeof: true,
                render: true,
                defaultProps: true,
                displayName: true,
                propTypes: true,
            };
            var MEMO_STATICS = {
                $$typeof: true,
                compare: true,
                defaultProps: true,
                displayName: true,
                propTypes: true,
                type: true,
            };
            var TYPE_STATICS = {};
            TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
            TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

            function getStatics(component) {
                // React v16.11 and below
                if (reactIs.isMemo(component)) {
                    return MEMO_STATICS;
                } // React v16.12 and above

                return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
            }

            var defineProperty = Object.defineProperty;
            var getOwnPropertyNames = Object.getOwnPropertyNames;
            var getOwnPropertySymbols = Object.getOwnPropertySymbols;
            var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
            var getPrototypeOf = Object.getPrototypeOf;
            var objectPrototype = Object.prototype;
            function hoistNonReactStatics(
                targetComponent,
                sourceComponent,
                blacklist
            ) {
                if (typeof sourceComponent !== "string") {
                    // don't hoist over string (html) components
                    if (objectPrototype) {
                        var inheritedComponent =
                            getPrototypeOf(sourceComponent);

                        if (
                            inheritedComponent &&
                            inheritedComponent !== objectPrototype
                        ) {
                            hoistNonReactStatics(
                                targetComponent,
                                inheritedComponent,
                                blacklist
                            );
                        }
                    }

                    var keys = getOwnPropertyNames(sourceComponent);

                    if (getOwnPropertySymbols) {
                        keys = keys.concat(
                            getOwnPropertySymbols(sourceComponent)
                        );
                    }

                    var targetStatics = getStatics(targetComponent);
                    var sourceStatics = getStatics(sourceComponent);

                    for (var i = 0; i < keys.length; ++i) {
                        var key = keys[i];

                        if (
                            !KNOWN_STATICS[key] &&
                            !(blacklist && blacklist[key]) &&
                            !(sourceStatics && sourceStatics[key]) &&
                            !(targetStatics && targetStatics[key])
                        ) {
                            var descriptor = getOwnPropertyDescriptor(
                                sourceComponent,
                                key
                            );

                            try {
                                // Avoid failures from read-only properties
                                defineProperty(
                                    targetComponent,
                                    key,
                                    descriptor
                                );
                            } catch (e) {}
                        }
                    }
                }

                return targetComponent;
            }

            module.exports = hoistNonReactStatics;

            /***/
        },

        /***/ 6103: /***/ function (__unused_webpack_module, exports) {
            "use strict";
            /** @license React v16.13.1
             * react-is.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            var b = "function" === typeof Symbol && Symbol.for,
                c = b ? Symbol.for("react.element") : 60103,
                d = b ? Symbol.for("react.portal") : 60106,
                e = b ? Symbol.for("react.fragment") : 60107,
                f = b ? Symbol.for("react.strict_mode") : 60108,
                g = b ? Symbol.for("react.profiler") : 60114,
                h = b ? Symbol.for("react.provider") : 60109,
                k = b ? Symbol.for("react.context") : 60110,
                l = b ? Symbol.for("react.async_mode") : 60111,
                m = b ? Symbol.for("react.concurrent_mode") : 60111,
                n = b ? Symbol.for("react.forward_ref") : 60112,
                p = b ? Symbol.for("react.suspense") : 60113,
                q = b ? Symbol.for("react.suspense_list") : 60120,
                r = b ? Symbol.for("react.memo") : 60115,
                t = b ? Symbol.for("react.lazy") : 60116,
                v = b ? Symbol.for("react.block") : 60121,
                w = b ? Symbol.for("react.fundamental") : 60117,
                x = b ? Symbol.for("react.responder") : 60118,
                y = b ? Symbol.for("react.scope") : 60119;
            function z(a) {
                if ("object" === typeof a && null !== a) {
                    var u = a.$$typeof;
                    switch (u) {
                        case c:
                            switch (((a = a.type), a)) {
                                case l:
                                case m:
                                case e:
                                case g:
                                case f:
                                case p:
                                    return a;
                                default:
                                    switch (((a = a && a.$$typeof), a)) {
                                        case k:
                                        case n:
                                        case t:
                                        case r:
                                        case h:
                                            return a;
                                        default:
                                            return u;
                                    }
                            }
                        case d:
                            return u;
                    }
                }
            }
            function A(a) {
                return z(a) === m;
            }
            exports.AsyncMode = l;
            exports.ConcurrentMode = m;
            exports.ContextConsumer = k;
            exports.ContextProvider = h;
            exports.Element = c;
            exports.ForwardRef = n;
            exports.Fragment = e;
            exports.Lazy = t;
            exports.Memo = r;
            exports.Portal = d;
            exports.Profiler = g;
            exports.StrictMode = f;
            exports.Suspense = p;
            exports.isAsyncMode = function (a) {
                return A(a) || z(a) === l;
            };
            exports.isConcurrentMode = A;
            exports.isContextConsumer = function (a) {
                return z(a) === k;
            };
            exports.isContextProvider = function (a) {
                return z(a) === h;
            };
            exports.isElement = function (a) {
                return "object" === typeof a && null !== a && a.$$typeof === c;
            };
            exports.isForwardRef = function (a) {
                return z(a) === n;
            };
            exports.isFragment = function (a) {
                return z(a) === e;
            };
            exports.isLazy = function (a) {
                return z(a) === t;
            };
            exports.isMemo = function (a) {
                return z(a) === r;
            };
            exports.isPortal = function (a) {
                return z(a) === d;
            };
            exports.isProfiler = function (a) {
                return z(a) === g;
            };
            exports.isStrictMode = function (a) {
                return z(a) === f;
            };
            exports.isSuspense = function (a) {
                return z(a) === p;
            };
            exports.isValidElementType = function (a) {
                return (
                    "string" === typeof a ||
                    "function" === typeof a ||
                    a === e ||
                    a === m ||
                    a === g ||
                    a === f ||
                    a === p ||
                    a === q ||
                    ("object" === typeof a &&
                        null !== a &&
                        (a.$$typeof === t ||
                            a.$$typeof === r ||
                            a.$$typeof === h ||
                            a.$$typeof === k ||
                            a.$$typeof === n ||
                            a.$$typeof === w ||
                            a.$$typeof === x ||
                            a.$$typeof === y ||
                            a.$$typeof === v))
                );
            };
            exports.typeOf = z;

            /***/
        },

        /***/ 1296: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            if (true) {
                module.exports = __webpack_require__(6103);
            } else {
            }

            /***/
        },

        /***/ 6086: /***/ function (module) {
            "use strict";

            var assign = Object.assign.bind(Object);
            module.exports = assign;
            module.exports["default"] = module.exports;

            //# sourceMappingURL=object-assign.js.map

            /***/
        },

        /***/ 3454: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var ref, ref1;
            module.exports =
                ((ref = __webpack_require__.g.process) === null ||
                ref === void 0
                    ? void 0
                    : ref.env) &&
                typeof ((ref1 = __webpack_require__.g.process) === null ||
                ref1 === void 0
                    ? void 0
                    : ref1.env) === "object"
                    ? __webpack_require__.g.process
                    : __webpack_require__(7663);

            //# sourceMappingURL=process.js.map

            /***/
        },

        /***/ 1118: /***/ function (
            __unused_webpack_module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/_app",
                function () {
                    return __webpack_require__(2078);
                },
            ]);
            if (false) {
            }

            /***/
        },

        /***/ 2078: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            // ESM COMPAT FLAG
            __webpack_require__.r(__webpack_exports__);

            // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                default: function () {
                    return /* binding */ _app;
                },
            });

            // NAMESPACE OBJECT: ./node_modules/styled-system/dist/index.esm.js
            var styled_system_dist_index_esm_namespaceObject = {};
            __webpack_require__.r(styled_system_dist_index_esm_namespaceObject);
            __webpack_require__.d(
                styled_system_dist_index_esm_namespaceObject,
                {
                    alignContent: function () {
                        return alignContent;
                    },
                    alignItems: function () {
                        return alignItems;
                    },
                    alignSelf: function () {
                        return alignSelf;
                    },
                    background: function () {
                        return background;
                    },
                    backgroundImage: function () {
                        return backgroundImage;
                    },
                    backgroundPosition: function () {
                        return backgroundPosition;
                    },
                    backgroundRepeat: function () {
                        return backgroundRepeat;
                    },
                    backgroundSize: function () {
                        return backgroundSize;
                    },
                    border: function () {
                        return border;
                    },
                    borderBottom: function () {
                        return borderBottom;
                    },
                    borderColor: function () {
                        return borderColor;
                    },
                    borderLeft: function () {
                        return borderLeft;
                    },
                    borderRadius: function () {
                        return borderRadius;
                    },
                    borderRight: function () {
                        return borderRight;
                    },
                    borderStyle: function () {
                        return borderStyle;
                    },
                    borderTop: function () {
                        return borderTop;
                    },
                    borderWidth: function () {
                        return borderWidth;
                    },
                    borders: function () {
                        return border_dist_index_esm;
                    },
                    bottom: function () {
                        return bottom;
                    },
                    boxShadow: function () {
                        return shadow_dist_index_esm;
                    },
                    buttonStyle: function () {
                        return buttonStyle;
                    },
                    color: function () {
                        return color;
                    },
                    colorStyle: function () {
                        return colorStyle;
                    },
                    compose: function () {
                        return compose;
                    },
                    createParser: function () {
                        return createParser;
                    },
                    createStyleFunction: function () {
                        return createStyleFunction;
                    },
                    display: function () {
                        return display;
                    },
                    flex: function () {
                        return flex;
                    },
                    flexBasis: function () {
                        return flexBasis;
                    },
                    flexDirection: function () {
                        return flexDirection;
                    },
                    flexGrow: function () {
                        return flexGrow;
                    },
                    flexShrink: function () {
                        return flexShrink;
                    },
                    flexWrap: function () {
                        return flexWrap;
                    },
                    flexbox: function () {
                        return flexbox;
                    },
                    fontFamily: function () {
                        return fontFamily;
                    },
                    fontSize: function () {
                        return fontSize;
                    },
                    fontStyle: function () {
                        return fontStyle;
                    },
                    fontWeight: function () {
                        return fontWeight;
                    },
                    get: function () {
                        return get;
                    },
                    grid: function () {
                        return grid;
                    },
                    gridArea: function () {
                        return gridArea;
                    },
                    gridAutoColumns: function () {
                        return gridAutoColumns;
                    },
                    gridAutoFlow: function () {
                        return gridAutoFlow;
                    },
                    gridAutoRows: function () {
                        return gridAutoRows;
                    },
                    gridColumn: function () {
                        return gridColumn;
                    },
                    gridColumnGap: function () {
                        return gridColumnGap;
                    },
                    gridGap: function () {
                        return gridGap;
                    },
                    gridRow: function () {
                        return gridRow;
                    },
                    gridRowGap: function () {
                        return gridRowGap;
                    },
                    gridTemplateAreas: function () {
                        return gridTemplateAreas;
                    },
                    gridTemplateColumns: function () {
                        return gridTemplateColumns;
                    },
                    gridTemplateRows: function () {
                        return gridTemplateRows;
                    },
                    height: function () {
                        return height;
                    },
                    justifyContent: function () {
                        return justifyContent;
                    },
                    justifyItems: function () {
                        return justifyItems;
                    },
                    justifySelf: function () {
                        return justifySelf;
                    },
                    layout: function () {
                        return layout;
                    },
                    left: function () {
                        return left;
                    },
                    letterSpacing: function () {
                        return letterSpacing;
                    },
                    lineHeight: function () {
                        return lineHeight;
                    },
                    margin: function () {
                        return margin;
                    },
                    maxHeight: function () {
                        return maxHeight;
                    },
                    maxWidth: function () {
                        return maxWidth;
                    },
                    minHeight: function () {
                        return minHeight;
                    },
                    minWidth: function () {
                        return minWidth;
                    },
                    opacity: function () {
                        return opacity;
                    },
                    order: function () {
                        return order;
                    },
                    overflow: function () {
                        return overflow;
                    },
                    overflowX: function () {
                        return overflowX;
                    },
                    overflowY: function () {
                        return overflowY;
                    },
                    padding: function () {
                        return padding;
                    },
                    position: function () {
                        return position;
                    },
                    right: function () {
                        return right;
                    },
                    shadow: function () {
                        return shadow;
                    },
                    size: function () {
                        return size;
                    },
                    space: function () {
                        return space;
                    },
                    style: function () {
                        return style;
                    },
                    system: function () {
                        return system;
                    },
                    textAlign: function () {
                        return textAlign;
                    },
                    textShadow: function () {
                        return shadow_dist_index_esm;
                    },
                    textStyle: function () {
                        return textStyle;
                    },
                    top: function () {
                        return index_esm_top;
                    },
                    typography: function () {
                        return typography;
                    },
                    variant: function () {
                        return variant;
                    },
                    verticalAlign: function () {
                        return verticalAlign;
                    },
                    width: function () {
                        return width;
                    },
                    zIndex: function () {
                        return zIndex;
                    },
                }
            );

            // EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
            var jsx_runtime = __webpack_require__(5893);
            // EXTERNAL MODULE: ./node_modules/react-is/index.js
            var react_is = __webpack_require__(9864);
            // EXTERNAL MODULE: ./node_modules/react/index.js
            var react = __webpack_require__(7294);
            // EXTERNAL MODULE: ./node_modules/shallowequal/index.js
            var shallowequal = __webpack_require__(6774);
            var shallowequal_default =
                /*#__PURE__*/ __webpack_require__.n(shallowequal); // CONCATENATED MODULE: ./node_modules/@emotion/stylis/dist/stylis.browser.esm.js
            function stylis_min(W) {
                function M(d, c, e, h, a) {
                    for (
                        var m = 0,
                            b = 0,
                            v = 0,
                            n = 0,
                            q,
                            g,
                            x = 0,
                            K = 0,
                            k,
                            u = (k = q = 0),
                            l = 0,
                            r = 0,
                            I = 0,
                            t = 0,
                            B = e.length,
                            J = B - 1,
                            y,
                            f = "",
                            p = "",
                            F = "",
                            G = "",
                            C;
                        l < B;

                    ) {
                        g = e.charCodeAt(l);
                        l === J &&
                            0 !== b + n + v + m &&
                            (0 !== b && (g = 47 === b ? 10 : 47),
                            (n = v = m = 0),
                            B++,
                            J++);

                        if (0 === b + n + v + m) {
                            if (
                                l === J &&
                                (0 < r && (f = f.replace(N, "")),
                                0 < f.trim().length)
                            ) {
                                switch (g) {
                                    case 32:
                                    case 9:
                                    case 59:
                                    case 13:
                                    case 10:
                                        break;

                                    default:
                                        f += e.charAt(l);
                                }

                                g = 59;
                            }

                            switch (g) {
                                case 123:
                                    f = f.trim();
                                    q = f.charCodeAt(0);
                                    k = 1;

                                    for (t = ++l; l < B; ) {
                                        switch ((g = e.charCodeAt(l))) {
                                            case 123:
                                                k++;
                                                break;

                                            case 125:
                                                k--;
                                                break;

                                            case 47:
                                                switch (
                                                    (g = e.charCodeAt(l + 1))
                                                ) {
                                                    case 42:
                                                    case 47:
                                                        a: {
                                                            for (
                                                                u = l + 1;
                                                                u < J;
                                                                ++u
                                                            ) {
                                                                switch (
                                                                    e.charCodeAt(
                                                                        u
                                                                    )
                                                                ) {
                                                                    case 47:
                                                                        if (
                                                                            42 ===
                                                                                g &&
                                                                            42 ===
                                                                                e.charCodeAt(
                                                                                    u -
                                                                                        1
                                                                                ) &&
                                                                            l +
                                                                                2 !==
                                                                                u
                                                                        ) {
                                                                            l =
                                                                                u +
                                                                                1;
                                                                            break a;
                                                                        }

                                                                        break;

                                                                    case 10:
                                                                        if (
                                                                            47 ===
                                                                            g
                                                                        ) {
                                                                            l =
                                                                                u +
                                                                                1;
                                                                            break a;
                                                                        }
                                                                }
                                                            }

                                                            l = u;
                                                        }
                                                }

                                                break;

                                            case 91:
                                                g++;

                                            case 40:
                                                g++;

                                            case 34:
                                            case 39:
                                                for (
                                                    ;
                                                    l++ < J &&
                                                    e.charCodeAt(l) !== g;

                                                ) {}
                                        }

                                        if (0 === k) break;
                                        l++;
                                    }

                                    k = e.substring(t, l);
                                    0 === q &&
                                        (q = (f = f
                                            .replace(ca, "")
                                            .trim()).charCodeAt(0));

                                    switch (q) {
                                        case 64:
                                            0 < r && (f = f.replace(N, ""));
                                            g = f.charCodeAt(1);

                                            switch (g) {
                                                case 100:
                                                case 109:
                                                case 115:
                                                case 45:
                                                    r = c;
                                                    break;

                                                default:
                                                    r = O;
                                            }

                                            k = M(c, r, k, g, a + 1);
                                            t = k.length;
                                            0 < A &&
                                                ((r = X(O, f, I)),
                                                (C = H(
                                                    3,
                                                    k,
                                                    r,
                                                    c,
                                                    D,
                                                    z,
                                                    t,
                                                    g,
                                                    a,
                                                    h
                                                )),
                                                (f = r.join("")),
                                                void 0 !== C &&
                                                    0 ===
                                                        (t = (k = C.trim())
                                                            .length) &&
                                                    ((g = 0), (k = "")));
                                            if (0 < t)
                                                switch (g) {
                                                    case 115:
                                                        f = f.replace(da, ea);

                                                    case 100:
                                                    case 109:
                                                    case 45:
                                                        k = f + "{" + k + "}";
                                                        break;

                                                    case 107:
                                                        f = f.replace(
                                                            fa,
                                                            "$1 $2"
                                                        );
                                                        k = f + "{" + k + "}";
                                                        k =
                                                            1 === w ||
                                                            (2 === w &&
                                                                L("@" + k, 3))
                                                                ? "@-webkit-" +
                                                                  k +
                                                                  "@" +
                                                                  k
                                                                : "@" + k;
                                                        break;

                                                    default:
                                                        (k = f + k),
                                                            112 === h &&
                                                                (k =
                                                                    ((p += k),
                                                                    ""));
                                                }
                                            else k = "";
                                            break;

                                        default:
                                            k = M(c, X(c, f, I), k, h, a + 1);
                                    }

                                    F += k;
                                    k = I = r = u = q = 0;
                                    f = "";
                                    g = e.charCodeAt(++l);
                                    break;

                                case 125:
                                case 59:
                                    f = (0 < r ? f.replace(N, "") : f).trim();
                                    if (1 < (t = f.length))
                                        switch (
                                            (0 === u &&
                                                ((q = f.charCodeAt(0)),
                                                45 === q ||
                                                    (96 < q && 123 > q)) &&
                                                (t = (f = f.replace(" ", ":"))
                                                    .length),
                                            0 < A &&
                                                void 0 !==
                                                    (C = H(
                                                        1,
                                                        f,
                                                        c,
                                                        d,
                                                        D,
                                                        z,
                                                        p.length,
                                                        h,
                                                        a,
                                                        h
                                                    )) &&
                                                0 ===
                                                    (t = (f = C.trim())
                                                        .length) &&
                                                (f = "\x00\x00"),
                                            (q = f.charCodeAt(0)),
                                            (g = f.charCodeAt(1)),
                                            q)
                                        ) {
                                            case 0:
                                                break;

                                            case 64:
                                                if (105 === g || 99 === g) {
                                                    G += f + e.charAt(l);
                                                    break;
                                                }

                                            default:
                                                58 !== f.charCodeAt(t - 1) &&
                                                    (p += P(
                                                        f,
                                                        q,
                                                        g,
                                                        f.charCodeAt(2)
                                                    ));
                                        }
                                    I = r = u = q = 0;
                                    f = "";
                                    g = e.charCodeAt(++l);
                            }
                        }

                        switch (g) {
                            case 13:
                            case 10:
                                47 === b
                                    ? (b = 0)
                                    : 0 === 1 + q &&
                                      107 !== h &&
                                      0 < f.length &&
                                      ((r = 1), (f += "\x00"));
                                0 < A * Y &&
                                    H(0, f, c, d, D, z, p.length, h, a, h);
                                z = 1;
                                D++;
                                break;

                            case 59:
                            case 125:
                                if (0 === b + n + v + m) {
                                    z++;
                                    break;
                                }

                            default:
                                z++;
                                y = e.charAt(l);

                                switch (g) {
                                    case 9:
                                    case 32:
                                        if (0 === n + m + b)
                                            switch (x) {
                                                case 44:
                                                case 58:
                                                case 9:
                                                case 32:
                                                    y = "";
                                                    break;

                                                default:
                                                    32 !== g && (y = " ");
                                            }
                                        break;

                                    case 0:
                                        y = "\\0";
                                        break;

                                    case 12:
                                        y = "\\f";
                                        break;

                                    case 11:
                                        y = "\\v";
                                        break;

                                    case 38:
                                        0 === n + b + m &&
                                            ((r = I = 1), (y = "\f" + y));
                                        break;

                                    case 108:
                                        if (0 === n + b + m + E && 0 < u)
                                            switch (l - u) {
                                                case 2:
                                                    112 === x &&
                                                        58 ===
                                                            e.charCodeAt(
                                                                l - 3
                                                            ) &&
                                                        (E = x);

                                                case 8:
                                                    111 === K && (E = K);
                                            }
                                        break;

                                    case 58:
                                        0 === n + b + m && (u = l);
                                        break;

                                    case 44:
                                        0 === b + v + n + m &&
                                            ((r = 1), (y += "\r"));
                                        break;

                                    case 34:
                                    case 39:
                                        0 === b &&
                                            (n = n === g ? 0 : 0 === n ? g : n);
                                        break;

                                    case 91:
                                        0 === n + b + v && m++;
                                        break;

                                    case 93:
                                        0 === n + b + v && m--;
                                        break;

                                    case 41:
                                        0 === n + b + m && v--;
                                        break;

                                    case 40:
                                        if (0 === n + b + m) {
                                            if (0 === q)
                                                switch (2 * x + 3 * K) {
                                                    case 533:
                                                        break;

                                                    default:
                                                        q = 1;
                                                }
                                            v++;
                                        }

                                        break;

                                    case 64:
                                        0 === b + v + n + m + u + k && (k = 1);
                                        break;

                                    case 42:
                                    case 47:
                                        if (!(0 < n + m + v))
                                            switch (b) {
                                                case 0:
                                                    switch (
                                                        2 * g +
                                                        3 * e.charCodeAt(l + 1)
                                                    ) {
                                                        case 235:
                                                            b = 47;
                                                            break;

                                                        case 220:
                                                            (t = l), (b = 42);
                                                    }

                                                    break;

                                                case 42:
                                                    47 === g &&
                                                        42 === x &&
                                                        t + 2 !== l &&
                                                        (33 ===
                                                            e.charCodeAt(
                                                                t + 2
                                                            ) &&
                                                            (p += e.substring(
                                                                t,
                                                                l + 1
                                                            )),
                                                        (y = ""),
                                                        (b = 0));
                                            }
                                }

                                0 === b && (f += y);
                        }

                        K = x;
                        x = g;
                        l++;
                    }

                    t = p.length;

                    if (0 < t) {
                        r = c;
                        if (
                            0 < A &&
                            ((C = H(2, p, r, d, D, z, t, h, a, h)),
                            void 0 !== C && 0 === (p = C).length)
                        )
                            return G + p + F;
                        p = r.join(",") + "{" + p + "}";

                        if (0 !== w * E) {
                            2 !== w || L(p, 2) || (E = 0);

                            switch (E) {
                                case 111:
                                    p = p.replace(ha, ":-moz-$1") + p;
                                    break;

                                case 112:
                                    p =
                                        p.replace(Q, "::-webkit-input-$1") +
                                        p.replace(Q, "::-moz-$1") +
                                        p.replace(Q, ":-ms-input-$1") +
                                        p;
                            }

                            E = 0;
                        }
                    }

                    return G + p + F;
                }

                function X(d, c, e) {
                    var h = c.trim().split(ia);
                    c = h;
                    var a = h.length,
                        m = d.length;

                    switch (m) {
                        case 0:
                        case 1:
                            var b = 0;

                            for (d = 0 === m ? "" : d[0] + " "; b < a; ++b) {
                                c[b] = Z(d, c[b], e).trim();
                            }

                            break;

                        default:
                            var v = (b = 0);

                            for (c = []; b < a; ++b) {
                                for (var n = 0; n < m; ++n) {
                                    c[v++] = Z(d[n] + " ", h[b], e).trim();
                                }
                            }
                    }

                    return c;
                }

                function Z(d, c, e) {
                    var h = c.charCodeAt(0);
                    33 > h && (h = (c = c.trim()).charCodeAt(0));

                    switch (h) {
                        case 38:
                            return c.replace(F, "$1" + d.trim());

                        case 58:
                            return d.trim() + c.replace(F, "$1" + d.trim());

                        default:
                            if (0 < 1 * e && 0 < c.indexOf("\f"))
                                return c.replace(
                                    F,
                                    (58 === d.charCodeAt(0) ? "" : "$1") +
                                        d.trim()
                                );
                    }

                    return d + c;
                }

                function P(d, c, e, h) {
                    var a = d + ";",
                        m = 2 * c + 3 * e + 4 * h;

                    if (944 === m) {
                        d = a.indexOf(":", 9) + 1;
                        var b = a.substring(d, a.length - 1).trim();
                        b = a.substring(0, d).trim() + b + ";";
                        return 1 === w || (2 === w && L(b, 1))
                            ? "-webkit-" + b + b
                            : b;
                    }

                    if (0 === w || (2 === w && !L(a, 1))) return a;

                    switch (m) {
                        case 1015:
                            return 97 === a.charCodeAt(10)
                                ? "-webkit-" + a + a
                                : a;

                        case 951:
                            return 116 === a.charCodeAt(3)
                                ? "-webkit-" + a + a
                                : a;

                        case 963:
                            return 110 === a.charCodeAt(5)
                                ? "-webkit-" + a + a
                                : a;

                        case 1009:
                            if (100 !== a.charCodeAt(4)) break;

                        case 969:
                        case 942:
                            return "-webkit-" + a + a;

                        case 978:
                            return "-webkit-" + a + "-moz-" + a + a;

                        case 1019:
                        case 983:
                            return (
                                "-webkit-" + a + "-moz-" + a + "-ms-" + a + a
                            );

                        case 883:
                            if (45 === a.charCodeAt(8))
                                return "-webkit-" + a + a;
                            if (0 < a.indexOf("image-set(", 11))
                                return a.replace(ja, "$1-webkit-$2") + a;
                            break;

                        case 932:
                            if (45 === a.charCodeAt(4))
                                switch (a.charCodeAt(5)) {
                                    case 103:
                                        return (
                                            "-webkit-box-" +
                                            a.replace("-grow", "") +
                                            "-webkit-" +
                                            a +
                                            "-ms-" +
                                            a.replace("grow", "positive") +
                                            a
                                        );

                                    case 115:
                                        return (
                                            "-webkit-" +
                                            a +
                                            "-ms-" +
                                            a.replace("shrink", "negative") +
                                            a
                                        );

                                    case 98:
                                        return (
                                            "-webkit-" +
                                            a +
                                            "-ms-" +
                                            a.replace(
                                                "basis",
                                                "preferred-size"
                                            ) +
                                            a
                                        );
                                }
                            return "-webkit-" + a + "-ms-" + a + a;

                        case 964:
                            return "-webkit-" + a + "-ms-flex-" + a + a;

                        case 1023:
                            if (99 !== a.charCodeAt(8)) break;
                            b = a
                                .substring(a.indexOf(":", 15))
                                .replace("flex-", "")
                                .replace("space-between", "justify");
                            return (
                                "-webkit-box-pack" +
                                b +
                                "-webkit-" +
                                a +
                                "-ms-flex-pack" +
                                b +
                                a
                            );

                        case 1005:
                            return ka.test(a)
                                ? a.replace(aa, ":-webkit-") +
                                      a.replace(aa, ":-moz-") +
                                      a
                                : a;

                        case 1e3:
                            b = a.substring(13).trim();
                            c = b.indexOf("-") + 1;

                            switch (b.charCodeAt(0) + b.charCodeAt(c)) {
                                case 226:
                                    b = a.replace(G, "tb");
                                    break;

                                case 232:
                                    b = a.replace(G, "tb-rl");
                                    break;

                                case 220:
                                    b = a.replace(G, "lr");
                                    break;

                                default:
                                    return a;
                            }

                            return "-webkit-" + a + "-ms-" + b + a;

                        case 1017:
                            if (-1 === a.indexOf("sticky", 9)) break;

                        case 975:
                            c = (a = d).length - 10;
                            b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a)
                                .substring(d.indexOf(":", 7) + 1)
                                .trim();

                            switch (
                                (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0))
                            ) {
                                case 203:
                                    if (111 > b.charCodeAt(8)) break;

                                case 115:
                                    a = a.replace(b, "-webkit-" + b) + ";" + a;
                                    break;

                                case 207:
                                case 102:
                                    a =
                                        a.replace(
                                            b,
                                            "-webkit-" +
                                                (102 < m ? "inline-" : "") +
                                                "box"
                                        ) +
                                        ";" +
                                        a.replace(b, "-webkit-" + b) +
                                        ";" +
                                        a.replace(b, "-ms-" + b + "box") +
                                        ";" +
                                        a;
                            }

                            return a + ";";

                        case 938:
                            if (45 === a.charCodeAt(5))
                                switch (a.charCodeAt(6)) {
                                    case 105:
                                        return (
                                            (b = a.replace("-items", "")),
                                            "-webkit-" +
                                                a +
                                                "-webkit-box-" +
                                                b +
                                                "-ms-flex-" +
                                                b +
                                                a
                                        );

                                    case 115:
                                        return (
                                            "-webkit-" +
                                            a +
                                            "-ms-flex-item-" +
                                            a.replace(ba, "") +
                                            a
                                        );

                                    default:
                                        return (
                                            "-webkit-" +
                                            a +
                                            "-ms-flex-line-pack" +
                                            a
                                                .replace("align-content", "")
                                                .replace(ba, "") +
                                            a
                                        );
                                }
                            break;

                        case 973:
                        case 989:
                            if (
                                45 !== a.charCodeAt(3) ||
                                122 === a.charCodeAt(4)
                            )
                                break;

                        case 931:
                        case 953:
                            if (!0 === la.test(d))
                                return 115 ===
                                    (b = d.substring(
                                        d.indexOf(":") + 1
                                    )).charCodeAt(0)
                                    ? P(
                                          d.replace(
                                              "stretch",
                                              "fill-available"
                                          ),
                                          c,
                                          e,
                                          h
                                      ).replace(":fill-available", ":stretch")
                                    : a.replace(b, "-webkit-" + b) +
                                          a.replace(
                                              b,
                                              "-moz-" + b.replace("fill-", "")
                                          ) +
                                          a;
                            break;

                        case 962:
                            if (
                                ((a =
                                    "-webkit-" +
                                    a +
                                    (102 === a.charCodeAt(5)
                                        ? "-ms-" + a
                                        : "") +
                                    a),
                                211 === e + h &&
                                    105 === a.charCodeAt(13) &&
                                    0 < a.indexOf("transform", 10))
                            )
                                return (
                                    a
                                        .substring(0, a.indexOf(";", 27) + 1)
                                        .replace(ma, "$1-webkit-$2") + a
                                );
                    }

                    return a;
                }

                function L(d, c) {
                    var e = d.indexOf(1 === c ? ":" : "{"),
                        h = d.substring(0, 3 !== c ? e : 10);
                    e = d.substring(e + 1, d.length - 1);
                    return R(2 !== c ? h : h.replace(na, "$1"), e, c);
                }

                function ea(d, c) {
                    var e = P(
                        c,
                        c.charCodeAt(0),
                        c.charCodeAt(1),
                        c.charCodeAt(2)
                    );
                    return e !== c + ";"
                        ? e.replace(oa, " or ($1)").substring(4)
                        : "(" + c + ")";
                }

                function H(d, c, e, h, a, m, b, v, n, q) {
                    for (var g = 0, x = c, w; g < A; ++g) {
                        switch (
                            (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q))
                        ) {
                            case void 0:
                            case !1:
                            case !0:
                            case null:
                                break;

                            default:
                                x = w;
                        }
                    }

                    if (x !== c) return x;
                }

                function T(d) {
                    switch (d) {
                        case void 0:
                        case null:
                            A = S.length = 0;
                            break;

                        default:
                            if ("function" === typeof d) S[A++] = d;
                            else if ("object" === typeof d)
                                for (var c = 0, e = d.length; c < e; ++c) {
                                    T(d[c]);
                                }
                            else Y = !!d | 0;
                    }

                    return T;
                }

                function U(d) {
                    d = d.prefix;
                    void 0 !== d &&
                        ((R = null),
                        d
                            ? "function" !== typeof d
                                ? (w = 1)
                                : ((w = 2), (R = d))
                            : (w = 0));
                    return U;
                }

                function B(d, c) {
                    var e = d;
                    33 > e.charCodeAt(0) && (e = e.trim());
                    V = e;
                    e = [V];

                    if (0 < A) {
                        var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
                        void 0 !== h && "string" === typeof h && (c = h);
                    }

                    var a = M(O, e, c, 0, 0);
                    0 < A &&
                        ((h = H(-2, a, e, e, D, z, a.length, 0, 0, 0)),
                        void 0 !== h && (a = h));
                    V = "";
                    E = 0;
                    z = D = 1;
                    return a;
                }

                var ca = /^\0+/g,
                    N = /[\0\r\f]/g,
                    aa = /: */g,
                    ka = /zoo|gra/,
                    ma = /([,: ])(transform)/g,
                    ia = /,\r+?/g,
                    F = /([\t\r\n ])*\f?&/g,
                    fa = /@(k\w+)\s*(\S*)\s*/,
                    Q = /::(place)/g,
                    ha = /:(read-only)/g,
                    G = /[svh]\w+-[tblr]{2}/,
                    da = /\(\s*(.*)\s*\)/g,
                    oa = /([\s\S]*?);/g,
                    ba = /-self|flex-/g,
                    na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
                    la = /stretch|:\s*\w+\-(?:conte|avail)/,
                    ja = /([^-])(image-set\()/,
                    z = 1,
                    D = 1,
                    E = 0,
                    w = 1,
                    O = [],
                    S = [],
                    A = 0,
                    R = null,
                    Y = 0,
                    V = "";
                B.use = T;
                B.set = U;
                void 0 !== W && U(W);
                return B;
            }

            /* harmony default export */ var stylis_browser_esm = stylis_min; // CONCATENATED MODULE: ./node_modules/@emotion/unitless/dist/unitless.browser.esm.js

            var unitlessKeys = {
                animationIterationCount: 1,
                borderImageOutset: 1,
                borderImageSlice: 1,
                borderImageWidth: 1,
                boxFlex: 1,
                boxFlexGroup: 1,
                boxOrdinalGroup: 1,
                columnCount: 1,
                columns: 1,
                flex: 1,
                flexGrow: 1,
                flexPositive: 1,
                flexShrink: 1,
                flexNegative: 1,
                flexOrder: 1,
                gridRow: 1,
                gridRowEnd: 1,
                gridRowSpan: 1,
                gridRowStart: 1,
                gridColumn: 1,
                gridColumnEnd: 1,
                gridColumnSpan: 1,
                gridColumnStart: 1,
                msGridRow: 1,
                msGridRowSpan: 1,
                msGridColumn: 1,
                msGridColumnSpan: 1,
                fontWeight: 1,
                lineHeight: 1,
                opacity: 1,
                order: 1,
                orphans: 1,
                tabSize: 1,
                widows: 1,
                zIndex: 1,
                zoom: 1,
                WebkitLineClamp: 1,
                // SVG-related properties
                fillOpacity: 1,
                floodOpacity: 1,
                stopOpacity: 1,
                strokeDasharray: 1,
                strokeDashoffset: 1,
                strokeMiterlimit: 1,
                strokeOpacity: 1,
                strokeWidth: 1,
            };

            /* harmony default export */ var unitless_browser_esm =
                unitlessKeys; // CONCATENATED MODULE: ./node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js

            function memoize(fn) {
                var cache = Object.create(null);
                return function (arg) {
                    if (cache[arg] === undefined) cache[arg] = fn(arg);
                    return cache[arg];
                };
            }

            /* harmony default export */ var emotion_memoize_browser_esm =
                memoize; // CONCATENATED MODULE: ./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.browser.esm.js

            var reactPropsRegex =
                /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

            var isPropValid = /* #__PURE__ */ emotion_memoize_browser_esm(
                function (prop) {
                    return (
                        reactPropsRegex.test(prop) ||
                        (prop.charCodeAt(0) === 111 &&
                            /* o */
                            prop.charCodeAt(1) === 110 &&
                            /* n */
                            prop.charCodeAt(2) < 91)
                    );
                }
                /* Z+1 */
            );

            /* harmony default export */ var emotion_is_prop_valid_browser_esm =
                isPropValid;

            // EXTERNAL MODULE: ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
            var hoist_non_react_statics_cjs = __webpack_require__(8679);
            var hoist_non_react_statics_cjs_default =
                /*#__PURE__*/ __webpack_require__.n(
                    hoist_non_react_statics_cjs
                ); // CONCATENATED MODULE: ./node_modules/styled-components/dist/styled-components.browser.esm.js
            /* provided dependency */ var process = __webpack_require__(3454);
            function v() {
                return (v =
                    Object.assign ||
                    function (e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = arguments[t];
                            for (var r in n)
                                Object.prototype.hasOwnProperty.call(n, r) &&
                                    (e[r] = n[r]);
                        }
                        return e;
                    }).apply(this, arguments);
            }
            var g = function (e, t) {
                    for (var n = [e[0]], r = 0, o = t.length; r < o; r += 1)
                        n.push(t[r], e[r + 1]);
                    return n;
                },
                S = function (t) {
                    return (
                        null !== t &&
                        "object" == typeof t &&
                        "[object Object]" ===
                            (t.toString
                                ? t.toString()
                                : Object.prototype.toString.call(t)) &&
                        !(0, react_is.typeOf)(t)
                    );
                },
                w = Object.freeze([]),
                E = Object.freeze({});
            function b(e) {
                return "function" == typeof e;
            }
            function _(e) {
                return false || e.displayName || e.name || "Component";
            }
            function N(e) {
                return e && "string" == typeof e.styledComponentId;
            }
            var A =
                    ("undefined" != typeof process &&
                        (process.env.REACT_APP_SC_ATTR ||
                            process.env.SC_ATTR)) ||
                    "data-styled",
                C = "5.3.5",
                I = "undefined" != typeof window && "HTMLElement" in window,
                P = Boolean(
                    "boolean" == typeof SC_DISABLE_SPEEDY
                        ? SC_DISABLE_SPEEDY
                        : "undefined" != typeof process &&
                          void 0 !== process.env.REACT_APP_SC_DISABLE_SPEEDY &&
                          "" !== process.env.REACT_APP_SC_DISABLE_SPEEDY
                        ? "false" !== process.env.REACT_APP_SC_DISABLE_SPEEDY &&
                          process.env.REACT_APP_SC_DISABLE_SPEEDY
                        : "undefined" != typeof process &&
                          void 0 !== process.env.SC_DISABLE_SPEEDY &&
                          "" !== process.env.SC_DISABLE_SPEEDY
                        ? "false" !== process.env.SC_DISABLE_SPEEDY &&
                          process.env.SC_DISABLE_SPEEDY
                        : "production" !== "production"
                ),
                O = {},
                R = false ? 0 : {};
            function D() {
                for (
                    var e = arguments.length <= 0 ? void 0 : arguments[0],
                        t = [],
                        n = 1,
                        r = arguments.length;
                    n < r;
                    n += 1
                )
                    t.push(
                        n < 0 || arguments.length <= n ? void 0 : arguments[n]
                    );
                return (
                    t.forEach(function (t) {
                        e = e.replace(/%[a-z]/, t);
                    }),
                    e
                );
            }
            function j(e) {
                for (
                    var t = arguments.length,
                        n = new Array(t > 1 ? t - 1 : 0),
                        r = 1;
                    r < t;
                    r++
                )
                    n[r - 1] = arguments[r];
                throw true
                    ? new Error(
                          "An error occurred. See https://git.io/JUIaE#" +
                              e +
                              " for more information." +
                              (n.length > 0 ? " Args: " + n.join(", ") : "")
                      )
                    : 0;
            }
            var T = (function () {
                    function e(e) {
                        (this.groupSizes = new Uint32Array(512)),
                            (this.length = 512),
                            (this.tag = e);
                    }
                    var t = e.prototype;
                    return (
                        (t.indexOfGroup = function (e) {
                            for (var t = 0, n = 0; n < e; n++)
                                t += this.groupSizes[n];
                            return t;
                        }),
                        (t.insertRules = function (e, t) {
                            if (e >= this.groupSizes.length) {
                                for (
                                    var n = this.groupSizes,
                                        r = n.length,
                                        o = r;
                                    e >= o;

                                )
                                    (o <<= 1) < 0 && j(16, "" + e);
                                (this.groupSizes = new Uint32Array(o)),
                                    this.groupSizes.set(n),
                                    (this.length = o);
                                for (var s = r; s < o; s++)
                                    this.groupSizes[s] = 0;
                            }
                            for (
                                var i = this.indexOfGroup(e + 1),
                                    a = 0,
                                    c = t.length;
                                a < c;
                                a++
                            )
                                this.tag.insertRule(i, t[a]) &&
                                    (this.groupSizes[e]++, i++);
                        }),
                        (t.clearGroup = function (e) {
                            if (e < this.length) {
                                var t = this.groupSizes[e],
                                    n = this.indexOfGroup(e),
                                    r = n + t;
                                this.groupSizes[e] = 0;
                                for (var o = n; o < r; o++)
                                    this.tag.deleteRule(n);
                            }
                        }),
                        (t.getGroup = function (e) {
                            var t = "";
                            if (e >= this.length || 0 === this.groupSizes[e])
                                return t;
                            for (
                                var n = this.groupSizes[e],
                                    r = this.indexOfGroup(e),
                                    o = r + n,
                                    s = r;
                                s < o;
                                s++
                            )
                                t += this.tag.getRule(s) + "/*!sc*/\n";
                            return t;
                        }),
                        e
                    );
                })(),
                x = new Map(),
                k = new Map(),
                V = 1,
                B = function (e) {
                    if (x.has(e)) return x.get(e);
                    for (; k.has(V); ) V++;
                    var t = V++;
                    return false && 0, x.set(e, t), k.set(t, e), t;
                },
                z = function (e) {
                    return k.get(e);
                },
                M = function (e, t) {
                    t >= V && (V = t + 1), x.set(e, t), k.set(t, e);
                },
                G = "style[" + A + '][data-styled-version="5.3.5"]',
                L = new RegExp(
                    "^" + A + '\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)'
                ),
                F = function (e, t, n) {
                    for (
                        var r, o = n.split(","), s = 0, i = o.length;
                        s < i;
                        s++
                    )
                        (r = o[s]) && e.registerName(t, r);
                },
                Y = function (e, t) {
                    for (
                        var n = (t.textContent || "").split("/*!sc*/\n"),
                            r = [],
                            o = 0,
                            s = n.length;
                        o < s;
                        o++
                    ) {
                        var i = n[o].trim();
                        if (i) {
                            var a = i.match(L);
                            if (a) {
                                var c = 0 | parseInt(a[1], 10),
                                    u = a[2];
                                0 !== c &&
                                    (M(u, c),
                                    F(e, u, a[3]),
                                    e.getTag().insertRules(c, r)),
                                    (r.length = 0);
                            } else r.push(i);
                        }
                    }
                },
                q = function () {
                    return "undefined" != typeof window &&
                        void 0 !== window.__webpack_nonce__
                        ? window.__webpack_nonce__
                        : null;
                },
                H = function (e) {
                    var t = document.head,
                        n = e || t,
                        r = document.createElement("style"),
                        o = (function (e) {
                            for (
                                var t = e.childNodes, n = t.length;
                                n >= 0;
                                n--
                            ) {
                                var r = t[n];
                                if (r && 1 === r.nodeType && r.hasAttribute(A))
                                    return r;
                            }
                        })(n),
                        s = void 0 !== o ? o.nextSibling : null;
                    r.setAttribute(A, "active"),
                        r.setAttribute("data-styled-version", "5.3.5");
                    var i = q();
                    return (
                        i && r.setAttribute("nonce", i), n.insertBefore(r, s), r
                    );
                },
                $ = (function () {
                    function e(e) {
                        var t = (this.element = H(e));
                        t.appendChild(document.createTextNode("")),
                            (this.sheet = (function (e) {
                                if (e.sheet) return e.sheet;
                                for (
                                    var t = document.styleSheets,
                                        n = 0,
                                        r = t.length;
                                    n < r;
                                    n++
                                ) {
                                    var o = t[n];
                                    if (o.ownerNode === e) return o;
                                }
                                j(17);
                            })(t)),
                            (this.length = 0);
                    }
                    var t = e.prototype;
                    return (
                        (t.insertRule = function (e, t) {
                            try {
                                return (
                                    this.sheet.insertRule(t, e),
                                    this.length++,
                                    !0
                                );
                            } catch (e) {
                                return !1;
                            }
                        }),
                        (t.deleteRule = function (e) {
                            this.sheet.deleteRule(e), this.length--;
                        }),
                        (t.getRule = function (e) {
                            var t = this.sheet.cssRules[e];
                            return void 0 !== t && "string" == typeof t.cssText
                                ? t.cssText
                                : "";
                        }),
                        e
                    );
                })(),
                W = (function () {
                    function e(e) {
                        var t = (this.element = H(e));
                        (this.nodes = t.childNodes), (this.length = 0);
                    }
                    var t = e.prototype;
                    return (
                        (t.insertRule = function (e, t) {
                            if (e <= this.length && e >= 0) {
                                var n = document.createTextNode(t),
                                    r = this.nodes[e];
                                return (
                                    this.element.insertBefore(n, r || null),
                                    this.length++,
                                    !0
                                );
                            }
                            return !1;
                        }),
                        (t.deleteRule = function (e) {
                            this.element.removeChild(this.nodes[e]),
                                this.length--;
                        }),
                        (t.getRule = function (e) {
                            return e < this.length
                                ? this.nodes[e].textContent
                                : "";
                        }),
                        e
                    );
                })(),
                U = (function () {
                    function e(e) {
                        (this.rules = []), (this.length = 0);
                    }
                    var t = e.prototype;
                    return (
                        (t.insertRule = function (e, t) {
                            return (
                                e <= this.length &&
                                (this.rules.splice(e, 0, t), this.length++, !0)
                            );
                        }),
                        (t.deleteRule = function (e) {
                            this.rules.splice(e, 1), this.length--;
                        }),
                        (t.getRule = function (e) {
                            return e < this.length ? this.rules[e] : "";
                        }),
                        e
                    );
                })(),
                J = I,
                X = { isServer: !I, useCSSOMInjection: !P },
                Z = (function () {
                    function e(e, t, n) {
                        void 0 === e && (e = E),
                            void 0 === t && (t = {}),
                            (this.options = v({}, X, {}, e)),
                            (this.gs = t),
                            (this.names = new Map(n)),
                            (this.server = !!e.isServer),
                            !this.server &&
                                I &&
                                J &&
                                ((J = !1),
                                (function (e) {
                                    for (
                                        var t = document.querySelectorAll(G),
                                            n = 0,
                                            r = t.length;
                                        n < r;
                                        n++
                                    ) {
                                        var o = t[n];
                                        o &&
                                            "active" !== o.getAttribute(A) &&
                                            (Y(e, o),
                                            o.parentNode &&
                                                o.parentNode.removeChild(o));
                                    }
                                })(this));
                    }
                    e.registerId = function (e) {
                        return B(e);
                    };
                    var t = e.prototype;
                    return (
                        (t.reconstructWithOptions = function (t, n) {
                            return (
                                void 0 === n && (n = !0),
                                new e(
                                    v({}, this.options, {}, t),
                                    this.gs,
                                    (n && this.names) || void 0
                                )
                            );
                        }),
                        (t.allocateGSInstance = function (e) {
                            return (this.gs[e] = (this.gs[e] || 0) + 1);
                        }),
                        (t.getTag = function () {
                            return (
                                this.tag ||
                                (this.tag =
                                    ((n = (t = this.options).isServer),
                                    (r = t.useCSSOMInjection),
                                    (o = t.target),
                                    (e = n
                                        ? new U(o)
                                        : r
                                        ? new $(o)
                                        : new W(o)),
                                    new T(e)))
                            );
                            var e, t, n, r, o;
                        }),
                        (t.hasNameForId = function (e, t) {
                            return (
                                this.names.has(e) && this.names.get(e).has(t)
                            );
                        }),
                        (t.registerName = function (e, t) {
                            if ((B(e), this.names.has(e)))
                                this.names.get(e).add(t);
                            else {
                                var n = new Set();
                                n.add(t), this.names.set(e, n);
                            }
                        }),
                        (t.insertRules = function (e, t, n) {
                            this.registerName(e, t),
                                this.getTag().insertRules(B(e), n);
                        }),
                        (t.clearNames = function (e) {
                            this.names.has(e) && this.names.get(e).clear();
                        }),
                        (t.clearRules = function (e) {
                            this.getTag().clearGroup(B(e)), this.clearNames(e);
                        }),
                        (t.clearTag = function () {
                            this.tag = void 0;
                        }),
                        (t.toString = function () {
                            return (function (e) {
                                for (
                                    var t = e.getTag(),
                                        n = t.length,
                                        r = "",
                                        o = 0;
                                    o < n;
                                    o++
                                ) {
                                    var s = z(o);
                                    if (void 0 !== s) {
                                        var i = e.names.get(s),
                                            a = t.getGroup(o);
                                        if (i && a && i.size) {
                                            var c =
                                                    A +
                                                    ".g" +
                                                    o +
                                                    '[id="' +
                                                    s +
                                                    '"]',
                                                u = "";
                                            void 0 !== i &&
                                                i.forEach(function (e) {
                                                    e.length > 0 &&
                                                        (u += e + ",");
                                                }),
                                                (r +=
                                                    "" +
                                                    a +
                                                    c +
                                                    '{content:"' +
                                                    u +
                                                    '"}/*!sc*/\n');
                                        }
                                    }
                                }
                                return r;
                            })(this);
                        }),
                        e
                    );
                })(),
                K = /(a)(d)/gi,
                Q = function (e) {
                    return String.fromCharCode(e + (e > 25 ? 39 : 97));
                };
            function ee(e) {
                var t,
                    n = "";
                for (t = Math.abs(e); t > 52; t = (t / 52) | 0)
                    n = Q(t % 52) + n;
                return (Q(t % 52) + n).replace(K, "$1-$2");
            }
            var te = function (e, t) {
                    for (var n = t.length; n; )
                        e = (33 * e) ^ t.charCodeAt(--n);
                    return e;
                },
                ne = function (e) {
                    return te(5381, e);
                };
            function re(e) {
                for (var t = 0; t < e.length; t += 1) {
                    var n = e[t];
                    if (b(n) && !N(n)) return !1;
                }
                return !0;
            }
            var oe = ne("5.3.5"),
                se = (function () {
                    function e(e, t, n) {
                        (this.rules = e),
                            (this.staticRulesId = ""),
                            (this.isStatic =
                                true && (void 0 === n || n.isStatic) && re(e)),
                            (this.componentId = t),
                            (this.baseHash = te(oe, t)),
                            (this.baseStyle = n),
                            Z.registerId(t);
                    }
                    return (
                        (e.prototype.generateAndInjectStyles = function (
                            e,
                            t,
                            n
                        ) {
                            var r = this.componentId,
                                o = [];
                            if (
                                (this.baseStyle &&
                                    o.push(
                                        this.baseStyle.generateAndInjectStyles(
                                            e,
                                            t,
                                            n
                                        )
                                    ),
                                this.isStatic && !n.hash)
                            )
                                if (
                                    this.staticRulesId &&
                                    t.hasNameForId(r, this.staticRulesId)
                                )
                                    o.push(this.staticRulesId);
                                else {
                                    var s = Ne(this.rules, e, t, n).join(""),
                                        i = ee(te(this.baseHash, s) >>> 0);
                                    if (!t.hasNameForId(r, i)) {
                                        var a = n(s, "." + i, void 0, r);
                                        t.insertRules(r, i, a);
                                    }
                                    o.push(i), (this.staticRulesId = i);
                                }
                            else {
                                for (
                                    var c = this.rules.length,
                                        u = te(this.baseHash, n.hash),
                                        l = "",
                                        d = 0;
                                    d < c;
                                    d++
                                ) {
                                    var h = this.rules[d];
                                    if ("string" == typeof h)
                                        (l += h), false && 0;
                                    else if (h) {
                                        var p = Ne(h, e, t, n),
                                            f = Array.isArray(p)
                                                ? p.join("")
                                                : p;
                                        (u = te(u, f + d)), (l += f);
                                    }
                                }
                                if (l) {
                                    var m = ee(u >>> 0);
                                    if (!t.hasNameForId(r, m)) {
                                        var y = n(l, "." + m, void 0, r);
                                        t.insertRules(r, m, y);
                                    }
                                    o.push(m);
                                }
                            }
                            return o.join(" ");
                        }),
                        e
                    );
                })(),
                ie = /^\s*\/\/.*$/gm,
                ae = [":", "[", ".", "#"];
            function ce(e) {
                var t,
                    n,
                    r,
                    o,
                    s = void 0 === e ? E : e,
                    i = s.options,
                    a = void 0 === i ? E : i,
                    c = s.plugins,
                    u = void 0 === c ? w : c,
                    l = new stylis_browser_esm(a),
                    d = [],
                    h = (function (e) {
                        function t(t) {
                            if (t)
                                try {
                                    e(t + "}");
                                } catch (e) {}
                        }
                        return function (n, r, o, s, i, a, c, u, l, d) {
                            switch (n) {
                                case 1:
                                    if (0 === l && 64 === r.charCodeAt(0))
                                        return e(r + ";"), "";
                                    break;
                                case 2:
                                    if (0 === u) return r + "/*|*/";
                                    break;
                                case 3:
                                    switch (u) {
                                        case 102:
                                        case 112:
                                            return e(o[0] + r), "";
                                        default:
                                            return r + (0 === d ? "/*|*/" : "");
                                    }
                                case -2:
                                    r.split("/*|*/}").forEach(t);
                            }
                        };
                    })(function (e) {
                        d.push(e);
                    }),
                    f = function (e, r, s) {
                        return (0 === r && -1 !== ae.indexOf(s[n.length])) ||
                            s.match(o)
                            ? e
                            : "." + t;
                    };
                function m(e, s, i, a) {
                    void 0 === a && (a = "&");
                    var c = e.replace(ie, ""),
                        u = s && i ? i + " " + s + " { " + c + " }" : c;
                    return (
                        (t = a),
                        (n = s),
                        (r = new RegExp("\\" + n + "\\b", "g")),
                        (o = new RegExp("(\\" + n + "\\b){2,}")),
                        l(i || !s ? "" : s, u)
                    );
                }
                return (
                    l.use(
                        [].concat(u, [
                            function (e, t, o) {
                                2 === e &&
                                    o.length &&
                                    o[0].lastIndexOf(n) > 0 &&
                                    (o[0] = o[0].replace(r, f));
                            },
                            h,
                            function (e) {
                                if (-2 === e) {
                                    var t = d;
                                    return (d = []), t;
                                }
                            },
                        ])
                    ),
                    (m.hash = u.length
                        ? u
                              .reduce(function (e, t) {
                                  return t.name || j(15), te(e, t.name);
                              }, 5381)
                              .toString()
                        : ""),
                    m
                );
            }
            var ue = react.createContext(),
                le = ue.Consumer,
                de = react.createContext(),
                he = (de.Consumer, new Z()),
                pe = ce();
            function fe() {
                return (0, react.useContext)(ue) || he;
            }
            function me() {
                return (0, react.useContext)(de) || pe;
            }
            function ye(e) {
                var t = (0, react.useState)(e.stylisPlugins),
                    n = t[0],
                    s = t[1],
                    c = fe(),
                    u = (0, react.useMemo)(
                        function () {
                            var t = c;
                            return (
                                e.sheet
                                    ? (t = e.sheet)
                                    : e.target &&
                                      (t = t.reconstructWithOptions(
                                          { target: e.target },
                                          !1
                                      )),
                                e.disableCSSOMInjection &&
                                    (t = t.reconstructWithOptions({
                                        useCSSOMInjection: !1,
                                    })),
                                t
                            );
                        },
                        [e.disableCSSOMInjection, e.sheet, e.target]
                    ),
                    l = (0, react.useMemo)(
                        function () {
                            return ce({
                                options: { prefix: !e.disableVendorPrefixes },
                                plugins: n,
                            });
                        },
                        [e.disableVendorPrefixes, n]
                    );
                return (
                    (0, react.useEffect)(
                        function () {
                            shallowequal_default()(n, e.stylisPlugins) ||
                                s(e.stylisPlugins);
                        },
                        [e.stylisPlugins]
                    ),
                    react.createElement(
                        ue.Provider,
                        { value: u },
                        react.createElement(
                            de.Provider,
                            { value: l },
                            false ? 0 : e.children
                        )
                    )
                );
            }
            var ve = (function () {
                    function e(e, t) {
                        var n = this;
                        (this.inject = function (e, t) {
                            void 0 === t && (t = pe);
                            var r = n.name + t.hash;
                            e.hasNameForId(n.id, r) ||
                                e.insertRules(
                                    n.id,
                                    r,
                                    t(n.rules, r, "@keyframes")
                                );
                        }),
                            (this.toString = function () {
                                return j(12, String(n.name));
                            }),
                            (this.name = e),
                            (this.id = "sc-keyframes-" + e),
                            (this.rules = t);
                    }
                    return (
                        (e.prototype.getName = function (e) {
                            return void 0 === e && (e = pe), this.name + e.hash;
                        }),
                        e
                    );
                })(),
                ge = /([A-Z])/,
                Se = /([A-Z])/g,
                we = /^ms-/,
                Ee = function (e) {
                    return "-" + e.toLowerCase();
                };
            function be(e) {
                return ge.test(e) ? e.replace(Se, Ee).replace(we, "-ms-") : e;
            }
            var _e = function (e) {
                return null == e || !1 === e || "" === e;
            };
            function Ne(e, n, r, o) {
                if (Array.isArray(e)) {
                    for (var s, i = [], a = 0, c = e.length; a < c; a += 1)
                        "" !== (s = Ne(e[a], n, r, o)) &&
                            (Array.isArray(s) ? i.push.apply(i, s) : i.push(s));
                    return i;
                }
                if (_e(e)) return "";
                if (N(e)) return "." + e.styledComponentId;
                if (b(e)) {
                    if (
                        "function" != typeof (l = e) ||
                        (l.prototype && l.prototype.isReactComponent) ||
                        !n
                    )
                        return e;
                    var u = e(n);
                    return false && 0, Ne(u, n, r, o);
                }
                var l;
                return e instanceof ve
                    ? r
                        ? (e.inject(r, o), e.getName(o))
                        : e
                    : S(e)
                    ? (function e(t, n) {
                          var r,
                              o,
                              s = [];
                          for (var i in t)
                              t.hasOwnProperty(i) &&
                                  !_e(t[i]) &&
                                  ((Array.isArray(t[i]) && t[i].isCss) ||
                                  b(t[i])
                                      ? s.push(be(i) + ":", t[i], ";")
                                      : S(t[i])
                                      ? s.push.apply(s, e(t[i], i))
                                      : s.push(
                                            be(i) +
                                                ": " +
                                                ((r = i),
                                                null == (o = t[i]) ||
                                                "boolean" == typeof o ||
                                                "" === o
                                                    ? ""
                                                    : "number" != typeof o ||
                                                      0 === o ||
                                                      r in unitless_browser_esm
                                                    ? String(o).trim()
                                                    : o + "px") +
                                                ";"
                                        ));
                          return n ? [n + " {"].concat(s, ["}"]) : s;
                      })(e)
                    : e.toString();
            }
            var Ae = function (e) {
                return Array.isArray(e) && (e.isCss = !0), e;
            };
            function Ce(e) {
                for (
                    var t = arguments.length,
                        n = new Array(t > 1 ? t - 1 : 0),
                        r = 1;
                    r < t;
                    r++
                )
                    n[r - 1] = arguments[r];
                return b(e) || S(e)
                    ? Ae(Ne(g(w, [e].concat(n))))
                    : 0 === n.length &&
                      1 === e.length &&
                      "string" == typeof e[0]
                    ? e
                    : Ae(Ne(g(e, n)));
            }
            var Ie = /invalid hook call/i,
                Pe = new Set(),
                Oe = function (e, t) {
                    if (false) {
                        var o, n, r;
                    }
                },
                Re = function (e, t, n) {
                    return (
                        void 0 === n && (n = E),
                        (e.theme !== n.theme && e.theme) || t || n.theme
                    );
                },
                De = /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,
                je = /(^-|-$)/g;
            function Te(e) {
                return e.replace(De, "-").replace(je, "");
            }
            var xe = function (e) {
                return ee(ne(e) >>> 0);
            };
            function ke(e) {
                return "string" == typeof e && (true || 0);
            }
            var Ve = function (e) {
                    return (
                        "function" == typeof e ||
                        ("object" == typeof e &&
                            null !== e &&
                            !Array.isArray(e))
                    );
                },
                Be = function (e) {
                    return (
                        "__proto__" !== e &&
                        "constructor" !== e &&
                        "prototype" !== e
                    );
                };
            function ze(e, t, n) {
                var r = e[n];
                Ve(t) && Ve(r) ? Me(r, t) : (e[n] = t);
            }
            function Me(e) {
                for (
                    var t = arguments.length,
                        n = new Array(t > 1 ? t - 1 : 0),
                        r = 1;
                    r < t;
                    r++
                )
                    n[r - 1] = arguments[r];
                for (var o = 0, s = n; o < s.length; o++) {
                    var i = s[o];
                    if (Ve(i)) for (var a in i) Be(a) && ze(e, i[a], a);
                }
                return e;
            }
            var Ge = react.createContext(),
                Le = Ge.Consumer;
            function Fe(e) {
                var t = (0, react.useContext)(Ge),
                    n = (0, react.useMemo)(
                        function () {
                            return (function (e, t) {
                                if (!e) return j(14);
                                if (b(e)) {
                                    var n = e(t);
                                    return true ? n : 0;
                                }
                                return Array.isArray(e) || "object" != typeof e
                                    ? j(8)
                                    : t
                                    ? v({}, t, {}, e)
                                    : e;
                            })(e.theme, t);
                        },
                        [e.theme, t]
                    );
                return e.children
                    ? react.createElement(Ge.Provider, { value: n }, e.children)
                    : null;
            }
            var Ye = {};
            function qe(e, t, n) {
                var o = N(e),
                    i = !ke(e),
                    a = t.attrs,
                    c = void 0 === a ? w : a,
                    d = t.componentId,
                    h =
                        void 0 === d
                            ? (function (e, t) {
                                  var n = "string" != typeof e ? "sc" : Te(e);
                                  Ye[n] = (Ye[n] || 0) + 1;
                                  var r = n + "-" + xe("5.3.5" + n + Ye[n]);
                                  return t ? t + "-" + r : r;
                              })(t.displayName, t.parentComponentId)
                            : d,
                    p = t.displayName,
                    f =
                        void 0 === p
                            ? (function (e) {
                                  return ke(e)
                                      ? "styled." + e
                                      : "Styled(" + _(e) + ")";
                              })(e)
                            : p,
                    g =
                        t.displayName && t.componentId
                            ? Te(t.displayName) + "-" + t.componentId
                            : t.componentId || h,
                    S =
                        o && e.attrs
                            ? Array.prototype.concat(e.attrs, c).filter(Boolean)
                            : c,
                    A = t.shouldForwardProp;
                o &&
                    e.shouldForwardProp &&
                    (A = t.shouldForwardProp
                        ? function (n, r, o) {
                              return (
                                  e.shouldForwardProp(n, r, o) &&
                                  t.shouldForwardProp(n, r, o)
                              );
                          }
                        : e.shouldForwardProp);
                var C,
                    I = new se(n, g, o ? e.componentStyle : void 0),
                    P = I.isStatic && 0 === c.length,
                    O = function (e, t) {
                        return (function (e, t, n, r) {
                            var o = e.attrs,
                                i = e.componentStyle,
                                a = e.defaultProps,
                                c = e.foldedComponentIds,
                                d = e.shouldForwardProp,
                                h = e.styledComponentId,
                                p = e.target;
                            false && 0;
                            var f = (function (e, t, n) {
                                    void 0 === e && (e = E);
                                    var r = v({}, t, { theme: e }),
                                        o = {};
                                    return (
                                        n.forEach(function (e) {
                                            var t,
                                                n,
                                                s,
                                                i = e;
                                            for (t in (b(i) && (i = i(r)), i))
                                                r[t] = o[t] =
                                                    "className" === t
                                                        ? ((n = o[t]),
                                                          (s = i[t]),
                                                          n && s
                                                              ? n + " " + s
                                                              : n || s)
                                                        : i[t];
                                        }),
                                        [r, o]
                                    );
                                })(
                                    Re(t, (0, react.useContext)(Ge), a) || E,
                                    t,
                                    o
                                ),
                                y = f[0],
                                g = f[1],
                                S = (function (e, t, n, r) {
                                    var o = fe(),
                                        s = me(),
                                        i = t
                                            ? e.generateAndInjectStyles(E, o, s)
                                            : e.generateAndInjectStyles(
                                                  n,
                                                  o,
                                                  s
                                              );
                                    return false && 0, false && 0, i;
                                })(i, r, y, false ? 0 : void 0),
                                w = n,
                                _ = g.$as || t.$as || g.as || t.as || p,
                                N = ke(_),
                                A = g !== t ? v({}, t, {}, g) : t,
                                C = {};
                            for (var I in A)
                                "$" !== I[0] &&
                                    "as" !== I &&
                                    ("forwardedAs" === I
                                        ? (C.as = A[I])
                                        : (d
                                              ? d(
                                                    I,
                                                    emotion_is_prop_valid_browser_esm,
                                                    _
                                                )
                                              : !N ||
                                                emotion_is_prop_valid_browser_esm(
                                                    I
                                                )) && (C[I] = A[I]));
                            return (
                                t.style &&
                                    g.style !== t.style &&
                                    (C.style = v({}, t.style, {}, g.style)),
                                (C.className = Array.prototype
                                    .concat(
                                        c,
                                        h,
                                        S !== h ? S : null,
                                        t.className,
                                        g.className
                                    )
                                    .filter(Boolean)
                                    .join(" ")),
                                (C.ref = w),
                                (0, react.createElement)(_, C)
                            );
                        })(C, e, t, P);
                    };
                return (
                    (O.displayName = f),
                    ((C = react.forwardRef(O)).attrs = S),
                    (C.componentStyle = I),
                    (C.displayName = f),
                    (C.shouldForwardProp = A),
                    (C.foldedComponentIds = o
                        ? Array.prototype.concat(
                              e.foldedComponentIds,
                              e.styledComponentId
                          )
                        : w),
                    (C.styledComponentId = g),
                    (C.target = o ? e.target : e),
                    (C.withComponent = function (e) {
                        var r = t.componentId,
                            o = (function (e, t) {
                                if (null == e) return {};
                                var n,
                                    r,
                                    o = {},
                                    s = Object.keys(e);
                                for (r = 0; r < s.length; r++)
                                    (n = s[r]),
                                        t.indexOf(n) >= 0 || (o[n] = e[n]);
                                return o;
                            })(t, ["componentId"]),
                            s = r && r + "-" + (ke(e) ? e : Te(_(e)));
                        return qe(e, v({}, o, { attrs: S, componentId: s }), n);
                    }),
                    Object.defineProperty(C, "defaultProps", {
                        get: function () {
                            return this._foldedDefaultProps;
                        },
                        set: function (t) {
                            this._foldedDefaultProps = o
                                ? Me({}, e.defaultProps, t)
                                : t;
                        },
                    }),
                    false && 0,
                    (C.toString = function () {
                        return "." + C.styledComponentId;
                    }),
                    i &&
                        hoist_non_react_statics_cjs_default()(C, e, {
                            attrs: !0,
                            componentStyle: !0,
                            displayName: !0,
                            foldedComponentIds: !0,
                            shouldForwardProp: !0,
                            styledComponentId: !0,
                            target: !0,
                            withComponent: !0,
                        }),
                    C
                );
            }
            var He = function (e) {
                return (function e(t, r, o) {
                    if (
                        (void 0 === o && (o = E),
                        !(0, react_is.isValidElementType)(r))
                    )
                        return j(1, String(r));
                    var s = function () {
                        return t(r, o, Ce.apply(void 0, arguments));
                    };
                    return (
                        (s.withConfig = function (n) {
                            return e(t, r, v({}, o, {}, n));
                        }),
                        (s.attrs = function (n) {
                            return e(
                                t,
                                r,
                                v({}, o, {
                                    attrs: Array.prototype
                                        .concat(o.attrs, n)
                                        .filter(Boolean),
                                })
                            );
                        }),
                        s
                    );
                })(qe, e);
            };
            [
                "a",
                "abbr",
                "address",
                "area",
                "article",
                "aside",
                "audio",
                "b",
                "base",
                "bdi",
                "bdo",
                "big",
                "blockquote",
                "body",
                "br",
                "button",
                "canvas",
                "caption",
                "cite",
                "code",
                "col",
                "colgroup",
                "data",
                "datalist",
                "dd",
                "del",
                "details",
                "dfn",
                "dialog",
                "div",
                "dl",
                "dt",
                "em",
                "embed",
                "fieldset",
                "figcaption",
                "figure",
                "footer",
                "form",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "head",
                "header",
                "hgroup",
                "hr",
                "html",
                "i",
                "iframe",
                "img",
                "input",
                "ins",
                "kbd",
                "keygen",
                "label",
                "legend",
                "li",
                "link",
                "main",
                "map",
                "mark",
                "marquee",
                "menu",
                "menuitem",
                "meta",
                "meter",
                "nav",
                "noscript",
                "object",
                "ol",
                "optgroup",
                "option",
                "output",
                "p",
                "param",
                "picture",
                "pre",
                "progress",
                "q",
                "rp",
                "rt",
                "ruby",
                "s",
                "samp",
                "script",
                "section",
                "select",
                "small",
                "source",
                "span",
                "strong",
                "style",
                "sub",
                "summary",
                "sup",
                "table",
                "tbody",
                "td",
                "textarea",
                "tfoot",
                "th",
                "thead",
                "time",
                "title",
                "tr",
                "track",
                "u",
                "ul",
                "var",
                "video",
                "wbr",
                "circle",
                "clipPath",
                "defs",
                "ellipse",
                "foreignObject",
                "g",
                "image",
                "line",
                "linearGradient",
                "marker",
                "mask",
                "path",
                "pattern",
                "polygon",
                "polyline",
                "radialGradient",
                "rect",
                "stop",
                "svg",
                "text",
                "textPath",
                "tspan",
            ].forEach(function (e) {
                He[e] = He(e);
            });
            var $e = (function () {
                function e(e, t) {
                    (this.rules = e),
                        (this.componentId = t),
                        (this.isStatic = re(e)),
                        Z.registerId(this.componentId + 1);
                }
                var t = e.prototype;
                return (
                    (t.createStyles = function (e, t, n, r) {
                        var o = r(Ne(this.rules, t, n, r).join(""), ""),
                            s = this.componentId + e;
                        n.insertRules(s, s, o);
                    }),
                    (t.removeStyles = function (e, t) {
                        t.clearRules(this.componentId + e);
                    }),
                    (t.renderStyles = function (e, t, n, r) {
                        e > 2 && Z.registerId(this.componentId + e),
                            this.removeStyles(e, n),
                            this.createStyles(e, t, n, r);
                    }),
                    e
                );
            })();
            function We(e) {
                for (
                    var t = arguments.length,
                        n = new Array(t > 1 ? t - 1 : 0),
                        o = 1;
                    o < t;
                    o++
                )
                    n[o - 1] = arguments[o];
                var i = Ce.apply(void 0, [e].concat(n)),
                    a = "sc-global-" + xe(JSON.stringify(i)),
                    u = new $e(i, a);
                function l(e) {
                    var t = fe(),
                        n = me(),
                        o = (0, react.useContext)(Ge),
                        l = (0, react.useRef)(t.allocateGSInstance(a)).current;
                    return (
                        false && 0,
                        false && 0,
                        t.server && h(l, e, t, o, n),
                        (0, react.useLayoutEffect)(
                            function () {
                                if (!t.server)
                                    return (
                                        h(l, e, t, o, n),
                                        function () {
                                            return u.removeStyles(l, t);
                                        }
                                    );
                            },
                            [l, e, t, o, n]
                        ),
                        null
                    );
                }
                function h(e, t, n, r, o) {
                    if (u.isStatic) u.renderStyles(e, O, n, o);
                    else {
                        var s = v({}, t, { theme: Re(t, r, l.defaultProps) });
                        u.renderStyles(e, s, n, o);
                    }
                }
                return false && 0, react.memo(l);
            }
            function Ue(e) {
                false && 0;
                for (
                    var t = arguments.length,
                        n = new Array(t > 1 ? t - 1 : 0),
                        r = 1;
                    r < t;
                    r++
                )
                    n[r - 1] = arguments[r];
                var o = Ce.apply(void 0, [e].concat(n)).join(""),
                    s = xe(o);
                return new ve(s, o);
            }
            var Je = (function () {
                    function e() {
                        var e = this;
                        (this._emitSheetCSS = function () {
                            var t = e.instance.toString();
                            if (!t) return "";
                            var n = q();
                            return (
                                "<style " +
                                [
                                    n && 'nonce="' + n + '"',
                                    A + '="true"',
                                    'data-styled-version="5.3.5"',
                                ]
                                    .filter(Boolean)
                                    .join(" ") +
                                ">" +
                                t +
                                "</style>"
                            );
                        }),
                            (this.getStyleTags = function () {
                                return e.sealed ? j(2) : e._emitSheetCSS();
                            }),
                            (this.getStyleElement = function () {
                                var t;
                                if (e.sealed) return j(2);
                                var n =
                                        (((t = {})[A] = ""),
                                        (t["data-styled-version"] = "5.3.5"),
                                        (t.dangerouslySetInnerHTML = {
                                            __html: e.instance.toString(),
                                        }),
                                        t),
                                    o = q();
                                return (
                                    o && (n.nonce = o),
                                    [
                                        react.createElement(
                                            "style",
                                            v({}, n, { key: "sc-0-0" })
                                        ),
                                    ]
                                );
                            }),
                            (this.seal = function () {
                                e.sealed = !0;
                            }),
                            (this.instance = new Z({ isServer: !0 })),
                            (this.sealed = !1);
                    }
                    var t = e.prototype;
                    return (
                        (t.collectStyles = function (e) {
                            return this.sealed
                                ? j(2)
                                : react.createElement(
                                      ye,
                                      { sheet: this.instance },
                                      e
                                  );
                        }),
                        (t.interleaveWithNodeStream = function (e) {
                            return j(3);
                        }),
                        e
                    );
                })(),
                Xe = function (e) {
                    var t = r.forwardRef(function (t, n) {
                        var o = s(Ge),
                            i = e.defaultProps,
                            a = Re(t, o, i);
                        return (
                            false && 0,
                            r.createElement(e, v({}, t, { theme: a, ref: n }))
                        );
                    });
                    return (
                        y(t, e), (t.displayName = "WithTheme(" + _(e) + ")"), t
                    );
                },
                Ze = function () {
                    return s(Ge);
                },
                Ke = { StyleSheet: Z, masterSheet: he };
            false && 0, false && 0;
            /* harmony default export */ var styled_components_browser_esm = He;
            //# sourceMappingURL=styled-components.browser.esm.js.map

            // EXTERNAL MODULE: ./node_modules/next/dist/build/polyfills/object-assign.js
            var object_assign = __webpack_require__(6086);
            var object_assign_default =
                /*#__PURE__*/ __webpack_require__.n(object_assign); // CONCATENATED MODULE: ./node_modules/@styled-system/core/dist/index.esm.js
            var merge = function merge(a, b) {
                var result = object_assign_default()({}, a, b);

                for (var key in a) {
                    var _assign;

                    if (!a[key] || typeof b[key] !== "object") continue;
                    object_assign_default()(
                        result,
                        ((_assign = {}),
                        (_assign[key] = object_assign_default()(
                            a[key],
                            b[key]
                        )),
                        _assign)
                    );
                }

                return result;
            }; // sort object-value responsive styles

            var sort = function sort(obj) {
                var next = {};
                Object.keys(obj)
                    .sort(function (a, b) {
                        return a.localeCompare(b, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        });
                    })
                    .forEach(function (key) {
                        next[key] = obj[key];
                    });
                return next;
            };

            var defaults = {
                breakpoints: [40, 52, 64].map(function (n) {
                    return n + "em";
                }),
            };

            var createMediaQuery = function createMediaQuery(n) {
                return "@media screen and (min-width: " + n + ")";
            };

            var getValue = function getValue(n, scale) {
                return get(scale, n, n);
            };

            var get = function get(obj, key, def, p, undef) {
                key = key && key.split ? key.split(".") : [key];

                for (p = 0; p < key.length; p++) {
                    obj = obj ? obj[key[p]] : undef;
                }

                return obj === undef ? def : obj;
            };
            var createParser = function createParser(config) {
                var cache = {};

                var parse = function parse(props) {
                    var styles = {};
                    var shouldSort = false;
                    var isCacheDisabled =
                        props.theme && props.theme.disableStyledSystemCache;

                    for (var key in props) {
                        if (!config[key]) continue;
                        var sx = config[key];
                        var raw = props[key];
                        var scale = get(props.theme, sx.scale, sx.defaults);

                        if (typeof raw === "object") {
                            cache.breakpoints =
                                (!isCacheDisabled && cache.breakpoints) ||
                                get(
                                    props.theme,
                                    "breakpoints",
                                    defaults.breakpoints
                                );

                            if (Array.isArray(raw)) {
                                cache.media =
                                    (!isCacheDisabled && cache.media) ||
                                    [null].concat(
                                        cache.breakpoints.map(createMediaQuery)
                                    );
                                styles = merge(
                                    styles,
                                    parseResponsiveStyle(
                                        cache.media,
                                        sx,
                                        scale,
                                        raw,
                                        props
                                    )
                                );
                                continue;
                            }

                            if (raw !== null) {
                                styles = merge(
                                    styles,
                                    parseResponsiveObject(
                                        cache.breakpoints,
                                        sx,
                                        scale,
                                        raw,
                                        props
                                    )
                                );
                                shouldSort = true;
                            }

                            continue;
                        }

                        object_assign_default()(styles, sx(raw, scale, props));
                    } // sort object-based responsive styles

                    if (shouldSort) {
                        styles = sort(styles);
                    }

                    return styles;
                };

                parse.config = config;
                parse.propNames = Object.keys(config);
                parse.cache = cache;
                var keys = Object.keys(config).filter(function (k) {
                    return k !== "config";
                });

                if (keys.length > 1) {
                    keys.forEach(function (key) {
                        var _createParser;

                        parse[key] = createParser(
                            ((_createParser = {}),
                            (_createParser[key] = config[key]),
                            _createParser)
                        );
                    });
                }

                return parse;
            };

            var parseResponsiveStyle = function parseResponsiveStyle(
                mediaQueries,
                sx,
                scale,
                raw,
                _props
            ) {
                var styles = {};
                raw.slice(0, mediaQueries.length).forEach(function (value, i) {
                    var media = mediaQueries[i];
                    var style = sx(value, scale, _props);

                    if (!media) {
                        object_assign_default()(styles, style);
                    } else {
                        var _assign2;

                        object_assign_default()(
                            styles,
                            ((_assign2 = {}),
                            (_assign2[media] = object_assign_default()(
                                {},
                                styles[media],
                                style
                            )),
                            _assign2)
                        );
                    }
                });
                return styles;
            };

            var parseResponsiveObject = function parseResponsiveObject(
                breakpoints,
                sx,
                scale,
                raw,
                _props
            ) {
                var styles = {};

                for (var key in raw) {
                    var breakpoint = breakpoints[key];
                    var value = raw[key];
                    var style = sx(value, scale, _props);

                    if (!breakpoint) {
                        object_assign_default()(styles, style);
                    } else {
                        var _assign3;

                        var media = createMediaQuery(breakpoint);
                        object_assign_default()(
                            styles,
                            ((_assign3 = {}),
                            (_assign3[media] = object_assign_default()(
                                {},
                                styles[media],
                                style
                            )),
                            _assign3)
                        );
                    }
                }

                return styles;
            };

            var createStyleFunction = function createStyleFunction(_ref) {
                var properties = _ref.properties,
                    property = _ref.property,
                    scale = _ref.scale,
                    _ref$transform = _ref.transform,
                    transform =
                        _ref$transform === void 0 ? getValue : _ref$transform,
                    defaultScale = _ref.defaultScale;
                properties = properties || [property];

                var sx = function sx(value, scale, _props) {
                    var result = {};
                    var n = transform(value, scale, _props);
                    if (n === null) return;
                    properties.forEach(function (prop) {
                        result[prop] = n;
                    });
                    return result;
                };

                sx.scale = scale;
                sx.defaults = defaultScale;
                return sx;
            }; // new v5 API

            var system = function system(args) {
                if (args === void 0) {
                    args = {};
                }

                var config = {};
                Object.keys(args).forEach(function (key) {
                    var conf = args[key];

                    if (conf === true) {
                        // shortcut definition
                        config[key] = createStyleFunction({
                            property: key,
                            scale: key,
                        });
                        return;
                    }

                    if (typeof conf === "function") {
                        config[key] = conf;
                        return;
                    }

                    config[key] = createStyleFunction(conf);
                });
                var parser = createParser(config);
                return parser;
            };
            var compose = function compose() {
                var config = {};

                for (
                    var _len = arguments.length,
                        parsers = new Array(_len),
                        _key = 0;
                    _key < _len;
                    _key++
                ) {
                    parsers[_key] = arguments[_key];
                }

                parsers.forEach(function (parser) {
                    if (!parser || !parser.config) return;
                    object_assign_default()(config, parser.config);
                });
                var parser = createParser(config);
                return parser;
            }; // CONCATENATED MODULE: ./node_modules/@styled-system/layout/dist/index.esm.js

            var isNumber = function isNumber(n) {
                return typeof n === "number" && !isNaN(n);
            };

            var getWidth = function getWidth(n, scale) {
                return get(scale, n, !isNumber(n) || n > 1 ? n : n * 100 + "%");
            };

            var config = {
                width: {
                    property: "width",
                    scale: "sizes",
                    transform: getWidth,
                },
                height: {
                    property: "height",
                    scale: "sizes",
                },
                minWidth: {
                    property: "minWidth",
                    scale: "sizes",
                },
                minHeight: {
                    property: "minHeight",
                    scale: "sizes",
                },
                maxWidth: {
                    property: "maxWidth",
                    scale: "sizes",
                },
                maxHeight: {
                    property: "maxHeight",
                    scale: "sizes",
                },
                size: {
                    properties: ["width", "height"],
                    scale: "sizes",
                },
                overflow: true,
                overflowX: true,
                overflowY: true,
                display: true,
                verticalAlign: true,
            };
            var layout = system(config);
            /* harmony default export */ var index_esm = layout; // CONCATENATED MODULE: ./node_modules/@styled-system/color/dist/index.esm.js

            var index_esm_config = {
                color: {
                    property: "color",
                    scale: "colors",
                },
                backgroundColor: {
                    property: "backgroundColor",
                    scale: "colors",
                },
                opacity: true,
            };
            index_esm_config.bg = index_esm_config.backgroundColor;
            var color = system(index_esm_config);
            /* harmony default export */ var dist_index_esm = color; // CONCATENATED MODULE: ./node_modules/@styled-system/typography/dist/index.esm.js

            var index_esm_defaults = {
                fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
            };
            var dist_index_esm_config = {
                fontFamily: {
                    property: "fontFamily",
                    scale: "fonts",
                },
                fontSize: {
                    property: "fontSize",
                    scale: "fontSizes",
                    defaultScale: index_esm_defaults.fontSizes,
                },
                fontWeight: {
                    property: "fontWeight",
                    scale: "fontWeights",
                },
                lineHeight: {
                    property: "lineHeight",
                    scale: "lineHeights",
                },
                letterSpacing: {
                    property: "letterSpacing",
                    scale: "letterSpacings",
                },
                textAlign: true,
                fontStyle: true,
            };
            var typography = system(dist_index_esm_config);
            /* harmony default export */ var typography_dist_index_esm =
                typography; // CONCATENATED MODULE: ./node_modules/@styled-system/flexbox/dist/index.esm.js

            var flexbox_dist_index_esm_config = {
                alignItems: true,
                alignContent: true,
                justifyItems: true,
                justifyContent: true,
                flexWrap: true,
                flexDirection: true,
                // item
                flex: true,
                flexGrow: true,
                flexShrink: true,
                flexBasis: true,
                justifySelf: true,
                alignSelf: true,
                order: true,
            };
            var flexbox = system(flexbox_dist_index_esm_config);
            /* harmony default export */ var flexbox_dist_index_esm = flexbox; // CONCATENATED MODULE: ./node_modules/@styled-system/grid/dist/index.esm.js

            var dist_index_esm_defaults = {
                space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
            };
            var grid_dist_index_esm_config = {
                gridGap: {
                    property: "gridGap",
                    scale: "space",
                    defaultScale: dist_index_esm_defaults.space,
                },
                gridColumnGap: {
                    property: "gridColumnGap",
                    scale: "space",
                    defaultScale: dist_index_esm_defaults.space,
                },
                gridRowGap: {
                    property: "gridRowGap",
                    scale: "space",
                    defaultScale: dist_index_esm_defaults.space,
                },
                gridColumn: true,
                gridRow: true,
                gridAutoFlow: true,
                gridAutoColumns: true,
                gridAutoRows: true,
                gridTemplateColumns: true,
                gridTemplateRows: true,
                gridTemplateAreas: true,
                gridArea: true,
            };
            var grid = system(grid_dist_index_esm_config);
            /* harmony default export */ var grid_dist_index_esm = grid; // CONCATENATED MODULE: ./node_modules/@styled-system/border/dist/index.esm.js

            var border_dist_index_esm_config = {
                border: {
                    property: "border",
                    scale: "borders",
                },
                borderWidth: {
                    property: "borderWidth",
                    scale: "borderWidths",
                },
                borderStyle: {
                    property: "borderStyle",
                    scale: "borderStyles",
                },
                borderColor: {
                    property: "borderColor",
                    scale: "colors",
                },
                borderRadius: {
                    property: "borderRadius",
                    scale: "radii",
                },
                borderTop: {
                    property: "borderTop",
                    scale: "borders",
                },
                borderTopLeftRadius: {
                    property: "borderTopLeftRadius",
                    scale: "radii",
                },
                borderTopRightRadius: {
                    property: "borderTopRightRadius",
                    scale: "radii",
                },
                borderRight: {
                    property: "borderRight",
                    scale: "borders",
                },
                borderBottom: {
                    property: "borderBottom",
                    scale: "borders",
                },
                borderBottomLeftRadius: {
                    property: "borderBottomLeftRadius",
                    scale: "radii",
                },
                borderBottomRightRadius: {
                    property: "borderBottomRightRadius",
                    scale: "radii",
                },
                borderLeft: {
                    property: "borderLeft",
                    scale: "borders",
                },
                borderX: {
                    properties: ["borderLeft", "borderRight"],
                    scale: "borders",
                },
                borderY: {
                    properties: ["borderTop", "borderBottom"],
                    scale: "borders",
                },
            };
            border_dist_index_esm_config.borderTopWidth = {
                property: "borderTopWidth",
                scale: "borderWidths",
            };
            border_dist_index_esm_config.borderTopColor = {
                property: "borderTopColor",
                scale: "colors",
            };
            border_dist_index_esm_config.borderTopStyle = {
                property: "borderTopStyle",
                scale: "borderStyles",
            };
            border_dist_index_esm_config.borderTopLeftRadius = {
                property: "borderTopLeftRadius",
                scale: "radii",
            };
            border_dist_index_esm_config.borderTopRightRadius = {
                property: "borderTopRightRadius",
                scale: "radii",
            };
            border_dist_index_esm_config.borderBottomWidth = {
                property: "borderBottomWidth",
                scale: "borderWidths",
            };
            border_dist_index_esm_config.borderBottomColor = {
                property: "borderBottomColor",
                scale: "colors",
            };
            border_dist_index_esm_config.borderBottomStyle = {
                property: "borderBottomStyle",
                scale: "borderStyles",
            };
            border_dist_index_esm_config.borderBottomLeftRadius = {
                property: "borderBottomLeftRadius",
                scale: "radii",
            };
            border_dist_index_esm_config.borderBottomRightRadius = {
                property: "borderBottomRightRadius",
                scale: "radii",
            };
            border_dist_index_esm_config.borderLeftWidth = {
                property: "borderLeftWidth",
                scale: "borderWidths",
            };
            border_dist_index_esm_config.borderLeftColor = {
                property: "borderLeftColor",
                scale: "colors",
            };
            border_dist_index_esm_config.borderLeftStyle = {
                property: "borderLeftStyle",
                scale: "borderStyles",
            };
            border_dist_index_esm_config.borderRightWidth = {
                property: "borderRightWidth",
                scale: "borderWidths",
            };
            border_dist_index_esm_config.borderRightColor = {
                property: "borderRightColor",
                scale: "colors",
            };
            border_dist_index_esm_config.borderRightStyle = {
                property: "borderRightStyle",
                scale: "borderStyles",
            };
            var border = system(border_dist_index_esm_config);
            /* harmony default export */ var border_dist_index_esm = border; // CONCATENATED MODULE: ./node_modules/@styled-system/background/dist/index.esm.js

            var background_dist_index_esm_config = {
                background: true,
                backgroundImage: true,
                backgroundSize: true,
                backgroundPosition: true,
                backgroundRepeat: true,
            };
            background_dist_index_esm_config.bgImage =
                background_dist_index_esm_config.backgroundImage;
            background_dist_index_esm_config.bgSize =
                background_dist_index_esm_config.backgroundSize;
            background_dist_index_esm_config.bgPosition =
                background_dist_index_esm_config.backgroundPosition;
            background_dist_index_esm_config.bgRepeat =
                background_dist_index_esm_config.backgroundRepeat;
            var background = system(background_dist_index_esm_config);
            /* harmony default export */ var background_dist_index_esm =
                background; // CONCATENATED MODULE: ./node_modules/@styled-system/position/dist/index.esm.js

            var position_dist_index_esm_defaults = {
                space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
            };
            var position_dist_index_esm_config = {
                position: true,
                zIndex: {
                    property: "zIndex",
                    scale: "zIndices",
                },
                top: {
                    property: "top",
                    scale: "space",
                    defaultScale: position_dist_index_esm_defaults.space,
                },
                right: {
                    property: "right",
                    scale: "space",
                    defaultScale: position_dist_index_esm_defaults.space,
                },
                bottom: {
                    property: "bottom",
                    scale: "space",
                    defaultScale: position_dist_index_esm_defaults.space,
                },
                left: {
                    property: "left",
                    scale: "space",
                    defaultScale: position_dist_index_esm_defaults.space,
                },
            };
            var position = system(position_dist_index_esm_config);
            /* harmony default export */ var position_dist_index_esm = position; // CONCATENATED MODULE: ./node_modules/@styled-system/space/dist/index.esm.js

            var space_dist_index_esm_defaults = {
                space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
            };

            var index_esm_isNumber = function isNumber(n) {
                return typeof n === "number" && !isNaN(n);
            };

            var getMargin = function getMargin(n, scale) {
                if (!index_esm_isNumber(n)) {
                    return get(scale, n, n);
                }

                var isNegative = n < 0;
                var absolute = Math.abs(n);
                var value = get(scale, absolute, absolute);

                if (!index_esm_isNumber(value)) {
                    return isNegative ? "-" + value : value;
                }

                return value * (isNegative ? -1 : 1);
            };

            var configs = {};
            configs.margin = {
                margin: {
                    property: "margin",
                    scale: "space",
                    transform: getMargin,
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                marginTop: {
                    property: "marginTop",
                    scale: "space",
                    transform: getMargin,
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                marginRight: {
                    property: "marginRight",
                    scale: "space",
                    transform: getMargin,
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                marginBottom: {
                    property: "marginBottom",
                    scale: "space",
                    transform: getMargin,
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                marginLeft: {
                    property: "marginLeft",
                    scale: "space",
                    transform: getMargin,
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                marginX: {
                    properties: ["marginLeft", "marginRight"],
                    scale: "space",
                    transform: getMargin,
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                marginY: {
                    properties: ["marginTop", "marginBottom"],
                    scale: "space",
                    transform: getMargin,
                    defaultScale: space_dist_index_esm_defaults.space,
                },
            };
            configs.margin.m = configs.margin.margin;
            configs.margin.mt = configs.margin.marginTop;
            configs.margin.mr = configs.margin.marginRight;
            configs.margin.mb = configs.margin.marginBottom;
            configs.margin.ml = configs.margin.marginLeft;
            configs.margin.mx = configs.margin.marginX;
            configs.margin.my = configs.margin.marginY;
            configs.padding = {
                padding: {
                    property: "padding",
                    scale: "space",
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                paddingTop: {
                    property: "paddingTop",
                    scale: "space",
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                paddingRight: {
                    property: "paddingRight",
                    scale: "space",
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                paddingBottom: {
                    property: "paddingBottom",
                    scale: "space",
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                paddingLeft: {
                    property: "paddingLeft",
                    scale: "space",
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                paddingX: {
                    properties: ["paddingLeft", "paddingRight"],
                    scale: "space",
                    defaultScale: space_dist_index_esm_defaults.space,
                },
                paddingY: {
                    properties: ["paddingTop", "paddingBottom"],
                    scale: "space",
                    defaultScale: space_dist_index_esm_defaults.space,
                },
            };
            configs.padding.p = configs.padding.padding;
            configs.padding.pt = configs.padding.paddingTop;
            configs.padding.pr = configs.padding.paddingRight;
            configs.padding.pb = configs.padding.paddingBottom;
            configs.padding.pl = configs.padding.paddingLeft;
            configs.padding.px = configs.padding.paddingX;
            configs.padding.py = configs.padding.paddingY;
            var margin = system(configs.margin);
            var padding = system(configs.padding);
            var space = compose(margin, padding);
            /* harmony default export */ var space_dist_index_esm =
                /* unused pure expression or super */ null && space; // CONCATENATED MODULE: ./node_modules/@styled-system/shadow/dist/index.esm.js

            var shadow = system({
                boxShadow: {
                    property: "boxShadow",
                    scale: "shadows",
                },
                textShadow: {
                    property: "textShadow",
                    scale: "shadows",
                },
            });
            /* harmony default export */ var shadow_dist_index_esm = shadow; // CONCATENATED MODULE: ./node_modules/@styled-system/css/dist/index.esm.js

            function _extends() {
                _extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];
                            for (var key in source) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        source,
                                        key
                                    )
                                ) {
                                    target[key] = source[key];
                                }
                            }
                        }
                        return target;
                    };
                return _extends.apply(this, arguments);
            }

            // based on https://github.com/developit/dlv
            var index_esm_get = function get(obj, key, def, p, undef) {
                key = key && key.split ? key.split(".") : [key];

                for (p = 0; p < key.length; p++) {
                    obj = obj ? obj[key[p]] : undef;
                }

                return obj === undef ? def : obj;
            };
            var defaultBreakpoints = [40, 52, 64].map(function (n) {
                return n + "em";
            });
            var defaultTheme = {
                space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
                fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
            };
            var aliases = {
                bg: "backgroundColor",
                m: "margin",
                mt: "marginTop",
                mr: "marginRight",
                mb: "marginBottom",
                ml: "marginLeft",
                mx: "marginX",
                my: "marginY",
                p: "padding",
                pt: "paddingTop",
                pr: "paddingRight",
                pb: "paddingBottom",
                pl: "paddingLeft",
                px: "paddingX",
                py: "paddingY",
            };
            var multiples = {
                marginX: ["marginLeft", "marginRight"],
                marginY: ["marginTop", "marginBottom"],
                paddingX: ["paddingLeft", "paddingRight"],
                paddingY: ["paddingTop", "paddingBottom"],
                size: ["width", "height"],
            };
            var scales = {
                color: "colors",
                backgroundColor: "colors",
                borderColor: "colors",
                margin: "space",
                marginTop: "space",
                marginRight: "space",
                marginBottom: "space",
                marginLeft: "space",
                marginX: "space",
                marginY: "space",
                padding: "space",
                paddingTop: "space",
                paddingRight: "space",
                paddingBottom: "space",
                paddingLeft: "space",
                paddingX: "space",
                paddingY: "space",
                top: "space",
                right: "space",
                bottom: "space",
                left: "space",
                gridGap: "space",
                gridColumnGap: "space",
                gridRowGap: "space",
                gap: "space",
                columnGap: "space",
                rowGap: "space",
                fontFamily: "fonts",
                fontSize: "fontSizes",
                fontWeight: "fontWeights",
                lineHeight: "lineHeights",
                letterSpacing: "letterSpacings",
                border: "borders",
                borderTop: "borders",
                borderRight: "borders",
                borderBottom: "borders",
                borderLeft: "borders",
                borderWidth: "borderWidths",
                borderStyle: "borderStyles",
                borderRadius: "radii",
                borderTopRightRadius: "radii",
                borderTopLeftRadius: "radii",
                borderBottomRightRadius: "radii",
                borderBottomLeftRadius: "radii",
                borderTopWidth: "borderWidths",
                borderTopColor: "colors",
                borderTopStyle: "borderStyles",
                borderBottomWidth: "borderWidths",
                borderBottomColor: "colors",
                borderBottomStyle: "borderStyles",
                borderLeftWidth: "borderWidths",
                borderLeftColor: "colors",
                borderLeftStyle: "borderStyles",
                borderRightWidth: "borderWidths",
                borderRightColor: "colors",
                borderRightStyle: "borderStyles",
                outlineColor: "colors",
                boxShadow: "shadows",
                textShadow: "shadows",
                zIndex: "zIndices",
                width: "sizes",
                minWidth: "sizes",
                maxWidth: "sizes",
                height: "sizes",
                minHeight: "sizes",
                maxHeight: "sizes",
                flexBasis: "sizes",
                size: "sizes",
                // svg
                fill: "colors",
                stroke: "colors",
            };

            var positiveOrNegative = function positiveOrNegative(scale, value) {
                if (typeof value !== "number" || value >= 0) {
                    return index_esm_get(scale, value, value);
                }

                var absolute = Math.abs(value);
                var n = index_esm_get(scale, absolute, absolute);
                if (typeof n === "string") return "-" + n;
                return n * -1;
            };

            var transforms = [
                "margin",
                "marginTop",
                "marginRight",
                "marginBottom",
                "marginLeft",
                "marginX",
                "marginY",
                "top",
                "bottom",
                "left",
                "right",
            ].reduce(function (acc, curr) {
                var _extends2;

                return _extends(
                    {},
                    acc,
                    ((_extends2 = {}),
                    (_extends2[curr] = positiveOrNegative),
                    _extends2)
                );
            }, {});
            var responsive = function responsive(styles) {
                return function (theme) {
                    var next = {};
                    var breakpoints = index_esm_get(
                        theme,
                        "breakpoints",
                        defaultBreakpoints
                    );
                    var mediaQueries = [null].concat(
                        breakpoints.map(function (n) {
                            return "@media screen and (min-width: " + n + ")";
                        })
                    );

                    for (var key in styles) {
                        var value =
                            typeof styles[key] === "function"
                                ? styles[key](theme)
                                : styles[key];
                        if (value == null) continue;

                        if (!Array.isArray(value)) {
                            next[key] = value;
                            continue;
                        }

                        for (
                            var i = 0;
                            i < value.slice(0, mediaQueries.length).length;
                            i++
                        ) {
                            var media = mediaQueries[i];

                            if (!media) {
                                next[key] = value[i];
                                continue;
                            }

                            next[media] = next[media] || {};
                            if (value[i] == null) continue;
                            next[media][key] = value[i];
                        }
                    }

                    return next;
                };
            };
            var css = function css(args) {
                return function (props) {
                    if (props === void 0) {
                        props = {};
                    }

                    var theme = _extends(
                        {},
                        defaultTheme,
                        {},
                        props.theme || props
                    );

                    var result = {};
                    var obj = typeof args === "function" ? args(theme) : args;
                    var styles = responsive(obj)(theme);

                    for (var key in styles) {
                        var x = styles[key];
                        var val = typeof x === "function" ? x(theme) : x;

                        if (key === "variant") {
                            var variant = css(index_esm_get(theme, val))(theme);
                            result = _extends({}, result, {}, variant);
                            continue;
                        }

                        if (val && typeof val === "object") {
                            result[key] = css(val)(theme);
                            continue;
                        }

                        var prop = index_esm_get(aliases, key, key);
                        var scaleName = index_esm_get(scales, prop);
                        var scale = index_esm_get(
                            theme,
                            scaleName,
                            index_esm_get(theme, prop, {})
                        );
                        var transform = index_esm_get(
                            transforms,
                            prop,
                            index_esm_get
                        );
                        var value = transform(scale, val, val);

                        if (multiples[prop]) {
                            var dirs = multiples[prop];

                            for (var i = 0; i < dirs.length; i++) {
                                result[dirs[i]] = value;
                            }
                        } else {
                            result[prop] = value;
                        }
                    }

                    return result;
                };
            };
            /* harmony default export */ var css_dist_index_esm = css; // CONCATENATED MODULE: ./node_modules/@styled-system/variant/dist/index.esm.js

            var variant = function variant(_ref) {
                var _config;

                var scale = _ref.scale,
                    _ref$prop = _ref.prop,
                    prop = _ref$prop === void 0 ? "variant" : _ref$prop,
                    _ref$variants = _ref.variants,
                    variants = _ref$variants === void 0 ? {} : _ref$variants,
                    key = _ref.key;
                var sx;

                if (Object.keys(variants).length) {
                    sx = function sx(value, scale, props) {
                        return css_dist_index_esm(get(scale, value, null))(
                            props.theme
                        );
                    };
                } else {
                    sx = function sx(value, scale) {
                        return get(scale, value, null);
                    };
                }

                sx.scale = scale || key;
                sx.defaults = variants;
                var config = ((_config = {}), (_config[prop] = sx), _config);
                var parser = createParser(config);
                return parser;
            };
            /* harmony default export */ var variant_dist_index_esm =
                /* unused pure expression or super */ null && variant;
            var buttonStyle = variant({
                key: "buttons",
            });
            var textStyle = variant({
                key: "textStyles",
                prop: "textStyle",
            });
            var colorStyle = variant({
                key: "colorStyles",
                prop: "colors",
            }); // CONCATENATED MODULE: ./node_modules/styled-system/dist/index.esm.js

            // v4 api shims

            var width = index_esm.width,
                height = index_esm.height,
                minWidth = index_esm.minWidth,
                minHeight = index_esm.minHeight,
                maxWidth = index_esm.maxWidth,
                maxHeight = index_esm.maxHeight,
                size = index_esm.size,
                verticalAlign = index_esm.verticalAlign,
                display = index_esm.display,
                overflow = index_esm.overflow,
                overflowX = index_esm.overflowX,
                overflowY = index_esm.overflowY;
            var opacity = dist_index_esm.opacity;
            var fontSize = typography_dist_index_esm.fontSize,
                fontFamily = typography_dist_index_esm.fontFamily,
                fontWeight = typography_dist_index_esm.fontWeight,
                lineHeight = typography_dist_index_esm.lineHeight,
                textAlign = typography_dist_index_esm.textAlign,
                fontStyle = typography_dist_index_esm.fontStyle,
                letterSpacing = typography_dist_index_esm.letterSpacing;
            var alignItems = flexbox_dist_index_esm.alignItems,
                alignContent = flexbox_dist_index_esm.alignContent,
                justifyItems = flexbox_dist_index_esm.justifyItems,
                justifyContent = flexbox_dist_index_esm.justifyContent,
                flexWrap = flexbox_dist_index_esm.flexWrap,
                flexDirection = flexbox_dist_index_esm.flexDirection,
                flex = flexbox_dist_index_esm.flex,
                flexGrow = flexbox_dist_index_esm.flexGrow,
                flexShrink = flexbox_dist_index_esm.flexShrink,
                flexBasis = flexbox_dist_index_esm.flexBasis,
                justifySelf = flexbox_dist_index_esm.justifySelf,
                alignSelf = flexbox_dist_index_esm.alignSelf,
                order = flexbox_dist_index_esm.order;
            var gridGap = grid_dist_index_esm.gridGap,
                gridColumnGap = grid_dist_index_esm.gridColumnGap,
                gridRowGap = grid_dist_index_esm.gridRowGap,
                gridColumn = grid_dist_index_esm.gridColumn,
                gridRow = grid_dist_index_esm.gridRow,
                gridAutoFlow = grid_dist_index_esm.gridAutoFlow,
                gridAutoColumns = grid_dist_index_esm.gridAutoColumns,
                gridAutoRows = grid_dist_index_esm.gridAutoRows,
                gridTemplateColumns = grid_dist_index_esm.gridTemplateColumns,
                gridTemplateRows = grid_dist_index_esm.gridTemplateRows,
                gridTemplateAreas = grid_dist_index_esm.gridTemplateAreas,
                gridArea = grid_dist_index_esm.gridArea;
            var borderWidth = border_dist_index_esm.borderWidth,
                borderStyle = border_dist_index_esm.borderStyle,
                borderColor = border_dist_index_esm.borderColor,
                borderTop = border_dist_index_esm.borderTop,
                borderRight = border_dist_index_esm.borderRight,
                borderBottom = border_dist_index_esm.borderBottom,
                borderLeft = border_dist_index_esm.borderLeft,
                borderRadius = border_dist_index_esm.borderRadius;
            var backgroundImage = background_dist_index_esm.backgroundImage,
                backgroundSize = background_dist_index_esm.backgroundSize,
                backgroundPosition =
                    background_dist_index_esm.backgroundPosition,
                backgroundRepeat = background_dist_index_esm.backgroundRepeat;
            var zIndex = position_dist_index_esm.zIndex,
                index_esm_top = position_dist_index_esm.top,
                right = position_dist_index_esm.right,
                bottom = position_dist_index_esm.bottom,
                left = position_dist_index_esm.left;

            // v4 style API shim

            var style = function style(_ref) {
                var prop = _ref.prop,
                    cssProperty = _ref.cssProperty,
                    alias = _ref.alias,
                    key = _ref.key,
                    transformValue = _ref.transformValue,
                    scale = _ref.scale,
                    properties = _ref.properties;
                var config = {};
                config[prop] = createStyleFunction({
                    properties: properties,
                    property: cssProperty || prop,
                    scale: key,
                    defaultScale: scale,
                    transform: transformValue,
                });
                if (alias) config[alias] = config[prop];
                var parse = createParser(config);
                return parse;
            };

            // EXTERNAL MODULE: ./node_modules/deepmerge/dist/cjs.js
            var cjs = __webpack_require__(9996);
            var cjs_default = /*#__PURE__*/ __webpack_require__.n(cjs); // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/sx.js
            const sx = (props) => css_dist_index_esm(props.sx);

            /* harmony default export */ var lib_esm_sx = sx; // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/Box.js

            const Box = styled_components_browser_esm.div.withConfig({
                displayName: "Box",
                componentId: "sc-1gh2r6s-0",
            })(
                space,
                color,
                typography,
                layout,
                flexbox,
                grid,
                background,
                border,
                position,
                shadow,
                lib_esm_sx
            );
            /* harmony default export */ var lib_esm_Box = Box;
            // EXTERNAL MODULE: ./node_modules/@primer/react/lib-esm/theme-preval.js
            var theme_preval = __webpack_require__(7689); // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/theme.js
            /* harmony default export */ var lib_esm_theme = theme_preval.theme; // NOTE: for now, ThemeColors and ThemeShadows are handcrafted types. It would be nice if these // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/ThemeProvider.js
            // were exports from primitives (or a different shape but derived from those exports).
            const defaultColorMode = "day";
            const defaultDayScheme = "light";
            const defaultNightScheme = "dark"; // eslint-disable-next-line @typescript-eslint/no-explicit-any

            const ThemeContext = /*#__PURE__*/ react.createContext({
                setColorMode: () => null,
                setDayScheme: () => null,
                setNightScheme: () => null,
            }); // inspired from __NEXT_DATA__, we use application/json to avoid CSRF policy with inline scripts

            const getServerHandoff = () => {
                try {
                    var _document$getElementB;

                    const serverData =
                        (_document$getElementB =
                            document.getElementById("__PRIMER_DATA__")) ===
                            null || _document$getElementB === void 0
                            ? void 0
                            : _document$getElementB.textContent;
                    if (serverData) return JSON.parse(serverData);
                } catch (error) {
                    // if document/element does not exist or JSON is invalid, supress error
                }

                return {};
            };

            const ThemeProvider = ({ children, ...props }) => {
                var _ref,
                    _props$theme,
                    _ref2,
                    _props$colorMode,
                    _ref3,
                    _props$dayScheme,
                    _ref4,
                    _props$nightScheme;

                // Get fallback values from parent ThemeProvider (if exists)
                const {
                    theme: fallbackTheme,
                    colorMode: fallbackColorMode,
                    dayScheme: fallbackDayScheme,
                    nightScheme: fallbackNightScheme,
                } = useTheme(); // Initialize state

                const theme =
                    (_ref =
                        (_props$theme = props.theme) !== null &&
                        _props$theme !== void 0
                            ? _props$theme
                            : fallbackTheme) !== null && _ref !== void 0
                        ? _ref
                        : lib_esm_theme;
                const { resolvedServerColorMode } = getServerHandoff();
                const resolvedColorModePassthrough = react.useRef(
                    resolvedServerColorMode
                );
                const [colorMode, setColorMode] = react.useState(
                    (_ref2 =
                        (_props$colorMode = props.colorMode) !== null &&
                        _props$colorMode !== void 0
                            ? _props$colorMode
                            : fallbackColorMode) !== null && _ref2 !== void 0
                        ? _ref2
                        : defaultColorMode
                );
                const [dayScheme, setDayScheme] = react.useState(
                    (_ref3 =
                        (_props$dayScheme = props.dayScheme) !== null &&
                        _props$dayScheme !== void 0
                            ? _props$dayScheme
                            : fallbackDayScheme) !== null && _ref3 !== void 0
                        ? _ref3
                        : defaultDayScheme
                );
                const [nightScheme, setNightScheme] = react.useState(
                    (_ref4 =
                        (_props$nightScheme = props.nightScheme) !== null &&
                        _props$nightScheme !== void 0
                            ? _props$nightScheme
                            : fallbackNightScheme) !== null && _ref4 !== void 0
                        ? _ref4
                        : defaultNightScheme
                );
                const systemColorMode = useSystemColorMode();
                const resolvedColorMode =
                    resolvedColorModePassthrough.current ||
                    resolveColorMode(colorMode, systemColorMode);
                const colorScheme = chooseColorScheme(
                    resolvedColorMode,
                    dayScheme,
                    nightScheme
                );
                const { resolvedTheme, resolvedColorScheme } = react.useMemo(
                    () => applyColorScheme(theme, colorScheme),
                    [theme, colorScheme]
                ); // this effect will only run on client

                react.useEffect(
                    function updateColorModeAfterServerPassthrough() {
                        const resolvedColorModeOnClient = resolveColorMode(
                            colorMode,
                            systemColorMode
                        );

                        if (resolvedColorModePassthrough.current) {
                            // if the resolved color mode passed on from the server is not the resolved color mode on client, change it!
                            if (
                                resolvedColorModePassthrough.current !==
                                resolvedColorModeOnClient
                            ) {
                                window.setTimeout(() => {
                                    // override colorMode to whatever is resolved on the client to get a re-render
                                    setColorMode(resolvedColorModeOnClient); // immediately after that, set the colorMode to what the user passed to respond to system color mode changes

                                    setColorMode(colorMode);
                                });
                            }

                            resolvedColorModePassthrough.current = null;
                        }
                    },
                    [colorMode, systemColorMode]
                ); // Update state if props change

                react.useEffect(() => {
                    var _ref5, _props$colorMode2;

                    setColorMode(
                        (_ref5 =
                            (_props$colorMode2 = props.colorMode) !== null &&
                            _props$colorMode2 !== void 0
                                ? _props$colorMode2
                                : fallbackColorMode) !== null &&
                            _ref5 !== void 0
                            ? _ref5
                            : defaultColorMode
                    );
                }, [props.colorMode, fallbackColorMode]);
                react.useEffect(() => {
                    setColorMode(resolvedColorMode);
                }, [resolvedColorMode]);
                react.useEffect(() => {
                    var _ref6, _props$dayScheme2;

                    setDayScheme(
                        (_ref6 =
                            (_props$dayScheme2 = props.dayScheme) !== null &&
                            _props$dayScheme2 !== void 0
                                ? _props$dayScheme2
                                : fallbackDayScheme) !== null &&
                            _ref6 !== void 0
                            ? _ref6
                            : defaultDayScheme
                    );
                }, [props.dayScheme, fallbackDayScheme]);
                react.useEffect(() => {
                    var _ref7, _props$nightScheme2;

                    setNightScheme(
                        (_ref7 =
                            (_props$nightScheme2 = props.nightScheme) !==
                                null && _props$nightScheme2 !== void 0
                                ? _props$nightScheme2
                                : fallbackNightScheme) !== null &&
                            _ref7 !== void 0
                            ? _ref7
                            : defaultNightScheme
                    );
                }, [props.nightScheme, fallbackNightScheme]);
                return /*#__PURE__*/ react.createElement(
                    ThemeContext.Provider,
                    {
                        value: {
                            theme: resolvedTheme,
                            colorScheme,
                            colorMode,
                            resolvedColorMode,
                            resolvedColorScheme,
                            dayScheme,
                            nightScheme,
                            setColorMode,
                            setDayScheme,
                            setNightScheme,
                        },
                    },
                    /*#__PURE__*/ react.createElement(
                        Fe,
                        {
                            theme: resolvedTheme,
                        },
                        children,
                        props.preventSSRMismatch
                            ? /*#__PURE__*/ react.createElement("script", {
                                  type: "application/json",
                                  id: "__PRIMER_DATA__",
                                  dangerouslySetInnerHTML: {
                                      __html: JSON.stringify({
                                          resolvedServerColorMode:
                                              resolvedColorMode,
                                      }),
                                  },
                              })
                            : null
                    )
                );
            };
            ThemeProvider.displayName = "ThemeProvider";
            function useTheme() {
                return react.useContext(ThemeContext);
            }
            function useColorSchemeVar(values, fallback) {
                var _values$colorScheme;

                const { colorScheme = "" } = useTheme();
                return (_values$colorScheme = values[colorScheme]) !== null &&
                    _values$colorScheme !== void 0
                    ? _values$colorScheme
                    : fallback;
            }

            function useSystemColorMode() {
                const [systemColorMode, setSystemColorMode] =
                    react.useState(getSystemColorMode);
                react.useEffect(() => {
                    var _window, _window$matchMedia;

                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    const media =
                        (_window = window) === null || _window === void 0
                            ? void 0
                            : (_window$matchMedia = _window.matchMedia) ===
                                  null || _window$matchMedia === void 0
                            ? void 0
                            : _window$matchMedia.call(
                                  _window,
                                  "(prefers-color-scheme: dark)"
                              );

                    function handleChange(event) {
                        const isNight = event.matches;
                        setSystemColorMode(isNight ? "night" : "day");
                    } // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

                    if (media) {
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        if (media.addEventListener !== undefined) {
                            media.addEventListener("change", handleChange);
                            return function cleanup() {
                                media.removeEventListener(
                                    "change",
                                    handleChange
                                );
                            };
                        } // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        else if (media.addListener !== undefined) {
                            media.addListener(handleChange);
                            return function cleanup() {
                                media.removeListener(handleChange);
                            };
                        }
                    }
                }, []);
                return systemColorMode;
            }

            function getSystemColorMode() {
                var _window$matchMedia2, _window2, _window$matchMedia2$c;

                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (
                    typeof window !== "undefined" &&
                    (_window$matchMedia2 = (_window2 = window).matchMedia) !==
                        null &&
                    _window$matchMedia2 !== void 0 &&
                    (_window$matchMedia2$c = _window$matchMedia2.call(
                        _window2,
                        "(prefers-color-scheme: dark)"
                    )) !== null &&
                    _window$matchMedia2$c !== void 0 &&
                    _window$matchMedia2$c.matches
                ) {
                    return "night";
                }

                return "day";
            }

            function resolveColorMode(colorMode, systemColorMode) {
                switch (colorMode) {
                    case "auto":
                        return systemColorMode;

                    default:
                        return colorMode;
                }
            }

            function chooseColorScheme(colorMode, dayScheme, nightScheme) {
                switch (colorMode) {
                    case "day":
                        return dayScheme;

                    case "night":
                        return nightScheme;
                }
            }

            function applyColorScheme(theme, colorScheme) {
                if (!theme.colorSchemes) {
                    return {
                        resolvedTheme: theme,
                        resolvedColorScheme: undefined,
                    };
                }

                if (!theme.colorSchemes[colorScheme]) {
                    // eslint-disable-next-line no-console
                    console.error(
                        `\`${colorScheme}\` scheme not defined in \`theme.colorSchemes\``
                    ); // Apply the first defined color scheme

                    const defaultColorScheme = Object.keys(
                        theme.colorSchemes
                    )[0];
                    return {
                        resolvedTheme: cjs_default()(
                            theme,
                            theme.colorSchemes[defaultColorScheme]
                        ),
                        resolvedColorScheme: defaultColorScheme,
                    };
                }

                return {
                    resolvedTheme: cjs_default()(
                        theme,
                        theme.colorSchemes[colorScheme]
                    ),
                    resolvedColorScheme: colorScheme,
                };
            }

            /* harmony default export */ var lib_esm_ThemeProvider =
                ThemeProvider; // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/Button/types.js
            const StyledButton =
                styled_components_browser_esm.button.withConfig({
                    displayName: "types__StyledButton",
                    componentId: "sc-ws60qy-0",
                })(lib_esm_sx); // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/Button/styles.js
            const TEXT_ROW_HEIGHT = "20px"; // custom value off the scale

            const focusOutlineStyles = {
                outline: "2px solid",
                outlineColor: "accent.fg",
                outlineOffset: "-2px",
            };
            const fallbackFocus = {
                ...focusOutlineStyles,
                ":not(:focus-visible)": {
                    outline: "solid 1px transparent",
                },
            };
            const getVariantStyles = (variant = "default", theme) => {
                const style = {
                    default: {
                        color: "btn.text",
                        backgroundColor: "btn.bg",
                        boxShadow: `${
                            theme === null || theme === void 0
                                ? void 0
                                : theme.shadows.btn.shadow
                        }, ${
                            theme === null || theme === void 0
                                ? void 0
                                : theme.shadows.btn.insetShadow
                        }`,
                        "&:hover:not([disabled])": {
                            backgroundColor: "btn.hoverBg",
                        },
                        // focus must come before :active so that the active box shadow overrides
                        "&:focus:not([disabled])": { ...fallbackFocus },
                        "&:focus-visible:not([disabled])": focusOutlineStyles,
                        "&:active:not([disabled])": {
                            backgroundColor: "btn.activeBg",
                            borderColor: "btn.activeBorder",
                        },
                        "&:disabled": {
                            color: "primer.fg.disabled",
                            "[data-component=ButtonCounter]": {
                                color: "inherit",
                            },
                        },
                        "&[aria-expanded=true]": {
                            backgroundColor: "btn.activeBg",
                            borderColor: "btn.activeBorder",
                        },
                    },
                    primary: {
                        color: "btn.primary.text",
                        backgroundColor: "btn.primary.bg",
                        borderColor: "border.subtle",
                        boxShadow: `${
                            theme === null || theme === void 0
                                ? void 0
                                : theme.shadows.btn.primary.shadow
                        }`,
                        "&:hover:not([disabled])": {
                            color: "btn.primary.hoverText",
                            backgroundColor: "btn.primary.hoverBg",
                        },
                        // focus must come before :active so that the active box shadow overrides
                        "&:focus:not([disabled])": {
                            boxShadow: "inset 0 0 0 3px",
                            ...fallbackFocus,
                        },
                        "&:focus-visible:not([disabled])": {
                            ...focusOutlineStyles,
                            boxShadow: "inset 0 0 0 3px",
                        },
                        "&:active:not([disabled])": {
                            backgroundColor: "btn.primary.selectedBg",
                            boxShadow: `${
                                theme === null || theme === void 0
                                    ? void 0
                                    : theme.shadows.btn.primary.selectedShadow
                            }`,
                        },
                        "&:disabled": {
                            color: "btn.primary.disabledText",
                            backgroundColor: "btn.primary.disabledBg",
                            "[data-component=ButtonCounter]": {
                                color: "inherit",
                            },
                        },
                        "[data-component=ButtonCounter]": {
                            backgroundColor: "btn.primary.counterBg",
                            color: "btn.primary.text",
                        },
                        "&[aria-expanded=true]": {
                            backgroundColor: "btn.primary.selectedBg",
                            boxShadow: `${
                                theme === null || theme === void 0
                                    ? void 0
                                    : theme.shadows.btn.primary.selectedShadow
                            }`,
                        },
                    },
                    danger: {
                        color: "btn.danger.text",
                        backgroundColor: "btn.bg",
                        boxShadow: `${
                            theme === null || theme === void 0
                                ? void 0
                                : theme.shadows.btn.shadow
                        }`,
                        "&:hover:not([disabled])": {
                            color: "btn.danger.hoverText",
                            backgroundColor: "btn.danger.hoverBg",
                            borderColor: "btn.danger.hoverBorder",
                            boxShadow: `${
                                theme === null || theme === void 0
                                    ? void 0
                                    : theme.shadows.btn.danger.hoverShadow
                            }`,
                            "[data-component=ButtonCounter]": {
                                backgroundColor: "btn.danger.hoverCounterBg",
                                color: "btn.danger.hoverText",
                            },
                        },
                        // focus must come before :active so that the active box shadow overrides
                        "&:focus:not([disabled])": { ...fallbackFocus },
                        "&:focus-visible:not([disabled])": focusOutlineStyles,
                        "&:active:not([disabled])": {
                            color: "btn.danger.selectedText",
                            backgroundColor: "btn.danger.selectedBg",
                            boxShadow: `${
                                theme === null || theme === void 0
                                    ? void 0
                                    : theme.shadows.btn.danger.selectedShadow
                            }`,
                            borderColor: "btn.danger.selectedBorder",
                        },
                        "&:disabled": {
                            color: "btn.danger.disabledText",
                            backgroundColor: "btn.danger.disabledBg",
                            borderColor: "btn.danger.disabledBorder",
                            "[data-component=ButtonCounter]": {
                                color: "inherit",
                                backgroundColor: "btn.danger.disabledCounterBg",
                            },
                        },
                        "[data-component=ButtonCounter]": {
                            color: "btn.danger.text",
                            backgroundColor: "btn.danger.counterBg",
                        },
                        "&[aria-expanded=true]": {
                            color: "btn.danger.selectedText",
                            backgroundColor: "btn.danger.selectedBg",
                            boxShadow: `${
                                theme === null || theme === void 0
                                    ? void 0
                                    : theme.shadows.btn.danger.selectedShadow
                            }`,
                            borderColor: "btn.danger.selectedBorder",
                        },
                    },
                    invisible: {
                        color: "accent.fg",
                        backgroundColor: "transparent",
                        border: "0",
                        boxShadow: "none",
                        "&:hover:not([disabled])": {
                            backgroundColor: "btn.hoverBg",
                        },
                        // focus must come before :active so that the active box shadow overrides
                        "&:focus:not([disabled])": { ...fallbackFocus },
                        "&:focus-visible:not([disabled])": focusOutlineStyles,
                        "&:active:not([disabled])": {
                            backgroundColor: "btn.selectedBg",
                        },
                        "&:disabled": {
                            color: "primer.fg.disabled",
                            "[data-component=ButtonCounter]": {
                                color: "inherit",
                            },
                        },
                        "&[aria-expanded=true]": {
                            backgroundColor: "btn.selectedBg",
                        },
                    },
                    outline: {
                        color: "btn.outline.text",
                        boxShadow: `${
                            theme === null || theme === void 0
                                ? void 0
                                : theme.shadows.btn.shadow
                        }`,
                        borderColor: "btn.border",
                        backgroundColor: "btn.bg",
                        "&:hover:not([disabled])": {
                            color: "btn.outline.hoverText",
                            backgroundColor: "btn.outline.hoverBg",
                            borderColor: "outline.hoverBorder",
                            boxShadow: `${
                                theme === null || theme === void 0
                                    ? void 0
                                    : theme.shadows.btn.outline.hoverShadow
                            }`,
                            "[data-component=ButtonCounter]": {
                                backgroundColor: "btn.outline.hoverCounterBg",
                                color: "inherit",
                            },
                        },
                        // focus must come before :active so that the active box shadow overrides
                        "&:focus:not([disabled])": { ...fallbackFocus },
                        "&:focus-visible:not([disabled])": focusOutlineStyles,
                        "&:active:not([disabled])": {
                            color: "btn.outline.selectedText",
                            backgroundColor: "btn.outline.selectedBg",
                            boxShadow: `${
                                theme === null || theme === void 0
                                    ? void 0
                                    : theme.shadows.btn.outline.selectedShadow
                            }`,
                            borderColor: "btn.outline.selectedBorder",
                        },
                        "&:disabled": {
                            color: "btn.outline.disabledText",
                            backgroundColor: "btn.outline.disabledBg",
                            borderColor: "btn.border",
                            "[data-component=ButtonCounter]": {
                                backgroundColor:
                                    "btn.outline.disabledCounterBg",
                                color: "inherit",
                            },
                        },
                        "[data-component=ButtonCounter]": {
                            backgroundColor: "btn.outline.counterBg",
                            color: "btn.outline.text",
                        },
                        "&[aria-expanded=true]": {
                            color: "btn.outline.selectedText",
                            backgroundColor: "btn.outline.selectedBg",
                            boxShadow: `${
                                theme === null || theme === void 0
                                    ? void 0
                                    : theme.shadows.btn.outline.selectedShadow
                            }`,
                            borderColor: "btn.outline.selectedBorder",
                        },
                    },
                };
                return style[variant];
            };
            /* The button heights have to amount to 
  small - 28
  medium - 32
  large - 34
  In icon these have to be square.
*/

            const getSizeStyles = (
                size = "medium",
                variant = "default",
                iconOnly
            ) => {
                let paddingY, paddingX, fontSize;

                switch (size) {
                    case "small":
                        paddingY = 3;
                        paddingX = 12;
                        fontSize = 0;
                        break;

                    case "large":
                        paddingY = 9;
                        paddingX = 20;
                        fontSize = 2;
                        break;

                    case "medium":
                    default:
                        paddingY = 5;
                        paddingX = 16;
                        fontSize = 1;
                }

                if (iconOnly) {
                    // when `size !== 'medium'`, vertical alignment of the icon is thrown off
                    // because changing the font size draws an em-box that does not match the
                    // bounding box of the SVG
                    fontSize = 1;
                    paddingX = paddingY + 3; // to make it a square
                }

                if (variant === "invisible") {
                    paddingY = paddingY + 1; // to make up for absence of border
                }

                return {
                    paddingY: `${paddingY}px`,
                    paddingX: `${paddingX}px`,
                    fontSize,
                    "[data-component=ButtonCounter]": {
                        fontSize,
                    },
                };
            };
            const getBaseStyles = (theme) => ({
                borderRadius: "2",
                border: "1px solid",
                borderColor:
                    theme === null || theme === void 0
                        ? void 0
                        : theme.colors.btn.border,
                fontFamily: "inherit",
                fontWeight: "bold",
                lineHeight: TEXT_ROW_HEIGHT,
                whiteSpace: "nowrap",
                verticalAlign: "middle",
                cursor: "pointer",
                appearance: "none",
                userSelect: "none",
                textDecoration: "none",
                textAlign: "center",
                "&:disabled": {
                    cursor: "default",
                },
                "&:disabled svg": {
                    opacity: "0.6",
                },
                "@media (forced-colors: active)": {
                    "&:focus": {
                        // Support for Windows high contrast https://sarahmhigley.com/writing/whcm-quick-tips
                        outline: "solid 1px transparent",
                    },
                },
            });
            const getButtonStyles = (theme) => {
                const styles = {
                    ...getBaseStyles(theme),
                    display: "grid",
                    gridTemplateAreas: '"leadingIcon text trailingIcon"',
                    "& > :not(:last-child)": {
                        mr: "2",
                    },
                    '[data-component="leadingIcon"]': {
                        gridArea: "leadingIcon",
                    },
                    '[data-component="text"]': {
                        gridArea: "text",
                    },
                    '[data-component="trailingIcon"]': {
                        gridArea: "trailingIcon",
                    },
                };
                return styles;
            }; // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/Button/ButtonBase.js
            function ButtonBase_extends() {
                ButtonBase_extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];
                            for (var key in source) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        source,
                                        key
                                    )
                                ) {
                                    target[key] = source[key];
                                }
                            }
                        }
                        return target;
                    };
                return ButtonBase_extends.apply(this, arguments);
            }

            const ButtonBase = /*#__PURE__*/ (0, react.forwardRef)(
                (
                    {
                        children,
                        as: Component = "button",
                        sx: sxProp = {},
                        ...props
                    },
                    forwardedRef
                ) => {
                    const {
                        leadingIcon: LeadingIcon,
                        trailingIcon: TrailingIcon,
                        variant = "default",
                        size = "medium",
                    } = props;
                    const { theme } = useTheme();
                    const iconWrapStyles = {
                        display: "inline-block",
                    };
                    const sxStyles = cjs_default().all([
                        getButtonStyles(theme),
                        getSizeStyles(size, variant, false),
                        getVariantStyles(variant, theme),
                        sxProp,
                    ]);
                    return /*#__PURE__*/ react.createElement(
                        StyledButton,
                        ButtonBase_extends(
                            {
                                as: Component,
                                sx: sxStyles,
                            },
                            props,
                            {
                                ref: forwardedRef,
                            }
                        ),
                        LeadingIcon &&
                            /*#__PURE__*/ react.createElement(
                                lib_esm_Box,
                                {
                                    as: "span",
                                    "data-component": "leadingIcon",
                                    sx: iconWrapStyles,
                                },
                                /*#__PURE__*/ react.createElement(
                                    LeadingIcon,
                                    null
                                )
                            ),
                        children &&
                            /*#__PURE__*/ react.createElement(
                                "span",
                                {
                                    "data-component": "text",
                                },
                                children
                            ),
                        TrailingIcon &&
                            /*#__PURE__*/ react.createElement(
                                lib_esm_Box,
                                {
                                    as: "span",
                                    "data-component": "trailingIcon",
                                    sx: { ...iconWrapStyles, ml: 2 },
                                },
                                /*#__PURE__*/ react.createElement(
                                    TrailingIcon,
                                    null
                                )
                            )
                    );
                }
            ); // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/Button/Button.js

            function Button_extends() {
                Button_extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];
                            for (var key in source) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        source,
                                        key
                                    )
                                ) {
                                    target[key] = source[key];
                                }
                            }
                        }
                        return target;
                    };
                return Button_extends.apply(this, arguments);
            }

            const ButtonComponent = /*#__PURE__*/ (0, react.forwardRef)(
                ({ children, ...props }, forwardedRef) => {
                    return /*#__PURE__*/ react.createElement(
                        ButtonBase,
                        Button_extends(
                            {
                                ref: forwardedRef,
                            },
                            props,
                            {
                                as: "button",
                            }
                        ),
                        children
                    );
                }
            );
            ButtonComponent.displayName = "Button"; // CONCATENATED MODULE: ./node_modules/@styled-system/theme-get/dist/index.esm.js

            var themeGet = function themeGet(path, fallback) {
                if (fallback === void 0) {
                    fallback = null;
                }

                return function (props) {
                    return get(props.theme, path, fallback);
                };
            };
            /* harmony default export */ var theme_get_dist_index_esm =
                /* unused pure expression or super */ null && themeGet; // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/constants.js

            // eslint-disable-next-line import/no-namespace

            const {
                get: getKey,
                compose: constants_compose,
                system: constants_system,
            } = styled_system_dist_index_esm_namespaceObject;
            const constants_get = (key) =>
                themeGet(key, getKey(lib_esm_theme, key)); // Common props

            const COMMON = constants_compose(space, color, display);
            // Typography props
            const whiteSpace = constants_system({
                whiteSpace: {
                    property: "whiteSpace", // cssProperty: 'whiteSpace',
                },
            });
            const TYPOGRAPHY = constants_compose(typography, whiteSpace);
            // Border props
            const BORDER = constants_compose(border, shadow);
            // Layout props
            const LAYOUT = layout; // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/CounterLabel.js
            const colorStyles = ({ scheme, ...props }) => {
                return {
                    color:
                        scheme === "secondary"
                            ? constants_get("colors.fg.default")(props)
                            : scheme === "primary"
                            ? constants_get("colors.fg.onEmphasis")(props)
                            : constants_get("colors.fg.default")(props),
                };
            };

            const bgStyles = ({ scheme, ...props }) => {
                return {
                    backgroundColor:
                        scheme === "secondary"
                            ? constants_get("colors.neutral.muted")(props)
                            : scheme === "primary"
                            ? constants_get("colors.neutral.emphasis")(props)
                            : constants_get("colors.neutral.muted")(props),
                };
            };

            const CounterLabel = styled_components_browser_esm.span.withConfig({
                displayName: "CounterLabel",
                componentId: "sc-13ceqbg-0",
            })(
                [
                    "display:inline-block;padding:2px 5px;font-size:",
                    ";font-weight:",
                    ";line-height:",
                    ";border-radius:20px;",
                    ";",
                    ";&:empty{display:none;}",
                    ";",
                ],
                constants_get("fontSizes.0"),
                constants_get("fontWeights.bold"),
                constants_get("lineHeights.condensedUltra"),
                colorStyles,
                bgStyles,
                lib_esm_sx
            );
            /* harmony default export */ var lib_esm_CounterLabel =
                CounterLabel; // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/Button/ButtonCounter.js
            function ButtonCounter_extends() {
                ButtonCounter_extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];
                            for (var key in source) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        source,
                                        key
                                    )
                                ) {
                                    target[key] = source[key];
                                }
                            }
                        }
                        return target;
                    };
                return ButtonCounter_extends.apply(this, arguments);
            }

            const Counter = ({ children, sx: sxProp = {}, ...props }) => {
                return /*#__PURE__*/ react.createElement(
                    lib_esm_CounterLabel,
                    ButtonCounter_extends(
                        {
                            "data-component": "ButtonCounter",
                            sx: {
                                ml: 2,
                                ...sxProp,
                            },
                        },
                        props
                    ),
                    children
                );
            };

            Counter.displayName = "Counter"; // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/Button/index.js

            const Button = Object.assign(ButtonComponent, {
                Counter: Counter,
            }); // CONCATENATED MODULE: ./node_modules/@react-aria/ssr/dist/module.js
            // Default context value to use in case there is no SSRProvider. This is fine for
            // client-only apps. In order to support multiple copies of React Aria potentially
            // being on the page at once, the prefix is set to a random number. SSRProvider
            // will reset this to zero for consistency between server and client, so in the
            // SSR case multiple copies of React Aria is not supported.
            const $f01a183cc7bdff77849e49ad26eb904$var$defaultContext = {
                prefix: String(Math.round(Math.random() * 10000000000)),
                current: 0,
            };

            const $f01a183cc7bdff77849e49ad26eb904$var$SSRContext =
                /*#__PURE__*/ react.createContext(
                    $f01a183cc7bdff77849e49ad26eb904$var$defaultContext
                );

            /**
             * When using SSR with React Aria, applications must be wrapped in an SSRProvider.
             * This ensures that auto generated ids are consistent between the client and server.
             */
            function SSRProvider(props) {
                let cur = (0, react.useContext)(
                    $f01a183cc7bdff77849e49ad26eb904$var$SSRContext
                );
                let value = (0, react.useMemo)(
                    () => ({
                        // If this is the first SSRProvider, start with an empty string prefix, otherwise
                        // append and increment the counter.
                        prefix:
                            cur ===
                            $f01a183cc7bdff77849e49ad26eb904$var$defaultContext
                                ? ""
                                : cur.prefix + "-" + ++cur.current,
                        current: 0,
                    }),
                    [cur]
                );
                return /*#__PURE__*/ react.createElement(
                    $f01a183cc7bdff77849e49ad26eb904$var$SSRContext.Provider,
                    {
                        value: value,
                    },
                    props.children
                );
            }
            let $f01a183cc7bdff77849e49ad26eb904$var$canUseDOM = Boolean(
                typeof window !== "undefined" &&
                    window.document &&
                    window.document.createElement
            );
            /** @private */

            function useSSRSafeId(defaultId) {
                let ctx = useContext(
                    $f01a183cc7bdff77849e49ad26eb904$var$SSRContext
                ); // If we are rendering in a non-DOM environment, and there's no SSRProvider,
                // provide a warning to hint to the developer to add one.

                if (
                    ctx ===
                        $f01a183cc7bdff77849e49ad26eb904$var$defaultContext &&
                    !$f01a183cc7bdff77849e49ad26eb904$var$canUseDOM
                ) {
                    console.warn(
                        "When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server."
                    );
                }

                return useMemo(
                    () =>
                        defaultId ||
                        "react-aria" + ctx.prefix + "-" + ++ctx.current,
                    [defaultId]
                );
            }
            /**
             * Returns whether the component is currently being server side rendered or
             * hydrated on the client. Can be used to delay browser-specific rendering
             * until after hydration.
             */

            function useIsSSR() {
                let cur = useContext(
                    $f01a183cc7bdff77849e49ad26eb904$var$SSRContext
                );
                let isInSSRContext =
                    cur !== $f01a183cc7bdff77849e49ad26eb904$var$defaultContext;
                let [isSSR, setIsSSR] = useState(isInSSRContext); // If on the client, and the component was initially server rendered,
                // then schedule a layout effect to update the component after hydration.

                if (typeof window !== "undefined" && isInSSRContext) {
                    // This if statement technically breaks the rules of hooks, but is safe
                    // because the condition never changes after mounting.
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useLayoutEffect(() => {
                        setIsSSR(false);
                    }, []);
                }

                return isSSR;
            } // CONCATENATED MODULE: ./node_modules/@primer/react/lib-esm/BaseStyles.js
            //# sourceMappingURL=module.js.map

            function BaseStyles_extends() {
                BaseStyles_extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];
                            for (var key in source) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        source,
                                        key
                                    )
                                ) {
                                    target[key] = source[key];
                                }
                            }
                        }
                        return target;
                    };
                return BaseStyles_extends.apply(this, arguments);
            }

            const GlobalStyle = We([
                '*{box-sizing:border-box;}body{margin:0;}table{border-collapse:collapse;}[role="button"]:focus:not(:focus-visible):not(.focus-visible),[role="tabpanel"][tabindex="0"]:focus:not(:focus-visible):not(.focus-visible),button:focus:not(:focus-visible):not(.focus-visible),summary:focus:not(:focus-visible):not(.focus-visible),a:focus:not(:focus-visible):not(.focus-visible){outline:none;box-shadow:none;}[tabindex="0"]:focus:not(:focus-visible):not(.focus-visible),details-dialog:focus:not(:focus-visible):not(.focus-visible){outline:none;}',
            ]);
            const Base = styled_components_browser_esm.div.withConfig({
                displayName: "BaseStyles__Base",
                componentId: "sc-nfjs56-0",
            })(["", ";", ";"], TYPOGRAPHY, COMMON);

            function BaseStyles(props) {
                const { children, ...rest } = props; // load polyfill for :focus-visible

                __webpack_require__(5202);

                return /*#__PURE__*/ react.createElement(
                    Base,
                    BaseStyles_extends({}, rest, {
                        "data-portal-root": true,
                    }),
                    /*#__PURE__*/ react.createElement(GlobalStyle, null),
                    children
                );
            }

            BaseStyles.displayName = "BaseStyles";
            BaseStyles.defaultProps = {
                color: "fg.default",
                fontFamily: "normal",
                lineHeight: "default",
            };
            /* harmony default export */ var lib_esm_BaseStyles = BaseStyles; // CONCATENATED MODULE: ./pages/_app.js
            var ThemedApp = function () {
                var ref = (0, react.useState)(false),
                    render = ref[0],
                    setRender = ref[1];
                (0, react.useEffect)(function () {
                    console.log("PRERENDER: useEffect");
                    setRender(true);
                }, []);
                console.log("Env:", "production");
                console.log("PRERENDER: ".concat(render));
                return /*#__PURE__*/ (0, jsx_runtime.jsx)(lib_esm_Box, {
                    children:
                        !!render &&
                        /*#__PURE__*/ (0, jsx_runtime.jsx)(Button, {
                            variant: "danger",
                            children: "Test",
                        }),
                });
            };
            var App = function () {
                return /*#__PURE__*/ (0, jsx_runtime.jsx)(SSRProvider, {
                    children: /*#__PURE__*/ (0, jsx_runtime.jsx)(
                        lib_esm_ThemeProvider,
                        {
                            children: /*#__PURE__*/ (0, jsx_runtime.jsx)(
                                lib_esm_BaseStyles,
                                {
                                    children: /*#__PURE__*/ (0,
                                    jsx_runtime.jsx)(ThemedApp, {}),
                                }
                            ),
                        }
                    ),
                });
            };
            /* harmony default export */ var _app = App;

            /***/
        },

        /***/ 7663: /***/ function (module) {
            var __dirname = "/";
            (function () {
                var e = {
                    162: function (e) {
                        var t = (e.exports = {});
                        var r;
                        var n;
                        function defaultSetTimout() {
                            throw new Error("setTimeout has not been defined");
                        }
                        function defaultClearTimeout() {
                            throw new Error(
                                "clearTimeout has not been defined"
                            );
                        }
                        (function () {
                            try {
                                if (typeof setTimeout === "function") {
                                    r = setTimeout;
                                } else {
                                    r = defaultSetTimout;
                                }
                            } catch (e) {
                                r = defaultSetTimout;
                            }
                            try {
                                if (typeof clearTimeout === "function") {
                                    n = clearTimeout;
                                } else {
                                    n = defaultClearTimeout;
                                }
                            } catch (e) {
                                n = defaultClearTimeout;
                            }
                        })();
                        function runTimeout(e) {
                            if (r === setTimeout) {
                                return setTimeout(e, 0);
                            }
                            if ((r === defaultSetTimout || !r) && setTimeout) {
                                r = setTimeout;
                                return setTimeout(e, 0);
                            }
                            try {
                                return r(e, 0);
                            } catch (t) {
                                try {
                                    return r.call(null, e, 0);
                                } catch (t) {
                                    return r.call(this, e, 0);
                                }
                            }
                        }
                        function runClearTimeout(e) {
                            if (n === clearTimeout) {
                                return clearTimeout(e);
                            }
                            if (
                                (n === defaultClearTimeout || !n) &&
                                clearTimeout
                            ) {
                                n = clearTimeout;
                                return clearTimeout(e);
                            }
                            try {
                                return n(e);
                            } catch (t) {
                                try {
                                    return n.call(null, e);
                                } catch (t) {
                                    return n.call(this, e);
                                }
                            }
                        }
                        var i = [];
                        var o = false;
                        var u;
                        var a = -1;
                        function cleanUpNextTick() {
                            if (!o || !u) {
                                return;
                            }
                            o = false;
                            if (u.length) {
                                i = u.concat(i);
                            } else {
                                a = -1;
                            }
                            if (i.length) {
                                drainQueue();
                            }
                        }
                        function drainQueue() {
                            if (o) {
                                return;
                            }
                            var e = runTimeout(cleanUpNextTick);
                            o = true;
                            var t = i.length;
                            while (t) {
                                u = i;
                                i = [];
                                while (++a < t) {
                                    if (u) {
                                        u[a].run();
                                    }
                                }
                                a = -1;
                                t = i.length;
                            }
                            u = null;
                            o = false;
                            runClearTimeout(e);
                        }
                        t.nextTick = function (e) {
                            var t = new Array(arguments.length - 1);
                            if (arguments.length > 1) {
                                for (var r = 1; r < arguments.length; r++) {
                                    t[r - 1] = arguments[r];
                                }
                            }
                            i.push(new Item(e, t));
                            if (i.length === 1 && !o) {
                                runTimeout(drainQueue);
                            }
                        };
                        function Item(e, t) {
                            this.fun = e;
                            this.array = t;
                        }
                        Item.prototype.run = function () {
                            this.fun.apply(null, this.array);
                        };
                        t.title = "browser";
                        t.browser = true;
                        t.env = {};
                        t.argv = [];
                        t.version = "";
                        t.versions = {};
                        function noop() {}
                        t.on = noop;
                        t.addListener = noop;
                        t.once = noop;
                        t.off = noop;
                        t.removeListener = noop;
                        t.removeAllListeners = noop;
                        t.emit = noop;
                        t.prependListener = noop;
                        t.prependOnceListener = noop;
                        t.listeners = function (e) {
                            return [];
                        };
                        t.binding = function (e) {
                            throw new Error("process.binding is not supported");
                        };
                        t.cwd = function () {
                            return "/";
                        };
                        t.chdir = function (e) {
                            throw new Error("process.chdir is not supported");
                        };
                        t.umask = function () {
                            return 0;
                        };
                    },
                };
                var t = {};
                function __nccwpck_require__(r) {
                    var n = t[r];
                    if (n !== undefined) {
                        return n.exports;
                    }
                    var i = (t[r] = { exports: {} });
                    var o = true;
                    try {
                        e[r](i, i.exports, __nccwpck_require__);
                        o = false;
                    } finally {
                        if (o) delete t[r];
                    }
                    return i.exports;
                }
                if (typeof __nccwpck_require__ !== "undefined")
                    __nccwpck_require__.ab = __dirname + "/";
                var r = __nccwpck_require__(162);
                module.exports = r;
            })();

            /***/
        },

        /***/ 9921: /***/ function (__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;
            /**
             * @license React
             * react-is.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */
            var b = Symbol.for("react.element"),
                c = Symbol.for("react.portal"),
                d = Symbol.for("react.fragment"),
                e = Symbol.for("react.strict_mode"),
                f = Symbol.for("react.profiler"),
                g = Symbol.for("react.provider"),
                h = Symbol.for("react.context"),
                k = Symbol.for("react.server_context"),
                l = Symbol.for("react.forward_ref"),
                m = Symbol.for("react.suspense"),
                n = Symbol.for("react.suspense_list"),
                p = Symbol.for("react.memo"),
                q = Symbol.for("react.lazy"),
                t = Symbol.for("react.offscreen"),
                u;
            u = Symbol.for("react.module.reference");
            function v(a) {
                if ("object" === typeof a && null !== a) {
                    var r = a.$$typeof;
                    switch (r) {
                        case b:
                            switch (((a = a.type), a)) {
                                case d:
                                case f:
                                case e:
                                case m:
                                case n:
                                    return a;
                                default:
                                    switch (((a = a && a.$$typeof), a)) {
                                        case k:
                                        case h:
                                        case l:
                                        case q:
                                        case p:
                                        case g:
                                            return a;
                                        default:
                                            return r;
                                    }
                            }
                        case c:
                            return r;
                    }
                }
            }
            __webpack_unused_export__ = h;
            __webpack_unused_export__ = g;
            __webpack_unused_export__ = b;
            __webpack_unused_export__ = l;
            __webpack_unused_export__ = d;
            __webpack_unused_export__ = q;
            __webpack_unused_export__ = p;
            __webpack_unused_export__ = c;
            __webpack_unused_export__ = f;
            __webpack_unused_export__ = e;
            __webpack_unused_export__ = m;
            __webpack_unused_export__ = n;
            __webpack_unused_export__ = function () {
                return !1;
            };
            __webpack_unused_export__ = function () {
                return !1;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === h;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === g;
            };
            __webpack_unused_export__ = function (a) {
                return "object" === typeof a && null !== a && a.$$typeof === b;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === l;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === d;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === q;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === p;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === c;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === f;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === e;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === m;
            };
            __webpack_unused_export__ = function (a) {
                return v(a) === n;
            };
            exports.isValidElementType = function (a) {
                return "string" === typeof a ||
                    "function" === typeof a ||
                    a === d ||
                    a === f ||
                    a === e ||
                    a === m ||
                    a === n ||
                    a === t ||
                    ("object" === typeof a &&
                        null !== a &&
                        (a.$$typeof === q ||
                            a.$$typeof === p ||
                            a.$$typeof === g ||
                            a.$$typeof === h ||
                            a.$$typeof === l ||
                            a.$$typeof === u ||
                            void 0 !== a.getModuleId))
                    ? !0
                    : !1;
            };
            exports.typeOf = v;

            /***/
        },

        /***/ 9864: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            if (true) {
                module.exports = __webpack_require__(9921);
            } else {
            }

            /***/
        },

        /***/ 6774: /***/ function (module) {
            //

            module.exports = function shallowEqual(
                objA,
                objB,
                compare,
                compareContext
            ) {
                var ret = compare
                    ? compare.call(compareContext, objA, objB)
                    : void 0;

                if (ret !== void 0) {
                    return !!ret;
                }

                if (objA === objB) {
                    return true;
                }

                if (
                    typeof objA !== "object" ||
                    !objA ||
                    typeof objB !== "object" ||
                    !objB
                ) {
                    return false;
                }

                var keysA = Object.keys(objA);
                var keysB = Object.keys(objB);

                if (keysA.length !== keysB.length) {
                    return false;
                }

                var bHasOwnProperty =
                    Object.prototype.hasOwnProperty.bind(objB);

                // Test for A's keys different from B.
                for (var idx = 0; idx < keysA.length; idx++) {
                    var key = keysA[idx];

                    if (!bHasOwnProperty(key)) {
                        return false;
                    }

                    var valueA = objA[key];
                    var valueB = objB[key];

                    ret = compare
                        ? compare.call(compareContext, valueA, valueB, key)
                        : void 0;

                    if (
                        ret === false ||
                        (ret === void 0 && valueA !== valueB)
                    ) {
                        return false;
                    }
                }

                return true;
            };

            /***/
        },
    },
    /******/ function (__webpack_require__) {
        // webpackRuntimeModules
        /******/ var __webpack_exec__ = function (moduleId) {
            return __webpack_require__((__webpack_require__.s = moduleId));
        };
        /******/ __webpack_require__.O(0, [774, 179], function () {
            return __webpack_exec__(1118), __webpack_exec__(880);
        });
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ _N_E = __webpack_exports__;
        /******/
    },
]);
