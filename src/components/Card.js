function Card({ name }) {
  return (
    <div className="card-outer">
      <div className="card-inner">
        <img 
          src={process.env.PUBLIC_URL + "/ma-icons/" + name + ".png"}
          className="ma-logo"
          alt={name.toUpperCase()}
        />
      </div>
    </div>
  )
};

export default Card;