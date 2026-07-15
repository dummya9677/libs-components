import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { AppAuthProvider } from '@/context/AuthProvider';
import { router } from '@/routes';
import '@/index.css';

export default function App() {
  return (
    <Provider store={store}>
      <AppAuthProvider>
        <RouterProvider router={router} />
      </AppAuthProvider>
    </Provider>
  );
}
