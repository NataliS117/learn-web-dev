import {
  buildCalendarGrid,
  formatDayLabel,
  formatMonth,
  isDateSelectable,
} from "../../data/date";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function CalendarGrid({
  month,
  year,
  selectedDay,
  selectedMonth,
  selectedYear,
  today,
  onDayClick,
}) {
  const cells = buildCalendarGrid(year, month).flat();

  return (
    <div className="calendar">
      <div className="calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="calendar__weekday">
            {weekday}
          </span>
        ))}
      </div>

      <div
        className="calendar__grid"
        role="group"
        aria-label={`Календарь на ${formatMonth(month, year).toLowerCase()}`}
      >
        {cells.map((cell, index) => {
          const selectable =
            !cell.otherMonth && isDateSelectable(cell.day, month, year, today);

          const isSelected =
            !cell.otherMonth &&
            cell.day === selectedDay &&
            month === selectedMonth &&
            year === selectedYear;

          const isToday =
            !cell.otherMonth &&
            cell.day === today.day &&
            month === today.month &&
            year === today.year;

          const className = [
            "calendar-day",
            cell.otherMonth ? "calendar-day--outside" : "",
            !cell.otherMonth && !selectable ? "calendar-day--past" : "",
            isToday ? "calendar-day--today" : "",
            isSelected ? "calendar-day--selected" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={`${month}-${index}`}
              className={className}
              type="button"
              disabled={!selectable}
              aria-disabled={!selectable}
              aria-pressed={selectable ? isSelected : undefined}
              aria-current={isSelected ? "date" : undefined}
              aria-label={
                selectable
                  ? `${formatDayLabel(cell.day, month, year)}${isSelected ? ", выбрано" : ""}`
                  : undefined
              }
              onClick={() => onDayClick(cell.day, month, year)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarGrid;
