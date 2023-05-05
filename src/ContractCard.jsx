import React, { useState } from "react";
import styled from "styled-components";
import Badge from "./green-badge-icon.png";

const vscode = acquireVsCodeApi();

export const ContractCard = ({ contract }) => {
  const [opening, setOpening] = useState(false);

  return (
    <Card key={contract.address} className="card mb-2 hover-overlay">
      <div className="card-body">
        <div
          style={{ marginBottom: "20px" }}
          onClick={() => {
            setOpening(true);
            vscode.postMessage({
              command: "open",
              data: { address: contract.address, mainFile: contract.mainFile },
            });
            setTimeout(() => {
              setOpening(false);
            }, 2000);
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
            }}
          >
            {contract.name}
          </h6>
          <p
            className="card-text"
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

          <p className="card-text " style={{ marginTop: "20px", marginBottom: "20px", opacity: 0.8 }}>
            {contract.simpleDescription}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <DocLink
            onClick={(e) => {
              // track("Remix: open cookbook", { contract: contract.address }, userData);
            }}
            href={`https://www.cookbook.dev/contracts/${contract.address}?utm=vscode`}
            target="_blank"
            rel="noreferrer noopener"
          >
            View Docs and Stats
          </DocLink>
          {contract.audit ? (
            <div className="card-text " style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
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
  color: "var(--vscode-input-foreground)";
`;

const Card = styled.div`
  transition: all 0.1s linear;
  cursor: pointer;
  background-color: var(--vscode-input-background);
  &:hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }
`;

const DocLink = styled.a`
  font-size: small;
  color: var(--vscode-input-foreground);
  opacity: 0.8;
  &:hover {
    color: var(--vscode-input-foreground);
    opacity: 1;
  }
`;
