import React from "react";

export default function Button({ action, className, text, disabled }) {
  return (
    <button className={className} onClick={action} disabled={disabled}>
      {text}
    </button>
  );
}
