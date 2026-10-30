import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Package,
  ShoppingBag,
  Users,
  Tag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Plus,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export type AdminTab = 'orders' | 'products' | 'customers' | 'promocodes' | 'invoices';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  ordersCount: number;
  productsCount: number;
  promoCodesCount: number;
  onOpenAddProduct?: () => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export function AdminLayout({
  activeTab,
  onTabChange,
  ordersCount,
  productsCount,
  promoCodesCount,
  onOpenAddProduct,
  onLogout,
  children,
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ONLY 4 pages as requested
  const navItems = [
    {
      id: 'orders' as AdminTab,
      label: 'Orders',
      icon: ShoppingBag,
      badge: `${ordersCount} Total`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'products' as AdminTab,
      label: 'Product Listing',
      icon: Package,
      badge: `${productsCount} Items`,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'customers' as AdminTab,
      label: 'Customers',
      icon: Users,
      badge: '1.2k',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'promocodes' as AdminTab,
      label: 'Promo Codes',
      icon: Tag,
      badge: `${promoCodesCount} Codes`,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'invoices' as AdminTab,
      label: 'Invoices & Slips',
      icon: FileText,
      badge: 'GST & Pack',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  const currentTabLabel = navItems.find((n) => n.id === activeTab)?.label || 'Orders';

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1C1917] font-sans antialiased flex flex-col md:flex-row selection:bg-[#C59A44]/20 selection:text-[#9A7228]">
      {/* Desktop / Tablet Sidebar (Light Theme) */}
      <aside
        className={`hidden md:flex flex-col border-r border-[#EAE4DC] bg-white transition-all duration-300 ease-in-out z-30 sticky top-0 h-screen ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 border-b border-[#EAE4DC] flex items-center justify-between px-5 bg-white">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-full border border-[#D4A359]/40 overflow-hidden shrink-0 bg-[#FAF7F2] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <img
                src="/crystelle-gold-logo.png"
                alt="Crystelle Studio"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-display text-lg font-semibold tracking-wide text-[#1C1917]">
                  Crystelle
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#A67C2E]">
                  Studio Admin
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-[#78716C] hover:text-[#1C1917] p-1.5 rounded-lg hover:bg-[#F5F2EC] transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Add Candle Action */}
        {onOpenAddProduct && (
          <div className="px-3 pt-4">
            <Button
              onClick={onOpenAddProduct}
              className={`w-full bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
                sidebarCollapsed ? 'px-0 h-10 w-10 mx-auto rounded-full' : 'h-10 rounded-xl'
              }`}
              title="Add New Candle"
            >
              <Plus className="w-4 h-4" />
              {!sidebarCollapsed && <span>Add Candle</span>}
            </Button>
          </div>
        )}

        {/* Navigation Links (Only 4 pages) */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-[#A8A29E] uppercase">
              Admin Menu
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#F5EFE6] text-[#A67C2E] border border-[#E3D7C5] font-semibold shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F8F5EF]'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#C59A44]' : 'text-[#78716C] group-hover:text-[#1C1917]'
                    }`}
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User / Exit Footer */}
        <div className="p-3 border-t border-[#EAE4DC] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#FAF5EB] border border-[#E3D7C5] flex items-center justify-center text-xs font-bold text-[#A67C2E]">
              A
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#1C1917] truncate">Administrator</span>
                <span className="text-[10px] text-[#78716C] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> admin@gmail.com
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Link
              to="/"
              target="_blank"
              className="text-[#78716C] hover:text-[#1C1917] p-1.5 rounded-lg hover:bg-[#F5F2EC] transition-colors"
              title="View Customer Storefront"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-[#78716C] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                title="Sign Out of Admin Console"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Navigation Drawer (Light Theme) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex">
          <div className="w-72 bg-white border-r border-[#EAE4DC] h-full flex flex-col p-4 animate-in slide-in-from-left duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2.5">
                <img src="/crystelle-gold-logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
                <span className="font-display font-semibold text-lg text-[#1C1917]">Crystelle Admin</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#F5EFE6] text-[#A67C2E] border border-[#E3D7C5] font-semibold'
                        : 'text-[#57534E] hover:bg-[#F8F5EF]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#C59A44]" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#EAE4DC] space-y-2">
              <Link
                to="/"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs font-medium text-[#44403C]"
              >
                <ExternalLink className="w-4 h-4" /> View Storefront
              </Link>
              {onLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Light Theme) */}
        <header className="h-16 md:h-20 border-b border-[#EAE4DC] bg-white/90 backdrop-blur-md sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#78716C] hover:bg-[#F5F2EC] border border-[#EAE4DC]"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#A67C2E] font-bold">Admin</span>
              <span className="text-[#D6D3D1]">/</span>
              <h1 className="text-sm md:text-base font-semibold text-[#1C1917]">
                {currentTabLabel}
              </h1>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F1EB] border border-[#EAE4DC] text-xs text-[#57534E] hover:text-[#1C1917] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C59A44]" />
              <span>Storefront</span>
            </Link>

            {/* Admin Avatar Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#EAE4DC]">
              <div className="w-8 h-8 rounded-full bg-[#FAF5EB] border border-[#E3D7C5] flex items-center justify-center font-bold text-xs text-[#A67C2E] shadow-xs">
                A
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-semibold text-[#1C1917]">admin@gmail.com</span>
                <span className="text-[10px] text-[#78716C]">Store Manager</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-[#78716C] hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
