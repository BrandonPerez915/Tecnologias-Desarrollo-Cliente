import type { IconName } from "./icons";

export type Screen = "landing" | "home" | "cash" | "orders" | "inventory" | "loans" | "close" | "login" | "register";

export type Overlay = "actions" | "scanner" | "expense" | "sale" | "print" | "loan" | null;

export interface NavItem {
  id: Screen;
  label: string;
  icon: IconName;
}
