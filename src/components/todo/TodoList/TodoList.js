import React, {Component} from 'react';
import { connect } from 'react-redux';
import Todo from '../Todo';
import {toggleTodo} from '../../../actions';
class TodoList extends Component {
  constructor(props) {
    super(props);
    console.log('TodoList props', JSON.stringify(props, null, 2));
  }

  render() {
    return (
      <ul>
        {
          this.props.todos.map(todo =>
            <Todo key={todo.id}
              todo={todo}
              {...todo}
              onClick={() => this.props.onTodoClick(todo.id) }
              />
          )
        }
      </ul>
    );
  }
}
TodoList = connect(
  (state, ownProps = {}) => {
    return {
      todos: state.get('todos').toJS()
    }
  },
  (dispatch) => {
    return {
      onTodoClick: (id) => {
        dispatch(toggleTodo(id))
      }
    }
  }
)(TodoList);
export default TodoList;