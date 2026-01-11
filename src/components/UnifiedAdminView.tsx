'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, RefreshCw, Eye, FileDown, Database } from 'lucide-react';
import { toast } from 'sonner';

interface UnifiedRecord {
    id: string;
    user_name: string;
    user_email: string;
    category: 'Ticket' | 'Merchandise' | 'Accommodation';
    type: string;
    status: string;
    fulfillment_status: string;
    amount: number;
    created_at: string;
    phone_number: string;
}

export default function UnifiedAdminView() {
    const [data, setData] = useState<UnifiedRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [lastFetched, setLastFetched] = useState<string | null>(null);

    const fetchData = async (forceFresh = false) => {
        setLoading(true);
        try {
            // Add cache-busting timestamp if forcing fresh data
            const url = forceFresh
                ? `/api/admin/unified-view?_t=${Date.now()}`
                : '/api/admin/unified-view';

            const response = await fetch(url, {
                // Use default cache behavior, or no-cache if forcing fresh
                cache: forceFresh ? 'no-cache' : 'default'
            });
            const result = await response.json();

            if (result.success) {
                setData(result.data);
                setLastFetched(result.cached_at || new Date().toISOString());
                if (forceFresh) {
                    toast.success('Data refreshed successfully');
                }
            } else {
                toast.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching unified data:', error);
            toast.error('Error loading data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter and search logic
    const filteredData = useMemo(() => {
        return data.filter(record => {
            // Search filter
            const matchesSearch = searchTerm === '' ||
                record.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.phone_number.toLowerCase().includes(searchTerm.toLowerCase());

            // Category filter
            const matchesCategory = categoryFilter === 'all' || record.category === categoryFilter;

            // Status filter
            const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [data, searchTerm, categoryFilter, statusFilter]);

    // Calculate statistics (case-insensitive status matching)
    const stats = useMemo(() => {
        const totalRevenue = filteredData.reduce((sum, record) => {
            const status = record.status.toLowerCase();
            // Count as paid if status is 'paid' or for accommodation 'approved'
            const isPaid = status === 'paid' ||
                (record.category === 'Accommodation' && status === 'approved');
            return isPaid ? sum + record.amount : sum;
        }, 0);

        const pendingCount = filteredData.filter(r =>
            r.status.toLowerCase().includes('pending')
        ).length;

        const paidCount = filteredData.filter(r => {
            const status = r.status.toLowerCase();
            return status === 'paid' ||
                (r.category === 'Accommodation' && status === 'approved');
        }).length;

        const fulfilledCount = filteredData.filter(r =>
            r.fulfillment_status === 'Issued' ||
            r.fulfillment_status === 'Delivered' ||
            r.fulfillment_status === 'Confirmed' ||
            r.fulfillment_status === 'Approved'
        ).length;

        return { totalRevenue, pendingCount, paidCount, fulfilledCount };
    }, [filteredData]);

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Category', 'Type', 'Status', 'Fulfillment', 'Amount', 'Date'];
        const csvData = filteredData.map(record => [
            record.user_name,
            record.user_email,
            record.phone_number,
            record.category,
            record.type,
            record.status,
            record.fulfillment_status,
            record.amount,
            new Date(record.created_at).toLocaleString()
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `esummit-unified-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Data exported successfully');
    };

    // Export specific category
    const exportCategoryCSV = (category: 'Ticket' | 'Merchandise' | 'Accommodation') => {
        const categoryData = data.filter(r => r.category === category);
        const headers = ['Name', 'Email', 'Phone', 'Type', 'Status', 'Fulfillment', 'Amount', 'Date'];
        const csvData = categoryData.map(record => [
            record.user_name,
            record.user_email,
            record.phone_number,
            record.type,
            record.status,
            record.fulfillment_status,
            record.amount,
            new Date(record.created_at).toLocaleString()
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `esummit-${category.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success(`${category} data exported successfully`);
    };

    // Bulk download all categories
    const bulkDownloadAll = () => {
        // Download each category separately with slight delays
        exportCategoryCSV('Ticket');
        setTimeout(() => exportCategoryCSV('Merchandise'), 500);
        setTimeout(() => exportCategoryCSV('Accommodation'), 1000);
        setTimeout(() => {
            toast.success('All data exported! Check your downloads folder.');
        }, 1500);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Ticket':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            case 'Merchandise':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
            case 'Accommodation':
                return 'bg-green-500/10 text-green-400 border-green-500/30';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'paid' || s === 'approved') return 'bg-green-500/10 text-green-400';
        if (s.includes('pending')) return 'bg-yellow-500/10 text-yellow-400';
        if (s === 'rejected') return 'bg-red-500/10 text-red-400';
        return 'bg-gray-500/10 text-gray-400';
    };

    const getFulfillmentColor = (status: string) => {
        if (status === 'Issued' || status === 'Delivered' || status === 'Confirmed') {
            return 'bg-green-500/10 text-green-400';
        }
        return 'bg-gray-500/10 text-gray-400';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white">Unified Dashboard</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-white/60 text-sm">Complete overview of all transactions</p>
                        {lastFetched && (
                            <span className="text-white/40 text-xs font-mono">
                                • Updated {new Date(lastFetched).toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => fetchData(true)}
                        disabled={loading}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors flex items-center gap-2"
                        title="Force refresh data from database"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-lg transition-colors flex items-center gap-2"
                        title="Export current view as CSV"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <div className="relative group">
                        <button
                            onClick={bulkDownloadAll}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 font-semibold"
                            title="Download all tickets, merch, and accommodation data"
                        >
                            <Database className="w-4 h-4" />
                            Backup All
                        </button>
                        {/* Submenu for individual category downloads */}
                        <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => exportCategoryCSV('Ticket')}
                                    className="w-full px-3 py-2 text-left text-white/80 hover:bg-blue-500/20 hover:text-blue-400 rounded transition-colors flex items-center gap-2"
                                >
                                    <FileDown className="w-4 h-4" />
                                    Tickets Only
                                </button>
                                <button
                                    onClick={() => exportCategoryCSV('Merchandise')}
                                    className="w-full px-3 py-2 text-left text-white/80 hover:bg-purple-500/20 hover:text-purple-400 rounded transition-colors flex items-center gap-2"
                                >
                                    <FileDown className="w-4 h-4" />
                                    Merch Only
                                </button>
                                <button
                                    onClick={() => exportCategoryCSV('Accommodation')}
                                    className="w-full px-3 py-2 text-left text-white/80 hover:bg-green-500/20 hover:text-green-400 rounded transition-colors flex items-center gap-2"
                                >
                                    <FileDown className="w-4 h-4" />
                                    Accommodation Only
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-white/60 text-sm">Total Revenue</p>
                    <p className="text-2xl font-heading font-bold text-[#a855f7] mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-white/60 text-sm">Paid Transactions</p>
                    <p className="text-2xl font-heading font-bold text-green-400 mt-1">{stats.paidCount}</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-white/60 text-sm">Pending Verification</p>
                    <p className="text-2xl font-heading font-bold text-yellow-400 mt-1">{stats.pendingCount}</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-white/60 text-sm">Fulfilled Orders</p>
                    <p className="text-2xl font-heading font-bold text-blue-400 mt-1">{stats.fulfilledCount}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#a855f7]/50"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#a855f7]/50"
                >
                    <option value="all" className="bg-[#0a0a0a]">All Categories</option>
                    <option value="Ticket" className="bg-[#0a0a0a]">Tickets</option>
                    <option value="Merchandise" className="bg-[#0a0a0a]">Merchandise</option>
                    <option value="Accommodation" className="bg-[#0a0a0a]">Accommodation</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#a855f7]/50"
                >
                    <option value="all" className="bg-[#0a0a0a]">All Status</option>
                    <option value="Paid" className="bg-[#0a0a0a]">Paid</option>
                    <option value="Pending Verification" className="bg-[#0a0a0a]">Pending Verification</option>
                    <option value="Pending" className="bg-[#0a0a0a]">Pending</option>
                </select>
            </div>

            {/* Data Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">User</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Contact</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Payment Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Fulfillment</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-white/60">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading data...
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-white/60">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((record) => (
                                    <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="text-white font-medium">{record.user_name}</p>
                                            <p className="text-white/50 text-xs">{record.user_email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-white/70 text-sm font-mono">{record.phone_number}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(record.category)}`}>
                                                {record.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-white/80 text-sm font-mono">{record.type}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[#a855f7] font-heading font-bold">₹{record.amount}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${getFulfillmentColor(record.fulfillment_status)}`}>
                                                {record.fulfillment_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-white/70 text-xs">{new Date(record.created_at).toLocaleDateString()}</p>
                                            <p className="text-white/50 text-xs">{new Date(record.created_at).toLocaleTimeString()}</p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Results count */}
            <div className="text-center text-white/60 text-sm">
                Showing {filteredData.length} of {data.length} records
            </div>
        </div>
    );
}
