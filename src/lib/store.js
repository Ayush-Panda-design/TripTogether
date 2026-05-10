import { create } from 'zustand'

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  searchOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
}))
