import { useEffect, useState } from "react";

function DidYouKnow({ title, facts }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!facts || facts.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((previousIndex) => (previousIndex + 1) % facts.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [facts]);

  const activeFact = facts[activeIndex] || null;

  return (
    <div className="panel">
      <h3>{title}</h3>
      {activeFact ? (
        <div className="did-you-know-card" aria-live="polite">
          <div className="fact-text">{activeFact.text}</div>
          <div className="fact-meta">{activeFact.meta}</div>
        </div>
      ) : (
        <div className="status">Waiting for fact generation...</div>
      )}
    </div>
  );
}

export default DidYouKnow;
