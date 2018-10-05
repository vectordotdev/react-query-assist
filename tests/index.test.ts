import test, { ExecutionContext } from "ava";
import { mount, ReactWrapper } from "enzyme";
import React from "react";
import QueryAssist from "../src";
import { mockAttributes, simulateExtra } from "./helpers";

interface ICustomContext {
  wrapper: ReactWrapper<{}, {}, React.Component<{}, {}, any>>;
}

type Context = ExecutionContext<ICustomContext>;

test.beforeEach((t: Context) => {
  t.context.wrapper = mount(data as QueryAssist= {mockAttributes} / > );
  simulateExtra(t.context.wrapper);
});

test("closed at start", (t: Context) => {
  const { wrapper } = t.context;
  t.deepEqual(wrapper.state("attributes"), mockAttributes);
  t.is(wrapper.state("overlayComponents").length, 2);
  t.false(wrapper.state("dropdownOpen"));
});

test("opens when search is focused", (t: Context) => {
  const { wrapper } = t.context;
  wrapper.instance().onFocus();
  t.true(wrapper.state("dropdownOpen"));
});

test("remains open when typing an attribute", (t: Context) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("lev");
  t.true(wrapper.state("dropdownOpen"));
  t.is(wrapper.state("dropdownValue"), "lev");
  t.is(wrapper.state("overlayComponents")[0].length, 0);
});

test("closes after selecting suggestion", (t: Context) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("level:i");
  wrapper.instance().onSelectValue("level:info");
  t.true(wrapper.state("dropdownClosed"));
  t.false(wrapper.state("dropdownOpen"));
});

test("closes when navigating with arrow keys", (t: Context) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("lev");
  t.true(wrapper.state("dropdownOpen"));
  wrapper.simulateKey(37);
  t.false(wrapper.state("dropdownOpen"));
});

test("opens with new word", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("level:info ");
  t.true(wrapper.state("dropdownOpen"));
  t.is(wrapper.state("dropdownValue"), "");
});

test("opens at end of existing token", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("foobar level:error level:info bazqux", 29);
  t.true(wrapper.state("dropdownOpen"));
  t.is(wrapper.state("dropdownValue"), "level:info");
});

test("does not open at the end of invalid token", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("foo:bar");
  t.false(wrapper.state("dropdownOpen"));
  t.is(wrapper.state("dropdownValue"), "foo:bar");
});

test("opens at end of partial token", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("level:");
  t.true(wrapper.state("dropdownOpen"));
  t.is(wrapper.state("dropdownValue"), "level:");
});

test("opens at end of wildcard token", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("level:in*");
  t.true(wrapper.state("dropdownOpen"));
});

test("opens at end of quoted token", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping('other:"foo bar"');
  t.true(wrapper.state("dropdownOpen"));
  // with wildcard
  wrapper.simulateTyping('other:"foo bar*"');
  t.true(wrapper.state("dropdownOpen"));
});

test("does not reopen for word when manually closed", (t) => {
  const { wrapper } = t.context;
  // opens and closes with esc key
  wrapper.simulateTyping("lev");
  t.true(wrapper.state("dropdownOpen"));
  wrapper.instance().onClose(true);
  t.false(wrapper.state("dropdownOpen"));
  // doesn't reopen for word
  wrapper.simulateTyping("level");
  t.false(wrapper.state("dropdownOpen"));
  // reopens with new word
  wrapper.simulateTyping("level ");
  t.true(wrapper.state("dropdownOpen"));
});

test("closes dropdown when there is no attribute match", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("foobar baz");
  t.false(wrapper.state("dropdownOpen"));
});

test("does not open when data attribute changes", (t) => {
  const attributes = [];
  const wrapper = mount(data as QueryAssist= {attributes} / > );
  t.false(wrapper.state("dropdownOpen"));
  wrapper.setProps({ data: mockAttributes });
  t.false(wrapper.state("dropdownOpen"));
});

test("highlights valid tokens in the query", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping(
    "foo level:info level:foo bar " +
    '(foo:bar OR other:"foo bar") ' +
    "other:a* http_response:400 baz http_response:>600");
  const overlay = wrapper.state("overlayComponents");
  const content = overlay[1].props.children;
  t.is(content[0], "foo ");
  t.is(content[1].props.children, "level:info");
  t.is(content[2], " level:foo bar (foo:bar OR ");
  t.is(content[3].props.children, 'other:"foo bar"');
  t.is(content[4], ") ");
  t.is(content[5].props.children, "other:a*");
  t.is(content[6], " ");
  t.is(content[7].props.children, "http_response:400");
  t.is(content[8], " baz http_response:>600");
});

test("inserts selected value at end of query", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("foobar ");
  wrapper.instance().onSelectValue("level:info", " ");
  t.is(wrapper.state("value"), "foobar level:info ");
});

test("inserts selected value in middle of query", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("foobar le other:foo", 9);
  wrapper.instance().onSelectValue("level", ":");
  t.is(wrapper.state("value"), "foobar level: other:foo");
});

test("alters existing token in query with parens", (t) => {
  const { wrapper } = t.context;
  wrapper.simulateTyping("foobar (level:info other:foo)", 18);
  wrapper.instance().onSelectValue("-level:error");
  t.is(wrapper.state("value"), "foobar (-level:error other:foo)");
});

// figure out how to test dropdown position,
// jsdom doesn't currently support node.offsetLeft?
test.todo("dropdown location");

// make sure they all get implemented correctly
test.todo("custom styles with styled-system props");

test.todo("defaultValue changes");
test.todo("listening to changes with onChange");
test.todo("textarea collapses on blur");
test.todo("passing in nameKey");
test.todo("adjusting scroll when using arrow keys");
test.todo("splits up overlay correctly");
