export function Wordmark() {
  return (
    <span className="wordmark">
      <span className="wordmark-stamp" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="32" height="32">
          <rect x="3" y="3" width="34" height="34" rx="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <rect x="7.5" y="7.5" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <path d="M14 20.5l4.2 4.2L27 15.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="wordmark-text">
        India Business <b>One</b>
      </span>
    </span>
  );
}
