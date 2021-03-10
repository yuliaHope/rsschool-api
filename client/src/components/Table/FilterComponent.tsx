import React, { memo } from 'react';
import { Space, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { COLUMNS_TYPES } from 'components/Schedule/model';

type Props = {
  handleFilter: (event: CheckboxChangeEvent) => void;
  hiddenColumnsRows: Array<string>;
  eventTypes: Array<string>;
};

const FilterComponent: React.FC<Props> = ({ hiddenColumnsRows, eventTypes, handleFilter }) => {
  localStorage.setItem('settingsTypesAndColumns', JSON.stringify(hiddenColumnsRows));
  const renderColumns = COLUMNS_TYPES.map((el, ind) => {
    return (
      <Checkbox key={`${ind}_${el}`} value={el} checked={!hiddenColumnsRows.includes(el)} onChange={handleFilter}>
        {el}
      </Checkbox>
    );
  });

  const renderTypes = eventTypes.map((el, ind) => {
    return (
      <Checkbox key={`${ind}_${el}`} value={el} checked={!hiddenColumnsRows.includes(el)} onChange={handleFilter}>
        {el}
      </Checkbox>
    );
  });

  return (
    <Space style={{ alignItems: 'flex-start' }}>
      <Space direction="vertical">
        <span style={{ fontWeight: 'bold' }}>Columns</span>
        {renderColumns}
      </Space>
      {eventTypes.length !== 0 ? (
        <Space direction="vertical">
          <span style={{ fontWeight: 'bold' }}>Types</span>
          {renderTypes}
        </Space>
      ) : null}
    </Space>
  );
};

export default memo(FilterComponent);
