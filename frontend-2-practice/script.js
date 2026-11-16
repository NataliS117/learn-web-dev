// JavaScript для страницы выбора даты и времени.
// Работает без фреймворков и сборщиков: только DOM API.
//
// Структура файла:
//   1. Данные
//   2. Состояние
//   3. Чистые функции для работы с датами и слотами
//   4. Отрисовка и обработчики
//   5. Инициализация

// ==========================================================================
// 1. ДАННЫЕ
// ==========================================================================

// «Сегодня» для демонстрационного сценария.
// В реальном проекте здесь будет new Date(), а в четвёртой практике —
// ответ сервера /api/booking/today.
const TODAY = { day: 17, month: 9, year: 2026 };

// Названия месяцев: именительный падеж — для заголовка календаря,
// родительный — для фраз «17 октября».
const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

// Порядок как у Date.getDay(): 0 — воскресенье, 1 — понедельник, ...
const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

// Два набора слотов — как в имитационном сервере из четвёртой практики.
// Чётные и нечётные дни отличаются, чтобы при клике по дню было видно,
// что данные действительно обновляются.
const SLOTS_EVEN_DAY = [
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "11:30", available: true },
  { time: "12:00", available: false },
  { time: "13:00", available: false },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "19:30", available: true },
];

const SLOTS_ODD_DAY = [
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: false },
  { time: "11:30", available: true },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: false },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "19:30", available: true },
];

// ==========================================================================
// 2. СОСТОЯНИЕ
// ==========================================================================

// currentMonth/currentYear — какой месяц сейчас показан в календаре.
// selectedDay/selectedMonth/selectedYear — какая дата выбрана.
// selectedTime — выбранное время или null.
// slots — слоты выбранного дня.
function createInitialState() {
  return {
    currentMonth: TODAY.month,
    currentYear: TODAY.year,
    selectedDay: TODAY.day,
    selectedMonth: TODAY.month,
    selectedYear: TODAY.year,
    selectedTime: null,
    slots: getSlotsForDay(TODAY.day),
  };
}

const state = createInitialState();

// Ссылки на элементы, которые обновляются из JavaScript.
// Ищем их один раз после загрузки DOM.
const elements = {
  monthLabel: document.querySelector("#month-label"),
  calendarGrid: document.querySelector("#calendar-grid"),
  prevMonthButton: document.querySelector("#prev-month"),
  nextMonthButton: document.querySelector("#next-month"),
  slotsDate: document.querySelector("#slots-date"),
  slotsBadge: document.querySelector("#slots-badge"),
  slotsContent: document.querySelector("#slots-content"),
  summaryDay: document.querySelector("#summary-day"),
  summaryTime: document.querySelector("#summary-time"),
  nextButton: document.querySelector("#next-button"),
};

// ==========================================================================
// 3. ЧИСТЫЕ ФУНКЦИИ
// ==========================================================================

// Строит сетку календаря: возвращает массив недель по 7 ячеек.
// Ячейка — { day, otherMonth }. Функция не зависит от DOM.
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// Сравнивает две даты без времени.
// -1 — первая раньше, 0 — равны, 1 — первая позже.
function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// Раньше «сегодня» выбирать нельзя, сегодня и позже — можно.
function isDateSelectable(day, month, year, today) {
  return compareDates({ day, month, year }, today) >= 0;
}

function isSameDate(date1, date2) {
  return (
    date1.day === date2.day &&
    date1.month === date2.month &&
    date1.year === date2.year
  );
}

function getWeekday(day, month, year) {
  return new Date(year, month, day).getDay();
}

function getMonthLabel(month, year) {
  return `${MONTHS_NOMINATIVE[month]} ${year}`;
}

function getShortDate(day, month, year) {
  return `${DAYS_OF_WEEK[getWeekday(day, month, year)]}, ${day} ${MONTHS_GENITIVE[month]}`;
}

