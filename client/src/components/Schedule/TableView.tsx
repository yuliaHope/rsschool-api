import {
  QuestionCircleOutlined,
  YoutubeOutlined,
  ChromeOutlined,
  GithubOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Table, Tag, Tooltip } from 'antd';
import { GithubUserLink } from 'components';
import { dateSorter, getColumnSearchProps, tagsRenderer } from 'components/Table';
import { CourseEvent } from 'services/course';
import moment from 'moment-timezone';
import { EventTypeColor, EventTypeToName, TaskTypes } from './model';

type Props = {
  data: CourseEvent[];
  timeZone: string;
};

export function TableView({ data, timeZone }: Props) {
  return (
    <Table
      rowKey={record => (record.event.type === TaskTypes.deadline ? `${record.id}d` : record.id).toString()}
      pagination={false}
      dataSource={data}
      // onRow={() => ({
      //   onClick: ({ target }) => {
      //     if (!target.closest('a')) {
      //       // eslint-disable-next-line no-console
      //       console.log('row is clicked');
      //     }
      //   },
      // })}
      columns={[
        {
          title: columnFilter(),
          width: 20,
          dataIndex: '#',
          render: (_text, _record, index) => index + 1,
        },
        {
          title: 'Date',
          width: 120,
          dataIndex: 'dateTime',
          render: dateRenderer(timeZone),
          sorter: dateSorter('dateTime'),
          defaultSortOrder: 'descend',
        },
        { title: 'Time', width: 60, dataIndex: 'dateTime', render: timeRenderer(timeZone) },
        {
          title: 'Type',
          width: 100,
          dataIndex: ['event', 'type'],
          render: (value: keyof typeof EventTypeColor) => (
            <Tag color={EventTypeColor[value]}>{EventTypeToName[value] || value}</Tag>
          ),
        },
        {
          title: 'Special',
          width: 150,
          dataIndex: 'special',
          render: tags => {
            if (!tags) {
              return;
            }
            return tagsRenderer(tags.split(','));
          },
        },
        {
          title: 'Name',
          dataIndex: ['event', 'name'],
          render: (value: string, record) => {
            return record.event.descriptionUrl ? (
              <a target="_blank" href={record.event.descriptionUrl}>
                {value}
              </a>
            ) : (
              value
            );
          },
          ...getColumnSearchProps('event.name'),
        },
        {
          title: 'Url',
          width: 30,
          dataIndex: 'broadcastUrl',
          render: url => {
            return url ? (
              <Tooltip placement="topLeft" title={url}>
                <a target="_blank" href={url}>
                  {urlRenderer(url)}
                </a>
              </Tooltip>
            ) : (
              ''
            );
          },
        },
        { title: 'Duration', width: 60, dataIndex: 'duration' },
        {
          title: 'Organizer',
          width: 140,
          dataIndex: ['organizer', 'githubId'],
          render: (value: string) => (value ? <GithubUserLink value={value} /> : ''),
          ...getColumnSearchProps('organizer.githubId'),
        },
        {
          title: 'Place',
          dataIndex: 'place',
          render: (value: string) => {
            return value === 'Youtube Live' ? (
              <div>
                <YoutubeOutlined /> {value}{' '}
                <Tooltip title="Ссылка будет в Discord">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
            ) : (
              <Tooltip title={value}>
                {<div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{value}</div>}
              </Tooltip>
            );
          },
          onCell: () => {
            return {
              style: {
                whiteSpace: 'nowrap',
                maxWidth: 250,
              },
            };
          },
        },
      ]}
    />
  );
}

const dateRenderer = (timeZone: string) => (value: string) =>
  value ? moment(value, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('MMM Do YYYY') : '';

const timeRenderer = (timeZone: string) => (value: string) =>
  value ? moment(value, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('HH:mm') : '';

const urlRenderer = (url: string) => {
  const lowerUrl = url.toLowerCase();
  const isGithubLink = lowerUrl.includes('github');
  const isYoutubeLink = lowerUrl.includes('youtube');
  const isYoutubeLink2 = lowerUrl.includes('youtu.be');

  if (isGithubLink) {
    return <GithubOutlined />;
  }

  if (isYoutubeLink || isYoutubeLink2) {
    return <YoutubeOutlined />;
  }

  return <ChromeOutlined />;
};

const columnFilter = () => {
  return <SettingOutlined />;
};

export default TableView;
