export default function Loading() {
  return (
    <div className="container py-5 min-vh-100">
      {/* Header & Search Skeleton */}
      <div className="row justify-content-center mb-5 mt-4">
        <div className="col-lg-8 text-center placeholder-glow">
          <div className="placeholder col-6 bg-secondary opacity-25 rounded mb-4" style={{ height: '3rem' }}></div>
          <div className="placeholder col-8 bg-secondary opacity-25 rounded mb-4" style={{ height: '1.5rem' }}></div>
          <div className="placeholder col-10 bg-secondary opacity-25 rounded-pill" style={{ height: '4rem' }}></div>
        </div>
      </div>

      {/* Filter Chips Skeleton */}
      <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap placeholder-glow">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="placeholder bg-secondary opacity-25 rounded-pill" style={{ width: '80px', height: '35px' }}></div>
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="col">
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden" aria-hidden="true">
              <div className="position-relative placeholder-glow" style={{ aspectRatio: '1/1' }}>
                <div className="placeholder w-100 h-100 bg-secondary opacity-25"></div>
              </div>
              <div className="card-body p-4 d-flex flex-column">
                <div className="placeholder-glow mb-2">
                  <span className="placeholder col-9 bg-secondary opacity-25 rounded" style={{ height: '1.25rem' }}></span>
                </div>
                <div className="placeholder-glow mb-4">
                  <span className="placeholder col-5 bg-secondary opacity-25 rounded"></span>
                </div>
                <div className="mt-auto d-flex justify-content-between align-items-center placeholder-glow pt-3 border-top border-opacity-50">
                  <span className="placeholder col-4 bg-secondary opacity-25 rounded" style={{ height: '2rem' }}></span>
                  <span className="placeholder col-2 bg-secondary opacity-25 rounded" style={{ height: '1.5rem' }}></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
