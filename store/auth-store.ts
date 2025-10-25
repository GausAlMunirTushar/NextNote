// store/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserPlan, PLANS, PLAN_PRICES } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  updateUserPlan: (plan: UserPlan) => void;
  checkFeatureAccess: (feature: keyof typeof PLANS.free) => boolean;
  getUsageStats: () => { notes: number; tasks: number; storage: number };
  canCreateNote: () => boolean;
  canCreateTask: () => boolean;
  hasFeature: (feature: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        });
      },

      updateUserPlan: (plan: UserPlan) => {
        set(state => ({
          user: state.user ? { ...state.user, plan } : null
        }));
      },

      checkFeatureAccess: (feature: keyof typeof PLANS.free) => {
        const { user } = get();
        if (!user) return false;
        
        const userPlan = PLANS[user.plan];
        return userPlan[feature];
      },

      getUsageStats: () => {
        // You'll need to implement this based on your data
        const notesCount = 0; // Get from notes store
        const tasksCount = 0; // Get from tasks store
        const storageUsed = 0; // Calculate from attachments
        
        return {
          notes: notesCount,
          tasks: tasksCount,
          storage: storageUsed
        };
      },

      canCreateNote: () => {
        const { user, getUsageStats } = get();
        if (!user) return false;
        
        const usage = getUsageStats();
        const planLimit = PLANS[user.plan].maxNotes;
        
        return usage.notes < planLimit;
      },

      canCreateTask: () => {
        const { user, getUsageStats } = get();
        if (!user) return false;
        
        const usage = getUsageStats();
        const planLimit = PLANS[user.plan].maxTasks;
        
        return usage.tasks < planLimit;
      },

      hasFeature: (feature: string) => {
        const { user } = get();
        if (!user) return false;
        
        const userPlan = PLANS[user.plan];
        return userPlan[feature as keyof typeof PLANS.free] || false;
      },
    }),
    {
      name: "nextnote-auth-storage",
    }
  )
);