import React, { useEffect } from "react";
import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useKBar,
} from "kbar";
import { SpotlightResults } from "./SpotlightResults";

const searchStyle = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  outline: "none",
  border: "none",
  background: "var(--background)",
  color: "var(--foreground)",
};

const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "var(--shadow)",
};

export function Spotlight() {
  const { query } = useKBar();

  console.log("query", query);
  useEffect(() => {
    function handleSpotlightShortcut(event: any) {
      if (
        event.ctrlKey &&
        event.key === "/" &&
        event.defaultPrevented === false
      ) {
        query.toggle();
      }
    }
    window.addEventListener("keydown", handleSpotlightShortcut, true);
    console.log("Add event listener");
    return () =>
      window.removeEventListener("keydown", handleSpotlightShortcut, true);
  }, [query]);

  return (
    <KBarPortal>
      <KBarPositioner>
        <KBarAnimator style={animatorStyle}>
          <KBarSearch style={searchStyle} />
          <SpotlightResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}
