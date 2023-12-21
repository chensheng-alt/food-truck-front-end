import { Navigate } from 'umi';
import QueryFoodTrucks from '@/pages/food-trucks/QueryFoodTrucks';

export interface RouteConfigProps {
  name?: string;
  key: string;
  label?: string;
  icon?: React.ReactNode;
  path?: string;
  redirect?: string;
  tabs?: { removeDom?: boolean };
  menus?: { openKeys?: string[]; selectedKeys: string[] };
  hideInMenu?: boolean;
  children?: RouteConfigProps[];
  element?: React.ReactNode;
  breadcrumbItems?: any[];
}

export interface RouteProps {
  id: string;
  path?: string;
  name?: string;
  key?: string;
  parentId?: string;
  menus?: { openKeys?: string[]; selectedKeys: string[] };
  tabs?: any;
  element?: React.ReactNode;
  breadcrumbItems?: any[];
  hideInMenu?: boolean;
  children?: RouteProps[];
}

export const routesConfig: RouteConfigProps[] = [
  {
    name: 'root',
    key: 'root',
    path: '/',
    redirect: '/foodTrucks',
    hideInMenu: true,
  },
  {
    name: 'Food Truck Manage',
    key: 'foodTruckManage',
    path: '/',
    redirect: '/foodTrucks',
    children: [
      {
        name: 'Food Trucks',
        key: 'foodTrucks',
        path: '/foodTrucks',

        breadcrumbItems: [{ title: 'Food Trucks' }],
        element: <QueryFoodTrucks />,
      },
    ],
  },
];

const PARENT_LAYOUT_ID = '@@/global-layout';
export const redirectRoutes: any[] = [];

/**
 * 将自定义路由信息，转换为一层数组路由信息
 * @param customRoutesConfig 自定义路由信息
 * @param parentRoute 父路由信息
 * @returns 标准一层数组路由信息
 */
export function getRouteInfoFromRoutesConfig(
  customRoutesConfig: RouteConfigProps[],
  parentRoute?: RouteProps,
): RouteProps[] {
  const parentLayoutId = parentRoute?.id || PARENT_LAYOUT_ID;
  const sameLevelRoutes: RouteProps[] = [];

  customRoutesConfig.forEach((eachRoute) => {
    if (eachRoute.redirect) {
      redirectRoutes.push({
        path: eachRoute.path,
        key: eachRoute.key,
        element: <Navigate to={eachRoute.redirect} replace />,
      });
    }

    const currentRoute: RouteProps = {
      id: eachRoute.key,
      parentId: parentLayoutId,
      path: eachRoute.path,
      name: eachRoute.name,
      key: eachRoute.key,
      element: eachRoute.element,
      tabs: eachRoute.tabs,
      menus: eachRoute.menus,
      breadcrumbItems: eachRoute.breadcrumbItems,
      hideInMenu: eachRoute.hideInMenu,
    };

    if (eachRoute.children && eachRoute.children.length > 0) {
      const childRoutes = getRouteInfoFromRoutesConfig(eachRoute.children, currentRoute);
      if (childRoutes?.length > 0) {
        currentRoute.children = [...childRoutes];
      }
    }

    sameLevelRoutes.push(currentRoute);
  });

  return sameLevelRoutes;
}

export const allRoutes = getRouteInfoFromRoutesConfig(routesConfig);