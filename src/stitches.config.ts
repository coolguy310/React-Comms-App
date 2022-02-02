import { createStitches } from "@stitches/react";
import { gray, whiteA, blackA } from "@radix-ui/colors";

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      ...gray,
      ...whiteA,
      ...blackA,
      primary: "#05473C",
      secondary: "#54ECCA",
    },
  },
});
