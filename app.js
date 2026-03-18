// =======================
// CONFIG
// =======================

const hoursPerDay = 8;

// 6 Ian 2026 = SC1
const startDayNumber = dayNumber(2026, 0, 6);

let current = new Date();

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const overtimeText = document.getElementById("overtimeText");
const footer = document.getElementById("todayFooter");

// =======================
// DAY NUMBER
// =======================

function dayNumber(y, m, d) {
  return Math.floor(Date.UTC(y, m, d) / 86400000);
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// =======================
// CONCEDIU
// =======================

const vacationDays = new Set([
  "2026-04-10","2026-04-11","2026-04-12","2026-04-13",
  "2026-08-08","2026-08-09","2026-08-10","2026-08-11",
  "2026-08-12","2026-08-13","2026-08-14","2026-08-15",
  "2026-08-16","2026-08-17","2026-08-18","2026-08-19",
  "2026-08-20","2026-08-21","2026-08-22","2026-08-23",
  "2026-12-23","2026-12-24","2026-12-25","2026-12-26",
  "2026-12-27","2026-12-28","2026-12-29","2026-12-30",
  "2026-12-31",
]);

// =======================
// SARBATORI LEGALE (RO)
// =======================

const holidays = new Set([
  "2026-01-01",  //anul nou
  "2026-01-02",  //a doua zi de anul nou
  "2026-01-06",  //Boboteaza
  "2026-01-07",  //sf. Ion
  "2026-01-24",  //mica unire
  "2026-04-10",  //vinerea mare
  "2026-04-11",  //sambata mare
  "2026-04-12",  //Pastele
  "2026-04-13",  //a doua zi de Paste
  "2026-05-01",  //ziua muncii
  "2026-05-31",  //Rusaliile
  "2026-06-01",  //a doua zi de Rusalii, ziua copilului
  "2026-08-15",  //sf. Maria
  "2026-11-30",  //sf.Andrei
  "2026-12-01",  //ziua Romaniei
  "2026-12-25",  //Craciunul
  "2026-12-26"   //a doua zi de Craciun
]);

// =======================
// SHIFT LOGIC
// =======================

const cycle = ["sc1","sc1","sc2","sc2","sc3","sc3","lib","lib"];

function shiftFor(date) {
  const dn = dayNumber(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diff = dn - startDayNumber;
  return cycle[(diff % 8 + 8) % 8];
}

// =======================
// RENDER
// =======================

function render() {
  calendar.innerHTML = "";

const today = new Date();



calendar.classList.add("animate");
setTimeout(() => calendar.classList.remove("animate"), 200);

const isCurrentMonth =
  current.getMonth() === today.getMonth() &&
  current.getFullYear() === today.getFullYear();

const todayBtn = document.getElementById("todayBtn");

if (isCurrentMonth) {
  todayBtn.classList.remove("pulse");
} else {
  todayBtn.classList.add("pulse");
}

  const y = current.getFullYear();
  const m = current.getMonth();

  monthTitle.textContent =
    current.toLocaleDateString("ro-RO", {
      month: "long",
      year: "numeric"
    }).toUpperCase();

  const first = new Date(y, m, 1);
  const start = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const totalCells = Math.ceil((start + daysInMonth) / 7) * 7;

  let worked = 0;
  let workdays = 0;
  let vacationDaysInMonth = 0;

  for (let i = 0; i < totalCells; i++) {
    const d = new Date(y, m, i - start + 1);
    const div = document.createElement("div");
    div.className = "day";

    if (d.getMonth() !== m) {
      div.classList.add("other");
      div.innerHTML = `<div class="date">${d.getDate()}</div><div></div>`;
    } else {
      const key = dateKey(d);
      const shift = shiftFor(d);

      const isVacation = vacationDays.has(key);
      const isHoliday = holidays.has(key);
      const isWeekday = d.getDay() > 0 && d.getDay() < 6;

      div.classList.add(shift);
      if (d.getDay() === 0 || d.getDay() === 6) {
  div.classList.add("weekend");
}

      if (isHoliday) div.classList.add("holiday");
      if (isVacation) div.classList.add("vacation"); // CO bate vizual tot

      // ===== CALCUL ORE =====

      // ore lucrate (L–D)
      if (!isVacation && shift !== "lib") {
        worked += hoursPerDay;
      }

      // norma (doar L–V)
      if (isWeekday) {
        workdays++;
        if (isVacation) vacationDaysInMonth++;
      }

      div.innerHTML = `
        <div class="date">${d.getDate()}</div>
        <div class="shift-label">${isVacation ? "CO" : shift.toUpperCase()}</div>
      `;
    }

    const today = new Date();
    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      div.classList.add("today");
    }

    calendar.appendChild(div);
  }

  // =======================
  // OVERTIME
  // =======================

  const overtime =
    worked - (workdays - vacationDaysInMonth) * hoursPerDay;

  overtimeText.textContent =
    overtime > 0
      ? `${overtime} ore… forța e cu tine 💪`
      : `${overtime} ore… portofelul plânge 😭`;

  overtimeText.className =
    overtime > 0 ? "positive" : "negative";

  footer.textContent =
    "Azi e: " +
    new Date().toLocaleDateString("ro-RO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
}

// =======================
// NAV
// =======================

document.getElementById("prev").onclick = () => {
  current.setMonth(current.getMonth() - 1);
  render();
};

document.getElementById("next").onclick = () => {
  current.setMonth(current.getMonth() + 1);
  render();
};

document.getElementById("todayBtn").onclick = () => {
  current = new Date();
  render();
};

render();
