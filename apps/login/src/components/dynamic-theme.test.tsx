import { render, screen } from "@testing-library/react";
import type { BrandingSettings } from "@zitadel/proto/zitadel/settings/v2/branding_settings_pb";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { DynamicTheme } from "./dynamic-theme";

const responsive = vi.hoisted(() => ({ isSideBySide: false }));
vi.mock("@/lib/theme-hooks", () => ({
  useResponsiveLayout: () => ({ isSideBySide: responsive.isSideBySide, isResponsiveOverride: false }),
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

  it("uses a single column when a side-by-side screen has only one section", () => {
    responsive.isSideBySide = true;
    try {
      const { container } = render(
        <DynamicTheme>
          <section><h1>Only status content</h1></section>
        </DynamicTheme>,
      );

      expect(container.querySelector(".login-auth-card")).toBeTruthy();
      expect(screen.getByRole("heading", { name: "Only status content" })).toBeTruthy();
    } finally {
      responsive.isSideBySide = false;
    }
  });

  it("marks only the authentication card for mobile presentation", () => {
    const { container } = render(
      <DynamicTheme>
        <div><h1>Mobile heading</h1></div>
        <form><input aria-label="Mobile field" /></form>
      </DynamicTheme>,
    );
    expect(container.querySelector(".login-auth-card")).toBeTruthy();
    expect(screen.getByLabelText("Mobile field")).toBeTruthy();
  });

  it("preserves additional sections instead of silently discarding them", () => {
    render(
      <DynamicTheme>
        <div><h1>Login heading</h1></div>
        <form><input aria-label="Username" /></form>
        <p>Additional login guidance</p>
      </DynamicTheme>,
    );

    expect(screen.getByRole("heading", { name: "Login heading" })).toBeTruthy();
    expect(screen.getByLabelText("Username")).toBeTruthy();
    expect(screen.getByText("Additional login guidance")).toBeTruthy();
  });

  it("uses the logo configured by ZITADEL branding", () => {
    const branding = { lightTheme: { logoUrl: "/dynamic-logo.svg" } } as unknown as BrandingSettings;

    render(
      <DynamicTheme branding={branding}>
        <div><h1>Configured heading</h1></div>
        <form><input aria-label="Configured field" /></form>
      </DynamicTheme>,
    );

    expect(screen.getAllByAltText("logo")).toHaveLength(1);
    screen.getAllByAltText("logo").forEach((image) => {
      expect(image.getAttribute("src")).toBe("/dynamic-logo.svg");
    });
    expect(screen.getByRole("heading", { name: "Configured heading" })).toBeTruthy();
  });
});
