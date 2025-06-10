
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/ui/DataTable';
import { busOperators } from '@/data/mockData';
import { Eye, ArrowLeft, Plus } from 'lucide-react';

// Mock bus data - in a real app, this would come from an API
const mockBuses = [
  { 
    id: '1', 
    registrationNumber: 'MH01AB1234',
    operatorId: '1',
    type: 'AC Sleeper',
    capacity: 42,
    status: 'active',
    manufactureYear: 2020,
    lastMaintenance: '2023-05-15',
    insuranceValidTill: '2023-12-31',
    route: 'Mumbai-Delhi'
  },
  { 
    id: '2', 
    registrationNumber: 'MH01CD5678',
    operatorId: '1',
    type: 'Non-AC Seater',
    capacity: 54,
    status: 'active',
    manufactureYear: 2019,
    lastMaintenance: '2023-04-10',
    insuranceValidTill: '2023-11-30',
    route: 'Mumbai-Pune'
  },
  { 
    id: '3', 
    registrationNumber: 'MH02AB9012',
    operatorId: '1',
    type: 'AC Seater',
    capacity: 36,
    status: 'maintenance',
    manufactureYear: 2021,
    lastMaintenance: '2023-06-05',
    insuranceValidTill: '2024-01-15',
    route: 'Mumbai-Nagpur'
  },
  { 
    id: '4', 
    registrationNumber: 'MH01EF3456',
    operatorId: '2',
    type: 'AC Sleeper',
    capacity: 40,
    status: 'active',
    manufactureYear: 2022,
    lastMaintenance: '2023-05-20',
    insuranceValidTill: '2023-12-15',
    route: 'Delhi-Jaipur'
  }
];

const BusList = () => {
  const { operatorId } = useParams();
  const navigate = useNavigate();
  const [operator, setOperator] = useState(null);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    // Get operator details
    const foundOperator = busOperators.find(op => op.id === operatorId);
    if (foundOperator) {
      setOperator(foundOperator);
    }
    
    // Get buses for this operator
    const filteredBuses = mockBuses.filter(bus => bus.operatorId === operatorId);
    setBuses(filteredBuses);
  }, [operatorId]);

  const columns = [
    { key: 'registrationNumber', header: 'Registration No.' },
    { key: 'type', header: 'Bus Type' },
    { key: 'capacity', header: 'Capacity' },
    { key: 'status', header: 'Status' },
    { key: 'route', header: 'Route' },
    { key: 'manufactureYear', header: 'Year' },
    { key: 'lastMaintenance', header: 'Last Maintenance' },
    { key: 'insuranceValidTill', header: 'Insurance Valid Till' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (bus) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Navigate to bus details page (would be implemented in a real app)
            console.log("View bus details:", bus.id);
          }}
          className="action-button flex items-center"
        >
          <Eye size={16} className="mr-1" />
          View Details
        </button>
      )
    }
  ];

  const handleRowClick = (bus) => {
    // Navigate to bus details page (would be implemented in a real app)
    console.log("Clicked on bus:", bus.id);
  };

  return (
    <Layout>
      <div className="mb-6">
        <button 
          onClick={() => navigate(`/bus-management/operators/${operatorId}`)}
          className="mb-4 flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Operator Details
        </button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Buses for {operator?.name || 'Operator'}</h1>
            <p className="text-gray-600">Total Buses: {buses.length}</p>
          </div>
          
          <button 
            className="add-button"
            onClick={() => console.log("Add new bus for operator:", operatorId)}
          >
            <Plus size={18} />
            Add New Bus
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={buses}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
      />
    </Layout>
  );
};

export default BusList;
