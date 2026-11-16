// Чистые функции и константы для работы с датами.
// Не зависят от React и DOM — их можно переносить в любой проект.

export const MONTHS_NOMINATIVE = [
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

export const MONTHS_GENITIVE = [
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

// 0 — воскресенье, 1 — понедельник, ... — как у Date.getDay().
export const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

export function isDateSelectable(day, month, year, today) {
  return compareDates({ day, month, year }, today) >= 0;
}

export function isSameDate(date1, date2) {
  return (
    date1.day === date2.day &&
    date1.month === date2.month &&
    date1.year === date2.year
  );
}

export function getWeekday(day, month, year) {
  return new Date(year, month, day).getDay();
}

export function formatMonth(month, year) {
  return `${MONTHS_NOMINATIVE[month]} ${year}`;
}

export function formatDateShort(day, month, year) {
  return `${DAYS_OF_WEEK[getWeekday(day, month, year)]}, ${day} ${MONTHS_GENITIVE[month]}`;
}

export function formatDateLong(day, month, year) {
  return `${DAYS_OF_WEEK[getWeekday(day, month, year)]}, ${day} ${MONTHS_GENITIVE[month]} ${year}`;
}

export function formatDayLabel(day, month, year) {
  const weekday = DAYS_OF_WEEK[getWeekday(day, month, year)].toLowerCase();
  return `${day} ${MONTHS_GENITIVE[month]} ${year}, ${weekday}`;
}

// Возвращает массив недель по 7 ячеек.
// Ячейка — { day, otherMonth }.
export function buildCalendarGrid(year, month) {
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
