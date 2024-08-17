import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import GoogleLogIn from './components/GoogleLogIn'
import LogOut from './components/LogOut'
const CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div>
        <p className="text-green-600 text-center font-bold text-8xl">hello</p>
        <GoogleLogIn/>
      </div>  
    </GoogleOAuthProvider>

  );
}

export default App;
