import argparse
import datetime as dt
import json
import posixpath
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


STATION_CODES = (
    'E.20A', 'E.98', 'M.5', 'M.7', 'M.9', 'M.11B', 'M.69', 'M.170',
    'M.176', 'M.179', 'M.179A', 'M.182', 'TS6',
)
NAMESPACES = {
    'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
    'relationships': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}
EXCEL_EPOCH = dt.datetime(1899, 12, 30)


def column_number(cell_reference: str) -> int:
    letters = re.match(r'[A-Z]+', cell_reference).group()
    number = 0
    for letter in letters:
        number = number * 26 + ord(letter) - ord('A') + 1
    return number


def read_shared_strings(archive: zipfile.ZipFile) -> list[str]:
    if 'xl/sharedStrings.xml' not in archive.namelist():
        return []
    root = ET.fromstring(archive.read('xl/sharedStrings.xml'))
    return [
        ''.join(text.text or '' for text in item.findall('.//main:t', NAMESPACES))
        for item in root.findall('main:si', NAMESPACES)
    ]


def read_cell_value(cell: ET.Element, shared_strings: list[str]) -> str:
    inline = cell.find('main:is', NAMESPACES)
    if inline is not None:
        return ''.join(text.text or '' for text in inline.findall('.//main:t', NAMESPACES))

    value = cell.find('main:v', NAMESPACES)
    if value is None or value.text is None:
        return ''
    if cell.attrib.get('t') == 's':
        return shared_strings[int(value.text)]
    return value.text


def read_sheet_rows(archive: zipfile.ZipFile, path: str, shared_strings: list[str]) -> list[dict[int, str]]:
    root = ET.fromstring(archive.read(path))
    rows = []
    for row in root.findall('main:sheetData/main:row', NAMESPACES):
        cells = {}
        for cell in row.findall('main:c', NAMESPACES):
            cells[column_number(cell.attrib['r'])] = read_cell_value(cell, shared_strings)
        rows.append(cells)
    return rows


def read_station_records(rows: list[dict[int, str]]) -> list[dict[str, object]]:
    if len(rows) < 4:
        return []

    time_columns = [
        column for column, label in rows[2].items()
        if label.strip().lower() == 'time'
    ]
    records = []
    for row in rows[3:]:
        for time_column in time_columns:
            raw_date = row.get(time_column, '')
            if not raw_date:
                continue
            try:
                date = (EXCEL_EPOCH + dt.timedelta(days=float(raw_date))).date().isoformat()
            except (OverflowError, ValueError):
                continue

            def number_at(column: int) -> float | None:
                raw_value = row.get(column, '')
                return float(raw_value) if raw_value else None

            flow = number_at(time_column + 1)
            level = number_at(time_column + 2)
            if flow is not None or level is not None:
                records.append({'time': date, 'flow': flow, 'level': level})

    records.sort(key=lambda record: record['time'])
    return records


def main() -> None:
    parser = argparse.ArgumentParser(description='Convert station worksheets to dashboard data.')
    parser.add_argument('workbook', type=Path)
    parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[1] / 'station-readings.js')
    args = parser.parse_args()

    with zipfile.ZipFile(args.workbook) as archive:
        workbook = ET.fromstring(archive.read('xl/workbook.xml'))
        relationships = ET.fromstring(archive.read('xl/_rels/workbook.xml.rels'))
        targets = {item.attrib['Id']: item.attrib['Target'] for item in relationships}
        sheet_paths = {
            sheet.attrib['name']: posixpath.normpath(posixpath.join(
                'xl', targets[sheet.attrib[f"{{{NAMESPACES['relationships']}}}id"]].lstrip('/'),
            ))
            for sheet in workbook.findall('main:sheets/main:sheet', NAMESPACES)
        }
        shared_strings = read_shared_strings(archive)
        readings = {}
        for code in STATION_CODES:
            sheet_path = sheet_paths.get(code)
            rows = read_sheet_rows(archive, sheet_path, shared_strings) if sheet_path else []
            readings[code] = read_station_records(rows)
            print(f'{code}: {len(readings[code])} daily records')

    args.output.write_text(
        'window.stationReadings = ' + json.dumps(readings, ensure_ascii=False, separators=(',', ':')) + ';\n',
        encoding='utf-8',
    )
    print(f'Wrote {sum(map(len, readings.values()))} daily records to {args.output}')


if __name__ == '__main__':
    main()