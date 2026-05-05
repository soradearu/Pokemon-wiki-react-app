// src/App.test.jsx

import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

global.fetch = jest.fn();

const mockPokemonList = {
  next: "https://pokeapi.co/api/v2/pokemon?limit=20&offset=20",
  results: [
    {
      name: "pikachu",
      url: "https://pokeapi.co/api/v2/pokemon/pikachu",
    },
  ],
};

const mockPokemonDetails = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  types: [
    {
      type: {
        name: "electric",
      },
    },
  ],
  stats: [
    {
      stat: { name: "hp" },
      base_stat: 35,
    },
  ],
  sprites: {
    front_default: "pikachu.png",
    other: {
      dream_world: {
        front_default: "pikachu-dream.png",
      },
    },
  },
};

beforeEach(() => {
  fetch.mockImplementation((url) => {
    if (url.includes("?limit=20")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPokemonList),
      });
    }

    if (url.includes("pikachu")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetails),
      });
    }

    return Promise.reject(new Error("Unknown API request"));
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("App", () => {
  test("renders app title", () => {
    render(<App />);

    const title = screen.getByText(/pokemon wiki/i);

    expect(title).toBeInTheDocument();
  });

  test("renders pokemon after fetch", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });

  test("renders load more button", () => {
    render(<App />);

    const button = screen.getByRole("button", {
      name: /more pokemons/i,
    });

    expect(button).toBeInTheDocument();
  });

  test("calls fetch API", async () => {
    render(<App />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});
