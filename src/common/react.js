
import * as React from 'react';

// Source: https://www.davedrinks.coffee/how-do-i-use-two-react-refs/
export const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

// Web: returns the current hash location (excluding the '#' symbol)
// Based on https://codesandbox.io/s/wouter-hash-based-hook-5fp9g
const currentLoc = () => window.location.hash.replace("#", "") || "/";
export const useHashLocation = () => {
  const [loc, setLoc] = React.useState(currentLoc());
  React.useEffect(() => {
    const handler = () => setLoc(currentLoc());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = React.useCallback(to => window.location.hash = to, []);
  // const navigateNoHistory = React.useCallback(to => {
  //   window.history.replaceState(undefined, undefined, "#"+to);
  //   setLoc(to); // because handler does not detect replaceState
  // }, []);
  // Disable no history navigation
  return [loc, navigate, navigate/*NoHistory*/];
};

// Note: ReloadProtect does not prevent hash changes. Be warned!
export const ReloadProtect = ({ shouldProtect = true }) => {
  React.useEffect(() => {
    // componentDidMount
    if (shouldProtect)
      window.onbeforeunload = e => "Are you sure you want to quit?";
    // componentWillUnmount
    return () => window.onbeforeunload = null;
  });
  return null;
}

// Assumes display: block (CSS's display: revert property has poor support)
export const Hidden = ({ children, show }) =>
  <div style={{ display: show ? "block" : "none" }}>
    {children}
  </div>;
