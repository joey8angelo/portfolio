import ReactGA from "react-ga4";

export type EventCategory = 
  | "Navigation" 
  | "UI" 
  | "Outbound Link" 
  | "3D Scene" 
  | "Project Interaction";

export const trackEvent = (category: EventCategory, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

const useAnalytics = () => {
  return { trackEvent };
};

export default useAnalytics;
