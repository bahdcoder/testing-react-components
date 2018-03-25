import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';

import App from './App';
import { apiUrl } from './config';

import TodoService from './service/Todo';

const client = axios.create({
  baseURL: apiUrl,
});

const todoService = new TodoService(client);

ReactDOM.render(<App todoService={todoService} />, document.getElementById('root'));
