import React, {Component} from 'react';
import {connect} from 'react-redux';
import AddTodoInput from '../AddTodoInput';
import TodoList from '../../components/TodoList';
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
