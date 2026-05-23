import React from "react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NavBar from "./NavBar";

describe("NavBar", () => {
  it("renders all habit page links", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /coding/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /physical/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /mental health/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /achievements/i }),
    ).toBeInTheDocument();
  });

  it("links have correct hrefs", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /coding/i })).toHaveAttribute(
      "href",
      "/coding",
    );
    expect(screen.getByRole("link", { name: /physical/i })).toHaveAttribute(
      "href",
      "/physical",
    );
    expect(
      screen.getByRole("link", { name: /mental health/i }),
    ).toHaveAttribute("href", "/mental");
    expect(screen.getByRole("link", { name: /achievements/i })).toHaveAttribute(
      "href",
      "/achievements",
    );
  });
});
