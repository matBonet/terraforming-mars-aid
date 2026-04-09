function Card({ short, title, description, onRemove }) {
  return (
    <div className="card-outer">
      <button className="card-remove-btn" onClick={onRemove} title="Exclude and re-roll">&#x2715;</button>
      <div className="card-inner">
        <img
          src={process.env.PUBLIC_URL + "/ma-icons/" + short + ".png"}
          className="ma-logo"
          alt={title}
          onError={ ({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.className = "ma-title";
          }}
        />
        <p className="ma-description">{description}</p>
      </div>
    </div>
  )
};

export default Card;
