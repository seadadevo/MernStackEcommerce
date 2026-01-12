import './App.css'
import { BrowserRouter} from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import AppRoutes from './routes/AppRoutes';



function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
