import { ColorState as IColorState } from 'react-color';

export const pickerColors = [
  '#ff0000',
  '#FF6900',
  '#FCCB00',
  '#37D67A',
  '#308e00',
  '#2db7f5',
  '#004DCF',
  '#a326f4',
  '#FA28FF',
  '#F78DA7',
];

export const DEFAULT_COLOR = '#308e00';

export function setTagColor(e: IColorState, tagName: string, localStorageHook: (value: string) => void, storedTagColors: string | undefined) {
  const parsedTagColors = JSON.parse(<string>storedTagColors) || {};
  parsedTagColors[tagName] = e.hex;
  localStorageHook(JSON.stringify(parsedTagColors));
}

export function getTagColor(tagName: string, storedTagColors: string | undefined) {
  const parsedTagColors = JSON.parse(<string>(storedTagColors)) || {};
  return parsedTagColors[tagName] || DEFAULT_COLOR;
}

export const mockedTags = [
  { name: 'deadline' },
  { name: 'test' },
  { name: 'jstask' },
  { name: 'htmltask' },
  { name: 'externaltask' },
  { name: 'selfeducation' },
  { name: 'codewars' },
  { name: 'codejam' },
  { name: 'newtask' },
  { name: 'lecture' },
  { name: 'lecture_online' },
  { name: 'lecture_offline' },
  { name: 'lecture_mixed' },
  { name: 'lecture_self_study' },
  { name: 'info' },
  { name: 'warmup' },
  { name: 'meetup' },
  { name: 'workshop' },
  { name: 'interview' },
];
