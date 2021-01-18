import React, { useState, useMemo } from 'react';
import { Form, Input, InputNumber, Button, Upload, DatePicker, Select, Spin, Alert, Switch, Drawer } from 'antd';
// import { Task, TaskService } from 'services/task';
import { CourseService, CourseTaskDetails } from 'services/course';
import { withSession } from 'components';
// import withCourseData from 'components/withCourseData';
import { Course } from '../../services/models';

import { UploadOutlined } from '@ant-design/icons';
// import MapComponent from '../../TaskPageDrawer/Map';
// import DynamicFieldSet from '../DynamicLinksField';
// import { layout, validateMessages, normFile, initialTags, timeZoneListAdd } from './utilsForForms';
// import moment from 'moment';
import 'moment-timezone';

import { SPECIAL_EVENT_TAGS } from 'components/Schedule/model';
import { TIMEZONES } from '../../configs/timezones';
import DynamicFieldSet from './dmitriSiniakov/DynamicLinksField'
// import TagColor from '../UserSettings/TagColor';

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
  tag: any,
  // darkTheme,
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
    // onSelectChange,
    // tag,
    // darkTheme,
    // onMapClicked,
    // activeMarker,
    loading,
    error,
    // storedTagColors, // it doesnt work
    // setStoredTagColors, // it doesn't work
    course,
  } = props;
  console.log(course);
  const courseId = course.id;
  const service = useMemo(() => new CourseService(courseId), [courseId]);

  const [isMapShown, setMapShown] = useState(false);
  const [addTagMode, setAddTagMode] = useState(false);
  const [allowFeedback, setAllowFeedback] = useState(true);
  const [tags, setTags] = useState(SPECIAL_EVENT_TAGS);
  const [isSuccess, setSuccess] = useState(false);
  // const [currentTimeZone, setCurrentTimeZone] = useState('Europe/Minsk');
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // const tagOptionsList = tags.map((option: string) => {
  //   return (
  //     <Option value={option} key={option}>
  //       {option}
  //     </Option>
  //   );
  // });

  const timeZoneOptionsList = TIMEZONES.map(tz => (
    <Option key={tz} value={tz}>
      {tz}
    </Option>
  ));

  const OnTimeZoneChange = (e: string) => {
    setTimeZone(e);
  };

  const showMap = () => {
    setMapShown(!isMapShown);
  };

  const toggleAddTagMode = (flag: boolean, value?: string) => {
    if (value) {
      const newTagsList = [...tags];
      newTagsList.push(value);
      setTags(newTagsList);
    }
    setAddTagMode(flag);
  };

  const onSwitchChange = async (checked: boolean) => {
    setAllowFeedback(checked);
  };

  const onFinish = (values: any) => { 
    // const valuesTest = {
    //   checker: "mentor",
    //   courseId: 13,
    //   maxScore: 100,
    //   pairsCount: undefined,
    //   scoreWeight: 1,
    //   stageId: undefined,
    //   studentEndDate: "2021-01-23 19:27+00:00",
    //   studentStartDate: "2021-01-15 19:21+00:00",
    //   taskId: 526,
    //   taskOwnerId: undefined,
    //   type: undefined,
    //   name: 'vasya'
    // };

    // values = {
    //   ...values,
    //   author: values.author ? values.author : 'admin',
    //   tag: tag,
    //   date: moment(values.date).tz(timeZone).format(),
    //   deadline: moment(values.deadline).tz(timeZone).format(),
    //   links: values.links ? values.links : ['https://www.google.com/'],
    //   photo: values.photo ? true : null,
    //   video: values.video ? true : null,
    //   map: activeMarker,
    //   allowFeedback: allowFeedback,
    //   courseId: course.id,
    // };

    const record = createRecord(values, course.id);
    // interface values: Task + ?courseId

    if (!error) {
      setSuccess(true);
    }

    console.log(record);

    service.createCourseTask(record);
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
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={{
          tag: 'self education',
        }}
        onFieldsChange={onFieldsChange}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {/* <Form.Item name="tag" label="Tag">
          <Input.Group compact>
            <Select
              style={{ width: '30%' }}
              defaultValue={'self education'}
              onChange={(e) => {
                onSelectChange(e);
              }}
            >
              {tagOptionsList}
            </Select>
            {!addTagMode && (
              <Button
                style={{ width: '40%' }}
                type="default"
                onClick={() => {
                  toggleAddTagMode(true);
                }}
              >
                Add own tag
              </Button>
            )}
            {addTagMode && (
              <Input
                name="owntag"
                style={{ width: '30%' }}
                autoFocus={true}
                onBlur={(e) => {
                  toggleAddTagMode(false, e.target.value);
                }}
              />
            )}
          </Input.Group>
        </Form.Item> */}
        {/* <Form.Item label="Tag color">
          <TagColor 
            tags={tags} 
            setStoredTagColors={setStoredTagColors} 
            storedTagColors={storedTagColors}
          />
        </Form.Item> */}
        <Form.Item label="Time Zone">
          <Select
            style={{ width: '50%' }}
            defaultValue={'Europe/Minsk'}
            onChange={(e) => {
              OnTimeZoneChange(e);
            }}
          >
            {timeZoneOptionsList}
          </Select>
        </Form.Item>
        <Form.Item
          name="range"
          label="Start - End Date"
          rules={[{ required: true, type: 'array', message: 'Please enter start and end date' }]}
        >
          <DatePicker.RangePicker format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm' }} />
        </Form.Item>
        {/* <Form.Item
          label="Date"
          name="date"
          rules={[{ type: 'object', required: true, message: 'Please select date!' }]}
        >
          <DatePicker style={{ width: '30%' }} format="YYYY/MM/DD" />
        </Form.Item>
        <Form.Item name="deadline" label="Deadline">
          <DatePicker format="YYYY/MM/DD" />
        </Form.Item> */}
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
};

function createRecord(values: any, courseId: number) {
  // data: Partial<Task>
  const data = {
    id: values.id,
    courseId,
    type: values.type,
    name: values.name,
    verification: values.verification,
    githubPrRequired: !!values.githubPrRequired,
    descriptionUrl: values.descriptionUrl,
    githubRepoName: values.githubRepoName,
    sourceGithubRepoUrl: values.sourceGithubRepoUrl,
    tags: values.tags,
    discipline: values.discipline,
    attributes: JSON.parse(values.attributes ?? '{}'),

    taskId: 515,  //test
  };
  return data;
}

export default withSession(FormAddTask);