import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { AuthContextProvider } from './store/auth-context';
import { Provider } from 'react-redux';
import store from './store/index'

ReactDOM.render(
  <AuthContextProvider>
    <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>  
    </BrowserRouter>
  </AuthContextProvider>,
  document.getElementById('root')
);