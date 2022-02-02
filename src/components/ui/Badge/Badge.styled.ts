import { styled, theme } from "stitches.config";

export const BadgeWrapper = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 24,
  height: 24,
  borderRadius: 6,
  backgroundColor: theme.colors.primary,
  color: "White",
});
