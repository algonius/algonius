import React from 'react';
import { describe, expect, it } from "@jest/globals"
import { render, act } from "@testing-library/react"
import HelloContent from "~ui/components/hello"


describe("test contents/hello", () => {
  it("should render", async () => {
    let renderResult;
    await act(async () => {
      renderResult = render(<HelloContent />);
    });
    expect(renderResult.getByText("Hello")).toBeTruthy();
  })
}) 
