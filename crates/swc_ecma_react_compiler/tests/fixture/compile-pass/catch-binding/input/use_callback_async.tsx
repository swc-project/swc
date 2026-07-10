import { useCallback } from "react";

export function useRepro() {
    return useCallback(async () => {
        try {
            await 0;
        } catch (error) {
            return error;
        }
    }, []);
}
