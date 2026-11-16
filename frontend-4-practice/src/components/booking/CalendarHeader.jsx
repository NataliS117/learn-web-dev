import { formatMonth } from "../../data/date";

function CalendarHeader({ month, year, onPrevMonth, onNextMonth }) {
  return (
    <div className="card__head">
      <div className="card__head-text">
        <p className="card__eyebrow">Шаг 4 · Дата визита</p>
        <h2 className="card__title" id="calendar-title">
          Выберите день
        </h2>
      </div>

      <div className="calendar-nav" aria-label="Переключение месяцев">
        <button
          className="calendar-nav__button"
          type="button"
          onClick={onPrevMonth}
          aria-label="Предыдущий месяц"
        >
          <span className="calendar-nav__icon" aria-hidden="true">
            ‹
          </span>
        </button>
        <p className="calendar-nav__label" aria-live="polite">
          {formatMonth(month, year)}
        </p>
        <button
          className="calendar-nav__button"
          type="button"
          onClick={onNextMonth}
          aria-label="Следующий месяц"
        >
          <span className="calendar-nav__icon" aria-hidden="true">
            ›
          </span>
        </button>
      </div>
    </div>
  );
}

export default CalendarHeader;
