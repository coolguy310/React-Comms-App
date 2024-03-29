import { styled } from "stitches.config";

const Text = styled("p", {
  variants: {
    fontSize: {
      xl: {
        fontSize: "x-large",
      },
      md: {
        fontSize: "medium",
      },
      lg: {
        fontSize: "large",
      },
      sm: {
        fontSize: 14,
      },
      xs: {
        fontSize: 12,
      },
    },

    fontWeight: {
      bold: {
        fontWeight: "bold",
      },
    },
  },
});

export default Text;
