import React, { useMemo, useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Popconfirm, Table, Typography, Space, Form, Button, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment-timezone';
import mergeWith from 'lodash/mergeWith';
import { GithubUserLink } from 'components';
import {
  dateSorter,
  getColumnSearchProps,
  tagsRenderer,
  dateWithTimeZoneRenderer,
  urlRenderer,
  placeRenderer,
  renderTagWithStyle,
} from 'components/Table';
import { CourseEvent, CourseService } from 'services/course';
import { ScheduleRow } from './model';
import EditableCell from './EditableCell';
import Link from 'next/link';
import { EventService } from 'services/event';
import { Task, TaskService } from 'services/task';

const { Text } = Typography;

const eventService = new EventService();
const taskService = new TaskService();

type Props = {
  data: CourseEvent[];
  timeZone: string;
  isAdmin: boolean;
  courseId: number;
  refreshData: Function;
  storedTagColors?: object;
  alias: string;
};

const getColumns = (timeZone: string, alias: string, storedTagColors?: object) => [
  {
    title: <SettingOutlined />,
    width: 20,
    dataIndex: '#',
    render: (_text: string, _record: CourseEvent, index: number) => index + 1,
  },
  {
    title: 'Date',
    width: 120,
    dataIndex: 'dateTime',
    render: dateWithTimeZoneRenderer(timeZone, 'MMM Do YYYY'),
    sorter: dateSorter('dateTime'),
    sortDirections: ['descend', 'ascend'],
    defaultSortOrder: 'descend',
    editable: true,
  },
  {
    title: 'Time',
    width: 60,
    dataIndex: 'dateTime',
    render: dateWithTimeZoneRenderer(timeZone, 'HH:mm'),
    editable: true,
  },
  {
    title: 'Type',
    width: 120,
    dataIndex: ['event', 'type'],
    render: (tagName: string) => renderTagWithStyle(tagName, storedTagColors),
    editable: true,
  },
  {
    title: 'Special',
    width: 150,
    dataIndex: ['special'],
    render: (tags: string) => !!tags && tagsRenderer(tags.split(',')),
    editable: true,
  },
  {
    title: 'Name',
    width: 150,
    dataIndex: ['event', 'name'],
    render: (value: string, row: any) => {
      return (
        <Link
          href={`/course/entityDetails?course=${alias}&entityType=${row.isTask ? 'task' : 'event'}&entityId=${row.id}`}
        >
          <a>
            <Text style={{ width: '100%', height: '100%', display: 'block' }} strong>
              {value}
            </Text>
          </a>
        </Link>
      );
    },
    ...getColumnSearchProps('event.name'),
    editable: true,
  },
  {
    title: 'Url',
    width: 30,
    dataIndex: ['event', 'descriptionUrl'],
    render: urlRenderer,
    editable: true,
  },
  { title: 'Duration', width: 60, dataIndex: 'duration', editable: true },
  {
    title: 'Organizer',
    width: 140,
    dataIndex: ['organizer', 'githubId'],
    render: (value: string) => !!value && <GithubUserLink value={value} />,
    ...getColumnSearchProps('organizer.githubId'),
    editable: true,
  },
  {
    title: 'Place',
    dataIndex: 'place',
    render: placeRenderer,
    onCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          maxWidth: 250,
        },
      };
    },
    editable: true,
  },
];

export function TableView({ data, timeZone, isAdmin, courseId, refreshData, storedTagColors, alias }: Props) {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const courseService = useMemo(() => new CourseService(courseId), [courseId]);

  const isEditing = (record: CourseEvent) => `${record.id}${record.event.type}` === editingKey;

  const edit = (record: CourseEvent) => {
    form.setFieldsValue({
      ...record,
      dateTime: moment(record.dateTime),
      time: moment(record.dateTime),
      special: record.special ? record.special.split(',') : [],
      duration: record.duration ? Number(record.duration) : null,
    });
    setEditingKey(`${record.id}${record.event.type}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await courseService.deleteCourseEvent(id);
      await refreshData();
    } catch {
      message.error('Failed to delete item. Please try later.');
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id: number, isTask?: boolean) => {
    const updatedRow = (await form.validateFields()) as ScheduleRow;
    const index = data.findIndex(item => id === item.id);

    if (index > -1) {
      const editableEntity = data[index];

      mergeWith(editableEntity, updatedRow);
      editableEntity.special = updatedRow.special ? updatedRow.special.join(',') : '';

      try {
        if (isTask) {
          await taskService.updateTask(editableEntity.event.id, getNewDataForUpdate(editableEntity) as Partial<Task>);
          await courseService.updateCourseTask(editableEntity.id, getCourseTaskDataForUpdate(editableEntity));
        } else {
          await eventService.updateEvent(editableEntity.event.id, getNewDataForUpdate(editableEntity));
          await courseService.updateCourseEvent(editableEntity.id, getCourseEventDataForUpdate(editableEntity));
        }
        await refreshData();
      } catch {
        message.error('An error occurred. Please try later.');
      }
    }

    setEditingKey('');
  };

  const getAdminColumn = (isAdmin: boolean) => {
    if (!isAdmin) {
      return [];
    }

    return [
      {
        title: 'Action',
        key: 'action',
        render: (_: any, record: CourseEvent) => {
          const editable = isEditing(record);

          return editable ? (
            <span>
              <a
                onClick={event => {
                  event.stopPropagation();
                  save(record.id, record.isTask);
                }}
                style={{ marginRight: 8 }}
              >
                Save
              </a>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Space>
              <Button
                type="link"
                style={{ padding: 0 }}
                disabled={editingKey !== ''}
                onClick={event => {
                  event.stopPropagation();
                  edit(record);
                }}
              >
                Edit
              </Button>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => {
                  handleDelete(record.id);
                }}
              >
                <Button type="link" style={{ padding: 0 }} disabled={editingKey !== ''}>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
  };

  const columns = [...getColumns(timeZone, alias, storedTagColors), ...getAdminColumn(isAdmin)] as ColumnsType<
    CourseEvent
  >;

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: CourseEvent) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowKey={({ event, id }) => `${id}${event.type}`}
        pagination={false}
        dataSource={data}
        size="middle"
        columns={mergedColumns}
        rowClassName="editable-row"
      />
    </Form>
  );
}

const getCourseEventDataForUpdate = (entity: CourseEvent) => {
  return {
    dateTime: entity.dateTime,
    organizerId: entity.organizerId,
    place: entity.place,
    special: entity.special,
    duration: entity.duration,
  };
};

const getCourseTaskDataForUpdate = (entity: CourseEvent) => {
  const taskDate = entity.event.type !== 'deadline' ? 'studentStartDate' : 'studentEndDate';

  const dataForUpdate = {
    [taskDate]: entity.dateTime,
    taskOwner: { githubId: entity.organizer.githubId },
    special: entity.special,
    duration: entity.duration,
  };

  if (entity.event.type !== 'deadline') {
    return { ...dataForUpdate, type: entity.event.type };
  }

  return dataForUpdate;
};

const getNewDataForUpdate = (entity: CourseEvent) => {
  const dataForUpdate = {
    name: entity.event.name,
    descriptionUrl: entity.event.descriptionUrl,
  };

  if (entity.event.type !== 'deadline') {
    return { ...dataForUpdate, type: entity.event.type };
  }

  return dataForUpdate;
};

export default TableView;
