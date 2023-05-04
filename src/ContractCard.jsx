import React, { useState } from "react";
import styled from "styled-components";
import Badge from "./green-badge-icon.png";

export const ContractCard = ({ contract }) => {
  const [opening, setOpening] = useState(false);

  return (
    <Card key={contract.address} className="card mb-2 hover-overlay">
      <div className="card-body">
        <div
          style={{ marginBottom: "20px" }}
          onClick={() => {
            setOpening(true);
          }}
        >
          <h6
            className="card-title"
            style={{
              lineHeight: "1.4",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "white",
            }}
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
              // track("Remix: open cookbook", { contract: contract.address }, userData);
            }}
            href={`https://www.cookbook.dev/contracts/${contract.address}?utm=vscode`}
            target="_blank"
            rel="noreferrer noopener"
            style={{ fontSize: "small", color: "white" }}
          >
            View Docs and Stats
          </a>
          {contract.audit ? (
            <div
              className="card-text text-muted"
              style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "5px" }}
            >
              <img src={Badge} width={15} height={15} alt="audited badge" />
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

const Truncate = styled.div`
  width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
`;

const Card = styled.div`
  transition: all 0.1s linear;
  cursor: pointer;
  background-color: var(--vscode-input-background);
  &:hover {
    background-color: var(--vscode-button-hoverBackground);
  }
`;
