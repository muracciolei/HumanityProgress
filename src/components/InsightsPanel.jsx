function InsightsPanel({ id, title, insights }) {
  return (
    <div className="panel" aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      <ul>
        {insights.map((insight, index) => (
          <li key={`${id}-${index}`}>{insight}</li>
        ))}
      </ul>
    </div>
  );
}

export default InsightsPanel;
