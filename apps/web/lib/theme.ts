// Runs before first paint (inlined in layout.tsx) so the page never flashes the wrong theme.
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}})();`;
