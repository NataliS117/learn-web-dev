import { MASTER, SERVICE } from "../../data/booking";
import { formatDateLong } from "../../data/date";

function BookingBottomBar({ selectedDay, selectedMonth, selectedYear, selectedTime }) {
  return (
    <section className="summary-bar" aria-label="Выбранная запись" aria-live="polite">
      <div className="summary-bar__date">
        <p className="summary-bar__label">Ваша запись</p>
        <p className="summary-bar__value">
          <span className="summary-bar__day">
            {formatDateLong(selectedDay, selectedMonth, selectedYear)}
          </span>
          <span className="summary-bar__dot" aria-hidden="true">
            •
          </span>
          <strong
            className={`summary-bar__time${selectedTime ? "" : " summary-bar__time--empty"}`}
          >
            {selectedTime || "время не выбрано"}
          </strong>
        </p>
      </div>

      <div className="summary-bar__service">
        <p className="summary-bar__service-name">{SERVICE.name}</p>
        <p className="summary-bar__service-meta">
          {SERVICE.duration} · {MASTER.name}
        </p>
      </div>

      <p className="summary-bar__price">{SERVICE.price}</p>

      <button
        className="button button--primary summary-bar__button"
        type="button"
        disabled={!selectedTime}
      >
        <span className="button__text">Далее</span>
        <span className="button__arrow" aria-hidden="true">
          →
        </span>
      </button>
    </section>
  );
}

export default BookingBottomBar;
