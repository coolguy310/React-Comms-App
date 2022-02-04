import { createStitches } from "@stitches/react";
import { gray, red, whiteA, blackA } from "@radix-ui/colors";

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
      ...red,
      ...whiteA,
      ...blackA,
      primary: "#05473C",
      secondary: "#54ECCA",
    },
  },
});
