import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MenuItem } from '../data/menuData';
import { ref, onValue, set, update, push } from 'firebase/database';
import { db } from '../firebase';

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  priceUsed: number;
  variant?: 'half' | 'full';
}

export interface TableOrder {
  tableId: number;
  items: OrderItem[];
  status: 'active' | 'billed' | 'cleared';
  startTime: string; 
  billTime?: string; 
  guestCount: number;
  notes: string;
}

export interface ArchivedOrder extends TableOrder {
  id: string;
  archivedAt: string;
  total: number;
}

interface OrderContextType {
  tables: TableOrder[];
  history: ArchivedOrder[];
  totalTables: number;
  setTotalTables: (n: number) => void;
  addItemToTable: (tableId: number, item: MenuItem, variant?: 'half' | 'full') => void;
  removeItemFromTable: (tableId: number, itemId: string, variant?: 'half' | 'full') => void;
  updateQuantity: (tableId: number, itemId: string, delta: number, variant?: 'half' | 'full') => void;
  clearTable: (tableId: number) => void;
  billTable: (tableId: number) => void;
  setGuestCount: (tableId: number, count: number) => void;
  setNotes: (tableId: number, notes: string) => void;
  getTableTotal: (tableId: number) => number;
  activeOrdersCount: number;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const getPriceFromVariant = (item: MenuItem, variant?: 'half' | 'full'): number => {
  if (typeof item.price === 'number') return item.price;
  const parts = String(item.price).split('/');
  if (variant === 'full' && parts[1]) return parseInt(parts[1]);
  return parseInt(parts[0]);
};

const DEFAULT_TOTAL_TABLES = 12;
const DB_PATH = 'restaurant_tables'; 
const HISTORY_PATH = 'order_history';

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [totalTables, setTotalTables] = useState(DEFAULT_TOTAL_TABLES);
  const [tables, setTables] = useState<TableOrder[]>([]);
  const [history, setHistory] = useState<ArchivedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Firebase
  useEffect(() => {
    const tablesRef = ref(db, DB_PATH);
    const historyRef = ref(db, HISTORY_PATH);

    const unsubTables = onValue(
      tablesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const tablesArray: TableOrder[] = Object.values(data);
          tablesArray.sort((a, b) => a.tableId - b.tableId);
          setTables(tablesArray);
          if (tablesArray.length > 0 && tablesArray.length !== totalTables) {
            setTotalTables(tablesArray.length);
          }
        } else {
          const initialTables: Record<string, TableOrder> = {};
          for (let i = 1; i <= DEFAULT_TOTAL_TABLES; i++) {
            initialTables[`table-${i}`] = {
              tableId: i,
              items: [],
              status: 'cleared',
              startTime: new Date().toISOString(),
              guestCount: 1,
              notes: '',
            };
          }
          set(tablesRef, initialTables);
        }
      },
      (error) => {
        console.error("Firebase tables read failed:", error);
        setIsLoading(false);
      }
    );

    const unsubHistory = onValue(
      historyRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const historyArray: ArchivedOrder[] = Object.entries(data).map(([id, val]) => ({
            ...(val as any),
            id
          }));
          // Sort by archivedAt descending
          historyArray.sort((a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime());
          setHistory(historyArray);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Firebase history read failed:", error);
        setIsLoading(false);
      }
    );

