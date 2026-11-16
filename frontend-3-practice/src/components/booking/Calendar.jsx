import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";
import MasterSummary from "./MasterSummary";

function Calendar({
  currentMonth,
  currentYear,
  selectedDay,
  selectedMonth,
  selectedYear,
  today,
  onDayClick,
  onPrevMonth,
  onNextMonth,
}) {
  return (
    <section className="card calendar-card" aria-labelledby="calendar-title">
      <CalendarHeader
        month={currentMonth}
        year={currentYear}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />

      <CalendarGrid
        month={currentMonth}
        year={currentYear}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        today={today}
        onDayClick={onDayClick}
      />

      <ul className="calendar-legend" aria-label="Обозначения календаря">
        <li className="calendar-legend__item">
          <span
            className="calendar-legend__dot calendar-legend__dot--selected"
            aria-hidden="true"
          />
          Выбранная дата
        </li>
        <li className="calendar-legend__item">
          <span
            className="calendar-legend__dot calendar-legend__dot--available"
            aria-hidden="true"
          />
          Доступно для записи
        </li>
        <li className="calendar-legend__item">
          <span
            className="calendar-legend__dot calendar-legend__dot--past"
            aria-hidden="true"
          />
          Недоступно
        </li>
      </ul>

      <MasterSummary />
    </section>
  );
}

export default Calendar;
