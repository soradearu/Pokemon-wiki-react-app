// src/App.jsx

import { useEffect, useState, useCallback } from "react";
import PokemonThumbnail from "./Components/PokemonThumbnail";

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=20";

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [nextUrl, setNextUrl] = useState(API_URL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPokemons = useCallback(async () => {
    if (!nextUrl || loading) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(nextUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch Pokémon list");
      }

      const data = await response.json();

      setNextUrl(data.next);

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const response = await fetch(pokemon.url);

          if (!response.ok) {
            throw new Error(`Failed to fetch ${pokemon.name}`);
          }

          return response.json();
        })
      );

      setPokemons((prev) => [...prev, ...pokemonDetails]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [nextUrl, loading]);

  useEffect(() => {
    fetchPokemons();
  }, []);

  return (
    <div className="app-container">
      <h1>💜 Pokemon Wiki 💜</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="pokemon-container">
        <div className="all-container">
          {pokemons.map((pokemon) => (
            <PokemonThumbnail
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              image={
                pokemon.sprites.other?.dream_world?.front_default ||
                pokemon.sprites.other?.official-artwork?.front_default ||
                pokemon.sprites.front_default
              }
              type={pokemon.types[0]?.type?.name}
              height={pokemon.height}
              weight={pokemon.weight}
              stats={pokemon.stats}
            />
          ))}
        </div>

        {nextUrl && (
          <button
            className="button-paper"
            onClick={fetchPokemons}
            disabled={loading}
          >
            {loading ? "Loading..." : "More Pokemons"}
          </button>
        )}
      </div>

      <div className="name">
        <h4>Made with ♥ by Fairydevmother</h4>
      </div>
    </div>
  );
}
