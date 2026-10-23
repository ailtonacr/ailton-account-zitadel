import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";

export const ExternalLink = ({ children, href }: { children: ReactNode; href: string }) => {
  return (
    <a
      href={href}
      className="inline-flex space-x-2 rounded-lg border border-button-light-border bg-background-light-400 px-3 py-1 text-sm font-medium text-text-light-500 hover:bg-background-light-300 dark:border-button-dark-border dark:bg-background-dark-400 dark:text-text-dark-500 dark:hover:bg-background-dark-300"
    >
      <div>{children}</div>

      <ArrowRightIcon className="block w-4" />
    </a>
  );
};
