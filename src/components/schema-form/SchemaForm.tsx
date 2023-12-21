import { BetaSchemaForm, ProDescriptions } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import { execRequestResolvingParams } from '../../utils/columnUtils';
import { execRequest } from '../../utils/common';
import React, { useState } from 'react';
import { addDictConversionFunction } from '../../utils/columnUtils';
import { SchemaFormProps } from './SchemaFormProps';
import './SchemaFormStyle.less';

const SchemaForm: React.FC<SchemaFormProps> = (props) => {
  const clonedProps = { ...props };
  const {
    title,
    layoutType,
    initialValues,
    rowProps,
    colProps,
    columns,
    width,
    modalProps,
    labelCol,
    wrapperCol,
    open,
    onOpenChange,
    requestUrl,
    requestMethod,
    requestParams,
    submitUrl,
    submitMethod,
    submitParams,
    parentRef,
    routePathDefine,
    showReturnButton,
    ...otherProps
  } = clonedProps;

  const [formInitValues, setFormInitValues] = useState({});

  /**
   * 包装DescriptionForm和ModalDescriptionForm 的返回结果信息
   * @param formType 表单类型
   * @param resultData 返回的数据结果
   * @returns 包装后的数据结果
   */
  function formResultWapper(formType: string, resultData: any): any {
    if (formType === 'DescriptionForm' || formType === 'ModalDescriptionForm') {
      return {
        success: true,
        data: resultData.data,
      };
    } else {
      return resultData.data;
    }
  }

  /**
   * 根据url, method, params，从后台获取数据信息
   * @returns 返回获取到的数据信息
   */
  async function requestDatas() {
    if (requestUrl) {
      const requestData = await execRequestResolvingParams(
        requestUrl,
        requestMethod || 'POST',
        (requestParams as string) || '',
        initialValues,
        routePathDefine,
      );
      const resultData: any = formResultWapper(layoutType, requestData);
      setFormInitValues(resultData);
      return resultData;
    } else {
      setFormInitValues(initialValues);
      return formResultWapper(layoutType, initialValues);
    }
  }

  /**
   * 根据url, method, params，向后台提交数据
   * @param values form中的数据
   */
  async function submitDatas(values: any) {
    if (submitUrl) {
      const result: any = await execRequest(submitUrl, submitMethod, {
        ...formInitValues,
        ...values,
      });
      if (result.resultCode === '200') {
        // modalOpenState[openKey] = false;
        // setModalOpenState({ ...modalOpenState });
        // actionRef.current?.reload();
        if (onOpenChange && typeof onOpenChange === 'function') {
          onOpenChange(false);
          if (parentRef) {
            parentRef.current?.reload();
          }
        }
        message.success('success');
      }
    }
  }

  const DEFAULT_LABEL_COL = { flex: '80px' };
  const DEFAULT_WRAPPER_COL = { flex: '1' };
  const DEFAULT_MODAL_WIDTH = '80%';

  // 编辑每一列的信息
  const _columns: any[] = columns.map((eachColumn: any) => {
    let newColumn = { ...eachColumn };
    // 添加值列表转换
    newColumn = addDictConversionFunction(newColumn);
    newColumn.width = undefined; // 删除width的设置，由rowProps、colPros、width、labelCol进行布局设置
    return newColumn;
  });

  if (layoutType !== 'ModalDescriptionForm' && layoutType !== 'DescriptionForm') {
    const modalProperties: any = {};
    const submitterDefine: any = {};
    let schemaFormClassName = '';

    // 为Modal类型，设置特有的属性
    if (layoutType === 'ModalForm' || layoutType === 'DrawerForm') {
      schemaFormClassName = layoutType === 'ModalForm' ? 'modal-schema-form' : 'drawer-schema-form';
      modalProperties.open = open;
      modalProperties.onOpenChange = onOpenChange;
      modalProperties.modalProps = {
        maskClosable: false,
        destroyOnClose: true,
        keyboard: true,
        ...modalProps,
        title,
      };
    } else if (layoutType === 'Form') {
      schemaFormClassName = 'schema-form';
      submitterDefine.render = (submitterProps: any, doms: any) => {
        const submitButtons: any[] = [];

        // 返回按钮
        if (showReturnButton) {
          submitButtons.push(
            <Button
              key="return"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              Cancel
            </Button>,
          );
        }

        submitButtons.push(...doms);
        return <div className="schema-form-submit-buttons">{submitButtons}</div>;
      };
    }
    return (
      <BetaSchemaForm
        className={schemaFormClassName}
        {...otherProps}
        grid
        layout="horizontal"
        layoutType={layoutType}
        rowProps={rowProps}
        colProps={colProps}
        columns={_columns}
        width={width || DEFAULT_MODAL_WIDTH}
        labelCol={labelCol || DEFAULT_LABEL_COL}
        wrapperCol={wrapperCol || DEFAULT_WRAPPER_COL}
        onFinish={async (values: any) => {
          submitDatas(values);
        }}
        request={async () => {
          return requestDatas();
        }}
        {...modalProperties}
        submitter={{ render: submitterDefine.render }}
      />
    );
  } else {
    const descComponent = (
      <ProDescriptions
        {...otherProps}
        className="modal-description-form-container"
        layout="horizontal"
        columns={_columns}
        request={async () => {
          return requestDatas();
        }}
        title={layoutType === 'ModalDescriptionForm' ? '' : title}
      />
    );
    if (layoutType === 'ModalDescriptionForm') {
      return (
        <Modal
          footer={[
            <Button key="closeButton" onClick={onOpenChange}>
              Close
            </Button>,
          ]}
          open={open}
          onCancel={onOpenChange}
          width={width || DEFAULT_MODAL_WIDTH}
          {...modalProps}
          maskClosable={false}
          destroyOnClose
          keyboard
          title={title}
        >
          {descComponent}
        </Modal>
      );
    } else if (layoutType === 'DescriptionForm') {
      return (
        <>
          {descComponent}
          {showReturnButton ? (
            <div style={{ textAlign: 'right' }}>
              <Button
                key="return"
                onClick={() => {
                  window.history.go(-1);
                }}
              >
                返回
              </Button>
            </div>
          ) : null}
        </>
      );
    }
    return descComponent;
  }
};

SchemaForm.defaultProps = {
  rowProps: { gutter: { xs: 8, sm: 16, md: 24, lg: 32 } },
  colProps: { xs: 12, sm: 12, md: 8, lg: 8 },
};

export default SchemaForm;
