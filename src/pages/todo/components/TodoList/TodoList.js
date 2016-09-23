import React, {Component} from 'react';
import { connect } from 'react-redux';
import Todo from '../Todo';
import {toggleTodo, fetchTodosFromApi} from '../../actions';
class TodoList extends Component {
  constructor(props) {
    super(props);
    console.log('TodoList props', JSON.stringify(props, null, 2));
    // this.props.fetchTodosFromApi();
  }
  componentDidMount() {
    this.props.fetchTodosFromApi();
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

const mapStateToProps = (state, ownProps = {}) => {
  return {
    todos: state.get('todos').toJS()
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id));
    },
    fetchTodosFromApi: () => {
      dispatch(fetchTodosFromApi());
    }
  };
}

TodoList = connect(mapStateToProps,mapDispatchToProps)(TodoList);
export default TodoList;
