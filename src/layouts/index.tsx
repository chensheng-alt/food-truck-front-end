import { Outlet, useRouteProps } from 'umi';

export default function Layout() {
  console.log('useRouteProps:', useRouteProps());

  return (
    <div>
      <div style={{ backgroundColor: '#FFF' }}>
        <Outlet />
      </div>
    </div>
  );
}
