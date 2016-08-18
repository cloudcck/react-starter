import React, {Component} from 'react';
import { connect } from 'react-redux';
import {addTodo} from '../../actions';
class AddTodoInput extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };
    this.addNewTodo = this.addNewTodo.bind(this);
  }

  addNewTodo(event) {
    event.preventDefault();
    const todoText = this.foo.value;
    console.log('this.foo :', this.foo.value);
    this.props.dispatch(addTodo(todoText));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.addNewTodo} >
          <input ref={node => { this.foo = node; } }/>
          <button className="btn">
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    );
  }


}
AddTodoInput = connect()(AddTodoInput);
export default AddTodoInput;