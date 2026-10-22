import { render, screen } from "@testing-library/react";
import { BrandingSettings } from "@zitadel/proto/zitadel/settings/v2/branding_settings_pb";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { DynamicTheme } from "./dynamic-theme";

vi.mock("@/lib/theme-hooks", () => ({
  useResponsiveLayout: () => ({ isSideBySide: false, isResponsiveOverride: false }),
}));

vi.mock("./theme-wrapper", () => ({
  ThemeWrapper: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("DynamicTheme — universal presentation", () => {
  it("renders provided content without a hardcoded application name or logo", () => {
    render(
      <DynamicTheme>
        <div><h1>Translated heading</h1></div>
        <form><label htmlFor="identifier">Translated label</label><input id="identifier" /></form>
      </DynamicTheme>,
    );

    expect(screen.getByRole("heading", { name: "Translated heading" })).toBeTruthy();
    expect(screen.getByLabelText("Translated label")).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("uses the logo configured by ZITADEL branding", () => {
    const branding = { lightTheme: { logoUrl: "/dynamic-logo.svg" } } as BrandingSettings;

    render(
      <DynamicTheme branding={branding}>
        <div><h1>Configured heading</h1></div>
        <form><input aria-label="Configured field" /></form>
      </DynamicTheme>,
    );

    expect(screen.getByAltText("logo").getAttribute("src")).toBe("/dynamic-logo.svg");
    expect(screen.getByRole("heading", { name: "Configured heading" })).toBeTruthy();
  });
});
