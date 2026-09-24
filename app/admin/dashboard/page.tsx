import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import { DashboardTable } from "./DashboardTable";

export default async function DashboardPage(props: any) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  await dbConnect();
  
  // 1. PROJECTION & PAGINATION: Fetch only the fields needed and use skip/limit
  const prompts = await Prompt.find({}, {
    _id: 1,
    title: 1,
    prompt: 1,
    image: 1,
    category: 1,
    platform: 1,
    slug: 1,
    stats: 1,
    created_at: 1
  })
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  
  // 2. FAST COUNT: Use DB to count, much faster than array length
  const totalPrompts = await Prompt.countDocuments();
  const totalPages = Math.ceil(totalPrompts / limit);
  
  const allCategoriesRaw = await Prompt.distinct("category");
  const categoriesSet = new Set<string>();
  allCategoriesRaw.forEach((cat) => {
    if (Array.isArray(cat)) cat.forEach((c) => categoriesSet.add(c));
    else categoriesSet.add(cat);
  });
  const totalCategories = categoriesSet.size;
  
  // 3. AGGREGATION: Let MongoDB calculate totals instead of a Javascript loop
  const statsAggregation = await Prompt.aggregate([
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$stats.views" },
        totalCopies: { $sum: "$stats.copies" }
      }
    }
  ]);
  const totalViews = statsAggregation[0]?.totalViews || 0;
  const totalCopies = statsAggregation[0]?.totalCopies || 0;

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
      <DashboardTable 
        initialPrompts={JSON.parse(JSON.stringify(prompts))} 
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
