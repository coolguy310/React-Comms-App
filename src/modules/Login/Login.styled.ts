import Button from "components/ui/Button/Button";
import { styled, theme } from "stitches.config";

export const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});

export const LoginHeading = styled("h1", {
  fontSize: "2.25rem",
  marginBottom: "3rem",
  fontWeight: "bolder",
});

export const GoogleButton = styled(Button, {
  display: "flex",
  alignItems: "center",
  padding: "0.75rem 1.25rem",
  color: "white",
  backgroundColor: theme.colors.primary,
  borderRadius: 6,
  svg: {
    marginRight: 12,
  },
});
