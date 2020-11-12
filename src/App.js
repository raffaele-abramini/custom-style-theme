import React, { useState, useEffect } from "react";
import "./styles.css";
import styled from "@emotion/styled";
import { applyFromTheme } from "./helpers";

// TODO
// - [x] Support comma
// - [] Add memo

const customTheme = {
  Button: {
    borderRadius: "4px",

    // span: {
    //   fontWeight: "bold"
    // },

    "variant_primary.size_small": {
      color: "yellow"
    },
    "variant_primary, variant_secondary": {
      color: "red"
    }
  }
};

const Button = styled.button`
  display: block;
  border: none;
  margin: 5px;
  padding: 10px;
  // some styles here
  ${(p) =>
    p.size === "small" &&
    `
  font-size: 8px;
  `}
  ${(p) =>
    p.variant === "primary" &&
    `
  background: lightBlue; 
  `}
  ${(p) =>
    p.variant === "secondary" &&
    `
  background: orange;
  `}

  ${(p) => applyFromTheme(customTheme.Button, p)}
`;

export default function App() {
  const [id, setId] = useState(0);

  useEffect(() => {
    setTimeout(() => setId(id + 1), 1000);
  }, [id]);

  return (
    <div className="App">
      <Button variant="primary" id={id}>
        Primary
      </Button>
      <Button variant="primary" size="small" id={id}>
        Primary small
      </Button>
      <Button variant="secondary" id={id}>
        Secondary
      </Button>
    </div>
  );
}
