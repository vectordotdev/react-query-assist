import * as React from 'react';

export interface IPageClickProps {
  notify: (...params: any[]) => void;
  notifyOnTouchEnd?: boolean;
  outsideOnly?: boolean;
}


declare class PageClick extends React.Component<IPageClickProps, any> {}

export default PageClick;