import { useMemo } from "react";
import { css } from "@emotion/react";
import { theme } from "antd";
import { useMediaQuery } from "./hooks";
export const getMQ = (token)=>({
        xsMin: `@media (min-width: ${token.screenXSMin}px)`,
        xsMax: `@media (max-width: ${token.screenXSMax}px)`,
        smMin: `@media (min-width: ${token.screenSMMin}px)`,
        smMax: `@media (max-width: ${token.screenSMMax}px)`,
        mdMin: `@media (min-width: ${token.screenMDMin}px)`,
        mdMax: `@media (max-width: ${token.screenMDMax}px)`,
        lgMin: `@media (min-width: ${token.screenLGMin}px)`,
        lgMax: `@media (max-width: ${token.screenLGMax}px)`,
        xlMin: `@media (min-width: ${token.screenXLMin}px)`,
        xlMax: `@media (max-width: ${token.screenXLMax}px)`,
        xxlMin: `@media (min-width: ${token.screenXXLMin}px)`
    });
export const useBreakpoint = (breakpoint)=>{
    const { token } = theme.useToken();
    const query = useMemo(()=>{
        const key = breakpoint === "xs" ? "xsMax" : `${breakpoint}Min`;
        return getMQ(token)[key].replace("@media ", "");
    }, [
        breakpoint,
        token
    ]);
    return useMediaQuery(query);
};
export const createStyles = (arg)=>arg;
/**
 * Reusable styles
 */ export const centeredCss = css({
    display: "grid",
    placeContent: "center",
    height: "100%"
});
export const fullVPHeightCss = css({
    height: "100vh"
});
export const noMargin = css({
    margin: "0 !important"
});
