import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { JSDOM } from "jsdom";

const {
  window,
} = new JSDOM("<!doctype html><html><body></body></html>");

global.window = window;
global.document = window.document;

Enzyme.configure({
  adapter: new Adapter(),
});

export const mockAttributes = [
  {
    name: "level",
    type: "string",
    enumerations: ["info", "error"],
  },
  {
    name: "http_response",
    type: "int",
    enumerations: [200, 400],
  },
  {
    name: "other",
    type: "string",
    enumerations: null,
  },
];

export function simulateExtra(wrapper) {
  wrapper.simulateKey = (code) => {
    wrapper.instance().onKeyDown({
      preventDefault: () => {},
      keyCode: code,
    });
  };

  wrapper.simulateTyping = (value = "", position) => {
    const textarea = wrapper.find("textarea");
    const newPos = position || value.length;

    textarea.simulate("change", { target: { value } });
    textarea.getDOMNode().setSelectionRange(newPos, newPos);
    textarea.simulate("focus");
  };
}
