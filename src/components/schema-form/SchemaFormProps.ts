import { RequestProps, SchemaColumnProps, SubmitProps } from '../types';

export type SchemaFormLayoutType =
  | 'Form'
  | 'ModalForm'
  | 'DrawerForm'
  | 'StepsForm'
  | 'StepForm'
  | 'LightFilter'
  | 'QueryFilter'
  | 'Embed'
  | 'ModalDescriptionForm'
  | 'DescriptionForm';

export type SchemaFormProps = {
  layoutType: SchemaFormLayoutType;
  triggerKey?: string;
  width?: number | string;
  columns: SchemaColumnProps[];
  labelCol?: any;
  wrapperCol?: any;
  modalProps?: any;
  drawerProps?: any;
  initialValues?: any;
  open?: boolean;
  parentRef?: any;
  routePathDefine: string;
  showReturnButton?: boolean;
  onOpenChange?: (visible: any) => void;
} & RequestProps &
  SubmitProps &
  any;
