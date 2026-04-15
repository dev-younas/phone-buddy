import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import colors from "@/constants/colors";

export function useColors() {
  const ctx = useContext(AppContext);
  const isDark = ctx?.isDarkMode ?? false;
  const palette = isDark ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
