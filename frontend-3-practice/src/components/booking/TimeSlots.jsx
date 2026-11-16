import { groupSlots } from "../../data/booking";
import { formatDateShort, isSameDate } from "../../data/date";

function TimeSlots({
  selectedDay,
  selectedMonth,
  selectedYear,
  slots,
  selectedTime,
  today,
  onTimeClick,
}) {
  const isToday = isSameDate(
    { day: selectedDay, month: selectedMonth, year: selectedYear },
    today
  );
  const groups = groupSlots(slots);

  return (
    <section className="card slots-card" aria-labelledby="slots-title">
      <div className="card__head">
        <div className="card__head-text">
          <p className="card__eyebrow">Свободное время</p>
          <h2 className="card__title" id="slots-title">
            {formatDateShort(selectedDay, selectedMonth, selectedYear)}
          </h2>
        </div>
        <span className={`badge ${isToday ? "badge--success" : "badge--neutral"}`}>
          {isToday ? "Сегодня" : "Выбрано"}
        </span>
      </div>

      <p className="slots-card__hint">
        Выберите удобное время. Занятые слоты отмечены серым — на них записаться нельзя.
      </p>

      <div aria-live="polite">
        {groups.map((group) => (
          <div key={group.title} className="slots-group">
            <h3 className="slots-group__title">{group.title}</h3>
            <div className="slots">
              {group.slots.map((slot) => {
                const isSelected = slot.time === selectedTime;
                const className = [
                  "slot",
                  !slot.available ? "slot--busy" : "",
                  isSelected ? "slot--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={slot.time}
                    className={className}
                    type="button"
                    disabled={!slot.available}
                    aria-disabled={!slot.available}
                    aria-pressed={slot.available ? isSelected : undefined}
                    aria-label={`${slot.time}${slot.available ? "" : ", занято"}`}
                    onClick={() => onTimeClick(slot.time)}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="slots-card__note">
        <p className="slots-card__note-text">
          Длительность визита — 90 минут. Если вы опаздываете больше чем на 10 минут, мастер
          может перенести начало процедуры.
        </p>
      </div>
    </section>
  );
}

export default TimeSlots;
