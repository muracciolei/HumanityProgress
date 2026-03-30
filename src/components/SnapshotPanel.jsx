import { formatMetricValue } from "../utils/formatters";

function SnapshotPanel({ title, snapshot }) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="snapshot-grid">
        {snapshot.map((item) => (
          <article className="snapshot-card" key={item.id}>
            <h4>{item.label}</h4>
            <div className="snapshot-value">
              {formatMetricValue(item.value, item.metric)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default SnapshotPanel;
