import { MoreOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, MenuProps, Popconfirm, Space, message } from 'antd';
import { execRequestResolvingParams } from '../../utils/columnUtils';
import {
  arrayCompare,
  execRequest,
  queryPageTableResultMapping,
} from '../../utils/common';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import SchemaForm from '../schema-form/SchemaForm';
import { SchemaColumnProps } from '../types';
import { addDictConversionFunction, resolvingPathParam } from '../../utils/columnUtils';
import { QueryPageTableProps } from './QueryPageTableProps';

const QueryPageTable: React.FC<QueryPageTableProps> = (props) => {
  const {
    rowKey,
    columns,
    toolbars,
    requestUrl,
    requestMethod,
    popupForms,
    dataSource,
    onLoadCompleted,
    ...otherProps
  } = props;
  const [modalOpenState, setModalOpenState] = useState<any>({ initState: false });
  const [tableColumns, setTableColumns] = useState<any>([]);
  const [toolbarButtons, setToolbarButtons] = useState<any>([]);
  const currentOperateRowData = useRef<any>();
  const actionRef = useRef<ActionType>();

  const _current = useRef(1);
  let _pageSize = useRef(20);
  let _totalColWidth = useRef(0);

  /**
   * 设置分页信息
   * @param current 当前页号
   * @param pageSize 一页显示的记录数
   */
  function setPageInfo(current?: number, pageSize?: number) {
    _current.current = current || 1;
    _pageSize.current = pageSize || 20;
  }

  /**
   * index(序号)列的默认实现函数
   * @param rowIndex 行号
   * @returns 实际的行号
   */
  function defaultIndexColumnRender(rowIndex: number): number {
    const index = _current.current === 1 ? rowIndex + 1 : (_current.current - 1) * _pageSize.current + rowIndex + 1;
    return index;
  }

  /**
   * 分析columns，过滤出普通列和操作列的信息
   * @param originalColumns proTable的columns信息
   * @returns 普通列和操作列信息
   */
  function analyzeColumns(originalColumns: SchemaColumnProps[]) {
    let normalColumns: SchemaColumnProps[] = [];
    let actionColumns: SchemaColumnProps[] = [];

    let valueType = '';
    originalColumns.forEach((eachColumn) => {
      let newColumn = { ...eachColumn };
      valueType = newColumn.valueType?.toString().toLocaleLowerCase() || '';
      if (valueType === 'option') {
        actionColumns.push(newColumn);
      } else {
        if (valueType === 'index' && !newColumn.render) {
          // 序号列
          newColumn.render = (dom: any, record: any, rowIndex: number) =>
            defaultIndexColumnRender(rowIndex);
        }
        // 计算所有显示列的宽度总和
        if (!newColumn.hideInTable) {
          _totalColWidth.current += (newColumn.width as number) || 100;
        }
        // 添加值列表转换
        newColumn = addDictConversionFunction(newColumn);

        normalColumns.push(newColumn);
      }
    });

    // 数组排序
    normalColumns = normalColumns.sort((col1, col2) => arrayCompare(col1, col2, 'order'));
    actionColumns = actionColumns.sort((col1, col2) => arrayCompare(col1, col2, 'order'));

    return { normalColumns, actionColumns };
  }

  function defaultActionButtonClick(defineColumn: SchemaColumnProps, rowData?: any): void {
    if (defineColumn.mode === 'popup') {
      const openStateKey: string = defineColumn.key || '';
      const newModalOpenState: any = {};

      newModalOpenState[openStateKey] = true;
      setModalOpenState({ ...modalOpenState, ...newModalOpenState });
      if (defineColumn.valueType === 'option') {
        // table中的操作按钮时
        currentOperateRowData.current = rowData;
      } else {
        // toolbars中的按钮时
        currentOperateRowData.current = undefined;
      }
    } else if (defineColumn.mode === 'redirect') {
      if (defineColumn.redirectUrl) {
        const resolvedUrl = resolvingPathParam(defineColumn.redirectUrl, rowData);
        window.location.href = `${resolvedUrl}`;
      }
    } else if (defineColumn.mode === 'call') {
      if (defineColumn.requestUrl) {
        execRequestResolvingParams(
          defineColumn.requestUrl,
          defineColumn.requestMethod || 'POST',
          (defineColumn.requestParams as string) || '',
          rowData,
        ).then((callResponseData: any) => {
          if (callResponseData.resultCode === '200') {
            actionRef.current?.reload();
            message.success('操作成功');
          }
        });
      } else if (defineColumn.onClick && typeof defineColumn.onClick === 'function') {
        defineColumn.onClick(defineColumn.valueType === 'option' ? rowData : undefined);
      }
    }
  }

  /**
   * 创建工具栏或操作列中的按钮
   * @param defineColumn 工具栏或操作列中的按钮的定义信息
   * @returns 新创建的按钮
   */
  function createActionOrToolbar(defineColumn: SchemaColumnProps, rowData?: any): ReactNode {
    let newButton;
    let isCreate = false;

    if (defineColumn.visible) {
      if (typeof defineColumn.visible === 'boolean') {
        isCreate = defineColumn.visible;
      } else if (typeof defineColumn.visible === 'function') {
        isCreate = defineColumn.visible(rowData);
      }
    } else {
      isCreate = true;
    }
    if (!isCreate) {
      return newButton;
    }

    newButton = (
      <Button
        key={defineColumn.key}
        size={defineColumn.valueType === 'option' ? 'small' : 'middle'}
        type={defineColumn.valueType === 'option' ? 'link' : defineColumn.valueType || 'primary'}
        onClick={
          !defineColumn.confirmMessage
            ? () => {
                defaultActionButtonClick(defineColumn, rowData);
              }
            : undefined
        }
      >
        {(defineColumn.title as string) || ''}
      </Button>
    );

    let returnButtonNode: ReactNode;
    if (defineColumn.confirmMessage) {
      returnButtonNode = (
        <Popconfirm
          title="警告"
          description={defineColumn.confirmMessage}
          onConfirm={() => defaultActionButtonClick(defineColumn, rowData)}
          okText="确定"
          cancelText="取消"
          key={`${defineColumn.key}-popconfirm`}
        >
          {newButton}
        </Popconfirm>
      );
    } else {
      returnButtonNode = newButton;
    }
    return returnButtonNode;
  }

  /**
   * 将inDropdwonButtons中的按钮，组合创建Dropdown按钮
   * @param defineActionColumns 操作列的定义信息
   * @param inDropdwonButtons 需要在Dropdown按钮中显示的按钮
   * @param record table中每一行的实际数据
   * @returns 创建后的Dropdown按钮
   */
  function createDropdownActionButton(
    defineActionColumns: any[],
    inDropdwonButtons: React.ReactNode[],
    record: any,
  ): React.ReactNode {
    const items: MenuProps['items'] = defineActionColumns.map(
      (eachActionButton: any, index: number) => {
        return {
          key: eachActionButton.key,
          label: inDropdwonButtons[index],
        };
      },
    );

    return (
      <Dropdown menu={{ items }} key={`dropdown-${record.rowId}`}>
        <Space>
          <MoreOutlined rotate={90} style={{ marginLeft: 7, marginRight: 7, color: '#1677ff' }} />
        </Space>
      </Dropdown>
    );
  }

  /**
   * 创建table的操作列
   * @param actionColumns 操作列的定义信息
   * @param tableRowKey table的rowKey属性
   * @returns 创建的操作列
   */
  function createTableActionColumn(actionColumns: SchemaColumnProps[]): SchemaColumnProps {
    const tableActionColumn: ProColumns = {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      valueType: 'option',
      hideInSearch: true,
    };

    const MAX_DISPLAY_ACTION_BUTTON = 3;
    const ACTION_COLUMN_CLASS_NAME = 'table-action-column';

    tableActionColumn.render = (text, record) => {
      let allActionButtons = actionColumns.map((eachActionColumns) => {
        return createActionOrToolbar(eachActionColumns, record);
      });
      allActionButtons = allActionButtons.filter(
        (eachActionButton) => eachActionButton !== undefined,
      );
      // 操作按钮数量小于等于3时，直接显示
      if (allActionButtons.length <= MAX_DISPLAY_ACTION_BUTTON) {
        return <div className={`${ACTION_COLUMN_CLASS_NAME}`}>{allActionButtons}</div>;
      }

      const inDropdwonButtons = allActionButtons.slice(MAX_DISPLAY_ACTION_BUTTON); // 显示在dropdown中的操作按钮
      const defineActionColumns = actionColumns.slice(MAX_DISPLAY_ACTION_BUTTON); // 创建操作按钮的定义信息
      const displayActionButtons: React.ReactNode[] = allActionButtons.slice(
        0,
        MAX_DISPLAY_ACTION_BUTTON,
      );

      displayActionButtons.push(
        // 创建Dropdown按钮
        createDropdownActionButton(defineActionColumns, inDropdwonButtons, record),
      );
      return <div className={`${ACTION_COLUMN_CLASS_NAME}`}>{displayActionButtons}</div>;
    };
    return tableActionColumn as SchemaColumnProps;
  }

  useEffect(() => {
    // 创建Table中的列和操作列
    const { normalColumns, actionColumns } = analyzeColumns(columns || []);
    const _tableColumns = normalColumns.concat(createTableActionColumn(actionColumns));
    setTableColumns(_tableColumns);

    // 创建toolbar按钮
    const _toolbarButtons: ReactNode[] = [];
    toolbars?.forEach((eachToolbar) => {
      _toolbarButtons.push(createActionOrToolbar(eachToolbar));
    });
    setToolbarButtons(_toolbarButtons);
  }, []);

  return (
    <>
      <ProTable
        actionRef={actionRef}
        bordered
        cardBordered
        options={false}
        size="middle"
        rowKey={rowKey || 'id'}
        scroll={{ x: _totalColWidth.current + 500 }}
        columns={tableColumns}
        toolBarRender={toolbarButtons.length > 0 ? () => toolbarButtons : false}
        dataSource={dataSource}
        request={async (params, sort) => {
          setPageInfo(params.current, params.pageSize);
          const queryParams = {
            pageNum: params.current,
            ...params,
          };

          // 设置排序信息
          const orderFields: any[] = Object.keys(sort);
          let orderFieldName = '';
          let orderAscOrDesc = '';
          if (orderFields.length > 0) {
            orderFieldName = orderFields[0];
            orderAscOrDesc = sort[orderFields[0]]?.toString().replace('end', '') || '';
          }
          const queryPageTableData: any = await execRequest(
            requestUrl || '',
            requestMethod || 'POST',
            { ...queryParams, orderFieldName, orderAscOrDesc },
          );
          if (queryPageTableData.resultCode === '200') {
            let resultData = queryPageTableResultMapping(queryPageTableData);
            if (onLoadCompleted && typeof onLoadCompleted === 'function') {
              onLoadCompleted(resultData.data);
            }
            return resultData;
          } else {
            return [];
          }
        }}
        {...otherProps}
      />
      {popupForms?.map((eachPopupForm) => {
        const { key, title, layoutType, triggerKey, ...otherSchemaFormProps } = eachPopupForm;
        const openKey = triggerKey || '';
        return modalOpenState[openKey] ? (
          <div key="key">
            <SchemaForm
              {...otherSchemaFormProps}
              title={title}
              layoutType={layoutType}
              parentRef={actionRef}
              initialValues={currentOperateRowData.current}
              open={modalOpenState[openKey]}
              onOpenChange={(visible: any) => {
                let isOpen = visible;
                if (layoutType === 'ModalDescriptionForm') {
                  isOpen = false;
                }
                modalOpenState[openKey] = isOpen;
                setModalOpenState({ ...modalOpenState });
              }}
              columns={eachPopupForm.columns}
            />
          </div>
        ) : null;
      })}
    </>
  );
};

export default QueryPageTable;
