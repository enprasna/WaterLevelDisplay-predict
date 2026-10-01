# Water Level Insights

A dependency-free first version for collecting and understanding water-level readings. It runs directly in a browser, which makes the MVP easy to try while the development environment is being prepared.

## Run

Open `index.html` in a browser. No build step or server is required.

The app includes:

- Station selection with sample data
- Latest level, change, average, and coverage metrics
- Time-series chart with observed readings
- Manual reading entry stored in the current browser session
- CSV import and export, including CSV files exported from Excel and Google Sheets
- Configurable threshold status in the sample station model
- Transparent baseline forecast based on recent average change

## Next development step

Install Node.js, then migrate the UI to Vite + React + TypeScript. Add a Python FastAPI service with PostgreSQL behind an API/data layer. Keep measured readings and forecasts in separate tables, and record forecast model version, generated time, horizon, and confidence range. The baseline forecast in `app.js` is intentionally simple and should become a replaceable service boundary rather than being presented as a safety-critical prediction.

## Suggested roadmap

1. Add users, station editing, persistent storage, and server-side validation.
2. Add scheduled sensor/API ingestion and notification delivery.
3. Train and evaluate forecasting models against held-out station history.
4. Add anomaly review, forecast confidence intervals, audit history, and role-based access.
