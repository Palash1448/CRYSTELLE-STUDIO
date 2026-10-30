import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { AdminLayout, AdminTab } from '@/components/admin/AdminLayout';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminCustomers } from '@/components/admin/AdminCustomers';
import { AdminPromocodes } from '@/components/admin/AdminPromocodes';
import { AdminInvoices } from '@/components/admin/AdminInvoices';
import { AdminLoginPage } from '@/components/admin/AdminLoginPage';
import { AddProductModal } from '@/components/admin/AddProductModal';
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal';
import { OrderFormModal } from '@/components/admin/OrderFormModal';
import { CustomerFormModal } from '@/components/admin/CustomerFormModal';
import {
  getStoredAdminSession,
  saveStoredAdminSession,
  logoutAdmin,
  createAdminSession,
  AdminSession,
} from '@/lib/admin-auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  fetchFirestoreOrders,
  saveAdminOrderToFirestore,
  deleteFirestoreOrder,
  fetchFirestoreProducts,
  saveProductToFirestore,
  deleteFirestoreProduct,
  saveCustomerToFirestore,
  deleteFirestoreCustomer,
  savePromoToFirestore,
  deleteFirestorePromo,
} from '@/lib/firestore-service';
import {
  initialOrders,
  initialCustomers,
  initialPromoCodes,
  StudioOrder,
  StudioCustomer,
  StudioPromoCode,
} from '@/lib/admin-data';
import { products, DUMMY_PRODUCT_IDS } from '@/lib/store-data';

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Admin Panel — Crystelle Studio' },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' },
      {
        name: 'description',
        content: 'Administrator console for orders, products, customers, promocodes, and invoices.',
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { tab?: string } => ({
    tab: (search['tab'] as string) || 'orders',
  }),
  component: AdminPage,
});

