import '@mantine/carousel/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthoPage from './pages/AuthoPage';
import AdminPage from './pages/MyshopPage/AdminRoute';
import MyshopPage from './pages/MyshopPage/MyshopRoute';
import UserPage from './pages/MyshopPage/UserRote';

function App() {
  const theme = createTheme({
    primaryColor: 'blue',
    colors: {
      blue: [
        '#f0faff', // 50
        '#e0f5fe', // 100
        '#bae8fd', // 200
        '#7dd5fc', // 300
        '#38bcf8', // 400
        '#0ea5e9', // 500 - primary
        '#028ac7', // 600
        '#0370a1', // 700
        '#075e85', // 800
        '#0c506e', // 900
        '#083549', // 950
      ],
    },
    fontFamily: 'Inter var, ui-sans-serif, system-ui, sans-serif',
    defaultRadius: 'md',
    components: {
      Input: {
        styles: {
          root: { '&:focus': { borderColor: '#0ea5e9' } }
        },
      },
      Button: {
        defaultProps: {
          color: '#0ea5e9',
        },
      },
    },
  });


  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" zIndex={1000} />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<AuthoPage />} />
              <Route path="/register" element={<AuthoPage />} />
              <Route path="/myshop/*" element={<MyshopPage />} />
              <Route path="admin/*" element={<AdminPage />} />
              <Route path="/*" element={<UserPage />}/>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
