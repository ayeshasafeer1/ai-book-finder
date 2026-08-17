import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AIRecommendations from "@/components/ai/AIRecommendations";

describe("AIRecommendations", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the AI discovery form", () => {
    render(<AIRecommendations />);

    expect(
      screen.getByRole("heading", { name: "Discover with AI" })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "e.g. a gothic romance with mystery"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Find with AI" })
    ).toBeInTheDocument();
  });

  it("disables the button when the input is empty", () => {
    render(<AIRecommendations />);

    const button = screen.getByRole("button", {
      name: "Find with AI",
    });

    expect(button).toBeDisabled();
  });

  it("displays recommendations after a successful request", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          recommendations: [
            {
              recommendation: {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                reason: "A classic romantic story.",
              },
              book: {
                id: 1342,
                title: "Pride and Prejudice",
                authors: [{ name: "Austen, Jane" }],
                formats: {},
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    render(<AIRecommendations />);

    const input = screen.getByPlaceholderText(
      "e.g. a gothic romance with mystery"
    );

    fireEvent.change(input, {
      target: {
        value: "I want a classic romantic novel",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Find with AI",
      })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Pride and Prejudice")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Jane Austen")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /View details for Pride and Prejudice/i,
      })
    ).toHaveAttribute("href", "/books/1342");
  });

  it("shows an error when the request fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: "Unable to generate recommendations.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    render(<AIRecommendations />);

    const input = screen.getByPlaceholderText(
      "e.g. a gothic romance with mystery"
    );

    fireEvent.change(input, {
      target: {
        value: "fantasy romance",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Find with AI",
      })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("alert")
      ).toHaveTextContent(
        "We couldn't generate recommendations right now. Please try again."
      );
    });
  });
});