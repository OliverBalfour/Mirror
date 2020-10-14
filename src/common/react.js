
import * as React from 'react';
import DOMPurify from 'dompurify';

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
  // Disable no history navigation as it breaks currentLoc
  return [loc, navigate, navigate/*NoHistory*/];
};

// You can supply a title, a function that produces a title each render, or null
// In every case the title is reset to its original value afterwards
let __useTitleInUse = 0;
export const useTitle = title => {
  if (typeof title === "function") {
    const result = title();
    if (result)
      document.title = result;
  }
  React.useEffect(() => {
    const original = document.title;
    __useTitleInUse++;
    if (typeof title === "string")
      document.title = title;
    return () => !(__useTitleInUse--) && (document.title = original);
  });
}

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

export const Hidden = ({ children, show }) =>
  <div style={show ? {} : { display: "none" }}>
    {children}
  </div>;

export const RawHTMLElement = ({ source, ...props }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    ref.current.appendChild(source);
  });
  return <span ref={ref} {...props} />
}

// DOMPurify reduces XSS risk
export const RawHTMLString = ({ source, purify = true, ...props }) =>
  <span dangerouslySetInnerHTML={{ __html: purify ? DOMPurify.sanitize(source) : source }} {...props} />;
