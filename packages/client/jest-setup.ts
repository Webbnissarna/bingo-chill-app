/* eslint-disable import/no-extraneous-dependencies */

// This file is run after jest env is initialized, before any tests
import "@testing-library/jest-dom";
import ReactMarkdown from "./mocks/react-markdown";
import * as nanoid from "./mocks/nanoid";

jest.mock("react-markdown", () => ReactMarkdown);
jest.mock("nanoid", () => nanoid);
jest.mock("rehype-raw", () => null);
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
jest.mock("figlet", () => {
  return {
    parseFont: jest.fn(),
    text: (
      _text: string,
      _options: unknown,
      callback: (idk: null, res: string) => void,
    ) => {
      callback(null, "");
    },
  };
});
jest.mock("figlet/importable-fonts/Blocks", () => null);
global.fetch = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
  });
});
