
import { useState } from 'react';
import { Wallet as WalletIcon } from 'lucide-react';
// import Layout from '@/components/layout/Layout';
import DataTable from '@/components/ui/DataTable';
import { WalletTransaction } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';

// Mock data for wallet transactions
const mockWalletTransactions: WalletTransaction[] = [
  {
    id: "1",
    userId: "user-001",
    userName: "John Doe",
    type: "Credit",
    amount: 500,
    date: "2023-10-15",
    status: "Completed",
    description: "Refund for cancelled booking #12345"
  },
  {
    id: "2",
    userId: "user-002",
    userName: "Jane Smith",
    type: "Debit",
    amount: 350,
    date: "2023-10-16",
    status: "Completed",
    description: "Payment for hotel booking #67890"
  },
  {
    id: "3",
    userId: "user-003",
    userName: "Michael Johnson",
    type: "Transfer",
    amount: 200,
    date: "2023-10-17",
    status: "Completed",
    description: "Transfer to bank account"
  },
  {
    id: "4",
    userId: "user-004",
    userName: "Sarah Williams",
    type: "Withdrawal",
    amount: 150,
    date: "2023-10-18",
    status: "Pending",
    description: "Withdrawal request to bank account"
  },
  {
    id: "5",
    userId: "user-005",
    userName: "Robert Brown",
    type: "Credit",
    amount: 100,
    date: "2023-10-19",
    status: "Completed",
    description: "Cashback reward"
  },
  {
    id: "6",
    userId: "user-002",
    userName: "Jane Smith",
    type: "Withdrawal",
    amount: 200,
    date: "2023-10-20",
    status: "Failed",
    description: "Withdrawal request failed - insufficient funds"
  }
];

const Wallet = () => {
  const [transactions] = useState<WalletTransaction[]>(mockWalletTransactions);

  // Calculate summary stats
  const totalTransactions = transactions.length;
  const totalCredits = transactions
    .filter(t => t.type === 'Credit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = transactions
    .filter(t => t.type === 'Debit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingWithdrawals = transactions
    .filter(t => t.type === 'Withdrawal' && t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const columns = [
    { key: 'id' as keyof WalletTransaction, header: 'Transaction ID' },
    { key: 'userName' as keyof WalletTransaction, header: 'User' },
    {
      key: 'type' as keyof WalletTransaction,
      header: 'Type',
      render: (transaction: WalletTransaction) => (
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${transaction.type === 'Credit' ? 'bg-green-100 text-green-800' : ''}
          ${transaction.type === 'Debit' ? 'bg-red-100 text-red-800' : ''}
          ${transaction.type === 'Transfer' ? 'bg-blue-100 text-blue-800' : ''}
          ${transaction.type === 'Withdrawal' ? 'bg-amber-100 text-amber-800' : ''}
        `}>
          {transaction.type}
        </span>
      )
    },
    {
      key: 'amount' as keyof WalletTransaction,
      header: 'Amount',
      render: (transaction: WalletTransaction) => <span>${transaction.amount.toFixed(2)}</span>
    },
    { key: 'date' as keyof WalletTransaction, header: 'Date' },
    {
      key: 'status' as keyof WalletTransaction,
      header: 'Status',
      render: (transaction: WalletTransaction) => <StatusBadge status={transaction.status} />
    },
    { key: 'description' as keyof WalletTransaction, header: 'Description' }
  ];

  const filterOptions = [
    {
      key: 'type' as keyof WalletTransaction,
      label: 'Type',
      options: [
        { label: 'Credit', value: 'Credit' },
        { label: 'Debit', value: 'Debit' },
        { label: 'Transfer', value: 'Transfer' },
        { label: 'Withdrawal', value: 'Withdrawal' }
      ]
    },
    {
      key: 'status' as keyof WalletTransaction,
      label: 'Status',
      options: [
        { label: 'Completed', value: 'Completed' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Failed', value: 'Failed' }
      ]
    }
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Wallet Management</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <WalletIcon className="h-5 w-5 text-blue-500" />
              <div className="text-2xl font-bold">{totalTransactions}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-full bg-green-100">
                <WalletIcon className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">${totalCredits.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Debits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-full bg-red-100">
                <WalletIcon className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">${totalDebits.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-full bg-amber-100">
                <WalletIcon className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600">${pendingWithdrawals.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        <DataTable
          columns={columns}
          data={transactions}
          keyExtractor={(item) => item.id}
          searchable={true}
          exportable={true}
          filterable={true}
          filterOptions={filterOptions}
        />
      </div>
    </>
  );
};

export default Wallet;
