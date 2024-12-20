import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignupPage from './components/authorization/SignupPage'
import SignupCreateAccount from './components/authorization/SignupCreateAccount'
import Home from './components/Home'
import LoginPage from './components/authorization/LoginPage'
import Layout from './components/layout/Layout'
import { CreateWorkspaceItemProvider } from './contexts/CreateWorkspaceItemContext'
import Board from './components/board/Board'
import WorkspaceItemDeleted from './components/workspace_and_items/WorkspaceItemDeleted'
import Document from './components/document/Document'
import ManageWorkspace from './components/layout/sidebar/workspace/ManageWorkpace'
import { BoardValuesProvider } from './contexts/BoardValuesContext'
import { BoardViewsProvider } from './contexts/BoardViewsContext'
import { UserContextProvider } from './contexts/UserContext'

const CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <CreateWorkspaceItemProvider>
        <UserContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<LoginPage />} />
              <Route path='signup' element={<SignupPage />} />
              <Route path='create-account' element={<SignupCreateAccount />} />
              <Route element={<Layout />}>
                <Route path='home' element={ <Home /> } />
                  <Route path='board' element={<BoardValuesProvider> <BoardViewsProvider> <Board /> </BoardViewsProvider></BoardValuesProvider>}/>
                  <Route path='workspace-item-deleted' element={<BoardValuesProvider> <BoardViewsProvider> <WorkspaceItemDeleted /> </BoardViewsProvider></BoardValuesProvider>}/>
                  <Route path='docs' element={ <Document/> }/>
                  <Route path='manage-workspace' element={ <ManageWorkspace/> }/>
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContextProvider>
      </CreateWorkspaceItemProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
