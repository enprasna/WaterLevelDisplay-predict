(() => {
  const renderHistoricalMetrics = renderMetrics;

  function renderMetricsWithRidLatest() {
    renderHistoricalMetrics();
    const reading = window.ridLatestReadings.readings[selected.id];
    const value = reading ? `${reading.level.toFixed(2)} m` : '—';
    const note = reading
      ? `${window.ridLatestReadings.source} · ${formatObservationDate(reading.time)} ${reading.time.slice(11, 16)} · Separate gauge reference`
      : 'No matching RID station data';

    $('metrics').insertAdjacentHTML('beforeend', `
      <div class="metric">
        <div class="metric-label">RID gauge level</div>
        <div class="metric-value">${value}</div>
        <div class="metric-note">${note}</div>
      </div>
    `);
  }

  renderMetrics = renderMetricsWithRidLatest;
  renderMetrics();
})();
