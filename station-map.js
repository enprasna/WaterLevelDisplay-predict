const mapStations = [
  { code: 'E.20A', river: 'แม่น้ำชี', site: 'บ้านฟ้าหยาด', district: 'มหาชนะชัย', province: 'ยโสธร', northing: 1717429, easting: 420289, lat: 15.533099, lng: 104.256698 },
  { code: 'E.98', river: 'แม่น้ำชี', site: 'ฝายธาตุน้อย', district: 'เขื่องใน', province: 'อุบลราชธานี', northing: 1691926, easting: 446357, lat: 15.303223, lng: 104.500324 },
  { code: 'M.5', river: 'แม่น้ำมูล', site: 'บ้านเมืองคง', district: 'ราษีไศล', province: 'ศรีสะเกษ', northing: 1696022, easting: 409030, lat: 15.339204, lng: 104.152502 },
  { code: 'M.7', river: 'แม่น้ำมูล', site: 'สะพานเสรีประชาธิปไตย', district: 'วารินชำราบ', province: 'อุบลราชธานี', northing: 1682974, easting: 484761, lat: 15.222801, lng: 104.858104 },
  { code: 'M.9', river: 'ห้วยสำราญ', site: 'ชุมชนสะพานขาว', district: 'เมือง', province: 'ศรีสะเกษ', northing: 1671502, easting: 426783, lat: 15.118100, lng: 104.318597 },
  { code: 'M.11B', river: 'แม่น้ำมูล', site: 'ไม่ระบุ', district: 'พิบูลมังสาหาร', province: 'อุบลราชธานี', northing: 1685955, easting: 525705, lat: 15.249670, lng: 105.239379 },
  { code: 'M.69', river: 'ลำเซบก', site: 'บ้านท่าบอแบง', district: 'ตระการพืชผล', province: 'อุบลราชธานี', northing: 1714028, easting: 496396, lat: 15.503601, lng: 104.966397 },
  { code: 'M.170', river: 'ลำโดมใหญ่', site: 'บ้านคำสำราญ', district: 'เดชอุดม', province: 'อุบลราชธานี', northing: 1635190, easting: 511062, lat: 14.790797, lng: 105.102796 },
  { code: 'M.176', river: 'ห้วยขะยุง', site: 'บ้านโนนศรีไศล', district: 'กันทรารมย์', province: 'ศรีสะเกษ', northing: 1659100, easting: 460610, lat: 15.006703, lng: 104.633598 },
  { code: 'M.179', river: 'ลำเซบาย', site: 'บ้านท่าวารี', district: 'เขื่องใน', province: 'อุบลราชธานี', northing: 1694608, easting: 465854, lat: 15.327803, lng: 104.681896 },
  { code: 'M.179A', river: 'ลำเซบาย', site: 'บ้านป่ากอ', district: 'เขื่องใน', province: 'อุบลราชธานี', northing: 1713980, easting: 456498, lat: 15.502797, lng: 104.594398 },
  { code: 'M.182', river: 'แม่น้ำมูล', site: 'บ้านสีถาน', district: 'กันทรารมย์', province: 'ศรีสะเกษ', northing: 1673078, easting: 445022, lat: 15.132796, lng: 104.488301 },
  { code: 'TS6', river: 'แม่น้ำโขง', site: 'วัดห้วยสะคาม', district: 'โขงเจียม', province: 'อุบลราชธานี', northing: 1694755.3586, easting: 551701.5704, lat: 15.328842, lng: 105.481650 },
];

const mapStationList = document.getElementById('mapStationList');
const stationMap = document.getElementById('stationMap');
const mapStationName = document.getElementById('mapStationName');
const mapStationCoordinates = document.getElementById('mapStationCoordinates');
const mapExternalLink = document.getElementById('mapExternalLink');

function showStationOnMap(station) {
  const location = `${station.lat},${station.lng}`;
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=13&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  stationMap.src = mapUrl;
  mapStationName.textContent = `${station.code} · ${station.site} · ${station.river}`;
  mapStationCoordinates.textContent = `UTM N ${station.northing} / E ${station.easting} · ${station.district}, ${station.province}`;
  mapExternalLink.href = googleMapsUrl;

  mapStationList.querySelectorAll('.station-location').forEach((button) => {
    const selected = button.dataset.stationCode === station.code;
    button.setAttribute('aria-pressed', String(selected));
  });
}

mapStationList.innerHTML = mapStations.map((station) => `
  <button class="station-location" type="button" data-station-code="${station.code}" aria-pressed="false">
    <span class="station-code">${station.code}</span>
    <span><strong>${station.site} · ${station.river}</strong><small>${station.district}, ${station.province}</small></span>
  </button>
`).join('');

mapStationList.addEventListener('click', (event) => {
  const button = event.target.closest('.station-location');
  if (!button) return;

  const station = mapStations.find((item) => item.code === button.dataset.stationCode);
  if (station) {
    showStationOnMap(station);
    window.dispatchEvent(new CustomEvent('station-map-select', { detail: station.code }));
  }
});

showStationOnMap(mapStations[0]);