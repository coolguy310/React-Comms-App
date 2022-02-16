import { matchPath } from "react-router-dom";

// This hook checks is a specific pathname matches the specified path pattern
// returns the match details, or null (if there is no match)
export default function usePathMatch(pathname: string, pattern: string) {
  const match = matchPath(
    {
      path: pattern,
      end: true,
    },
    pathname
  );
  return match;
}
