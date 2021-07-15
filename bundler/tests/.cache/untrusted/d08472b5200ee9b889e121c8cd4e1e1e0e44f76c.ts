// Loaded from https://framer.com/m/framer/Spotify.js@0.4.0


const React = window.React;
const { addPropertyControls: addPropertyControls , ControlType: ControlType  } = window.Framer;
const urlRegex = /(https?:\/\/[^ ]*)/;
const createEmbedUrl = (sourceUrl, theme = 0)=>{
    if (sourceUrl.length < 5) return null;
    // If someone pastes the embed code lets still try to render it
    const strippedUrl = sourceUrl.includes("iframe") ? sourceUrl.match(urlRegex)[1].replace(`"`, "") : sourceUrl;
    const url = new URL(strippedUrl);
    // Add embed prefix if needed
    if (!url.pathname.includes("embed")) url.pathname = `/embed${url.pathname}`;
    // Remove params
    url.search = `theme=${theme}`;
    return url.toString();
};
/**
 * SPOTIFY
 *
 * @framerIntrinsicWidth 280
 * @framerIntrinsicHeight 350
 */ export function Spotify(props) {
    const identifier = createEmbedUrl(props.url, props.theme);
    return(/*#__PURE__*/ React.createElement("iframe", {
        style: {
            height: "100%",
            width: "100%"
        },
        frameBorder: 0,
        src: identifier
    }));
}
Spotify.defaultProps = {
    url: "https://open.spotify.com/album/31qVWUdRrlb8thMvts0yYL?si=Jl-8Mnc3RNGuOtqRC7NXVg",
    width: 280,
    height: 350,
    theme: 1
};
addPropertyControls(Spotify, {
    url: {
        type: ControlType.String,
        title: "URL"
    },
    theme: {
        type: ControlType.Enum,
        displaySegmentedControl: true,
        options: [
            1,
            0
        ],
        optionTitles: [
            "On",
            "Off"
        ]
    }
});

export const __FramerMetadata__ = {"exports":{"Spotify":{"type":"reactComponent","slots":[],"annotations":{"framerIntrinsicWidth":"280","framerIntrinsicHeight":"350"}}}}
//# sourceMappingURL=./Spotify.map