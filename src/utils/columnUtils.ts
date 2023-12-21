import axiosRequest from '../axios';
import { SchemaColumnProps } from '../components/types';
import { execRequest, valueListMapping } from './common';
/**
 * 根据字典类型，查询值列表信息
 * @param type 字典类型
 * @param valueIsboolean 字典值是否是boolean类型
 * @returns 值列表
 */
export async function queryDictByType(
  type: string,
  valueIsboolean?: boolean,
): Promise<Array<{ label: string; value: any }>> {
  const valueListDatas = await axiosRequest({
    url: '/dictTypes/queryDictByType',
    method: 'GET',
    params: { type },
  });
  const valueList = valueListMapping(valueListDatas, valueIsboolean);
  return valueList;
}

/**
 * 为列 添加字典值转换功能
 * @param column 列信息
 * @returns 添加功能后的列信息
 */
export function addDictConversionFunction(column: SchemaColumnProps): SchemaColumnProps {
  const _column = { ...column };
  // 需要值列表转换
  if (_column.dictType) {
    _column.request = async () =>
      queryDictByType(_column.dictType as string, _column.dictTypeValueIsBoolean);
  }
  return _column;
}

/**
 * 解析路径中的参数信息，返回解析后的路径信息
 * @param originalUrl 原路径(带有参数的路径)。格式: /system/dict/:id/:name
 * @param data 数据。路径的参数, 将从data中获取实际值
 */
export function resolvingPathParam(originalUrl: string, data: any): string {
  const urlParams: string[] = originalUrl?.split(/:/);
  let resolvedUrl = urlParams[0];
  if (urlParams.length > 1) {
    for (let index = 1; index < urlParams.length; index++) {
      resolvedUrl = `${resolvedUrl + String(data[urlParams[index].replace('/', '')])}/`;
    }
    resolvedUrl = resolvedUrl.substring(0, resolvedUrl.length - 1);
  }
  return resolvedUrl;
}

/**
 * 将参数定义，转换为ts的参数对象
 * @param strParam 参数定义。格式: id,name,code=12345
 * @param data 数据。没有初始值的参数，将从data中获取实际值
 */
export function resolvingParamsFromData(strParam: string, data: any): any {
  if (!(strParam && strParam.length > 0)) {
    return null;
  }
  const params = strParam.split(/,/);
  const paramObj: any = {};

  params.forEach((eachParam) => {
    if (eachParam.indexOf('=') > 0) {
      const specificParams = eachParam.split(/=/);
      const paramName = specificParams[0].trim();
      const paramValue: any = specificParams[1].trim();
      // if (paramValue.indexOf(':') >= 0) {
      //   console.log('paramValue indexOf :');
      //   const defineValue = paramValue.split(/:/);
      //   console.log('paramValue indexOf : defineValue:', defineValue);
      //   paramValue = useParams()[defineValue[1].trim()];
      // }
      paramObj[paramName] = paramValue;
    } else {
      paramObj[eachParam.trim()] = data[eachParam.trim()];
    }
  });
  return paramObj;
}

/**
 * 从路径中获取参数值
 * @param routePathDefine 路由定义的路径信息
 * @returns 获取的参数值
 */
export function resolvingParamsFromPath(routePathDefine: string) {
  const locationPathNames = window.location.pathname.split(/\//);
  const routePaths = routePathDefine.split(/\//);
  const paramObj: any = {};
  routePaths.forEach((eachRoutePath, index) => {
    if (eachRoutePath.trim().startsWith(':')) {
      const paramName = eachRoutePath.trim().substring(1);
      const value = locationPathNames[index];
      paramObj[paramName] = value;
    }
  });

  return paramObj;
}
/**
 * 解析后params后, 调用后端接口
 * @param url 请求url
 * @param method 请求方法
 * @param params 请求参数
 * @param record 实际table行中的记录
 * @param routePathDefine 路由定义信息
 * @returns 调用结果
 */
export async function execRequestResolvingParams(
  url: string,
  method: string,
  params: string,
  record: any,
  routePathDefine?: string,
) {
  let paramObj: any = {};
  if (routePathDefine) {
    paramObj = resolvingParamsFromPath(routePathDefine);
  } else {
    paramObj = resolvingParamsFromData(params, record);
  }

  console.log('paramObj:', paramObj);
  return execRequest(url, method, paramObj);
}