function getLongDate(day, month, year) {
  return `${DAYS_OF_WEEK[getWeekday(day, month, year)]}, ${day} ${MONTHS_GENITIVE[month]} ${year}`;
}

function getDayLabel(day, month, year) {
  return `${day} ${MONTHS_GENITIVE[month]} ${year}, ${DAYS_OF_WEEK[getWeekday(day, month, year)].toLowerCase()}`;
}

// Имитация данных с сервера: чётный день — один набор, нечётный — другой.
// Возвращаем копии объектов, чтобы состояние страницы не зависело
// от исходных массивов.
function getSlotsForDay(day) {
  const source = day % 2 === 0 ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
  return source.map((slot) => ({ ...slot }));
}

// Делит слоты на утро, день и вечер для удобной отрисовки.
function groupSlots(slots) {
  const groups = [
    { title: "Утро", slots: [] },
    { title: "День", slots: [] },
    { title: "Вечер", slots: [] },
  ];

  slots.forEach((slot) => {
    const hour = Number(slot.time.slice(0, 2));
    if (hour < 12) {
      groups[0].slots.push(slot);
    } else if (hour < 17) {
      groups[1].slots.push(slot);
    } else {
      groups[2].slots.push(slot);
    }
  });

  return groups.filter((group) => group.slots.length > 0);
}

// ==========================================================================
// 4. ОТРИСОВКА И ОБРАБОТЧИКИ
// ==========================================================================

function renderCalendar() {
  const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);

  let html = "";

  weeks.forEach((week) => {
    week.forEach((cell) => {
      const selectable =
        !cell.otherMonth &&
        isDateSelectable(cell.day, state.currentMonth, state.currentYear, TODAY);

      const isSelected =
        !cell.otherMonth &&
        cell.day === state.selectedDay &&
        state.currentMonth === state.selectedMonth &&
        state.currentYear === state.selectedYear;

      const isToday =
        !cell.otherMonth &&
        cell.day === TODAY.day &&
        state.currentMonth === TODAY.month &&
        state.currentYear === TODAY.year;

      const classes = ["calendar-day"];
      if (cell.otherMonth) classes.push("calendar-day--outside");
      if (!cell.otherMonth && !selectable) classes.push("calendar-day--past");
      if (isToday) classes.push("calendar-day--today");
      if (isSelected) classes.push("calendar-day--selected");

      const attributes = [
        `class="${classes.join(" ")}"`,
        'type="button"',
        `data-day="${cell.day}"`,
        `data-month="${state.currentMonth}"`,
        `data-year="${state.currentYear}"`,
      ];

      if (!selectable) {
        attributes.push("disabled");
        attributes.push('aria-disabled="true"');
      } else {
        attributes.push(`aria-pressed="${isSelected}"`);
        attributes.push(`aria-label="${getDayLabel(cell.day, state.currentMonth, state.currentYear)}${isSelected ? ", выбрано" : ""}"`);
      }

      if (isSelected) {
        attributes.push('aria-current="date"');
      }

      html += `<button ${attributes.join(" ")}>${cell.day}</button>`;
    });
  });

  elements.calendarGrid.innerHTML = html;
  elements.monthLabel.textContent = getMonthLabel(state.currentMonth, state.currentYear);
  elements.calendarGrid.setAttribute(
    "aria-label",
    `Календарь на ${getMonthLabel(state.currentMonth, state.currentYear).toLowerCase()}`
  );

  // После innerHTML старые кнопки исчезли — вешаем обработчики заново.
  elements.calendarGrid
    .querySelectorAll(".calendar-day:not(:disabled)")
    .forEach((dayButton) => {
      dayButton.addEventListener("click", onDayClick);
    });
}

