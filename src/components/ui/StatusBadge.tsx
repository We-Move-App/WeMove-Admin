
interface StatusBadgeProps {
  status: string;
}

// const StatusBadge = ({ status }: StatusBadgeProps) => {
//   const getStatusClass = () => {
//     const statusLower = status.toLowerCase();

//     if (['approved', 'active', 'completed', 'confirmed'].includes(statusLower)) {
//       return 'bg-green-100 text-green-800';
//     }

//     if (['pending', 'submitted', 'upcoming'].includes(statusLower)) {
//       return 'bg-yellow-100 text-yellow-800';
//     }

//     if (['rejected', 'blocked', 'cancelled', 'failed'].includes(statusLower)) {
//       return 'bg-red-100 text-red-800';
//     }

//     if (['processing', 'in progress'].includes(statusLower)) {
//       return 'bg-blue-100 text-blue-800';
//     }

//     return 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
//       {status}
//     </span>
//   );
// };

// export default StatusBadge;

const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status) return <span className="text-gray-400 text-xs">Unknown</span>;

  const getStatusClass = () => {
    const statusLower = status.toLowerCase();
    if (['approved', 'active', 'completed', 'confirmed'].includes(statusLower)) {
      return 'bg-green-100 text-green-800';
    }
    if (['pending', 'submitted', 'upcoming'].includes(statusLower)) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (['rejected', 'blocked', 'cancelled', 'failed'].includes(statusLower)) {
      return 'bg-red-100 text-red-800';
    }
    if (['processing', 'in progress'].includes(statusLower)) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;