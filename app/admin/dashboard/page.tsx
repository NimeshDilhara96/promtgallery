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
        <div className="col-md-3">
          <div className="card stat-card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Prompts</h6>
                  <h2 className="mb-0">{totalPrompts}</h2>
                </div>
                <div className="fs-1 text-primary">
                  <i className="bi bi-collection"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Categories</h6>
                  <h2 className="mb-0">{totalCategories}</h2>
                </div>
                <div className="fs-1 text-success">
                  <i className="bi bi-tags"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Views</h6>
                  <h2 className="mb-0">{new Intl.NumberFormat().format(totalViews)}</h2>
                </div>
                <div className="fs-1 text-info">
                  <i className="bi bi-eye"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Copies</h6>
                  <h2 className="mb-0">{new Intl.NumberFormat().format(totalCopies)}</h2>
                </div>
                <div className="fs-1 text-warning">
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
