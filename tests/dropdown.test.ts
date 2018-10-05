import test from "ava";
import { mount } from "enzyme";
import React from "react";
import sinon from "sinon";
import Dropdown from "../src/components/dropdown";
import { mockAttributes, simulateExtra } from "./helpers";

test.beforeEach((t) => {
  t.context.onSelect = sinon.spy();
  t.context.wrapper = mount(
    attributes as Dropdown= {mockAttributes}
      onSelect = {t.context.onSelect} / > ,
  );
  simulateExtra(t.context.wrapper);
});

test("basic filtering", (t) => {
  const { wrapper } = t.context;
  t.is(wrapper.state("suggestions").length, 3);
  wrapper.setProps({ value: "lev" });
  t.is(wrapper.state("suggestions").length, 1);
  t.is(wrapper.state("suggestions")[0], "level");
});

test("no more suggestions", (t) => {
  const { wrapper } = t.context;
  wrapper.setProps({ value: "levv" });
  t.is(wrapper.state("suggestions").length, 0);
});

test("shows enumerations for selected attribute", (t) => {
  const { wrapper } = t.context;
  wrapper.setProps({ value: "level:" });
  t.is(wrapper.state("suggestions").length, 2);
  t.is(wrapper.state("suggestions")[0], "info");
  t.is(wrapper.state("selectedIdx"), 0);
});

test("adds wildcard suggestion with enums", (t) => {
  const { wrapper } = t.context;
  wrapper.setProps({ value: "level:i" });
  t.is(wrapper.state("suggestions").length, 2);
  t.is(wrapper.state("suggestions")[1], "i*");
});

test("addon suggestions when no enumerations", (t) => {
  const { wrapper } = t.context;
  wrapper.setProps({ value: "other:" });
  t.is(wrapper.state("suggestions").length, 0);
  t.is(wrapper.state("selectedIdx"), 2);
  wrapper.setProps({ value: "other:foo" });
  t.is(wrapper.state("suggestions")[0], '"foo"');
  t.is(wrapper.state("suggestions")[1], "foo*");
});

test("suggests wildcard insite quotes", (t) => {
  const { wrapper } = t.context;
  wrapper.setProps({ value: 'other:"foo b"' });
  t.is(wrapper.state("suggestions").length, 2);
  t.is(wrapper.state("suggestions")[0], '"foo b"');
  t.is(wrapper.state("suggestions")[1], '"foo b*"');
  wrapper.setProps({ value: 'other:"foo b*"' });
  t.is(wrapper.state("suggestions").length, 1);
  t.is(wrapper.state("suggestions")[0], '"foo b*"');
});

test("detects negation and operator", (t) => {
  const { wrapper } = t.context;
  wrapper.setProps({ value: "-response:>=400" });
  t.true(wrapper.state("negated"));
  t.is(wrapper.state("prepended"), "-");
  t.is(wrapper.state("operator"), ">=");
});

test("navigates with keyboard", (t) => {
  const { wrapper } = t.context;
  t.is(wrapper.state("highlightedIdx"), 0);
  wrapper.simulateKey(40);
  t.is(wrapper.state("highlightedIdx"), 1);
  wrapper.simulateKey(40);
  t.is(wrapper.state("highlightedIdx"), 2);
  wrapper.simulateKey(40);
  t.is(wrapper.state("highlightedIdx"), 0);
  wrapper.simulateKey(38);
  t.is(wrapper.state("highlightedIdx"), 2);
});

test("shows correct operators for type", (t) => {
  const { wrapper } = t.context;
  // number attribute
  wrapper.setProps({ value: "http_response:" });
  t.is(wrapper.instance().getOperators().length, 4);
  // string attribute
  wrapper.setProps({ value: "level:" });
  t.is(wrapper.instance().getOperators().length, 0);
});

test("suggestion is selected for attribute/value", (t) => {
  const { wrapper, onSelect } = t.context;
  t.false(onSelect.called);
  // selecting attribute
  wrapper.simulateKey(13);
  t.true(onSelect.firstCall.calledWith("level", ":"));
  wrapper.setProps({ value: "level:" });
  // selecting value
  wrapper.simulateKey(13);
  t.true(onSelect.secondCall.calledWith("level:info"));
});

test("negation is toggled", (t) => {
  const { wrapper, onSelect } = t.context;
  // has no value yet
  wrapper.instance().setOperator("-");
  t.true(onSelect.firstCall.calledWith("-"));
  // has a value, make sure it prepends
  wrapper.setProps({ value: "level" });
  wrapper.instance().setOperator("-");
  t.true(onSelect.secondCall.calledWith("-level"));
});

test("number operator is toggled", (t) => {
  const { wrapper, onSelect } = t.context;
  // toggle on
  wrapper.setProps({ value: "http_response:400" });
  wrapper.instance().setOperator(">=");
  t.true(onSelect.firstCall.calledWith("http_response:>=400"));
  // toggle off
  wrapper.setProps({ value: "http_response:>=400" });
  wrapper.instance().setOperator(">=");
  t.true(onSelect.secondCall.calledWith("http_response:400"));
});
