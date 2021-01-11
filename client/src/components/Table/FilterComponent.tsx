import React from 'react';
import { Space, Checkbox } from 'antd';

const FilterComponent: React.FC<any> = ({setHiddenColumnsRows,  hiddenColumnsRows, eventTypes}) => {
    const columnsName: Array<string> = ['Type', 'Special', 'Url', 'Organizer', 'Place'];
    
    const handledFilter = (event: any): void => {
        const {value} = event.target;
        const {checked} = event.target;
        if (checked && hiddenColumnsRows.has(value)) {
          setHiddenColumnsRows((prevState: Set<string>) => {
            prevState.delete(value);
            const newArr = Array.from(prevState);
            return new Set([...newArr]);
          });
        }
        if (!checked && !hiddenColumnsRows.has(value)) {
          setHiddenColumnsRows((prevState: Set<string>) => {
            const newArr = Array.from(prevState);
            return new Set([...newArr, value]);
          });
        }
    };
      
    return (
      <Space>
        <Space direction="vertical" >
            <strong>Columns</strong>
            {
                columnsName.map((el, ind) => {
                    return <Checkbox key={`${ind}_${el}`} value={el} checked={!hiddenColumnsRows.has(el)} onChange={handledFilter}>{el}</Checkbox>;
                })
            } 
        </Space>
        {
          eventTypes.length !== 0 
          ? (<Space direction="vertical">
            <strong>Events</strong>
            {
                eventTypes.map((el, ind) => {
                    return <Checkbox key={`${ind}_${el}`} value={el} checked={!hiddenColumnsRows.has(el)} onChange={handledFilter}>{el}</Checkbox>;
                })
            } 
          </Space>)
          : null
        }
      </Space>  
    );
}

export default FilterComponent;