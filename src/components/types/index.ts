import type { ProColumns } from '@ant-design/pro-components';

export interface RequestProps {
  requestUrl?: string;
  requestMethod?: string;
  requestParams?: string | Record<string, any>;
  routePathDefine?: string;
}

export interface SubmitProps {
  submitUrl?: string;
  submitMethod?: string;
  submitParams?: string | Record<string, any>;
}

export type SchemaColumnProps = {
  key?: string;
  confirmMessage?: string;
  icon?: React.ReactNode;
  visible?: boolean | ((record: any) => boolean);
  dictType?: string;
  dictTypeValueIsBoolean?: boolean;
  mode?: 'redirect' | 'popup' | 'call';
  colProps?: any;
  redirectUrl?: string;
  permission?: string;
  onClick?: (rowData?: any) => void;
} & RequestProps &
  ProColumns<any, any>;
