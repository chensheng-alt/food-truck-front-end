import axiosRequest from '../axios';

export function arrayCompare(obj1: any, obj2: any, colName: string): number {
  const order1 = obj1[`${colName}`] || 999;
  const order2 = obj2[`${colName}`] || 999;
  return order1 - order2;
}

/**
 * 将分页查询结果数据，转换为统一的数据结构
 * @param result 分页查询结果数据
 * @returns 转换后的数据结果
 */
export function queryPageTableResultMapping(result: any) {
  return {
    success: true,
    data: result.data.list || result.data.records,
    total: result.data.total,
    pageSize: result.data.pageSize,
    current: result.data.pageNum,
  };
}

/**
 * 将值列表数据{name, value}转换为统一的{label, value}格式
 * @param result 值列表结果数据
 * @param convertBoolean 值列表数据是否是boolean类型
 * @returns 值列表数据
 */
export function valueListMapping(
  result: any,
  convertBoolean?: boolean,
): Array<{ label: string; value: any }> {
  return result.data?.map((eachData: any) => {
    if (convertBoolean) {
      return {
        label: eachData.name,
        value: eachData.value === '1',
      };
    } else {
      return {
        label: eachData.name,
        value: eachData.value,
      };
    }
  });
}

/**
 * 后端url调用方法
 * @param url 调用的url
 * @param method 调用方法
 * @param params 参数
 * @returns 调用结果
 */
export async function execRequest(url: string, method?: string, params?: any): Promise<any> {
  const requestInfo: any = { method: method || 'GET' };
  if (requestInfo.method.toLocaleLowerCase() === 'get') {
    requestInfo.params = params;
  } else {
    requestInfo.data = params;
  }

  const result = await axiosRequest({
    url,
    ...requestInfo,
  });
  return result;
}
