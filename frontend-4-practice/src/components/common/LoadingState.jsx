function LoadingState({ title = "Загрузка…", text }) {
  return (
    <section className="card status-card" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <h2 className="status-card__title">{title}</h2>
      {text && <p className="status-card__text">{text}</p>}
    </section>
  );
}

export default LoadingState;
