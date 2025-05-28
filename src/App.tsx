import { createTheme, MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import './App.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { Header } from './components/header/Header';
import { TopHeader } from './components/header/TopHeader';
import { Footer } from './components/Footer/Footer';
import AuthoPage from './pages/AuthoPage';
import ResetPassword from './components/Autho/ResetPasswrod';
// Import other pages as needed

function App() {
  const theme = createTheme({
    // Your existing theme configuration
  });

  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" zIndex={1000} />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          {/* <TopHeader />
          <Header /> */}
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<AuthoPage />} />
              <Route path="/register" element={<AuthoPage />} />
              {/* Other routes */}
            </Routes>
          </main>
          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;