import React, {Component} from 'react';
import { connect } from 'react-redux';
import {addTodo} from '../../../actions';
class AddTodoInput extends Component {
  constructor(props) {
    super(props);
   
    this.state = { inputValue: '' };
    this.inputChange = this.inputChange.bind(this);
    this.addNewTodo = this.addNewTodo.bind(this);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.addNewTodo} >
          <input type="text" onChange={this.inputChange}/>
          <button className="btn">
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    );
  }

  inputChange(e) {
    this.setState({ inputValue: e.target.value });
  }
  addNewTodo(event) {
    event.preventDefault();
    this.props.dispatch(addTodo(this.state.inputValue));
  }
}
AddTodoInput = connect()(AddTodoInput);
export default AddTodoInput;