import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashboardSkeleton = () => {
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Skeleton height={30} width={200} className="mb-2" />
        <Skeleton height={20} width={300} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow">
            <Skeleton circle height={40} width={40} className="mb-3" />
            <Skeleton height={20} width="60%" className="mb-2" />
            <Skeleton height={28} width="40%" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-8">
        <Skeleton height={25} width={200} className="mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton height={300} />
          <Skeleton height={300} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <Skeleton height={25} width={200} className="mb-4" />
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={40} className="mb-2" />
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardSkeleton;
