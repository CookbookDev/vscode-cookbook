import React, { useState } from "react";
import styled from "styled-components";
import Badge from "./green-badge-icon.png";

export const ProtocolCard = ({ protocol, vscode, track }) => {
  const [opening, setOpening] = useState(false);

  return (
    <Card key={protocol.urlId} className="card mb-2 hover-overlay">
      <div className="card-body">
        <div
          style={{ marginBottom: "10px" }}
          onClick={() => {
            setOpening(true);
            track("VScode: protocol opened", {
              protocol: protocol.urlId,
              protocolId: protocol._id,
            });
            vscode.postMessage({
              command: "open",
              data: { urlId: protocol.urlId, type: "protocol" },
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
            {protocol.displayName}
          </h6>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
              width: "100%",
            }}
          >
            <a
              onClick={(e) => {
                track("VScode: open cookbook", { protocol: protocol.urlId });
                e.stopPropagation();
              }}
              href={`https://www.cookbook.dev/protocols/${protocol.project}`}
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
                width: "50%",
              }}
            >
              {protocol.displayImage && (
                <img src={protocol.displayImage} width={15} height={15} style={{ borderRadius: "10px" }} />
              )}
              <Truncate>{protocol.displayName}</Truncate>
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
              {protocol.total || 0}
            </Stars>
          </div>

          <p className="card-text " style={{ marginTop: "10px", opacity: 0.8 }}>
            {protocol.description}
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
              track("VScode: open cookbook", { protocol: protocol.urlId });
            }}
            href={`https://www.cookbook.dev/protocols/${protocol.urlId}?utm=vscode`}
            target="_blank"
            rel="noreferrer noopener"
          >
            View Docs and Stats
          </DocLink>
          {protocol.audits.length ? (
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
