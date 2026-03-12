import { useControls as useLevaControls } from "leva";

type ExtractValue<T> = T extends { value: infer V } ? V : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractValues<T extends Record<string, any>> = {
  [K in keyof T]: ExtractValue<T[K]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LevaControls<T extends Record<string, any>>(
  controls: T,
): ExtractValues<T> {
  return useLevaControls(controls) as ExtractValues<T>;
}

/**
 * Wraps leva's useControls with environment-aware behavior.
 * In development: Full leva debugging controls
 * In production: Returns the default values
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebugControls<T extends Record<string, any>>(
  controls: T,
): ExtractValues<T> {
  const isDev = import.meta.env.DEV;

  // extract default values
  const defaults = Object.entries(controls).reduce((acc, [key, config]) => {
    const value =
      config && typeof config === "object" && "value" in config
        ? config.value
        : config;

    return { ...acc, [key]: value };
  }, {} as ExtractValues<T>);

  if (!isDev) {
    return defaults;
  }

  return LevaControls(controls);
}