    return () => {
      unsubTables();
      unsubHistory();
    };
  }, []);

  const updateTotalTables = (n: number) => {
    if (n === tables.length) return;
    const tablesRef = ref(db, DB_PATH);
    if (n > tables.length) {
      const updates: Record<string, TableOrder> = {};
      for (let i = tables.length + 1; i <= n; i++) {
        updates[`table-${i}`] = {
          tableId: i,
          items: [],
          status: 'cleared',
          startTime: new Date().toISOString(),
          guestCount: 1,
          notes: '',
        };
      }
      update(tablesRef, updates);
    } else {
      setTotalTables(n);
    }
  };

  const getTableTotal = (tableId: number): number => {
    const table = tables.find(t => t.tableId === tableId);
    if (!table || !table.items) return 0;
    return table.items.reduce((sum, oi) => sum + oi.priceUsed * oi.quantity, 0);
  };

  const archiveOrder = (table: TableOrder) => {
    if ((table.items || []).length === 0) return;
    
    const historyRef = ref(db, HISTORY_PATH);
    const total = table.items.reduce((sum, oi) => sum + oi.priceUsed * oi.quantity, 0);
    
    push(historyRef, {
      ...table,
      archivedAt: new Date().toISOString(),
      total
    });
  };

  const addItemToTable = (tableId: number, item: MenuItem, variant?: 'half' | 'full') => {
    const table = tables.find(t => t.tableId === tableId);
    if (!table) return;

    const price = getPriceFromVariant(item, variant);
    const items = table.items || [];
    const existingIdx = items.findIndex(
      oi => oi.menuItem.id === item.id && oi.variant === variant
    );

    let newItems;
    if (existingIdx >= 0) {
      newItems = items.map((oi, idx) =>
        idx === existingIdx ? { ...oi, quantity: oi.quantity + 1 } : oi
      );
    } else {
      const newItem: OrderItem = { menuItem: item, quantity: 1, priceUsed: price };
      if (variant) newItem.variant = variant;
      newItems = [...items, newItem];
    }

    const tableRef = ref(db, `${DB_PATH}/table-${tableId}`);
    update(tableRef, {
      items: newItems,
      status: 'active',
      startTime: table.status === 'cleared' ? new Date().toISOString() : table.startTime,
    });
  };

  const removeItemFromTable = (tableId: number, itemId: string, variant?: 'half' | 'full') => {
    const table = tables.find(t => t.tableId === tableId);
    if (!table) return;

    const newItems = (table.items || []).filter(
      oi => !(oi.menuItem.id === itemId && oi.variant === variant)
    );

    const tableRef = ref(db, `${DB_PATH}/table-${tableId}`);
    update(tableRef, {
      items: newItems,
      status: newItems.length === 0 ? 'cleared' : table.status
    });
  };

  const updateQuantity = (tableId: number, itemId: string, delta: number, variant?: 'half' | 'full') => {
    const table = tables.find(t => t.tableId === tableId);
    if (!table) return;

    const newItems = (table.items || [])
      .map(oi => {
        if (oi.menuItem.id === itemId && oi.variant === variant) {
          return { ...oi, quantity: Math.max(0, oi.quantity + delta) };
        }
        return oi;
      })
      .filter(oi => oi.quantity > 0);

    const tableRef = ref(db, `${DB_PATH}/table-${tableId}`);
    update(tableRef, {
      items: newItems,
      status: newItems.length === 0 ? 'cleared' : table.status
    });
  };

  const clearTable = (tableId: number) => {
    const table = tables.find(t => t.tableId === tableId);
    if (!table) return;

    // Archive if it was active or billed
    if (table.status !== 'cleared') {
      archiveOrder(table);
    }

    const tableRef = ref(db, `${DB_PATH}/table-${tableId}`);
    update(tableRef, {
      items: [],
      status: 'cleared',
      notes: '',
      guestCount: 1
    });
  };

  const billTable = (tableId: number) => {
    const tableRef = ref(db, `${DB_PATH}/table-${tableId}`);
    update(tableRef, {
      status: 'billed',
      billTime: new Date().toISOString()
    });
  };

  const setGuestCount = (tableId: number, count: number) => {
    const tableRef = ref(db, `${DB_PATH}/table-${tableId}`);
    update(tableRef, { guestCount: count });
  };

  const setNotes = (tableId: number, notes: string) => {
    const tableRef = ref(db, `${DB_PATH}/table-${tableId}`);
    update(tableRef, { notes });
  };

  const activeOrdersCount = tables.filter(t => t.status === 'active').length;

  return (
    <OrderContext.Provider value={{
      tables: tables.slice(0, totalTables),
      history,
      totalTables,
      setTotalTables: updateTotalTables,
      addItemToTable,
      removeItemFromTable,
      updateQuantity,
      clearTable,
      billTable,
      setGuestCount,
      setNotes,
      getTableTotal,
      activeOrdersCount,
      isLoading,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};
