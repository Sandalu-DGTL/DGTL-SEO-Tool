import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DgtlOverview } from "./DgtlOverview";

describe("dashboard overview", () => {
  it("keeps the dashboard heading and guides clients to connected data", () => {
    const html = renderToStaticMarkup(createElement(DgtlOverview));
    expect(html).toContain("Search performance overview");
    expect(html).toContain("Review your connected data below");
  });

  it("does not render invented performance metrics or demo charts", () => {
    const html = renderToStaticMarkup(createElement(DgtlOverview));
    for (const sample of [
      "72%",
      "18.4K",
      "1,284",
      "4,836",
      "Sample growth score",
      "Sample report",
      "Rage clicks",
      "recharts",
    ]) {
      expect(html).not.toContain(sample);
    }
  });
});
