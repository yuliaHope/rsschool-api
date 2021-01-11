import { ColorState as IColorState } from 'react-color';
import { CSSProperties } from 'react';

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

export const DEFAULT_COLOR = { default: '#308e00' };

export function setTagColor(e: IColorState, tagName: string, localStorageHook: (value: object) => void, storedTagColors = {}) {
  localStorageHook({ ...storedTagColors, [tagName]: e.hex });
}

export function getTagColor(tagName: string, storedTagColors: Record<string, string> = {}) {
  return storedTagColors[tagName] || DEFAULT_COLOR.default;
}

export function getTagStyle(tagName: string, storedTagColors = {}, styles?: CSSProperties) {
  const tagColor: string = getTagColor(tagName, storedTagColors);
  return {
    ...styles,
    borderColor: tagColor,
    color: tagColor,
    backgroundColor: `${tagColor}10`,
  };
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