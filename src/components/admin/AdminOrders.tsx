import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Download,
  Filter,
  Calendar,
  X,
  CalendarX2,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StudioOrder } from '@/lib/admin-data';
import { money } from '@/lib/store-data';

interface AdminOrdersProps {
  orders: StudioOrder[];
  onSelectOrder: (order: StudioOrder) => void;
  onUpdateStatus: (orderId: string, newStatus: StudioOrder['status']) => void;
  onOpenAddOrder?: () => void;
  onEditOrder?: (order: StudioOrder) => void;
  onDeleteOrder?: (orderId: string) => void;
}

const ORDERS_PER_PAGE = 10;

export function AdminOrders({
  orders,
  onSelectOrder,
  onUpdateStatus,
  onOpenAddOrder,
  onEditOrder,
  onDeleteOrder,
}: AdminOrdersProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | StudioOrder['status']>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [orderToDelete, setOrderToDelete] = useState<StudioOrder | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Quick Date Helpers
  const todayDateStr = '2026-10-19';
  const yesterdayDateStr = '2026-10-18';

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesDate = !selectedDate || o.orderDate === selectedDate;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerCity.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDate && matchesSearch;
  });

  // Sort orders by most recent first (orderDate descending, orderNumber descending)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateCompare = (b.orderDate || '').localeCompare(a.orderDate || '');
    if (dateCompare !== 0) return dateCompare;
    return (b.orderNumber || '').localeCompare(a.orderNumber || '');
  });

  // Calculate pagination: 10 orders per page
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / ORDERS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * ORDERS_PER_PAGE;
  const endIndex = Math.min(startIndex + ORDERS_PER_PAGE, sortedOrders.length);
  const currentOrdersPage = sortedOrders.slice(startIndex, endIndex);

  // Reset to page 1 whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, selectedDate]);

  const getStatusBadge = (status: StudioOrder['status']) => {
    switch (status) {
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Poured':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Dispatched':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      if (!year || !month || !day) return dateStr;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(month, 10) - 1;
      const monthName = months[monthIdx] || month;
      return `${parseInt(day, 10)} ${monthName}, ${year}`;
    } catch {
      return dateStr;
    }
  };

  const confirmDelete = () => {
    if (orderToDelete && onDeleteOrder) {
      onDeleteOrder(orderToDelete.id);
      setOrderToDelete(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-[#1C1917]">
              Customer Orders & Fulfillment
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              {sortedOrders.length} {sortedOrders.length === 1 ? 'Order' : 'Orders'} Total
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-1">
            Displaying the 10 most recent orders on this page. Filter by date, status, or search.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenAddOrder && (
            <Button
              onClick={onOpenAddOrder}
              className="bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Order
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => alert(`Exporting ${sortedOrders.length} orders to CSV...`)}
            className="border-[#EAE4DC] bg-[#FAF8F5] text-[#1C1917] hover:bg-[#F5F1EB] text-xs h-10 px-3.5 rounded-xl shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-[#C59A44]" /> Export
          </Button>
        </div>
      </div>

      {/* Date Filter & Search Controls */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-3 sm:p-4 shadow-sm space-y-3">
        {/* Row 1: Search & Date Picker */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
            <Input
              placeholder="Search by order ID, customer name, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
            />
          </div>

          {/* Specific Date Picker Input */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl px-3 py-1.5 shadow-2xs h-10">
              <Calendar className="w-4 h-4 text-[#A67C2E] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-[#A8A29E] leading-none">
                  Specific Date
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-xs text-[#1C1917] font-medium focus:outline-none cursor-pointer"
                  title="Choose order date"
                />
              </div>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="p-1 rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#F0ECE6] transition-colors ml-1"
                  title="Clear date filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick date presets */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => setSelectedDate(todayDateStr)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  selectedDate === todayDateStr
                    ? 'bg-[#C59A44] text-white border-[#C59A44]'
                    : 'bg-[#FAF8F5] text-[#57534E] border-[#EAE4DC] hover:text-[#1C1917]'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(yesterdayDateStr)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  selectedDate === yesterdayDateStr
                    ? 'bg-[#C59A44] text-white border-[#C59A44]'
                    : 'bg-[#FAF8F5] text-[#57534E] border-[#EAE4DC] hover:text-[#1C1917]'
                }`}
              >
                Yesterday
              </button>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="px-2.5 py-2 rounded-xl text-xs font-medium text-[#78716C] hover:text-[#1C1917]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Status Stage Filter */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE6]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-[#78716C] font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Stage:
            </span>
            {(['All', 'Processing', 'Poured', 'Dispatched', 'Delivered'] as const).map((stage) => {
              const count =
                stage === 'All'
                  ? orders.length
                  : orders.filter((o) => o.status === stage).length;
              return (
                <button
                  key={stage}
                  onClick={() => setStatusFilter(stage)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    statusFilter === stage
                      ? 'bg-[#C59A44] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#78716C] hover:text-[#1C1917] border border-[#EAE4DC]'
                  }`}
                >
                  {stage} ({count})
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#A67C2E] bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
              <Calendar className="w-3.5 h-3.5" />
              <span>Showing orders for: <strong>{formatDisplayDate(selectedDate)}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Empty State when no orders match */}
      {sortedOrders.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-8 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#A67C2E] flex items-center justify-center mx-auto">
            <CalendarX2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1C1917]">No Orders Found</h3>
            <p className="text-xs text-[#78716C] mt-1 max-w-sm mx-auto">
              {selectedDate
                ? `There were no orders recorded on ${formatDisplayDate(selectedDate)}. Try selecting another date.`
                : 'No orders match your current filter settings.'}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setSelectedDate('');
              setStatusFilter('All');
              setSearchTerm('');
            }}
            className="bg-[#C59A44] hover:bg-[#B58934] text-white text-xs font-semibold rounded-xl h-9 px-4"
          >
            Show All Orders
          </Button>
        </div>
      )}

      {/* Desktop Table View (Hidden on mobile) */}
      {sortedOrders.length > 0 && (
        <div className="hidden md:block bg-white rounded-2xl border border-[#EAE4DC] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#78716C] border-b border-[#EAE4DC]">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Order Date</th>
                  <th className="py-3 px-4 font-semibold">Customer Details</th>
                  <th className="py-3 px-4 font-semibold">Candles Ordered</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Fulfillment Stage</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE6]">
                {currentOrdersPage.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-[#1C1917]">
                      {order.orderNumber}
                      <span className="block text-[10px] text-[#78716C] font-sans">
                        {order.createdAt}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#1C1917] block">
                        {formatDisplayDate(order.orderDate)}
                      </span>
                      <span className="text-[10px] text-[#A8A29E] font-mono">
                        {order.orderDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#1C1917]">{order.customerName}</p>
                      <p className="text-[11px] text-[#78716C]">{order.customerCity}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#57534E]">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="truncate max-w-xs text-[11px]">
                          {it.quantity}x {it.name} ({it.fragrance})
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#1C1917]">{order.paymentMethod}</span>
                      <span
                        className={`block text-[10px] ${
                          order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#1C1917]">
                      {money(order.totalAmount ?? (order as any).total ?? 0)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateStatus(order.id, e.target.value as StudioOrder['status'])
                        }
                        className={`text-xs rounded-xl border px-2.5 py-1 font-medium bg-white transition-colors cursor-pointer ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Poured">Poured</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onSelectOrder(order)}
                          className="h-8 px-2 text-xs text-[#A67C2E] hover:bg-[#FAF5EB]"
                          title="View Slip / Details"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Slip
                        </Button>
                        <button
                          onClick={() => onEditOrder && onEditOrder(order)}
                          className="p-1.5 rounded-lg border border-[#EAE4DC] bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-colors"
                          title="Edit Order"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#A67C2E]" />
                        </button>
                        <button
                          onClick={() => setOrderToDelete(order)}
                          className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Card View (Optimized for Phones) */}
      {sortedOrders.length > 0 && (
        <div className="md:hidden space-y-3">
          {currentOrdersPage.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#EAE4DC] p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-sm text-[#1C1917]">
                    {order.orderNumber}
                  </span>
                  <span className="text-[10px] text-[#A67C2E] font-medium block">
                    {formatDisplayDate(order.orderDate)} • {order.createdAt}
                  </span>
                </div>
                <span className="font-mono font-semibold text-sm text-[#A67C2E]">
                  {money(order.totalAmount ?? (order as any).total ?? 0)}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-semibold text-[#1C1917]">{order.customerName}</p>
                <p className="text-[#78716C] text-[11px]">{order.customerCity}</p>
                <p className="text-[#44403C] text-[11px] pt-1">
                  Items: {order.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE6]">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#78716C]">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      onUpdateStatus(order.id, e.target.value as StudioOrder['status'])
                    }
                    className={`text-[11px] rounded-lg border px-2 py-0.5 font-medium ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Poured">Poured</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectOrder(order)}
                    className="h-8 px-2.5 text-xs border-[#EAE4DC] text-[#1C1917] bg-[#FAF8F5]"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-[#C59A44]" /> Slip
                  </Button>
                  <button
                    onClick={() => onEditOrder && onEditOrder(order)}
                    className="p-1.5 rounded-lg border border-[#EAE4DC] bg-[#FAF8F5] text-[#57534E] hover:bg-white"
                    title="Edit Order"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#A67C2E]" />
                  </button>
                  <button
                    onClick={() => setOrderToDelete(order)}
                    className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    title="Delete Order"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar: Recent 10 orders per page */}
      {sortedOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#78716C]">
            <span>
              Showing <strong className="text-[#1C1917] font-semibold">{startIndex + 1}–{endIndex}</strong> of{' '}
              <strong className="text-[#1C1917] font-semibold">{sortedOrders.length}</strong> orders
            </span>
            <span className="hidden sm:inline-block text-[#D6D0C7]">•</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EAE4DC] text-[11px] font-medium text-[#A67C2E]">
              10 per page
            </span>
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-[#EAE4DC] bg-[#FAF8F5] text-[#1C1917] hover:bg-[#F5F1EB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Number Chips */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                    safePage === pg
                      ? 'bg-[#C59A44] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F1EB] border border-[#EAE4DC]'
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-[#EAE4DC] bg-[#FAF8F5] text-[#1C1917] hover:bg-[#F5F1EB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Order Confirmation Dialog */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1C1917]">Delete Order?</h3>
                <p className="text-xs text-[#78716C]">
                  Are you sure you want to delete order <span className="font-semibold text-[#1C1917]">{orderToDelete.orderNumber}</span> for {orderToDelete.customerName}?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0ECE6]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOrderToDelete(null)}
                className="text-xs text-[#78716C]"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
