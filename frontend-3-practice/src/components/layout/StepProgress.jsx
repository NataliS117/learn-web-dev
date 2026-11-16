const STEPS = [
  { num: "01", name: "Старт" },
  { num: "02", name: "Мастер" },
  { num: "03", name: "Услуга" },
  { num: "04", name: "Дата и время" },
  { num: "05", name: "Контакты" },
  { num: "06", name: "Готово" },
];

function StepProgress({ currentStep = 4 }) {
  return (
    <section className="progress" aria-label="Прогресс онлайн-записи">
      <div className="progress__head">
        <p className="progress__label">Запись на услугу</p>
        <p className="progress__value">
          Шаг {currentStep} из {STEPS.length}
        </p>
      </div>
      <ol className="steps">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          const className = [
            "steps__item",
            isDone ? "steps__item--done" : "",
            isActive ? "steps__item--active" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li
              key={step.num}
              className={className}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="steps__num">{step.num}</span>
              <span className="steps__name">{step.name}</span>
              <span className="steps__bar" />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default StepProgress;