function AdminPage() {
  const search = useSearch({ from: '/admin' });
  const navigate = useNavigate();

  // Admin authentication state
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    const session = getStoredAdminSession();
    if (session) {
      setAdminSession(session);
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && fbUser.email) {
        setAdminSession((curr) => {
          if (!curr) {
            const newSession = createAdminSession(fbUser.email || 'admin@crystellestudio.com', fbUser.uid, true);
            saveStoredAdminSession(newSession);
            return newSession;
          }
          return curr;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Active tab
  const currentTab = (search.tab as AdminTab) || 'orders';
  const [activeTab, setActiveTab] = useState<AdminTab>(currentTab);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    navigate({
      to: '/admin',
      search: { tab },
      replace: true,
    });
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
    saveStoredAdminSession(null);
    setAdminSession(null);
  };

  // State management with localStorage persistence
  // State management with localStorage persistence (Only real orders, no dummy data)
  const [orders, setOrders] = useState<StudioOrder[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('crystelle_admin_orders');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Purge all legacy dummy orders
            const realOnly = parsed.filter(
              (o) =>
                o &&
                o.id &&
                !o.id.startsWith('ord-') &&
                !o.orderNumber?.startsWith('#CS-984')
            );
            localStorage.setItem('crystelle_admin_orders', JSON.stringify(realOnly));
            return realOnly;
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached admin orders', e);
      }
    }
    return [];
  });

  const [productsList, setProductsList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('crystelle_admin_products');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter((p: any) => p && p.id && !DUMMY_PRODUCT_IDS.has(p.id));
            localStorage.setItem('crystelle_admin_products', JSON.stringify(clean));
            return clean;
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached admin products', e);
      }
    }
    return [];
  });

  const [customers, setCustomers] = useState<StudioCustomer[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('crystelle_admin_customers');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse cached admin customers', e);
      }
    }
    return initialCustomers;
  });

  const [promoCodes, setPromoCodes] = useState<StudioPromoCode[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('crystelle_admin_promos');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse cached admin promocodes', e);
      }
    }
    return initialPromoCodes;
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crystelle_admin_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crystelle_admin_products', JSON.stringify(productsList));
    }
  }, [productsList]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crystelle_admin_customers', JSON.stringify(customers));
    }
  }, [customers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crystelle_admin_promos', JSON.stringify(promoCodes));
    }
  }, [promoCodes]);

  // Synchronize remote orders from Firestore into Admin on authentication (Excluding dummy orders)
  useEffect(() => {
    if (!adminSession) return;
    let isMounted = true;

    fetchFirestoreOrders()
      .then((remoteOrders) => {
        if (!isMounted || !remoteOrders) return;

        // Auto-purge any dummy orders if found in Firestore
        remoteOrders.forEach((ro) => {
          if (ro.id?.startsWith('ord-') || ro.orderNumber?.startsWith('#CS-984')) {
            deleteFirestoreOrder(ro.id).catch(() => {});
          }
        });

        const realRemote = remoteOrders.filter(
          (ro) =>
            ro &&
            ro.id &&
            !ro.id.startsWith('ord-') &&
            !ro.orderNumber?.startsWith('#CS-984')
        );

        setOrders((prev) => {
          const cleanPrev = prev.filter(
            (o) =>
              o &&
              o.id &&
              !o.id.startsWith('ord-') &&
              !o.orderNumber?.startsWith('#CS-984')
          );
          const existingIds = new Set(cleanPrev.map((o) => o.id));
          const newOnes = realRemote.filter((ro) => !existingIds.has(ro.id));
          return [...newOnes, ...cleanPrev];
        });
      })
      .catch((err) => {
        console.warn('Firestore orders sync notice:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [adminSession]);

  // Synchronize remote products from Firestore into Admin (Excluding dummy products)
  useEffect(() => {
    if (!adminSession) return;
    let isMounted = true;

    fetchFirestoreProducts()
      .then((remoteProds) => {
        if (!isMounted || !remoteProds) return;
        remoteProds.forEach((rp) => {
          if (DUMMY_PRODUCT_IDS.has(rp.id)) {
            deleteFirestoreProduct(rp.id).catch(() => {});
          }
        });
        const realProds = remoteProds.filter((rp) => rp && rp.id && !DUMMY_PRODUCT_IDS.has(rp.id));
        if (realProds.length > 0) {
          setProductsList(realProds);
          if (typeof window !== 'undefined') {
            localStorage.setItem('crystelle_admin_products', JSON.stringify(realProds));
          }
        }
      })
      .catch((err) => {
        console.warn('Firestore products sync notice:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [adminSession]);

  // Modals state for CRUD
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<any | null>(null);

  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedOrderToEdit, setSelectedOrderToEdit] = useState<StudioOrder | null>(null);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<StudioOrder | null>(null);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomerToEdit, setSelectedCustomerToEdit] = useState<StudioCustomer | null>(null);

  // -------------------------
  // 1. PRODUCTS CRUD HANDLERS
  // -------------------------
  const handleAddProduct = (newProd: any) => {
    setProductsList((current) => [newProd, ...current]);
    saveProductToFirestore(newProd).catch(console.warn);
  };

  const handleUpdateProduct = (updatedProd: any) => {
    setProductsList((current) =>
      current.map((p) => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p))
    );
    saveProductToFirestore(updatedProd).catch(console.warn);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((current) => current.filter((p) => p.id !== productId));
    deleteFirestoreProduct(productId).catch(console.warn);
  };

  const handleUpdateStock = (productId: string, delta: number) => {
    setProductsList((current) =>
      current.map((p) => {
        if (p.id === productId) {
          const currentStock = p.stockQuantity ?? 32;
          const nextStock = Math.max(0, currentStock + delta);
          const updated = { ...p, stockQuantity: nextStock };
          saveProductToFirestore(updated).catch(console.warn);
          return updated;
        }
        return p;
      })
    );
  };

  // -----------------------
  // 2. ORDERS CRUD HANDLERS
  // -----------------------
  const handleAddOrder = (newOrder: StudioOrder) => {
    setOrders((current) => [newOrder, ...current]);
    saveAdminOrderToFirestore(newOrder).catch(console.warn);
  };

  const handleUpdateOrder = (updatedOrder: StudioOrder) => {
    setOrders((current) =>
      current.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    if (selectedOrderForDetails && selectedOrderForDetails.id === updatedOrder.id) {
      setSelectedOrderForDetails(updatedOrder);
    }
    saveAdminOrderToFirestore(updatedOrder).catch(console.warn);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((current) => current.filter((o) => o.id !== orderId));
    if (selectedOrderForDetails && selectedOrderForDetails.id === orderId) {
      setSelectedOrderForDetails(null);
    }
    deleteFirestoreOrder(orderId).catch(console.warn);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: StudioOrder['status']) => {
    let orderToSync: StudioOrder | undefined;
    setOrders((current) =>
      current.map((ord) => {
        if (ord.id === orderId) {
          orderToSync = { ...ord, status: newStatus };
          return orderToSync;
        }
        return ord;
      })
    );
    if (orderToSync) {
      saveAdminOrderToFirestore(orderToSync).catch(console.warn);
    }
    if (selectedOrderForDetails && selectedOrderForDetails.id === orderId) {
      setSelectedOrderForDetails((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // --------------------------
  // 3. CUSTOMERS CRUD HANDLERS
  // --------------------------
  const handleAddCustomer = (newCustomer: StudioCustomer) => {
    setCustomers((current) => [newCustomer, ...current]);
    saveCustomerToFirestore(newCustomer).catch(console.warn);
  };

  const handleUpdateCustomer = (updatedCustomer: StudioCustomer) => {
    setCustomers((current) =>
      current.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
    saveCustomerToFirestore(updatedCustomer).catch(console.warn);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((current) => current.filter((c) => c.id !== customerId));
    deleteFirestoreCustomer(customerId).catch(console.warn);
  };

  // ----------------------------
  // 4. PROMO CODES CRUD HANDLERS
  // ----------------------------
  const handleAddPromoCode = (newPromo: StudioPromoCode) => {
    setPromoCodes((current) => [newPromo, ...current]);
    savePromoToFirestore(newPromo).catch(console.warn);
  };

  const handleUpdatePromoCode = (updatedPromo: StudioPromoCode) => {
    setPromoCodes((current) =>
      current.map((p) => (p.id === updatedPromo.id ? updatedPromo : p))
    );
    savePromoToFirestore(updatedPromo).catch(console.warn);
  };

  const handleTogglePromoStatus = (promoId: string) => {
    let promoToSync: StudioPromoCode | undefined;
    setPromoCodes((current) =>
      current.map((p) => {
        if (p.id === promoId) {
          promoToSync = { ...p, isActive: !p.isActive };
          return promoToSync;
        }
        return p;
      })
    );
    if (promoToSync) {
      savePromoToFirestore(promoToSync).catch(console.warn);
    }
  };

  const handleDeletePromoCode = (promoId: string) => {
    setPromoCodes((current) => current.filter((p) => p.id !== promoId));
    deleteFirestorePromo(promoId).catch(console.warn);
  };

  // If not logged in, render the luxury light-theme admin login page
  if (!adminSession) {
    return <AdminLoginPage onLoginSuccess={(session) => setAdminSession(session)} />;
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      ordersCount={orders.length}
      productsCount={productsList.length}
      promoCodesCount={promoCodes.length}
      onOpenAddProduct={() => {
        setSelectedProductToEdit(null);
        setIsAddProductOpen(true);
      }}
      onLogout={handleLogout}
    >
      {activeTab === 'orders' && (
        <AdminOrders
          orders={orders}
          onSelectOrder={(ord) => setSelectedOrderForDetails(ord)}
          onUpdateStatus={handleUpdateOrderStatus}
          onOpenAddOrder={() => {
            setSelectedOrderToEdit(null);
            setIsOrderFormOpen(true);
          }}
          onEditOrder={(ord) => {
            setSelectedOrderToEdit(ord);
            setIsOrderFormOpen(true);
          }}
          onDeleteOrder={handleDeleteOrder}
        />
      )}

      {activeTab === 'products' && (
        <AdminProducts
          productsList={productsList}
          onOpenAddProduct={() => {
            setSelectedProductToEdit(null);
            setIsAddProductOpen(true);
          }}
          onUpdateStock={handleUpdateStock}
          onEditProduct={(p) => {
            setSelectedProductToEdit(p);
            setIsAddProductOpen(true);
          }}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {activeTab === 'customers' && (
        <AdminCustomers
          customers={customers}
          onOpenAddCustomer={() => {
            setSelectedCustomerToEdit(null);
            setIsCustomerModalOpen(true);
          }}
          onEditCustomer={(c) => {
            setSelectedCustomerToEdit(c);
            setIsCustomerModalOpen(true);
          }}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}

      {activeTab === 'promocodes' && (
        <AdminPromocodes
          promoCodes={promoCodes}
          onToggleStatus={handleTogglePromoStatus}
          onAddPromo={handleAddPromoCode}
          onUpdatePromo={handleUpdatePromoCode}
          onDeletePromo={handleDeletePromoCode}
        />
      )}

      {activeTab === 'invoices' && <AdminInvoices orders={orders} />}

      {/* Global Interactive CRUD Modals */}
      {/* 1. Product Form Modal (Add & Edit) */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setSelectedProductToEdit(null);
        }}
        onAddProduct={handleAddProduct}
        productToEdit={selectedProductToEdit}
        onUpdateProduct={handleUpdateProduct}
      />

      {/* 2. Order Form Modal (Add & Edit) */}
      <OrderFormModal
        isOpen={isOrderFormOpen}
        onClose={() => {
          setIsOrderFormOpen(false);
          setSelectedOrderToEdit(null);
        }}
        orderToEdit={selectedOrderToEdit}
        onSaveOrder={(ord) => {
          if (selectedOrderToEdit) {
            handleUpdateOrder(ord);
          } else {
            handleAddOrder(ord);
          }
        }}
      />

      {/* 3. Customer Form Modal (Add & Edit) */}
      <CustomerFormModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setSelectedCustomerToEdit(null);
        }}
        customerToEdit={selectedCustomerToEdit}
        onSaveCustomer={(cust) => {
          if (selectedCustomerToEdit) {
            handleUpdateCustomer(cust);
          } else {
            handleAddCustomer(cust);
          }
        }}
      />

      {/* 4. Order Details & Slip Modal */}
      <OrderDetailsModal
        order={selectedOrderForDetails}
        isOpen={Boolean(selectedOrderForDetails)}
        onClose={() => setSelectedOrderForDetails(null)}
        onUpdateStatus={handleUpdateOrderStatus}
        onUpdateOrder={handleUpdateOrder}
        onEditOrder={(ord) => {
          setSelectedOrderToEdit(ord);
          setIsOrderFormOpen(true);
        }}
        onDeleteOrder={handleDeleteOrder}
      />
    </AdminLayout>
  );
}
