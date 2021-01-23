import React, { useState, useMemo, useCallback } from 'react';
import { Form, Input, InputNumber, Button, Upload, DatePicker, Select, Spin, Alert, Switch, Drawer } from 'antd';
import { Task, TaskService } from 'services/task';
import { CourseService, CourseTaskDetails } from 'services/course';
import { useAsync } from 'react-use';
import { withSession } from 'components';
import { Course } from '../../services/models';
import { UserSearch } from 'components/UserSearch';
import { UserService } from 'services/user';
import { UploadOutlined } from '@ant-design/icons';
// import MapComponent from '../../TaskPageDrawer/Map';
import { formatTimezoneToUTC } from 'services/formatter';
import { TIMEZONES } from '../../configs/timezones';
import DynamicFieldSet from './dmitriSiniakov/DynamicLinksField'
import 'moment-timezone';

const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
    number: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
  links: 'Input link or delete this field.',
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

type Props = {
  handleCancel: any,
  handleChangeLinks: any,
  onFieldsChange: any,
  onSelectChange: any,
  // onMapClicked,
  activeMarker: any,
  loading: any,
  error: any,

  storedTagColors: object;
  setStoredTagColors: (value: object) => void;
  course: Course;
}

const FormAddTask: React.FC<Props> = (props) => {
  const {
    handleCancel,
    handleChangeLinks,
    onFieldsChange,
    // onMapClicked,
    // activeMarker,
    // loading,
    error,
    course,
  } = props;
  const courseId = course.id;
  const service = useMemo(() => new CourseService(courseId), [courseId]);

  const [isMapShown, setMapShown] = useState(false);
  const [allowFeedback, setAllowFeedback] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const userService = new UserService();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as CourseTaskDetails[]);
  const [tasks, setTasks] = useState([] as Task[]);
  const [modalData, setModalData] = useState(null as Partial<CourseTaskDetails> | null);
  const loadData = useCallback(async () => {
    setLoading(true);
    const [data, tasks] = await Promise.all([service.getCourseTasksDetails(), new TaskService().getTasks()]);
    setData(data);
    setTasks(tasks);
    setLoading(false);
  }, [courseId]);

  useAsync(loadData, [courseId]);

  const loadUsers = async (searchText: string) => {
    return userService.searchUser(searchText);
  };

  const showMap = () => {
    setMapShown(!isMapShown);
  };

  const onSwitchChange = async (checked: boolean) => {
    setAllowFeedback(checked);
  };

  const handleModalSubmit = (values: any) => { 
    console.log('before -- ', values);
    const [startDate, endDate] = values.range || [null, null];
    values = {
      ...values,
      courseId: course.id,
      author: values.author ? values.author : 'admin',
      // map: activeMarker,
      studentStartDate: startDate ? formatTimezoneToUTC(startDate, values.timeZone) : null,
      studentEndDate: endDate ? formatTimezoneToUTC(endDate, values.timeZone) : null,
      descriptionUrl: values.links ? values.links : ['https://www.google.com/'],
      photo: values.photo ? true : null,
      video: values.video ? true : null,
      allowFeedback: allowFeedback,
      
    };

    if (!error) {
      setSuccess(true);
    }
    console.log('after -- ', values);
    service.createCourseTask(values);
  };

  if (loading) {
    return <Spin />;
  }
  if (isSuccess && !error) {
    return <Alert message="Your task successfully added" type="success" showIcon />;
  }
  if (error) {
    return <Alert message="Something went wrong" type="error" showIcon />;
  }

  if (!loading && !error) {
    return (
      <Form
        className="form-add-wrapper"
        {...layout}
        name="nest-messages"
        onFinish={handleModalSubmit}
        validateMessages={validateMessages}
        initialValues={{
          tag: 'self education',
        }}
        onFieldsChange={onFieldsChange}
      >
        <Form.Item name="taskId" label="Task" rules={[{ required: true, message: 'Please select a task' }]}>
          <Select showSearch placeholder="Please select a task">
            {tasks.map((task: Task) => (
              <Option key={task.id} value={task.id}>
                {task.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="taskOwnerId"
          label="Task Owner"
          rules={[{ required: false, message: 'Please select a task owner' }]}
        >
          <UserSearch defaultValues={modalData?.taskOwner ? [modalData.taskOwner] : []} searchFn={loadUsers} />
        </Form.Item>
        <Form.Item name="timeZone" label="TimeZone">
          <Select placeholder="Please select a timezone">
            {TIMEZONES.map(tz => (
              <Option key={tz} value={tz}>
                {tz}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="range"
          label="Start - End Date"
          rules={[{ required: true, type: 'array', message: 'Please enter start and end date' }]}
        >
          <DatePicker.RangePicker format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm' }} />
        </Form.Item>
        <Form.Item name="duration" rules={[{ type: 'number', min: 0 }]} label="Duration">
          <InputNumber min={0} step={0.5} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea />
        </Form.Item>
        <Form.Item name="result" label="Result">
          <Input />
        </Form.Item>
        <Form.Item name="remark" label="Remark">
          <Input />
        </Form.Item>
        <DynamicFieldSet handleChangeLinks={handleChangeLinks} />   
        <Form.Item name="map" label="Map">
          <Button type="dashed" block onClick={showMap}>
            Show map
          </Button>
          {/* {isMapShown && <MapComponent onMapClicked={onMapClicked} activeMarker={activeMarker} darkTheme={darkTheme} />} */}
        </Form.Item>
        <Form.Item name="allowFeedback" valuePropName="checked" label="Allow feedback">
          <Switch defaultChecked onChange={onSwitchChange} />
        </Form.Item>
        <Form.Item name="photo" valuePropName="fileList" getValueFromEvent={normFile} label="Photo">
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item valuePropName="fileList" getValueFromEvent={normFile} label="Video">
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <div style={{width: '50%', margin: '0 auto'}}>
          <Button type="primary" htmlType="submit" style={{margin: '0 10px'}}>
            Submit
          </Button>
          <Button type="default" htmlType="submit" onClick={handleCancel} style={{margin: '0 10px'}}>
            Cancel
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <>
    </>
  )
};

export default withSession(FormAddTask);