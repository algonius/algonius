// src/config/load.test.ts

import { describe, expect, it, jest } from "@jest/globals"
import { loadConfig } from "./load";
import { defaultAppConfig } from "./default";
import { Storage } from "@plasmohq/storage";

describe("loadConfig", () => {
  it("should load and merge config from storage", async () => {
    const mockStorage = new Storage();
    const spy = jest.spyOn(mockStorage, "get");
    spy.mockImplementation(() => Promise.resolve(JSON.stringify({
      someKey: "someValue",
    })));

    const config = await loadConfig(mockStorage);

    expect(config).toEqual({
      ...defaultAppConfig,
      someKey: "someValue",
    });

    expect(spy).toHaveBeenCalledWith("appConfig");
  });
}); 
