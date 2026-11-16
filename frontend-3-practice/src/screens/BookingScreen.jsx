import { useState } from "react";

import BookingBottomBar from "../components/booking/BookingBottomBar";
import Calendar from "../components/booking/Calendar";
import TimeSlots from "../components/booking/TimeSlots";
import StepProgress from "../components/layout/StepProgress";
import { MASTER, SERVICE, TODAY, getSlotsForDay } from "../data/booking";
import { isDateSelectable, isSameDate } from "../data/date";

function BookingScreen() {
  // Пять значений состояния, которые меняются при действиях пользователя.
  // selectedMonth/selectedYear добавлены, чтобы выбранная дата оставалась
  // корректной при листании календаря на соседние месяцы.
  const [currentMonth, setCurrentMonth] = useState(TODAY.month);
  const [currentYear, setCurrentYear] = useState(TODAY.year);
  const [selectedDay, setSelectedDay] = useState(TODAY.day);
  const [selectedMonth, setSelectedMonth] = useState(TODAY.month);
  const [selectedYear, setSelectedYear] = useState(TODAY.year);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() => getSlotsForDay(TODAY.day));

  function handleDayClick(day, month, year) {
    if (!isDateSelectable(day, month, year, TODAY)) return;

    // Повторный клик по выбранному дню не сбрасывает время.
    if (
      isSameDate(
        { day, month, year },
        { day: selectedDay, month: selectedMonth, year: selectedYear }
      )
    ) {
      return;
    }

    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
    setSelectedTime(null);
    setSlots(getSlotsForDay(day));
  }

  function handlePrevMonth() {
    const previousMonth = new Date(currentYear, currentMonth - 1, 1);
    setCurrentMonth(previousMonth.getMonth());
    setCurrentYear(previousMonth.getFullYear());
  }

  function handleNextMonth() {
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    setCurrentMonth(nextMonth.getMonth());
    setCurrentYear(nextMonth.getFullYear());
  }

  return (
    <main className="booking">
      <div className="container">
        <div className="page-topline">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <a className="breadcrumbs__link" href="#">
              Главная
            </a>
            <span className="breadcrumbs__separator" aria-hidden="true">
              /
            </span>
            <a className="breadcrumbs__link" href="#">
              Онлайн-запись
            </a>
            <span className="breadcrumbs__separator" aria-hidden="true">
              /
            </span>
            <span className="breadcrumbs__current" aria-current="page">
              Дата и время
            </span>
          </nav>
          <a className="page-back" href="#">
            ← Назад к услугам
          </a>
        </div>

        <section className="booking__intro" aria-labelledby="booking-title">
          <div className="booking__heading">
            <p className="booking__eyebrow">Онлайн-запись в салон «Лотос»</p>
            <h1 className="booking__title" id="booking-title">
              Выбор даты и времени
            </h1>
            <p className="booking__subtitle">
              Осталось выбрать удобный день и время — мы напомним о визите за сутки.
            </p>
          </div>
          <div className="booking__meta">
            <span className="booking__meta-label">Мастер</span>
            <span className="booking__meta-value">{MASTER.name}</span>
            <span className="booking__meta-divider" aria-hidden="true" />
            <span className="booking__meta-label">Услуга</span>
            <span className="booking__meta-value">{SERVICE.name}</span>
          </div>
        </section>

        <StepProgress currentStep={4} />

        <div className="booking__grid">
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedDay={selectedDay}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            today={TODAY}
            onDayClick={handleDayClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <TimeSlots
            selectedDay={selectedDay}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            slots={slots}
            selectedTime={selectedTime}
            today={TODAY}
            onTimeClick={setSelectedTime}
          />
        </div>

        <BookingBottomBar
          selectedDay={selectedDay}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedTime={selectedTime}
        />
      </div>
    </main>
  );
}

export default BookingScreen;
