// VirtualizedList.js
import React from 'react';
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items, renderRow }) => (
  <List
    height={600} // Adjust based on your layout
    itemCount={items.length}
    itemSize={120} // Adjust based on your item height
    width={'100%'}
  >
    {({ index, style }) => (
      <div style={style}>
        {renderRow(items[index])}
      </div>
    )}
  </List>
);

export default VirtualizedList;
