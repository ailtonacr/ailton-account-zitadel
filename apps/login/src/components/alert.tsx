import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  type?: AlertType;
};

export enum AlertType {
  ALERT,
  INFO,
}

const warning =
  "border-warn-light-500/40 bg-warn-light-500/10 text-warn-light-500 dark:border-warn-dark-500/40 dark:bg-warn-dark-500/10 dark:text-warn-dark-500";
const neutral =
  "border-divider-light bg-background-light-400 text-text-light-secondary-500 dark:border-divider-dark dark:bg-background-dark-400 dark:text-text-dark-secondary-500";

export function Alert({ children, type = AlertType.ALERT }: Props) {
  return (
    <div
      className={clsx("flex min-w-0 flex-row items-start gap-3 rounded-md border p-4", {
        [warning]: type === AlertType.ALERT,
        [neutral]: type === AlertType.INFO,
      })}
    >
      {type === AlertType.ALERT && <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />}
      {type === AlertType.INFO && <InformationCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />}
      <span className="min-w-0 flex-1 text-sm leading-5">{children}</span>
    </div>
  );
}