function renderSlots() {
  const selectedDate = {
    day: state.selectedDay,
    month: state.selectedMonth,
    year: state.selectedYear,
  };
  const isToday = isSameDate(selectedDate, TODAY);

  elements.slotsDate.textContent = getShortDate(
    state.selectedDay,
    state.selectedMonth,
    state.selectedYear
  );
  elements.slotsBadge.textContent = isToday ? "Сегодня" : "Выбрано";
  elements.slotsBadge.classList.toggle("badge--success", isToday);
  elements.slotsBadge.classList.toggle("badge--neutral", !isToday);

  const groups = groupSlots(state.slots);

  let html = "";
  groups.forEach((group) => {
    html += `
      <div class="slots-group">
        <h3 class="slots-group__title">${group.title}</h3>
        <div class="slots">
    `;

    group.slots.forEach((slot) => {
      const classes = ["slot"];
      if (!slot.available) classes.push("slot--busy");
      if (slot.time === state.selectedTime) classes.push("slot--selected");

      const attrs = [
        `class="${classes.join(" ")}"`,
        'type="button"',
        `data-time="${slot.time}"`,
        `aria-label="${slot.time}${slot.available ? "" : ", занято"}"`,
      ];

      if (!slot.available) {
        attrs.push("disabled");
        attrs.push('aria-disabled="true"');
      } else {
        attrs.push(`aria-pressed="${slot.time === state.selectedTime}"`);
      }

      html += `<button ${attrs.join(" ")}>${slot.time}</button>`;
    });

    html += `
        </div>
      </div>
    `;
  });

  elements.slotsContent.innerHTML = html;

  // Перерисовка слотов тоже создаёт новые кнопки — снова навешиваем клики.
  elements.slotsContent.querySelectorAll(".slot:not(:disabled)").forEach((slotButton) => {
    slotButton.addEventListener("click", onTimeSlotClick);
  });
}

function renderBottomBar() {
  elements.summaryDay.textContent = getLongDate(
    state.selectedDay,
    state.selectedMonth,
    state.selectedYear
  );

  elements.summaryTime.textContent = state.selectedTime || "время не выбрано";
  elements.summaryTime.classList.toggle("summary-bar__time--empty", !state.selectedTime);
  elements.nextButton.disabled = !state.selectedTime;
  elements.nextButton.setAttribute("aria-disabled", String(!state.selectedTime));
}

function renderAll() {
  renderCalendar();
  renderSlots();
  renderBottomBar();
}

function onDayClick(event) {
  const button = event.currentTarget;
  const day = Number(button.dataset.day);
  const month = Number(button.dataset.month);
  const year = Number(button.dataset.year);

  if (!isDateSelectable(day, month, year, TODAY)) return;

  // Повторный клик по уже выбранному дню не должен сбрасывать время.
  if (
    day === state.selectedDay &&
    month === state.selectedMonth &&
    year === state.selectedYear
  ) {
    return;
  }

  state.selectedDay = day;
  state.selectedMonth = month;
  state.selectedYear = year;
  state.selectedTime = null; // при смене дня время всегда сбрасывается
  state.slots = getSlotsForDay(day);

  renderCalendar();
  renderSlots();
  renderBottomBar();
}

function onTimeSlotClick(event) {
  const time = event.currentTarget.dataset.time;
  if (!time) return;

  state.selectedTime = time;
  renderSlots();
  renderBottomBar();
}

function onPrevMonthClick() {
  const previousMonth = new Date(state.currentYear, state.currentMonth - 1, 1);
  state.currentMonth = previousMonth.getMonth();
  state.currentYear = previousMonth.getFullYear();
  renderCalendar();
}

function onNextMonthClick() {
  const nextMonth = new Date(state.currentYear, state.currentMonth + 1, 1);
  state.currentMonth = nextMonth.getMonth();
  state.currentYear = nextMonth.getFullYear();
  renderCalendar();
}

function setupMonthNavigation() {
  elements.prevMonthButton.addEventListener("click", onPrevMonthClick);
  elements.nextMonthButton.addEventListener("click", onNextMonthClick);
}

// ==========================================================================
// 5. ИНИЦИАЛИЗАЦИЯ
// ==========================================================================

function init() {
  renderAll();
  setupMonthNavigation();
}

document.addEventListener("DOMContentLoaded", init);
