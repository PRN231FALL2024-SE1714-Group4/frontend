import { Outlet } from 'react-router-dom';
import { AppLayout } from '@core/layout/AppLayout';

export const Dashboard = () => {
  return <AppLayout components={<Outlet />} />;
};
