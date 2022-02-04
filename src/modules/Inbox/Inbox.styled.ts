import Text from "components/ui/Text/Text";
import { styled } from "stitches.config";

export const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});

export const InboxList = styled("div", {
  "& > div:nth-child(even)": {
    backgroundColor: "$gray2",
  },
});

export const InboxText = styled(Text, {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
