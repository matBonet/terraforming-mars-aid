function Card({ short, title, description, onRemove }) {
  return (
    <div className="card-outer">
      <button className="card-remove-btn" onClick={onRemove} title="Exclude and re-roll">&#x2715;</button>
      <div className="card-inner">
        {/* <div className="vspace"></div> */}
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
        {/* <h2 className="ma-title">{name.toUpperCase()}</h2> */}
        {/* <div className="vspace"></div> */}
      </div>
    </div>
  )
};

export default Card;