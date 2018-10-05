import * as React from 'react';

declare function clean<TPassedProps>(
  component: React.Component<TPassedProps>
): React.ComponentType<TPassedProps>;


export default clean;