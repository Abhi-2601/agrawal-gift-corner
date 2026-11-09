import { Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';

export default function StorefrontLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
