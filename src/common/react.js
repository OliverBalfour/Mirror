
import * as React from 'react';
import DOMPurify from 'dompurify';
import { ThemeProvider as MUIThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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

export const useInterval = (f, ms) => {
  React.useEffect(() => {
    const id = setInterval(f, ms);
    return () => clearInterval(id);
  }, [f, ms]);
}

export const useEventListener = (elem, event, callback) => {
  React.useEffect(() => {
    elem.addEventListener(event, callback);
    return () => elem.removeEventListener(event, callback);
  });
}

// Non atomic boolean flags scoped to a component's mount lifecycle
export const flagSet = name => window['__flag_'+name];
export const useFlag = name => {
  React.useEffect(() => {
    const flagName = '__flag_'+name;
    window[flagName] = true;
    return () => window[flagName] = false;
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

export const Hidden = ({ children, show, ...props }) =>
  <div style={show ? {} : { display: "none" }} {...props}>
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
  <span dangerouslySetInnerHTML={{
      __html: purify
        ? DOMPurify.sanitize(source, { ADD_ATTR: ['target'] })
        : source
    }} {...props}
  />;

// <ErrorBoundary fallback={<p>failed</p>}>
//   <ComponentWhichCanThrow />
// </ErrorBoundary>
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// useGlobal hook can be used as follows:
// In a component:
//   useGlobal('setTheme', function (args) {...});
// Anywhere else in the app:
//   window.setTheme(args);
// It allows an imperative API which despite being against
// React's design principles is often very useful.
// Note that this should only be called once per name and the lifecycle
// of the component should always exceed that of the users
export function useGlobal(name, value) {
  React.useEffect(() => {
    window[name] = value;
    return () => delete window[name];
  });
}

// <ThemeProvider mode="dark">
//   <App />
// </ThemeProvider>
// Provides a container with a class on the child element, eg "div.theme-dark"
export class ThemeProvider extends React.Component {
  state = { theme: localStorage.theme || "light" };
  constructor (props) {
    super(props);
    this.themes = {
      dark: createMuiTheme({
        palette: {
          type: "dark",
          primary:   { main: "#90caf9" },
          secondary: { main: "#f48fb1" },
          error:     { main: "#f44336" },
          warning:   { main: "#ff9800" },
          info:      { main: "#2196f3" },
          success:   { main: "#4caf50" },
        }
      }),
      light: createMuiTheme({ palette: { type: "light" } })
    }
  }
  componentDidMount () {
    window.setTheme = theme => this.setState({ theme }, () => localStorage.theme = theme);
  }
  render () {
    document.documentElement.className = 'theme-' + this.state.theme;
    return (
      <MUIThemeProvider theme={this.themes[this.state.theme]}>
        {this.props.children}
      </MUIThemeProvider>
    );
  }
}
