import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './App.css';
import logo from './logo.svg';
import ListItem from './ListItem';
import loadingGif from './loading.gif';


class App extends Component {
  constructor() {
    super();
    this.state = {
      newTodo: '',
      editing: false,
      editingIndex: null,
      notification: null,
      todos: [],
      loading: true
    };

    this.addTodo = this.addTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideNotification = this.hideNotification.bind(this);
  }

  async componentDidMount() {
    const todos = await this.props.todoService.getTodos();
    this.setState({
      todos,
      loading: false
    });
  }

  handleChange(event) {
    this.setState({
      newTodo: event.target.value
    });
  }

  async addTodo() {
    const todo = await this.props.todoService.addTodo(this.state.newTodo);

    this.setState({
      todos: [
        ...this.state.todos, todo
      ],
      newTodo: '',
      notification: 'Todo added successfully.'
    }, () => this.hideNotification());
  }

  editTodo(index) {
    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index
    });
  }

  async updateTodo() {
    const todo = this.state.todos[this.state.editingIndex];
    const updatedTodo = await this.props.todoService.updateTodo(todo.id, this.state.newTodo);
    const todos = [ ...this.state.todos ];
    todos[this.state.editingIndex] = updatedTodo;
    this.setState({
      todos,
      editing: false,
      editingIndex: null,
      newTodo: '',
      notification: 'Todo updated successfully.'
    }, () => this.hideNotification());
  }

  hideNotification(notification) {
    setTimeout(() => {
      this.setState({
        notification: null
      });
    }, 2000);
  }

  async deleteTodo(index) {
    const todo = this.state.todos[index];

    await this.props.todoService.deleteTodo(todo.id);

    this.setState({ 
      todos: [
        ...this.state.todos.slice(0, index),
        ...this.state.todos.slice(index + 1)
      ],
      notification: 'Todo deleted successfully.'
    }, () => this.hideNotification());
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">CRUD React</h1>
        </header>
        <div className="container">
          {
            this.state.notification &&
            <div className="alert mt-3 alert-success">
              <p className="text-center">{this.state.notification}</p>
            </div>
          }
          <input
            type="text"
            name="todo"
            className="my-4 form-control"
            placeholder="Add a new todo"
            onChange={this.handleChange}
            value={this.state.newTodo}
            data-testid="todo-input"
          />
          <button
            onClick={this.state.editing ? this.updateTodo : this.addTodo}
            className="btn-success mb-3 form-control"
            disabled={this.state.newTodo.length < 5}
            data-testid="todo-button"
          >
            {this.state.editing ? 'Update todo' : 'Add todo'}
          </button>
          {
            this.state.loading &&
            <img src={loadingGif} alt=""/>
          }
          {
            (!this.state.editing || this.state.loading) &&
            <ul className="list-group" data-testid="todos-ul">
              {this.state.todos.map((item, index) => {
                return <ListItem
                  key={item.id}
                  item={item}
                  editTodo={() => { this.editTodo(index); }}
                  deleteTodo={() => { this.deleteTodo(index); }}
                />;
              })}
            </ul>
          }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  todoService: PropTypes.shape({
    getTodos: PropTypes.func.isRequired,
    addTodo: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired
  })
};

export default App;
