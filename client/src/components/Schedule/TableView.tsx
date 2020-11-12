import { SettingOutlined } from '@ant-design/icons';
import { Table, Typography } from 'antd';
import { GithubUserLink } from 'components';
import {
  dateSorter,
  getColumnSearchProps,
  tagsRenderer,
  dateWithTimeZoneRenderer,
  urlRenderer,
  eventColorTagRenderer,
  placeRenderer,
} from 'components/Table';
import { CourseEvent } from 'services/course';
import { TaskTypes } from './model';

const { Text } = Typography;

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
      size="middle"
      columns={[
        {
          title: <SettingOutlined />,
          width: 20,
          dataIndex: '#',
          render: (_text, _record, index) => index + 1,
        },
        {
          title: 'Date',
          width: 120,
          dataIndex: 'dateTime',
          render: dateWithTimeZoneRenderer(timeZone, 'MMM Do YYYY'),
          sorter: dateSorter('dateTime'),
          sortDirections: ['descend', 'ascend'],
          defaultSortOrder: 'descend',
        },
        { title: 'Time', width: 60, dataIndex: 'dateTime', render: dateWithTimeZoneRenderer(timeZone, 'HH:mm') },
        {
          title: 'Type',
          width: 120,
          dataIndex: ['event', 'type'],
          render: eventColorTagRenderer,
        },
        {
          title: 'Special',
          width: 150,
          dataIndex: 'special',
          render: tags => !!tags && tagsRenderer(tags.split(',')),
        },
        {
          title: 'Name',
          dataIndex: ['event', 'name'],
          render: value => <Text strong>{value}</Text>,
          ...getColumnSearchProps('event.name'),
        },
        {
          title: 'Url',
          width: 30,
          dataIndex: ['event', 'descriptionUrl'],
          render: urlRenderer,
        },
        { title: 'Duration', width: 60, dataIndex: 'duration' },
        {
          title: 'Organizer',
          width: 140,
          dataIndex: ['organizer', 'githubId'],
          render: (value: string) => !!value && <GithubUserLink value={value} />,
          ...getColumnSearchProps('organizer.githubId'),
        },
        {
          title: 'Place',
          dataIndex: 'place',
          render: placeRenderer,
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

export default TableView;
