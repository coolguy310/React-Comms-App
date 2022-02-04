import { styled } from "stitches.config";

const Flex = styled("div", {
  variants: {
    alignCenter: {
      true: {
        alignItems: "center",
      },
    },
    alignStart: {
      true: {
        alignItems: "flex-start",
      },
    },
    alignEnd: {
      true: {
        alignItems: "flex-end",
      },
    },
    justifyCenter: {
      true: {
        justifyContent: "center",
      },
    },
    justifyBetween: {
      true: {
        justifyContent: "space-between",
      },
    },
    justifyStart: {
      true: {
        justifyContent: "flex-start",
      },
    },
    justifyEnd: {
      true: {
        justifyContent: "flex-end",
      },
    },
    column: {
      true: {
        flexDirection: "column",
      },
    },
  },
  display: "flex",
});

export default Flex;
