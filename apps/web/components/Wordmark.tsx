export function Wordmark() {
  return (
    <span className="wordmark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/seal.webp" alt="" className="wordmark-mascot" width={38} height={38} />
      <span className="wordmark-text">
        India Business <b>One</b>
      </span>
    </span>
  );
}
