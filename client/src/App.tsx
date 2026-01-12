import './App.css'
import { BrowserRouter} from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';


function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <BrowserRouter>
        <AppRoutes/>
        <Toaster/> 
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
