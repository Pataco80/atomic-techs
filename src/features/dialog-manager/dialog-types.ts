import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type DialogVariant = "default" | "destructive" | "warning";
type DialogSize = "sm" | "md" | "lg";

type DialogAction = {
  label: ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: "default" | "destructive";
};

type DialogCancel = {
  label: ReactNode;
  onClick?: () => void | Promise<void>;
};

type DialogBaseConfig = {
  id?: string;
  title?: string;
  description?: ReactNode;
  icon?: LucideIcon;
  variant?: DialogVariant;
  size?: DialogSize;
  style?: "default" | "centered";
};

export type ConfirmDialogConfig = DialogBaseConfig & {
  type: "confirm";
  confirmText?: string;
  action: DialogAction;
  cancel?: DialogCancel;
};

export type InputDialogConfig = DialogBaseConfig & {
  type: "input";
  input: {
    label: string;
    defaultValue?: string;
    placeholder?: string;
  };
  action: Omit<DialogAction, "onClick"> & {
    onClick: (inputValue?: string) => void | Promise<void>;
  };
  cancel?: DialogCancel;
};

export type CustomDialogConfig = DialogBaseConfig & {
  type: "custom";
  children: ReactNode;
  /** Extra classes merged onto the dialog content (e.g. iOS form sheets). */
  className?: string;
  /** Fired when the dialog closes itself (e.g. Escape / outside) — lets the
   * caller keep its own open-state in sync. */
  onClose?: () => void;
  /** When true, render as a regular Dialog: closes on outside-click / Escape
   * and shows a close button. Use for dismissable surfaces like the command
   * palette. Defaults to false (AlertDialog — safe for form sheets). */
  dismissible?: boolean;
};

export type DialogConfig =
  | ConfirmDialogConfig
  | InputDialogConfig
  | CustomDialogConfig;

export type Dialog = DialogConfig & {
  id: string;
  loading?: boolean;
};
