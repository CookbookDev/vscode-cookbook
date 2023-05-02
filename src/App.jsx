import React, { useCallback, useEffect, useState } from "react";
import { ContractCard } from "./ContractCard";

export default function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);

  const getContracts = useCallback(async () => {
    const res = await axios.post("/contracts/search", {
      search,
      sort: "popular",
      filter: "",
      page: 1,
      plugin: true,
    });
    // track("Remix: search", { query: search }, userData);
    setContracts(res.data.contracts);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const debounceSearch = setTimeout(async () => {
      try {
        getContracts();
      } catch (error) {
        console.error(error);
      }
    }, 200); // debounce time in milliseconds

    return () => clearTimeout(debounceSearch);
  }, [getContracts]);

  return (
    <div className="p-3">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a
          href="https://www.cookbook.dev?utm=remix"
          target="_blank"
          rel="noreferrer noopener"
          style={{
            display: "flex",
            gap: "8px",
            textDecoration: "none",
            marginBottom: "20px",
          }}
        >
          <img src="/logo.svg" width={45} height={45} alt="Cookbook logo" />
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              width: "100%",
              alignSelf: "flex-end",
            }}
          >
            Cookbook.dev
          </div>
        </a>
        <div style={{ display: "flex", gap: "5px", marginTop: "20px", marginBottom: "10px" }}>
          <img
            src="/discord.svg"
            width={15}
            height={15}
            onClick={() => {
              // track("Remix: Discord Opened", {}, userData);
              window.open("https://discord.gg/WzsfPcfHrk");
            }}
            style={{ cursor: "pointer", zIndex: 20000000 }}
          />
        </div>
      </div>

      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="inputGroup-sizing-default">
            Search
          </span>
        </div>
        <input
          type="text"
          class="form-control"
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          onChange={(e) => {
            setSearch(e.target.value);
            setLoading(true);
          }}
          value={search}
        />
      </div>
      {loading ? (
        <div className="card-text text-muted">Searching...</div>
      ) : Boolean(contracts.length) ? (
        contracts.map((contract) => <ContractCard key={contract.address} contract={contract} theme={theme} />)
      ) : (
        <div>No contracts found</div>
      )}
    </div>
  );
}
