export default function Loading() {
  return (
    <div className="container py-5 text-center min-vh-100 d-flex flex-column justify-content-center">
      <div className="spinner-border text-primary mx-auto mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <h4 className="text-muted">Loading content...</h4>
    </div>
  );
}
