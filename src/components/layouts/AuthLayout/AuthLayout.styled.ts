import { styled } from "stitches.config";

export const StyledInput = styled("input", {
  border: "1px solid",
  borderRadius: 12,
  paddingLeft: "1.75rem",
  paddingRight: "1.75rem",
  width: "100%",
  height: "3rem",
  borderColor: "GrayText",
});

export const SidebarContent = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "0.5rem 2rem 0.5rem 1.25rem",
  height: "100%",
  borderRight: "2px solid $gray5",
});

export const SidebarWrapper = styled("div", {
  top: 0,
  zIndex: 30,
  paddingTop: "2rem",
  paddingBottom: "2rem",
  width: "16rem",
  height: "100%",
  position: "fixed",
  flexShrink: 0,
});

export const PageContainer = styled("div", {
  display: "flex",
  alignItems: "stretch",
  height: "100%",
  minHeight: "100vh",
  paddingTop: "2rem",
  paddingBottom: "2rem",
});

export const LinkItem = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  marginTop: "3rem",
  p: {
    marginRight: "1.5rem",
  },
});

export const MainContent = styled("div", {
  width: "100%",
  paddingLeft: "16rem",
});

export const LogoutButton = styled("button", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 6,
  paddingTop: 12,
  paddingBottom: 12,
  "& svg": {
    marginRight: 8,
  },
});
