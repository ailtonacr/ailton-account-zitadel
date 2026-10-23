"use client";

import { getComponentRoundness } from "@/lib/theme";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { ChangeEvent, DetailedHTMLProps, forwardRef, InputHTMLAttributes, ReactNode } from "react";

export type TextInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string;
  suffix?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string | ReactNode;
  success?: string | ReactNode;
  disabled?: boolean;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (value: ChangeEvent<HTMLInputElement>) => void;
  roundness?: string; // Allow override via props
};

const styles = (error: boolean, disabled: boolean, roundnessClasses: string = "rounded-md") =>
  clsx(
    {
      "min-h-[52px] mb-[2px] px-4 py-2.5 bg-input-light-background dark:bg-input-dark-background transition-colors duration-150 grow": true,
      "border border-input-light-border dark:border-input-dark-border hover:border-primary-light-500 dark:hover:border-primary-dark-500 focus:border-primary-light-500 dark:focus:border-primary-dark-500": true,
      "focus:outline-none focus:ring-2 focus:ring-primary-light-500/20 dark:focus:ring-primary-dark-500/20 text-base text-input-light-label dark:text-input-dark-label placeholder:text-text-light-secondary-500 dark:placeholder:text-text-dark-secondary-500": true,
      "border border-warn-light-500 dark:border-warn-dark-500 hover:border-warn-light-500 hover:dark:border-warn-dark-500 focus:border-warn-light-500 focus:dark:border-warn-dark-500":
        error,
      "pointer-events-none text-text-light-secondary-500 dark:text-text-dark-secondary-500 border border-input-light-border dark:border-input-dark-border hover:border-light-hoverborder hover:dark:border-hoverborder cursor-default":
        disabled,
    },
    roundnessClasses, // Apply the full roundness classes directly
  );

// Helper function to get default input roundness from theme
function getDefaultInputRoundness(): string {
  return getComponentRoundness("input");
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      placeholder,
      defaultValue,
      suffix,
      required = false,
      error,
      disabled,
      success,
      onChange,
      onBlur,
      roundness,
      ...props
    },
    ref,
  ) => {
    // Use theme-based roundness if not explicitly provided
    const actualRoundness = roundness || getDefaultInputRoundness();

    return (
      <label className="relative flex flex-col text-[13px] text-input-light-label dark:text-input-dark-label">
        <span className={`mb-2 leading-5 ${error ? "text-warn-light-500 dark:text-warn-dark-500" : ""}`}>
          {label} {required && "*"}
        </span>
        <div className="relative flex min-w-0">
          <input
          suppressHydrationWarning
          ref={ref}
          className={clsx(styles(!!error, !!disabled, actualRoundness), "w-full min-w-0", suffix && "pr-24")}
          defaultValue={defaultValue}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          placeholder={placeholder}
          autoComplete={props.autoComplete ?? "off"}
          onChange={(e) => onChange && onChange(e)}
          onBlur={(e) => onBlur && onBlur(e)}
          {...props}
        />

        {suffix && (
          <span
            className={clsx(
              "bg-background-light-500 dark:bg-background-dark-500 pointer-events-none absolute right-[3px] top-1/2 z-10 max-w-[60%] -translate-y-1/2 transform truncate p-2",
              // Extract just the roundness part for the suffix (no padding)
              actualRoundness.split(" ")[0], // Take only the first part (rounded-full, rounded-md, etc.)
            )}
          >
            @{suffix}
          </span>
        )}

        </div>
        {error && (
          <span className="mt-1 text-xs leading-5 text-warn-light-500 dark:text-warn-dark-500" role="alert">
            {error}
          </span>
        )}

        {success && (
          <div className="text-md mt-1 flex flex-row items-center text-primary-light-500 dark:text-primary-dark-500">
            <CheckCircleIcon className="h-4 w-4" />
            <span className="ml-1">{success}</span>
          </div>
        )}
      </label>
    );
  },
);
