import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import { DashboardTable } from "./DashboardTable";

export default async function DashboardPage() {
  await dbConnect();
  
  const prompts = await Prompt.find().sort({ created_at: -1 }).lean();
  
  const allCategoriesRaw = await Prompt.distinct("category");
  const categoriesSet = new Set<string>();
  allCategoriesRaw.forEach((cat) => {
    if (Array.isArray(cat)) cat.forEach((c) => categoriesSet.add(c));
    else categoriesSet.add(cat);
  });
  const totalCategories = categoriesSet.size;
  
  const totalPrompts = prompts.length;
  let totalViews = 0;
  let totalCopies = 0;
  
  prompts.forEach((p: any) => {
    totalViews += p.stats?.views || 0;
    totalCopies += p.stats?.copies || 0;
  });

  return (
    <div className="container-fluid py-4">
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6 col-6">
          <div className="card stat-card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1 mb-md-2" style={{ fontSize: '0.85rem' }}>Total Prompts</h6>
                  <h3 className="mb-0 fw-bold">{totalPrompts}</h3>
                </div>
                <div className="fs-1 text-primary d-none d-sm-block">
                  <i className="bi bi-collection"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-6">
          <div className="card stat-card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1 mb-md-2" style={{ fontSize: '0.85rem' }}>Categories</h6>
                  <h3 className="mb-0 fw-bold">{totalCategories}</h3>
                </div>
                <div className="fs-1 text-success d-none d-sm-block">
                  <i className="bi bi-tags"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-6">
          <div className="card stat-card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1 mb-md-2" style={{ fontSize: '0.85rem' }}>Total Views</h6>
                  <h3 className="mb-0 fw-bold">{new Intl.NumberFormat().format(totalViews)}</h3>
                </div>
                <div className="fs-1 text-info d-none d-sm-block">
                  <i className="bi bi-eye"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-6">
          <div className="card stat-card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1 mb-md-2" style={{ fontSize: '0.85rem' }}>Total Copies</h6>
                  <h3 className="mb-0 fw-bold">{new Intl.NumberFormat().format(totalCopies)}</h3>
                </div>
                <div className="fs-1 text-warning d-none d-sm-block">
                  <i className="bi bi-clipboard-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DashboardTable initialPrompts={JSON.parse(JSON.stringify(prompts))} />
    </div>
  );
}
