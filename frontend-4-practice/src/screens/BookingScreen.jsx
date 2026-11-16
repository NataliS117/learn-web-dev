import { useEffect, useState } from "react";

import { fetchSlots, fetchToday } from "../api";
import BookingBottomBar from "../components/booking/BookingBottomBar";
import Calendar from "../components/booking/Calendar";
import TimeSlots from "../components/booking/TimeSlots";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import StepProgress from "../components/layout/StepProgress";
import { MASTER, SERVICE } from "../data/booking";
import { isDateSelectable, isSameDate } from "../data/date";

function BookingScreen() {
  // «Сегодня» и состояние его загрузки.
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);
  const [todayRequestKey, setTodayRequestKey] = useState(0);

  // Календарь и выбранная дата.
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Слоты и состояние их загрузки.
  const [slots, setSlots] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [slotsRequestKey, setSlotsRequestKey] = useState(0);

  // 1. Загружаем «сегодня» при открытии страницы.
  useEffect(() => {
    let ignore = false;

    async function loadToday() {
      setTodayLoading(true);
      setTodayError(null);

      try {
        const data = await fetchToday();
        if (ignore) return;

        setToday(data);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDate({ day: data.day, month: data.month, year: data.year });
        setSelectedTime(null);
      } catch (error) {
        if (ignore) return;
        setTodayError(
          error.message || "Не удалось получить данные календаря. Попробуйте ещё раз."
        );
      } finally {
        if (!ignore) setTodayLoading(false);
      }
    }

    loadToday();
    return () => {
      ignore = true;
    };
  }, [todayRequestKey]);

  // 2. Загружаем слоты, когда известна выбранная дата.
  // При быстрых кликах старый запрос отменяется через ignore, а ответ
  // дополнительно сверяется с selectedDate по полю date.
  useEffect(() => {
    if (!today || !selectedDate) return undefined;

    let ignore = false;

    async function loadSlots() {
      setSlotsLoading(true);
      setSlotsError(null);
      setSlots(null);

      try {
        const data = await fetchSlots(selectedDate);
        if (ignore) return;

        if (!data.date || !isSameDate(data.date, selectedDate)) {
          throw new Error("Сервер вернул слоты для другой даты. Выберите день ещё раз.");
        }

        setSlots(data.slots || []);
      } catch (error) {
        if (ignore) return;
        setSlotsError(
          error.message || "Не удалось получить свободное время. Попробуйте ещё раз."
        );
      } finally {
        if (!ignore) setSlotsLoading(false);
      }
    }

    loadSlots();
    return () => {
      ignore = true;
    };
  }, [today, selectedDate, slotsRequestKey]);

  function handleDayClick(day, month, year) {
    if (!today || !isDateSelectable(day, month, year, today)) return;

    // Не запускаем повторный запрос, если выбран тот же день.
    if (selectedDate && isSameDate({ day, month, year }, selectedDate)) return;

    setSelectedDate({ day, month, year });
    setSelectedTime(null);
    setSlots(null);
    setSlotsError(null);
  }

  function handlePrevMonth() {
    if (currentMonth === null) return;
    const previousMonth = new Date(currentYear, currentMonth - 1, 1);
    setCurrentMonth(previousMonth.getMonth());
    setCurrentYear(previousMonth.getFullYear());
  }

  function handleNextMonth() {
    if (currentMonth === null) return;
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    setCurrentMonth(nextMonth.getMonth());
    setCurrentYear(nextMonth.getFullYear());
  }

  const isCalendarReady =
    Boolean(today) &&
    currentMonth !== null &&
    currentYear !== null &&
    Boolean(selectedDate);

  const isSlotsLoading = slotsLoading || (slots === null && !slotsError);

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

        {!isCalendarReady ? (
          <div className="booking__grid">
            {todayLoading && (
              <LoadingState
                title="Загрузка…"
                text="Подключаемся к календарю салона и получаем свободные даты."
              />
            )}

            {!todayLoading && todayError && (
              <ErrorState
                title="Не удалось загрузить календарь"
                text={todayError}
                onRetry={() => setTodayRequestKey((key) => key + 1)}
              />
            )}
          </div>
        ) : (
          <>
            <div className="booking__grid">
              <Calendar
                currentMonth={currentMonth}
                currentYear={currentYear}
                selectedDay={selectedDate.day}
                selectedMonth={selectedDate.month}
                selectedYear={selectedDate.year}
                today={today}
                onDayClick={handleDayClick}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />

              <TimeSlots
                selectedDay={selectedDate.day}
                selectedMonth={selectedDate.month}
                selectedYear={selectedDate.year}
                slots={slots}
                selectedTime={selectedTime}
                today={today}
                isLoading={isSlotsLoading}
                error={slotsError}
                onTimeClick={setSelectedTime}
                onRetry={() => setSlotsRequestKey((key) => key + 1)}
              />
            </div>

            <BookingBottomBar
              selectedDay={selectedDate.day}
              selectedMonth={selectedDate.month}
              selectedYear={selectedDate.year}
              selectedTime={selectedTime}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default BookingScreen;
