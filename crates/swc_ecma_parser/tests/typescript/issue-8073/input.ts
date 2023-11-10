avplay.setListener({
    onsubtitlechange: (duration, subtitles, type, attributes) => {
        duration // $ExpectType string
        subtitles // $ExpectType string
        type // $ExpectType string
        attributes // $ExpectType AVPlaySubtitleAttribute[]
    }
})