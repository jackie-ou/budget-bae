import * as React from "react"
import { clsx } from "clsx"

import styles from "./Button.module.css"

/*
 * Button — Budget Bae component library.
 *
 * Styled after the Lovable redesign: pill-shaped, theme-token colors
 * (see src/index.css). Supports text buttons with an optional left/right
 * icon, and icon-only buttons (e.g. Settings) via the `icon` prop.
 */

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive"
export type ButtonSize = "sm" | "md" | "lg"

type BaseProps = Omit<React.ComponentProps<"button">, "children"> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

type TextButtonProps = BaseProps & {
  children: React.ReactNode
  /** Icon rendered before the label. */
  leftIcon?: React.ReactNode
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode
  icon?: never
}

type IconButtonProps = BaseProps & {
  /** Renders an icon-only (circular) button. */
  icon: React.ReactNode
  /** Required: icon-only buttons have no visible text. */
  "aria-label": string
  children?: never
  leftIcon?: never
  rightIcon?: never
}

export type ButtonProps = TextButtonProps | IconButtonProps

function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  icon,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  const iconOnly = icon != null

  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        iconOnly && styles.iconOnly,
        className
      )}
      {...props}
    >
      {iconOnly ? (
        <Icon>{icon}</Icon>
      ) : (
        <>
          {leftIcon != null && <Icon>{leftIcon}</Icon>}
          {children}
          {rightIcon != null && <Icon>{rightIcon}</Icon>}
        </>
      )}
    </button>
  )
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" className={styles.icon}>
      {children}
    </span>
  )
}

export { Button }
