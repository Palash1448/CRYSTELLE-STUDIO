import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Flame,
  Users,
  ArrowUpRight,
  Sparkles,
  Plus,
  Download,
  AlertTriangle,
  Clock,
  Eye,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  StudioOrder,
  WorkshopBatch,
  revenueChartData7D,
  revenueChartData30D,
  fragranceDistribution,
} from '@/lib/admin-data';
import { money } from '@/lib/store-data';

interface AdminOverviewProps {
  orders: StudioOrder[];
  batches: WorkshopBatch[];
  onOpenAddProduct: () => void;
  onSelectOrder: (order: StudioOrder) => void;
  onViewAllOrders: () => void;
  onViewWorkshop: () => void;
  onViewProducts: () => void;
}

export function AdminOverview({
  orders,
  batches,
  onOpenAddProduct,
  onSelectOrder,
  onViewAllOrders,
  onViewWorkshop,
  onViewProducts,
}: AdminOverviewProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders'>('revenue');

  const chartData = timeframe === '7d' ? revenueChartData7D : revenueChartData30D;

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0) + 180000;
  const pendingOrders = orders.filter((o) => o.status === 'Processing' || o.status === 'Poured');

  const getStatusBadge = (status: StudioOrder['status']) => {
    switch (status) {
      case 'Processing':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Poured':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Dispatched':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Executive Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E1C1A] via-[#1A1816] to-[#141311] border border-[#2B2724] p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A359]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A359]/10 border border-[#D4A359]/30 text-[11px] font-semibold text-[#D4A359]">
              <Sparkles className="w-3.5 h-3.5" />
              Artisan Candle Studio Dashboard
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-[#FAF7F2]">
              Welcome back, Kartiki ✨
            </h2>
            <p className="text-xs md:text-sm text-[#ABA398] max-w-xl leading-relaxed">
              Here is your studio's performance, customer orders, and fragrance batch statuses for today.
              All workshop sensors and storefront sync operations are normal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                alert('Exporting Studio CSV Report: Orders & Inventory...');
              }}
              className="border-[#2E2A27] bg-[#141311] text-[#EDE8E1] hover:bg-[#201D1A] text-xs h-9"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-[#D4A359]" /> Export Report
            </Button>
            <Button
              onClick={onOpenAddProduct}
              size="sm"
              className="bg-gradient-to-r from-[#D4A359] to-[#C08A3E] hover:from-[#E0B26D] hover:to-[#CF9A4D] text-[#121110] font-semibold text-xs h-9 shadow-md shadow-[#D4A359]/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Pour New Candle
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-xl bg-[#141311] border border-[#262320] hover:border-[#D4A359]/40 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9E978E]">Total Studio Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#D4A359]/15 border border-[#D4A359]/30 flex items-center justify-center text-[#D4A359]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-semibold text-[#FAF7F2] font-mono tracking-tight">
              {money(totalRevenue)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
            <span className="text-[#8C847B]">vs last month</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-xl bg-[#141311] border border-[#262320] hover:border-[#D4A359]/40 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9E978E]">Fulfillment Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-semibold text-[#FAF7F2] font-mono tracking-tight">
              {orders.length + 336} Orders
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-amber-400 font-semibold font-mono">
              {pendingOrders.length} pending
            </span>
            <span className="text-[#8C847B]">• 98.4% on-time</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-xl bg-[#141311] border border-[#262320] hover:border-[#D4A359]/40 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9E978E]">Active Fragrance Lines</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-semibold text-[#FAF7F2] font-mono tracking-tight">
              8 Products
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-purple-400 font-semibold">420 Units</span>
            <span className="text-[#8C847B]">in workshop stock</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-xl bg-[#141311] border border-[#262320] hover:border-[#D4A359]/40 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9E978E]">Average Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-semibold text-[#FAF7F2] font-mono tracking-tight">
              {money(1240)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +₹120
            </span>
            <span className="text-[#8C847B]">via Gift Bundles</span>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Fragrance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends Chart (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141311] border border-[#262320] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262320]">
            <div>
              <h3 className="text-sm font-semibold text-[#EDE8E1] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D4A359]" />
                Studio Revenue & Demand Velocity
              </h3>
              <p className="text-xs text-[#9E978E] mt-0.5">
                Daily sales performance and customer checkout volume
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle metric */}
              <div className="bg-[#1C1A17] p-0.5 rounded-lg border border-[#2B2724] flex items-center text-[11px]">
                <button
                  onClick={() => setChartMetric('revenue')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    chartMetric === 'revenue'
                      ? 'bg-[#D4A359] text-[#121110] font-semibold'
                      : 'text-[#9E978E] hover:text-[#EDE8E1]'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setChartMetric('orders')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    chartMetric === 'orders'
                      ? 'bg-[#D4A359] text-[#121110] font-semibold'
                      : 'text-[#9E978E] hover:text-[#EDE8E1]'
                  }`}
                >
                  Orders
                </button>
              </div>

              {/* Toggle Timeframe */}
              <div className="bg-[#1C1A17] p-0.5 rounded-lg border border-[#2B2724] flex items-center text-[11px]">
                <button
                  onClick={() => setTimeframe('7d')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    timeframe === '7d'
                      ? 'bg-[#2E2A27] text-[#FAF7F2] font-semibold'
                      : 'text-[#9E978E] hover:text-[#EDE8E1]'
                  }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setTimeframe('30d')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    timeframe === '30d'
                      ? 'bg-[#2E2A27] text-[#FAF7F2] font-semibold'
                      : 'text-[#9E978E] hover:text-[#EDE8E1]'
                  }`}
                >
                  30D
                </button>
              </div>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A359" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4A359" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#221F1C" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#7B746B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#2B2724' }}
                />
                <YAxis
                  stroke="#7B746B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => (chartMetric === 'revenue' ? `₹${val / 1000}k` : `${val}`)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    const firstItem = payload && payload[0];
                    if (active && firstItem && firstItem.payload) {
                      const data = firstItem.payload;
                      return (
                        <div className="p-3 bg-[#1A1816] border border-[#2E2A27] rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-[#EDE8E1]">{label}</p>
                          <p className="text-[#D4A359] font-mono font-medium">
                            Revenue: {money(data.revenue)}
                          </p>
                          <p className="text-emerald-400 font-mono">Orders: {data.orders}</p>
                          <p className="text-[#9E978E]">Candles Poured: {data.candles}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={chartMetric}
                  stroke={chartMetric === 'revenue' ? '#D4A359' : '#10B981'}
                  strokeWidth={2.5}
                  fill={chartMetric === 'revenue' ? 'url(#revenueGrad)' : 'url(#ordersGrad)'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fragrance Performance Breakdown (1 Column) */}
        <div className="p-6 rounded-2xl bg-[#141311] border border-[#262320] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#262320]">
              <h3 className="text-sm font-semibold text-[#EDE8E1] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#D4A359]" />
                Fragrance Popularity
              </h3>
              <span className="text-[10px] text-[#8C847B]">Share of Sales</span>
            </div>

            <div className="mt-5 space-y-4">
              {fragranceDistribution.map((frag) => (
                <div key={frag.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#EDE8E1]">{frag.name}</span>
                    <span className="text-[#D4A359] font-mono font-semibold">{frag.sales}%</span>
                  </div>
                  <div className="w-full bg-[#1C1A17] h-2 rounded-full overflow-hidden border border-[#262320]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${frag.sales}%`,
                        backgroundColor: frag.color,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#8C847B]">
                    <span>Gross: {money(frag.revenue)}</span>
                    <span>High Re-order</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#262320]">
            <Button
              onClick={onViewProducts}
              variant="ghost"
              className="w-full text-xs text-[#D4A359] hover:bg-[#1E1C1A] flex items-center justify-center gap-1.5"
            >
              Manage Fragrance Catalog & Stock <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Live Recent Orders & Workshop Production Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141311] border border-[#262320]">
          <div className="flex items-center justify-between pb-4 border-b border-[#262320]">
            <div>
              <h3 className="text-sm font-semibold text-[#EDE8E1] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#D4A359]" />
                Recent Orders & Dispatch Status
              </h3>
              <p className="text-xs text-[#9E978E] mt-0.5">Real-time incoming customer purchases</p>
            </div>
            <Button
              onClick={onViewAllOrders}
              variant="outline"
              size="sm"
              className="text-xs border-[#2E2A27] text-[#EDE8E1] hover:bg-[#201D1A]"
            >
              View All {orders.length} Orders
            </Button>
          </div>

          <div className="mt-4 divide-y divide-[#221F1C] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#8C847B] border-b border-[#262320]">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Candles</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#221F1C]">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#181614] transition-colors group">
                    <td className="py-3 font-mono font-medium text-[#FAF7F2]">
                      {order.orderNumber}
                      <span className="block text-[10px] text-[#8C847B] font-sans">
                        {order.createdAt}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-medium text-[#EDE8E1] block">{order.customerName}</span>
                      <span className="text-[10px] text-[#8C847B]">{order.customerCity}</span>
                    </td>
                    <td className="py-3 text-[#ABA398]">
                      {order.items.map((it) => it.name).join(', ')}
                    </td>
                    <td className="py-3 font-mono font-semibold text-[#D4A359]">
                      {money(order.totalAmount)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border inline-block ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSelectOrder(order)}
                        className="h-7 px-2 text-[11px] text-[#C8C2BA] hover:text-[#FAF7F2] hover:bg-[#262320]"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workshop Production & Low Stock Alert (1 Column) */}
        <div className="p-6 rounded-2xl bg-[#141311] border border-[#262320] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#262320]">
              <h3 className="text-sm font-semibold text-[#EDE8E1] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#D4A359]" />
                Artisan Curing Batches
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">Live Queue</span>
            </div>

            <div className="mt-4 space-y-3.5">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-3.5 rounded-xl bg-[#181614] border border-[#262320] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#D4A359]">{batch.batchCode}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#221F1C] text-[#C8C2BA] border border-[#2E2A27]">
                      {batch.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#EDE8E1]">{batch.candleName}</p>
                    <p className="text-[10px] text-[#8C847B]">
                      {batch.quantity} units • {batch.waxType}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#8C847B]">
                      <span>Curing Progress</span>
                      <span className="font-mono text-[#EDE8E1]">{batch.progress}%</span>
                    </div>
                    <div className="w-full bg-[#221F1C] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full"
                        style={{ width: `${batch.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Low Inventory Alert */}
            <div className="mt-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                Workshop Restock Notice
              </div>
              <p className="text-[11px] text-[#C8C2BA] leading-relaxed">
                <strong className="text-amber-300">Rose Petal Candle</strong> has only 6 units remaining.
                Schedule a batch pour to prevent stockouts!
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#262320]">
            <Button
              onClick={onViewWorkshop}
              variant="outline"
              className="w-full text-xs border-[#2E2A27] text-[#EDE8E1] hover:bg-[#1E1C1A]"
            >
              Open Workshop & Lab Queue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
