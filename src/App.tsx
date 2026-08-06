import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
    <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
