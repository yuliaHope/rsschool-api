import React, { memo } from 'react';
import { Space, Checkbox, Button } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { COLUMNS_TYPES } from 'components/Schedule/model';

type Props = {
  handleFilter: (event: CheckboxChangeEvent) => void;
  hidenColumnsAndTypes: Array<string>;
  eventTypes: Array<string>;
  setHidenColumnsAndTypes: (event: Array<string>) => void;
};

const FilterComponent: React.FC<Props> = ({
  hidenColumnsAndTypes,
  eventTypes,
  handleFilter,
  setHidenColumnsAndTypes,
}) => {
  const renderColumns = COLUMNS_TYPES.map((el, ind) => {
    return (
      <Checkbox key={`${ind}_${el}`} value={el} checked={!hidenColumnsAndTypes.includes(el)} onChange={handleFilter}>
        {el}
      </Checkbox>
    );
  });

  const renderTypes = eventTypes.map((el, ind) => {
    return (
      <Checkbox key={`${ind}_${el}`} value={el} checked={!hidenColumnsAndTypes.includes(el)} onChange={handleFilter}>
        {el}
      </Checkbox>
    );
  });

  return (
    <Space style={{ flexDirection: 'column' }}>
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
      <Button style={{ marginTop: '10px' }} onClick={() => setHidenColumnsAndTypes([])}>
        Reset
      </Button>
    </Space>
  );
};

export default memo(FilterComponent);
