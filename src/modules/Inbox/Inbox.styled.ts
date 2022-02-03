import Text from "components/ui/Text/Text";
import { styled } from "stitches.config";

export const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});

export const Table = styled("table", {
  width: "100%",
  whiteSpace: "nowrap",
  tableLayout: "fixed",
});

export const Tbody = styled("tbody", {});

export const Tr = styled("tr", {
  "&:nth-child(even)": {
    backgroundColor: "$gray2",
  },
});

export const Td = styled("td", {
  "&.author": {
    width: "16rem",
    paddingLeft: "3rem",
  },

  "&.actions": {
    width: "16rem",
  },

  cursor: "pointer",
  textAlign: "left",
  padding: 8,
});

export const InboxText = styled(Text, {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
