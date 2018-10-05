import * as React from "react";
import { compareFuzzy } from "../utils/compare";
import { parseToken, serializeToken } from "../utils/token";

import {
  Container,
  Helper,
  Key,
  KeyOutline,
  Operator,
  OperatorLone,
  Operators,
  Section,
  Suggestion,
  Suggestions,
} from "./dropdown.styl";

interface IState {
  suggestions: string[];
  highlightedIdx: number;
  selectedIdx: number | null;
  prepended?: string;
  operator: string;
  negated: boolean;
}

export default class extends React.PureComponent<IDropdownProps, IState> {
  public static defaultProps = { // eslint-disable-line
    value: "",
    nameKey: "name",
    onSelect: () => ({}),
    onClose: () => ({}),
    keyboardHelpers: true,
    footerComponent: () => null,
  };

  constructor(props: IDropdownProps) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handleEscKey = this.handleEscKey.bind(this);
    this.handleArrowKeys = this.handleArrowKeys.bind(this);
    this.adjustListScroll = this.adjustListScroll.bind(this);
    this.getAttribute = this.getAttribute.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getSuggestionAddons = this.getSuggestionAddons.bind(this);
    this.filterSuggestions = this.filterSuggestions.bind(this);
    this.acceptSuggestion = this.acceptSuggestion.bind(this);
    this.getOperators = this.getOperators.bind(this);
    this.setOperator = this.setOperator.bind(this);
    this.state = {
      suggestions: [],
      highlightedIdx: 0,
      selectedIdx: null,
      prepended: "",
      operator: "",
      negated: false,
    };
  }

  public componentDidMount() {
    const { value, keyboardHelpers } = this.props;

    this.filterSuggestions(value);

    if (keyboardHelpers) {
      document.addEventListener("keydown", this.onKeyDown, false);
    }
  }

  public componentWillUnmount() {
    const { keyboardHelpers } = this.props;

    if (keyboardHelpers) {
      document.removeEventListener("keydown", this.onKeyDown, false);
    }
  }

  public componentWillReceiveProps(nextProps: IDropdownProps) {
    if (this.props.value !== nextProps.value) {
      this.filterSuggestions(nextProps.value);
    }
  }

  public componentDidUpdate() {
    if (this.state.suggestions.length === 0) {
      this.props.onClose();
    }
  }

  public onKeyDown(evt: KeyboardEvent) {
    switch (evt.keyCode) {
      case 9: // tab key
      case 13: // enter key
        this.handleEnterKey(evt);
        break;
      case 27: // esc key
        this.handleEscKey(evt);
        break;
      case 38: // up key
      case 40: // down key
        this.handleArrowKeys(evt, evt.keyCode);
        break;
    }
  }

  public handleEnterKey(evt: KeyboardEvent) {
    evt.preventDefault();
    this.acceptSuggestion();
  }

  public handleEscKey(evt: KeyboardEvent) {
    evt.preventDefault();
    this.props.onClose(true);
  }

  public handleArrowKeys(evt: KeyboardEvent, keyCode: number) {
    evt.preventDefault();

    const { highlightedIdx } = this.state;
    const isDownKey = keyCode === 40;

    // the furthest down it can go before wrapping
    const max = this.state.suggestions.length - 1;

    // determine the next position
    const newIdx = highlightedIdx !== null
      ? isDownKey ? highlightedIdx + 1 : highlightedIdx - 1
      : isDownKey ? 0 : max;

    this.setState({
      // make sure it doesn't go out of bounds by resetting to opposite side
      highlightedIdx: isDownKey
        ? newIdx <= max ? newIdx : 0
        : newIdx >= 0 ? newIdx : max,
    }, this.adjustListScroll);
  }

  public adjustListScroll() {
    const {
      offsetTop,
      clientHeight: selectorHeight,
    } = this._selected;

    const {
      scrollTop,
      clientHeight: listHeight,
    } = this._list;

    const topWaypoint = selectorHeight;
    const bottomWaypoint = listHeight - selectorHeight;
    const position = offsetTop - scrollTop;

    if (position > bottomWaypoint) {
      this._list.scrollTop += selectorHeight + (position - bottomWaypoint);
    } else if (position < topWaypoint) {
      this._list.scrollTop = offsetTop - selectorHeight + (position - topWaypoint);
    }
  }

  public getAttribute(selectedIdx: number) {
    if (selectedIdx !== null && selectedIdx > -1) {
      return this.props.attributes[selectedIdx];
    }
  }

  public getSuggestions(attribute) {
    const {
      nameKey,
      attributes,
    } = this.props;

    return attribute
      ? attribute.enumerations || []
      : attributes.map((attr) => attr[nameKey]);
  }

  public getSuggestionAddons(attribute, parsed) {
    const addons = [];

    if (attribute) {
      if (
        !parsed.wildcard &&
        !attribute.enumerations &&
        parsed.attributeValue &&
        attribute.type === "string"
      ) {
        addons.push(`"${parsed.attributeValue}"`);
      }

      if (
        parsed.attributeValue &&
        attribute.type === "string"
      ) {
        parsed.quoted && !attribute.enumerations
          ? addons.push(`"${parsed.attributeValue}*"`)
          : addons.push(`${parsed.attributeValue}*`);
      }
    }

    return addons;
  }

  public filterSuggestions(value) {
    const {
      nameKey,
      attributes,
    } = this.props;

    const parsed = parseToken(value);

    const hasAttributeName = parsed.attributeName && value.indexOf(":") > -1;
    const selectedIdx = hasAttributeName ? attributes
      .findIndex((attr) => attr[nameKey] === parsed.attributeName) : -1;

    const attribute = this.getAttribute(selectedIdx);
    const suggestions = this.getSuggestions(attribute);
    const searchValue = selectedIdx > -1 ? parsed.attributeValue : parsed.attributeName;

    const filtered = suggestions
      .filter((v) => compareFuzzy(searchValue, v))
      .concat(this.getSuggestionAddons(attribute, parsed));

    this.setState({
      selectedIdx,
      prepended: parsed.prepended,
      operator: parsed.operator,
      negated: parsed.negated,
      suggestions: filtered,
      highlightedIdx: 0,
    });
  }

  public acceptSuggestion() {
    const {
      nameKey,
      onSelect,
    } = this.props;

    const {
      suggestions,
      highlightedIdx,
      selectedIdx,
      prepended,
      operator,
    } = this.state;

    const attribute = this.getAttribute(selectedIdx);
    const suggestion = suggestions[highlightedIdx];

    const newValue = attribute
      ? `${attribute[nameKey]}:${operator}${suggestion}`
      : suggestion;

    const appended = selectedIdx === -1 ? ":" : "";
    onSelect(`${prepended}${newValue}`, appended);
  }

  public getOperators() {
    const operators = [];
    const attribute = this.getAttribute(this.state.selectedIdx);

    if (attribute) {
      switch (attribute.type) {
        case "int":
        case "float":
          operators.push({ name: "GT", char: ">", active: this.state.operator === ">" });
          operators.push({ name: "LT", char: "<", active: this.state.operator === "<" });
          operators.push({ name: "GTE", char: ">=", active: this.state.operator === ">=" });
          operators.push({ name: "LTE", char: "<=", active: this.state.operator === "<=" });
          break;
      }
    }

    return operators;
  }

  public setOperator(newOperator) {
    const {
      value,
    } = this.props;

    const {
      negated,
      operator,
    } = this.state;

    if (newOperator === "-") {
      const newValue = value
        .replace(/^-?(.*)/, `${negated ? "" : "-"}$1`);

      this.props.onSelect(newValue);
    } else {
      const token = parseToken(value);
      token.operator = operator === newOperator ? "" : newOperator;

      this.props.onSelect(serializeToken(token));
    }
  }

  public render() {
    const Footer = this.props.footerComponent;

    return (
      <Container
        left={this.props.offsetX || 0}
        top={this.props.offsetY || 0}
        {...this.props.dropdownProps}>
        <Suggestions
          {...this.props.listProps}
          innerRef={(ref) => (this._list = ref)}>
          {this.state.suggestions.map((suggestion, key) => {
            const isActive = this.state.highlightedIdx === key;

            return (
              <Suggestion
                key={key}
                active={isActive}
                onClick={this.acceptSuggestion}
                onMouseOver={() => this.setState({ highlightedIdx: key })}
                innerRef={isActive ? (ref) => (this._selected = ref) : undefined}
                {...this.props.selectorProps}>
                {suggestion}
              </Suggestion>
            );
          })}
        </Suggestions>

        <Operators>
          <OperatorLone
            active={this.state.negated}
            onClick={() => this.setOperator("-")}>
            <Key>-</Key>
            NEGATE
          </OperatorLone>

          {this.getOperators().map((operator, key) =>
            <Operator
              key={key}
              active={operator.active}
              onClick={() => this.setOperator(operator.char)}>
              <Key>{operator.char}</Key>
              {operator.name}
            </Operator>)}
        </Operators>

        {this.props.keyboardHelpers &&
          <Section center>
            <Helper>
              <KeyOutline>▲</KeyOutline>
              <KeyOutline>▼</KeyOutline>
              to navigate
            </Helper>

            <Helper>
              <KeyOutline long>↵</KeyOutline>
              to select
            </Helper>
          </Section>}

        <Footer />
      </Container>
    );
  }
}
