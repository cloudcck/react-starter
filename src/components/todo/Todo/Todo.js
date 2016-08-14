import React, {Component} from 'react';

class Todo extends Component {
  render() {
    return (
      <li className="todo"
        onClick={this.props.onClick}>
        {JSON.stringify(this.props.todo.completed) } - {this.props.todo.text}
      </li>
    );
  }
}

export default Todo;