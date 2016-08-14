import React, {Component} from 'react';
import AddTodoInput from '../todo/AddTodoInput';
import TodoList from '../todo/TodoList';
class TodoPage extends Component {
  render() {
    return (
      <div>
        <AddTodoInput />
        <hr/>
        <TodoList />
      </div>
    );
  }
}

export default TodoPage;