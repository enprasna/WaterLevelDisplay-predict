# Moon River

A dependency-free dashboard for observed water-flow and water-level records at the Moon River monitoring stations. It runs directly in a browser with no build step.

## Run

Open `index.html` in a browser. No build step or server is required.

The app includes:

- The 13 stations listed in the workbook register
- Separate daily flow (m³/s) and water-level (m) series for the 12 stations with station-named data sheets
- Metrics and time-series charts for the selected station and measurement
- Manual reading entry and CSV import/export for the selected station and measurement
- Google Maps location links and station register
- CSV import and export, including CSV files exported from Excel and Google Sheets
- Transparent baseline forecast based on recent observed changes

## Workbook data

The dashboard data in `station-readings.js` was generated from the station-named worksheets in the Moon River station workbook. The workbook contains daily records from April 1992 through March 2020 across the station sheets. `TS6` is listed in the register but has no matching data worksheet, so it starts with no readings.

To regenerate the dashboard data after updating the workbook, run:

```powershell
python .\tools\import_station_workbook.py "path\to\moon river stations.xlsx"
```

The importer reads Excel date serials and the `Time`, flow (`Q`), and water-level (`GH`) columns. The plotted history is downsampled for display; full daily records remain available to metrics and CSV export. Additional manual and CSV readings are held in browser memory and are cleared when the page reloads.

## Next development step

Migrate the UI to Vite + React + TypeScript. Add a Python FastAPI service with PostgreSQL behind an API/data layer. Keep measured readings and forecasts in separate tables, and record forecast model version, generated time, horizon, and confidence range. The baseline forecast in `app.js` is intentionally simple and should not be presented as a safety-critical prediction.

## Suggested roadmap

1. Add users, station editing, persistent storage, and server-side validation.
2. Add scheduled sensor/API ingestion and notification delivery.
3. Train and evaluate forecasting models against held-out station history.
4. Add anomaly review, forecast confidence intervals, audit history, and role-based access.
