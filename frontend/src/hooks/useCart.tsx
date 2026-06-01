import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  menuId: number;
  nama: string;
  harga: number;
  jumlah: number;
  catatan?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'jumlah'>) => void;
  removeItem: (menuId: number) => void;
  updateJumlah: (menuId: number, jumlah: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'jumlah'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuId === item.menuId);
      if (existing) {
        return prev.map((i) =>
          i.menuId === item.menuId ? { ...i, jumlah: i.jumlah + 1 } : i,
        );
      }
      return [...prev, { ...item, jumlah: 1 }];
    });
  };

  const removeItem = (menuId: number) => {
    setItems((prev) => prev.filter((i) => i.menuId !== menuId));
  };

  const updateJumlah = (menuId: number, jumlah: number) => {
    if (jumlah <= 0) {
      removeItem(menuId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuId === menuId ? { ...i, jumlah } : i)),
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, i) => acc + i.harga * i.jumlah, 0);
  const totalItems = items.reduce((acc, i) => acc + i.jumlah, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateJumlah, clearCart, total, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
