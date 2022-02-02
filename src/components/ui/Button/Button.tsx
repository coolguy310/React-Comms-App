import { styled } from "stitches.config";

const Button = styled("button", {
  variants: {
    variant: {
      primary: {
        color: "white",
        backgroundColor: "$primary",
      },
      secondary: {
        color: "black",
        backgroundColor: "$secondary",
      },
      bordered: {
        border: "1px solid",
        borderColor: "$gray5",
      },
    },
  },
  alignItems: "center",
  borderRadius: 6,
  svg: {
    marginRight: 12,
  },
});

export default Button;
