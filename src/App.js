import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import AuthPage from './pages/AuthPage';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import AuthContext from './store/auth-context';
import UsersPage from './pages/UsersPage';
import OtpCodePage from './pages/OtpCodePage';

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        <Route path='/auth' exact>
        <AuthPage />
        </Route>
        {!authCtx.isLoggedIn && (
          <Route path='/auth'>
            <AuthPage />
          </Route>
        )}
        <Route path='/forget/password'>
          <ForgetPasswordPage/>
        </Route>
        <Route path='/otp'>
          <OtpCodePage/>
        </Route>
        <Route path='/users'>
        {authCtx.isLoggedIn && <UsersPage/>}
        {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>
        <Route path='*'>
        {authCtx.isLoggedIn && <Redirect to='/users' />}
        {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;