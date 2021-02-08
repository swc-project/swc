import { SOURCE } from "../types/mod";

export const generateTVSource = (name: string): SOURCE => ({
  name,
  mediaType: "Television",
});
