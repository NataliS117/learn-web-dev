import { MASTER, SERVICE } from "../../data/booking";

function MasterSummary() {
  return (
    <aside className="master-summary" aria-label="Параметры записи">
      <img
        className="master-summary__photo"
        src={MASTER.photo}
        alt={`${MASTER.name}, ${MASTER.role.toLowerCase()}`}
        width="56"
        height="56"
      />
      <div className="master-summary__text">
        <p className="master-summary__name">{MASTER.name}</p>
        <p className="master-summary__meta">
          {MASTER.role} · {MASTER.experience} · рейтинг {MASTER.rating}
        </p>
        <p className="master-summary__price">
          {SERVICE.price} · {SERVICE.duration}
        </p>
      </div>
      <button className="master-summary__link" type="button">
        Изменить
      </button>
    </aside>
  );
}

export default MasterSummary;
