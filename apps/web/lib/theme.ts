// Runs before first paint (inlined in layout.tsx) so the page never flashes the wrong theme.
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}})();`;

// First visit only: mark <html> so the server-rendered splash shows before hydration (no flash of the site).
// `?splash=0` skips it, for screenshots and site captures.
export const splashScript = `(function(){try{if(location.search.indexOf("splash=0")<0&&!localStorage.getItem("splash-seen"))document.documentElement.dataset.splash="";}catch(e){}})();`;
