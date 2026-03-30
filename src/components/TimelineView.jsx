import timelineEvents from "../data/timelineEvents.json";

function TimelineView({ id, title }) {
  return (
    <div>
      <h2 id={id}>{title}</h2>
      <div className="timeline-track" role="list" aria-label="Global progress timeline">
        {timelineEvents.map((event) => (
          <article key={`${event.year}-${event.title}`} className="timeline-item" role="listitem">
            <div className="timeline-year">{event.year}</div>
            <h4>{event.title}</h4>
            <p>{event.description}</p>
            <a
              className="source-badge timeline-source"
              href={event.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {event.sourceLabel}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

export default TimelineView;
