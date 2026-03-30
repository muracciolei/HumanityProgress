function SourceBadge({ sourceName, sourceUrl, usedFallback }) {
  return (
    <a
      className="source-badge"
      data-fallback={usedFallback ? "true" : "false"}
      href={sourceUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open data source: ${sourceName}`}
    >
      Source: {sourceName}
    </a>
  );
}

export default SourceBadge;
