import { styled } from "stitches.config";

const Input = styled("input", {
  border: "1px solid",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  width: "100%",
  height: "3rem",
  borderColor: "$gray5",
  "&::placeholder": {
    color: "$gray7",
  },
});

export default Input;
