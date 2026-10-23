"use client";

import { Logo } from "@/components/logo";
import { useResponsiveLayout } from "@/lib/theme-hooks";
import { BrandingSettings } from "@zitadel/proto/zitadel/settings/v2/branding_settings_pb";
import React, { Children, ReactNode } from "react";
import { Card } from "./card";
import { ThemeWrapper } from "./theme-wrapper";

/**
 * Presentation-only layout. Branding, translated copy, authentication methods
 * and flow contents continue to come from the ZITADEL configuration.
 */
export function DynamicTheme({
  branding,
  children,
}: {
  children: ReactNode | ((isSideBySide: boolean) => ReactNode);
  branding?: BrandingSettings;
}) {
  const { isSideBySide } = useResponsiveLayout();
  const actualChildren: ReactNode = React.useMemo(() => {
    if (typeof children === "function") {
      return (children as (isSideBySide: boolean) => ReactNode)(isSideBySide);
    }
    return children;
  }, [children, isSideBySide]);

  const childArray = Children.toArray(actualChildren);
  const hasSections = childArray.length > 1;
  const heading = childArray[0] ?? null;
  const form = hasSections ? childArray.slice(1) : heading;
  const lightLogo = branding?.lightTheme?.logoUrl || branding?.darkTheme?.logoUrl;
  const darkLogo = branding?.darkTheme?.logoUrl || branding?.lightTheme?.logoUrl;
  const hasLogo = !!(lightLogo || darkLogo);

  const logo = hasLogo ? (
    <Logo lightSrc={lightLogo} darkSrc={darkLogo} height={44} width={148} />
  ) : null;

  return (
    <ThemeWrapper branding={branding}>
      {isSideBySide && hasSections ? (
        <div className="mx-auto w-full max-w-[960px] px-4 py-4 sm:px-6">
          <Card className="w-full overflow-hidden" padding="px-6 py-8 sm:px-10 sm:py-12">
            <div className="grid min-w-0 gap-8 md:grid-cols-2 md:gap-12">
              <div className="flex min-w-0 flex-col justify-center gap-8">
                {hasLogo && <div className="flex justify-start">{logo}</div>}
                {hasSections && <div className="w-full space-y-3 text-left">{heading}</div>}
              </div>
              <div className="flex min-w-0 flex-col justify-center">{form}</div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[520px] px-6 py-4 sm:px-6">
          {hasLogo && <div className="mb-7 flex justify-center">{logo}</div>}
          <Card className="login-auth-card w-full" padding="px-6 py-8 sm:px-9 sm:py-10">
            <div className="flex w-full min-w-0 flex-col gap-6 sm:gap-7">
              {hasSections ? (
                <>
                  <div className="w-full space-y-3 text-left">{heading}</div>
                  <div className="w-full">{form}</div>
                </>
              ) : (
                <div className="w-full">{actualChildren}</div>
              )}
            </div>
          </Card>
        </div>
      )}
    </ThemeWrapper>
  );
}
