import React from 'react';
import { Collapse, Tag } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';
import { GithubPicker } from 'react-color';
import { pickerColors, mockedTags as tags, setTagColor, getTagColor, DEFAULT_COLOR } from './userSettingsHandlers';
import { useLocalStorage } from 'react-use';

const SettingsTagColor: React.FC = () => {
  const { Panel } = Collapse;
  const [storedTagColors, setStoredTagColors] = useLocalStorage<any>('tagColors', DEFAULT_COLOR);

  const collapseTags = (
    <Collapse accordion ghost>
      {tags.map((item) => {
        return (
          <Panel
            header={
              <Tag
                style={{
                  cursor: 'pointer',
                  borderColor: getTagColor(item.name, storedTagColors),
                  color: getTagColor(item.name, storedTagColors),
                  backgroundColor: `${getTagColor(item.name, storedTagColors)}10`,
                }}
              >
                {item.name}
              </Tag>
            }
            key={item.name}
          >
            <GithubPicker
              colors={pickerColors}
              triangle="hide"
              width={'138px'}
              onChange={(e) => setTagColor(e, item.name, setStoredTagColors, storedTagColors)}
            />
          </Panel>
        );
      })}
    </Collapse>
  );

  return (
    <Collapse expandIcon={() => <BgColorsOutlined style={{ fontSize: '20px', color: '#08c' }} />}>
      <Panel header="Change Tag Color" key="tags">
        {collapseTags}
      </Panel>
    </Collapse>
  );
};

export default SettingsTagColor;
