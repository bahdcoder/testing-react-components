/**
 * A todo service that communicates with the api to perform CRUD on todos.
 */
export default class TodoService {
  constructor(client) {
    this.client = client;
  }

  async getTodos() {
    const { data } = await this.client.get('/todos');
    return data;
  }

  async addTodo(name) {
    const { data } = await this.client.post('/todos', { name });

    return data;
  }

  async updateTodo(id, name) {
    const { data } = await this.client.put(`/todos/${id}`, { name });

    return data;
  }

  async deleteTodo (id) {
    await this.client.delete(`/todos/${id}`);

    return true;
  }
}
