import { Col, Row, Select, Tooltip, Button } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { withSession, PageLayout } from 'components';
import { TableView, CalendarView, ListView } from 'components/Schedule';
import withCourseData from 'components/withCourseData';
import React, { useState, useMemo } from 'react';
import { CourseEvent, CourseService, CourseTaskDetails } from 'services/course';
import { CoursePageProps } from 'services/models';
import { TIMEZONES } from '../../configs/timezones';
import { useAsync, useLocalStorage } from 'react-use';
import { useLoading } from 'components/useLoading';
import { isMobileOnly } from 'mobile-device-detect';
import { ViewMode } from 'components/Schedule/model';
import UserSettings from 'components/UserSettings/UserSettings';
import { DEFAULT_COLOR } from 'components/UserSettings/userSettingsHandlers';
import moment from 'moment-timezone';

import ModalWindowForForm from '../../components/Forms/ModalFormAddTask';

const { Option } = Select;
const LOCAL_VIEW_MODE = 'scheduleViewMode';
const LOCAL_HIDE_OLD_EVENTS = 'scheduleHideOldEvents';

const TaskTypes = {
  deadline: 'deadline',
  test: 'test',
  newtask: 'newtask',
  lecture: 'lecture',
};

export function SchedulePage(props: CoursePageProps) {
  const [loading, withLoading] = useLoading(false);
  const [data, setData] = useState<CourseEvent[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [scheduleViewMode, setScheduleViewMode] = useLocalStorage<string>(LOCAL_VIEW_MODE, getDefaultViewMode());
  const [storedTagColors, setStoredTagColors] = useLocalStorage<object>('tagColors', DEFAULT_COLOR);
  const [isOldEventsHidden, setOldEventsHidden] = useLocalStorage<boolean>(LOCAL_HIDE_OLD_EVENTS, false);
  const courseService = useMemo(() => new CourseService(props.course.id), [props.course.id]);
  const relevantEvents = useMemo(() => {
    const yesterday = moment.utc().subtract(1, 'day');

    return data.filter(({ dateTime }) => moment(dateTime).isAfter(yesterday, 'day'));
  }, [data]);

  const [visible, setVisible] = useState(false);

  const handleCancel = () => {
    setVisible(false);
  };

  const loadData = async () => {
    const [events, tasks] = await Promise.all([courseService.getCourseEvents(), courseService.getCourseTasksDetails()]);
    const data = events.concat(tasksToEvents(tasks)).sort((a, b) => a.dateTime.localeCompare(b.dateTime));
    setData(data);

    const distinctTags = Array.from(new Set(data.map(element => element.event.type)));
    setTags(distinctTags);
  };

  useAsync(withLoading(loadData), [courseService]);

  const mapScheduleViewToComponent = {
    [ViewMode.TABLE]: TableView,
    [ViewMode.LIST]: ListView,
    [ViewMode.CALENDAR]: CalendarView,
  };

  const viewMode = scheduleViewMode as ViewMode;
  const ScheduleView = mapScheduleViewToComponent[viewMode] || TableView;
  const filteredData = isOldEventsHidden ? relevantEvents : data;

  const toggleOldEvents = () => {
    setOldEventsHidden(!isOldEventsHidden);
  };

  return (
    <PageLayout loading={loading} title="Schedule" githubId={props.session.githubId}>
      <Row justify="start" gutter={[16, 16]}>
        <Col>
          <Select style={{ width: 100 }} defaultValue={scheduleViewMode} onChange={setScheduleViewMode}>
            <Option value={ViewMode.TABLE}>Table</Option>
            <Option value={ViewMode.LIST}>List</Option>
            <Option value={ViewMode.CALENDAR}>Calendar</Option>
          </Select>
        </Col>
        <Col>
          <Select
            style={{ width: 200 }}
            placeholder="Please select a timezone"
            defaultValue={timeZone}
            onChange={setTimeZone}
          >
            {TIMEZONES.map(tz => (
              <Option key={tz} value={tz}>
                {tz}
              </Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Tooltip title="Hide old events" mouseEnterDelay={1}>
            <Button
              type="primary"
              onClick={toggleOldEvents}
              icon={isOldEventsHidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            />
          </Tooltip>
        </Col>
        <Col>
          <UserSettings
            tags={tags}
            setStoredTagColors={setStoredTagColors}
            storedTagColors={storedTagColors || {}}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
            // style={{ margin: '0 10px 10px 0' }}
            // className={props.userPreferences.readable ? 'readable-bold-1' : ''}
          >
            <p>Add new task</p>
          </Button>
          {visible && <ModalWindowForForm visible={visible} handleCancel={handleCancel} course={props.course}/>}
        </Col>
      </Row>
      <ScheduleView
        data={filteredData}
        timeZone={timeZone}
        isAdmin={props.session.isAdmin}
        courseId={props.course.id}
        refreshData={loadData}
        storedTagColors={storedTagColors || {}}
        alias={props.course.alias}
      />
    </PageLayout>
  );
}

const tasksToEvents = (tasks: CourseTaskDetails[]) => {
  return tasks.reduce((acc: Array<CourseEvent>, task: CourseTaskDetails) => {
    if (task.type !== TaskTypes.test) {
      acc.push(createCourseEventFromTask(task, task.type));
    }
    acc.push(createCourseEventFromTask(task, task.type === TaskTypes.test ? TaskTypes.test : TaskTypes.deadline));
    return acc;
  }, []);
};

const createCourseEventFromTask = (task: CourseTaskDetails, type: string): CourseEvent => {
  return {
    id: task.id,
    dateTime: (type === TaskTypes.deadline ? task.studentEndDate : task.studentStartDate) || '',
    event: {
      type: type,
      name: task.name,
      descriptionUrl: task.descriptionUrl,
    },
    organizer: {
      githubId: task.taskOwner ? task.taskOwner.githubId : '',
    },
    isTask: true,
  } as CourseEvent;
};

const getDefaultViewMode = () => {
  const localView = localStorage.getItem(LOCAL_VIEW_MODE);

  if (localView) {
    return localView;
  }

  if (isMobileOnly) {
    return ViewMode.LIST;
  }

  return ViewMode.TABLE;
};

export default withCourseData(withSession(SchedulePage));
