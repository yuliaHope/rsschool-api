import React from 'react';
import { Space, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

type Props = {
  handleFilter: (event: CheckboxChangeEvent) => void,
  hiddenColumnsRows: Array<string>,
  eventTypes: Array<string>,
}

const FilterComponent: React.FC<Props> = ({ hiddenColumnsRows, eventTypes, handleFilter }) => {
    const columnsName: Array<string> = ['Type', 'Special', 'Url', 'Organizer', 'Place'];
    
    return (
      <Space style={{alignItems: 'flex-start'}}>
        <Space direction='vertical'>
          <span style={{fontWeight: 'bold'}}>Columns</span>
            {
                columnsName.map((el, ind) => {
                    return <Checkbox key={`${ind}_${el}`} value={el} checked={!hiddenColumnsRows.includes(el)} onChange={handleFilter}>{el}</Checkbox>;
                })
            } 
        </Space>
        {
          eventTypes.length !== 0 
          ? (<Space direction='vertical'>
              <span style={{fontWeight: 'bold'}}>Events</span>
              {
                  eventTypes.map((el, ind) => {
                      return <Checkbox key={`${ind}_${el}`} value={el} checked={!hiddenColumnsRows.includes(el)} onChange={handleFilter}>{el}</Checkbox>;
                  })
              } 
          </Space>)
          : null
        }
      </Space>  
    );
}

export default FilterComponent;