declare interface IReactQueryAssistProps {
  className: string;
  debug: boolean;
  data: IQueryAssistData;
  nameKey: string;
  nameKeyIncludes: string[];
  defaultValue: string;
  placeholder: string;
  onChange: (value: string) => any;
  onSubmit: (value: string) => any;
  keyboardHelpers: boolean;
  collapseOnBlur: boolean;
  footerComponent: object;
  inputProps: object;
  dropdownProps: object;
  selectorProps: object;
  listProps: object;
}

declare interface IQueryAssistDataEntry {
  name: string;
  type?: string;
  enumerations?: string[] | null;
}

declare type IQueryAssistData = IQueryAssistDataEntry[];

declare interface IDropdownProps {
  value: string;
  nameKey: string;
  attributes: string[];
  onSelect: (value: string) => any;
  onClose: () => any;
  offsetX: number;
  offsetY: number;
  keyboardHelpers: boolean;
  footerComponent: boolean;
  dropdownProps: any;
  selectorProps: ISelectorProps;
  listProps: IListProps;
}

declare interface ISelectorProps {

}

declare interface IListProps {

}