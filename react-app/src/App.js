import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignupPage from './components/SignupPage'
import SignupCreateAccount from './components/SignupCreateAccount'
import Home from './components/Home'
import LoginPage from './components/LoginPage'

const CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='signup' element={<SignupPage/>}/>
          <Route path='create-account' element={<SignupCreateAccount/>}/>
          <Route path='home' element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>

  );
}

export default App;
