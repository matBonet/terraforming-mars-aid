function Card({ name }) {
  return (
    <div className="card-outer">
      <div className="card-inner">
        {/* <div className="vspace"></div> */}
        <img 
          src={process.env.PUBLIC_URL + "/ma-icons/" + name + ".png"}
          className="ma-logo"
          alt={name.toUpperCase()}
          onError={ ({ currentTarget }) => {
            console.log(currentTarget);
            currentTarget.onerror = null;
            currentTarget.className = "ma-title";
          }} 
        />
        {/* <h2 className="ma-title">{name.toUpperCase()}</h2> */}
        {/* <div className="vspace"></div> */}
      </div>
    </div>
  )
};

export default Card;