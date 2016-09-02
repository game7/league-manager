import * as React from 'react';
import { Link } from 'react-router'

export type cell = string;
export type row = cell[]

interface IFile {
  name: string;
  content: string;
}

export interface IImportState {
  file?: IFile;
  delimiter?: string;
  hasHeader?: boolean;
  rows?: row[];
  filename?: string;
  columns? : Column[];
  teams?: Map[];
  locations?: Map[];
}

export interface Column {
  pattern: string;
  property?: string;
}

interface Map {
  key: string;
  id?: number;
  name?: string;
}

export const PROPERTIES = [
  'Date',
  'Time',
  'Duration',
  'Home Team',
  'Away Team',
  'Location',
];

export const storage = {
  save: (state: IImportState) => localStorage.setItem('import', JSON.stringify(state)),
  load: (): IImportState => JSON.parse(localStorage.getItem('import') || '{}')
}

export const Back = (props: { disabled?: boolean, to?: string }) => {
  let css = ['btn', 'btn-default'];
  if(props.disabled) css.push('disabled');
  return (
    <Link className={css.join(' ')} to={props.to || ""}>
      <i className="fa fa-chevron-left"/>{" "}Back
    </Link>
  )
}

export const Next = (props: { disabled?: boolean, to?: string }) => {
  let css = ['btn', 'btn-default'];
  if(props.disabled) css.push('disabled');
  return (
    <Link className={css.join(' ')} to={props.to || ""}>
      Next{" "}<i className="fa fa-chevron-right"/>
    </Link>
  )
}
