function TimeSlider({ minYear, maxYear, selectedYear, onChange }) {
  return (
    <div className="time-slider-wrap">
      <div className="time-slider-top">
        <span>{minYear}</span>
        <strong>{selectedYear}</strong>
        <span>{maxYear}</span>
      </div>
      <input
        className="time-slider"
        type="range"
        min={minYear}
        max={maxYear}
        value={selectedYear}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Select timeline year"
      />
    </div>
  );
}

export default TimeSlider;
