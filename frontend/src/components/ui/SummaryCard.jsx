const SummaryCard = ({ title, value, variant = 'primary' }) => (
  <div className={`card text-white bg-${variant} mb-3`}>
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <h2 className="card-text">{value}</h2>
    </div>
  </div>
);

export default SummaryCard;