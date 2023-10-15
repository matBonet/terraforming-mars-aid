function Card({ name, description }) {
  return (
    <div className="card-outer">
      <div className="card-inner">
        {/* <div className="vspace"></div> */}
        <img 
          src={process.env.PUBLIC_URL + "/ma-icons/" + name + ".png"}
          className="ma-logo"
          alt={name.toUpperCase()}
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