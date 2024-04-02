import { ChatPage, LoginPage } from '../pages';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { DashboardProvider } from '../context';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LoginPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Route>
  )
);

export default function IntegraRouter() {
  return (
    <DashboardProvider>
      <RouterProvider router={router} />
    </DashboardProvider>
  );
}