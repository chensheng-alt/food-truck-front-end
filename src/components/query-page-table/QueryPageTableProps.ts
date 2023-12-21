import type { ProTableProps } from '@ant-design/pro-components';
import { SchemaFormLayoutType } from '../schema-form/SchemaFormProps';
import { RequestProps, SchemaColumnProps, SubmitProps } from '../types';

export type QueryPageTableProps = {
  toolbars?: SchemaColumnProps[];
  columns: SchemaColumnProps[];
  popupForms?: PopupFormProps[];
  onLoadCompleted?: (resultData: any) => void;
} & RequestProps &
  Omit<ProTableProps<any[], any>, 'columns'>;

export type PopupFormProps = {
  key: string;
  title?: string;
  layoutType: SchemaFormLayoutType;
  triggerKey?: string;
  columns: SchemaColumnProps[];
  otherSchemaFormProps?: any;
} & RequestProps &
  SubmitProps;
