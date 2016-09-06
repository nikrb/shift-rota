import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// TODO: we don't use style/style2 but seems to import all the css
import style from '../scss/app.scss';
import style2 from '../scss/react-datetime.css';

import Bootstrap from 'bootstrap-without-jquery';

import Layout from './pages/Layout';
import Rota from './pages/Rota';
import Shifts from './pages/Shifts';
import Users from './pages/Users';
import Settings from './pages/Settings';

const app = document.getElementById('app');
ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Layout} >
      <IndexRoute component={Rota} ></IndexRoute>
      <Route path="shifts" name="shifts" component={Shifts} ></Route>
      <Route path="user" name="users" component={Users} ></Route>
      <Route path="settings" name="settings" component={Settings} ></Route>
    </Route>
  </Router>,
app);
