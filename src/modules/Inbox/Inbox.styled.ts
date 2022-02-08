import Text from "components/ui/Text/Text";
import { styled } from "stitches.config";

export const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});

export const InboxItem = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.5rem 2rem",
  cursor: "pointer",
  borderBottom: "1px solid",
  borderBottomColor: "$gray4",
});

export const InboxText = styled(Text, {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
