"use client";

import type { Item } from "@/components/tab-group";
import { clsx } from "clsx";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export const Tab = ({ path, item: { slug, text } }: { path: string; item: Item }) => {
  const segment = useSelectedLayoutSegment();
  const href = slug ? path + "/" + slug : path;
  const isActive =
    // Example home pages e.g. `/layouts`
    (!slug && segment === null) ||
    // Nested pages e.g. `/layouts/electronics`
    segment === slug;

  return (
    <Link
      href={href}
      className={clsx("mt-2 mr-2 rounded-lg px-3 py-1 text-sm font-medium", {
        "border border-button-light-border bg-background-light-400 text-text-light-500 hover:bg-background-light-300 dark:border-button-dark-border dark:bg-background-dark-400 dark:text-text-dark-500 dark:hover:bg-background-dark-300": !isActive,
        "bg-primary-light-500 text-primary-light-contrast-500 dark:bg-primary-dark-500 dark:text-primary-dark-contrast-500": isActive,
      })}
    >
      {text}
    </Link>
  );
};
