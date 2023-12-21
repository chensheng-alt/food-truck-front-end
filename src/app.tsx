// 运行时配置
import { RunTimeLayoutConfig } from '@umijs/max';
import { allRoutes, redirectRoutes } from './routes';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'Composite-front-end' };
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    title: 'Food Trucks',
    layout: 'side',
    menu: {
      locale: false,
    },
    actionsRender: () => [], // 隐藏左侧菜单底部的action显示部分
    token: {
      sider: {
        colorTextMenuTitle: '#FFFFFF', // sider 的标题字体颜色
        colorMenuItemDivider: 'rgba(255, 255, 255, 0.06)', // menuItem 分割线的颜色
        colorBgMenuItemSelected: '#1677ff', // 菜单项选中后的背景颜色。蓝色
        colorMenuBackground: 'linear-gradient(#141414, #000000 28%)', // menu 的背景颜色
        colorTextMenu: 'rgba(255, 255, 255, 0.6)', // menuItem 的字体颜色
        colorTextMenuItemHover: '#FFFFFF', // menuItem 的 hover 字体颜色
        colorTextMenuSelected: '#FFFFFF', // menuItem 的选中字体颜色
        colorBgCollapsedButton: '#EFEFEF', // 展开收起按钮背景颜色
      },
    },
  };
};

export function patchClientRoutes({ routes }: { routes: any[] }) {
  if (routes && routes.length > 0) {
    // eslint-disable-next-line no-param-reassign
    routes[0].children[0].children = allRoutes;
    routes[0].children[0].routes = allRoutes;
    routes[0].routes = allRoutes;
    console.log('routes:', routes);
  }

  routes.unshift(...redirectRoutes);
}
