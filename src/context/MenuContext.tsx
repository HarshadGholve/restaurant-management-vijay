import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ref, onValue, set, update, remove } from 'firebase/database';
import { db } from '../firebase';
import {
  MenuItem,
  MenuCategory,
  menuItems as defaultMenuItems,
  categories as defaultCategories,
} from '../data/menuData';

interface MenuContextType {
  menuItems: MenuItem[];
  categories: MenuCategory[];
  isMenuLoading: boolean;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const MENU_ITEMS_PATH = 'menu_items';
const MENU_CATS_PATH = 'menu_categories';

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);

  useEffect(() => {
    const itemsRef = ref(db, MENU_ITEMS_PATH);
    const catsRef = ref(db, MENU_CATS_PATH);

    const unsubItems = onValue(
      itemsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const arr: MenuItem[] = Object.values(data);
          // Sort veg first, then by original order (preserved via id)
          setMenuItems(arr);
        } else {
          // Seed from static data on first run
          const seed: Record<string, MenuItem> = {};
          defaultMenuItems.forEach((item) => {
            seed[item.id] = item;
          });
          set(itemsRef, seed);
        }
      },
      (error) => {
        console.error("Firebase menu items read failed:", error);
        setIsMenuLoading(false);
      }
    );

    const unsubCats = onValue(
      catsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const arr: MenuCategory[] = Object.values(data);
          setCategories(arr);
        } else {
          // Seed categories
          const seed: Record<string, MenuCategory> = {};
          defaultCategories.forEach((cat) => {
            seed[cat.id] = cat;
          });
          set(catsRef, seed);
        }
        setIsMenuLoading(false);
      },
      (error) => {
        console.error("Firebase menu categories read failed:", error);
        setIsMenuLoading(false);
      }
    );

    return () => {
      unsubItems();
      unsubCats();
    };
  }, []);

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const id = `custom_${Date.now()}`;
    const newItem: MenuItem = { ...item, id };
    const itemRef = ref(db, `${MENU_ITEMS_PATH}/${id}`);
    set(itemRef, newItem);
  };

  const updateMenuItem = (item: MenuItem) => {
    const itemRef = ref(db, `${MENU_ITEMS_PATH}/${item.id}`);
    update(itemRef, item);
  };

  const deleteMenuItem = (id: string) => {
    const itemRef = ref(db, `${MENU_ITEMS_PATH}/${id}`);
    remove(itemRef);
  };

  return (
    <MenuContext.Provider
      value={{ menuItems, categories, isMenuLoading, addMenuItem, updateMenuItem, deleteMenuItem }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
};
