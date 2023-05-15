import React, { useCallback, useState } from "react";
import styled from "styled-components";
import Badge from "./green-badge-icon.png";

export const ContractCard = ({ contract, vscode }) => {
  const [opening, setOpening] = useState(false);

  const track = useCallback(
    (metric, data) => {
      vscode.postMessage({
        command: "track",
        data: { metric, data },
      });
    },
    [vscode]
  );

  return (
    <Card key={contract.address} className="card mb-2 hover-overlay">
      <div className="card-body">
        <div
          style={{ marginBottom: "10px" }}
          onClick={() => {
            setOpening(true);
            track("VScode: contract opened", {
              contract: contract.address,
              contractId: contract._id,
            });
            vscode.postMessage({
              command: "open",
              data: { address: contract.address, mainFile: contract.mainFile },
            });
            setTimeout(() => {
              setOpening(false);
            }, 4000);
          }}
        >
          <h6
            className="card-title"
            style={{
              lineHeight: "1.4",
              fontWeight: "bold",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {contract.name}
          </h6>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <a
              onClick={(e) => {
                track("VScode: open cookbook", { contract: contract.address });
                e.stopPropagation();
              }}
              href={`https://www.cookbook.dev/projects/${contract.author}`}
              target="_blank"
              rel="noreferrer noopener"
              className="card-text"
              style={{
                fontSize: "10px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginTop: "5px",
                textDecorationColor: "var(--vscode-input-foreground)",
              }}
            >
              {contract.picture && (
                <img
                  src={contract.picture}
                  width={15}
                  height={15}
                  style={{ borderRadius: "10px" }}
                />
              )}
              <Truncate>{contract.author}</Truncate>
            </a>
            <Stars>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="15"
                viewBox="0 0 17 17"
                version="1.1"
                width="15"
                fill="currentColor"
              >
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 "></path>
              </svg>
              {contract.total || 0}
            </Stars>
          </div>

          <p className="card-text " style={{ marginTop: "10px", opacity: 0.8 }}>
            {contract.simpleDescription}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <DocLink
            onClick={(e) => {
              track("VScode: open cookbook", { contract: contract.address });
            }}
            href={`https://www.cookbook.dev/contracts/${contract.address}?utm=vscode`}
            target="_blank"
            rel="noreferrer noopener"
          >
            View Docs and Stats
          </DocLink>
          {contract.audit ? (
            <div
              className="card-text "
              style={{
                fontSize: "10px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
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
  width: 100%;
  color: var(--vscode-input-foreground);
  text-decoration-color: var(--vscode-input-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Card = styled.div`
  transition: all 0.1s linear;
  cursor: pointer;
  background-color: var(--vscode-input-background);
  &:hover {
    background-color: var(--vscode-button-Background);
  }
`;

const DocLink = styled.a`
  font-size: 10px;
  color: var(--vscode-input-foreground);
  opacity: 0.8;
  &:hover {
    color: var(--vscode-input-foreground);
    opacity: 1;
  }
`;

const Stars = styled.div`
  width: max-content;
  display: flex;
  justify-content: center;
  font-size: 8px;
  gap: 2px;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  border-radius: 5px;
  color: #1b9e70;
  border: solid 1px rgb(0, 0, 0, 0);
`;
