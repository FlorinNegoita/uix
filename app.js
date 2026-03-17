const calendar = document.getElementById("calendar");

const startDate = new Date(2026, 0, 6); // 6 ian 2026 = SC1
const today = new Date();

const year = today.getFullYear();
const month = today.getMonth();

const daysInMonth = new Date(year, month + 1, 0).getDate();

const shiftBlocks = ["SC1", "SC2", "SC3", "LIB"];

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getShift(date) {
  const oneDay = 24 * 60 * 60 * 1000;

  const d1 = normalizeDate(startDate);
  const d2 = normalizeDate(date);

  const diffDays = Math.round((d2 - d1) / oneDay);

  const blockIndex = Math.floor((((diffDays % 8) + 8) % 8) / 2);
  return shiftBlocks[blockIndex];
}

for (let i = 1; i <= daysInMonth; i++) {
  const date = new Date(year, month, i);
  const shift = getShift(date);

  const day = document.createElement("div");
  day.classList.add("day");
  day.classList.add(shift.toLowerCase());

  if (
    i === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  ) {
    day.classList.add("today");
  }

  day.innerHTML = `
    <div class="day-number">${i}</div>
    <div class="shift-label">${shift}</div>
  `;

  calendar.appendChild(day);
}