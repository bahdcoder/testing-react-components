import React from 'react'; 
import { render, Simulate, flushPromises } from 'react-testing-library';

import App from './App';

import FakeTodoService from './service/FakeTodoService';

jest.useFakeTimers();

describe('The App Component', () => {
  const todos = [{
    id: 1,
    name: 'Make hair',
  }, {
    id: 2,
    name: 'Buy some KFC',
  }];
  const todoService = new FakeTodoService(todos);
  test('gets todos when component is mounted and displays them', async () => {
    // Spy on getTodos function 
   const getTodosSpy = jest.spyOn(todoService, 'getTodos');

   // Mount the component
   const { container, getByTestId } = render(<App todoService={todoService} />);

   // Wait for the promise that fetches todos to resolve so that the list of todos can be displayed
   await flushPromises();

   // Find the unordered list of todos
   const unorderedListOfTodos = getByTestId('todos-ul');
    
   // Expect that it has two children, since our service returns 2 todos.
   expect(unorderedListOfTodos.children.length).toBe(2);  

   // Expect that the spy was called
    expect(getTodosSpy).toHaveBeenCalled();
  });

  describe('creating todos', () => {
    test('the add todo button is disabled if user types in a todo with less than 5 characters, and enabled otherwise', async () => {
         // Mount the component
        const { container, getByTestId } = render(<App todoService={todoService} />);

        // Wait for the promise that fetches todos to resolve so that the list of todos can be displayed
        await flushPromises();

        // Find the add-todo button and the todo-input element using their data-testid attributes
        const addTodoButton = getByTestId('todo-button');
        const todoInputElement = getByTestId('todo-input');

        // Expect that at this point when the input value is empty, the button is disabled.
        expect(addTodoButton.disabled).toBe(true);

        // Change the value of the input to have four characters
        todoInputElement.value = 'ABCD';
        Simulate.change(todoInputElement);

        // Expect that at this point when the input value has less than 5 characters, the button is still disabled.
        expect(addTodoButton.disabled).toBe(true);
        
        // Change the value of the input to have five characters
        todoInputElement.value = 'ABCDE';
        Simulate.change(todoInputElement);

        // Expect that at this point when the input value has 5 characters, the button is enabled.
        expect(addTodoButton.disabled).toBe(false);
    });

    test('clicking the add todo button should save the new todo to the api, and display it on the list', async () => {
        const NEW_TODO_TEXT = 'OPEN_PULL_REQUEST';
        // Spy on getTodos function 
        const addTodoSpy = jest.spyOn(todoService, 'addTodo');

          // Mount the component
        const { container, getByTestId, queryByText } = render(<App todoService={todoService} />);

        // Wait for the promise that fetches todos to resolve so that the list of todos can be displayed
        await flushPromises();

        // Find the add-todo button and the todo-input element using their data-testid attributes
        const addTodoButton = getByTestId('todo-button');
        const todoInputElement = getByTestId('todo-input');

        // Change the value of the input to have more than five characters
        todoInputElement.value = NEW_TODO_TEXT;
        Simulate.change(todoInputElement);

        // Simulate a click on the addTodo button
        Simulate.click(addTodoButton);

        // Since we know this makes a call to the api, and waits for a promise to resolve before proceeding, let's flush it.
        await flushPromises();     
        
        // Let's find an element with the text content of the newly created todo
        const newTodoItem = queryByText(NEW_TODO_TEXT);

        // Expect that the element was found, and is a list item
        expect(newTodoItem).not.toBeNull();
        expect(newTodoItem).toBeInstanceOf(HTMLLIElement);

        // Expect that the api call was made
        expect(addTodoSpy).toHaveBeenCalled();
    });
  });
});