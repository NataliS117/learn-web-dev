function ErrorState({ title, text, onRetry }) {
  return (
    <section className="card status-card status-card--error" role="alert">
      <span className="status-card__icon" aria-hidden="true">
        !
      </span>
      <h2 className="status-card__title">{title}</h2>
      {text && <p className="status-card__text">{text}</p>}
      <button className="button button--ghost status-card__button" type="button" onClick={onRetry}>
        Попробовать снова
      </button>
    </section>
  );
}

export default ErrorState;
