import Text from "components/ui/Text/Text";
import { styled } from "stitches.config";

export const PostItem = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.5rem 2rem",
  cursor: "pointer",
  borderBottom: "1px solid",
  borderBottomColor: "$gray4",
  "&.active": {
    background: "#d3d3d33b",
  },
  "&:hover": {
    background: "#d3d3d33b",
  },
});

export const PostText = styled(Text, {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
