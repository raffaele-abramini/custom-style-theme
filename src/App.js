import React, { useState, useEffect } from "react";
import "./styles.css";
import styled from "@emotion/styled";
import { applyFromTheme } from "./themeHelpers";

// TODO
// - [x] Support comma
// - [x] Add memo
// - [x] Better css support
// - [] Better TS support

const customTheme = {
  Button: {
    // direct css rules
    borderRadius: "4px",

    // nested css rules
    span: {
      fontWeight: "bold"
    },

    // prop-based rules
    ".variant_primary.size_small": {
      color: "yellow"
    },
    ".variant_primary, .variant_secondary": {
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

  // This is here just to test performances ⬇️
  // useEffect(() => {
  //   setTimeout(() => setId(id + 1), 1000);
  // }, [id]);

  return (
    <div className="App">
      <Button variant="primary" id={id}>
        <span>Primary</span>
      </Button>
      <Button variant="primary" size="small" id={id}>
        <span>Primary small</span>
      </Button>
      <Button variant="secondary" id={id}>
        <span>Secondary</span>
      </Button>
    </div>
  );
}
