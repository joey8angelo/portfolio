import { create } from "zustand";
import { trackEvent } from "../hooks/useAnalytics";

type TabType = "home" | "about" | "sky";

interface NavigationState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const useNavigationStore = create<NavigationState>((set, get) => ({
  activeTab: "home",
  setActiveTab: (tab) => {
    if (get().activeTab !== tab) {
      trackEvent("Navigation", "Change Tab", tab);
      set({ activeTab: tab });
    }
  },
}));

export default useNavigationStore;
