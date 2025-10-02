import { useSearchParams } from 'react-router-dom';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePage = (page) => {
    searchParams.set('page', page);
    setSearchParams(searchParams);
    onPageChange(page);
  };

  if (totalPages <= 1) return null;

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
        </li>
        {[...Array(totalPages)].map((_, i) => (
          <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePage(i + 1)}>{i + 1}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;