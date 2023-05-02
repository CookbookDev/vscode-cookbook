import React, { useState } from "react";

export const ContractCard = ({ contract, theme }) => {
  const [opening, setOpening] = useState(false);

  return (
    <Card key={contract.address} className="card mb-2 hover-overlay" theme={theme}>
      <div className="card-body">
        <div
          style={{ marginBottom: "20px" }}
          onClick={() => {
            setOpening(true);
            // track("Remix: contract opened", { contract: contract.address, contractId: contract._id }, userData);
            client.openContract(contract.address).then(() => {
              setTimeout(() => {
                setOpening(false);
              }, 1000);
            });
          }}
        >
          <h6
            className="card-title"
            style={{ lineHeight: "1.4", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px" }}
          >
            {contract.name}
          </h6>
          <p
            className="card-text text-muted"
            style={{
              fontSize: "10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginBottom: "20px",
              marginTop: "10px",
            }}
          >
            {contract.picture && <img src={contract.picture} width={15} height={15} style={{ borderRadius: "10px" }} />}
            <Truncate>{contract.author}</Truncate>
          </p>

          <p className="card-text text-muted" style={{ marginTop: "20px", marginBottom: "20px" }}>
            {contract.simpleDescription}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a
            onClick={(e) => {
              e.stopPropagation();
              // track("Remix: open cookbook", { contract: contract.address }, userData);
            }}
            href={`https://www.cookbook.dev/contracts/${contract.address}?utm=remix`}
            target="_blank"
            rel="noreferrer noopener"
            style={{ fontSize: "small" }}
          >
            View Docs and Stats
          </a>
          {contract.audit ? (
            <div
              className="card-text text-muted"
              style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "5px" }}
            >
              {/* <Image src="/img/green-badge-icon.svg" width={15} height={15} alt="audited badge" /> */}
              Audited
            </div>
          ) : (
            <div />
          )}
        </div>
        {opening && <div>Opening...</div>}
      </div>
    </Card>
  );
};
