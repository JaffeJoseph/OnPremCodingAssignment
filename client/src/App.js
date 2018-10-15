"use-strict";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencilAlt,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      //items: array of all employees fullname: "string", DOB: "string", role: "string", id: "string"
      items: [],
      //employee: object containing employee currently being edited or added
      employee: { fullName: "", DOB: "", role: "" },
      //id: string containing currently edited employee id
      id: null
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDOBChange = this.handleDOBChange.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.addEmployee = this.addEmployee.bind(this);
  }

  //fetch data from server
  fetchData() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "default"
    };

    fetch("http://localhost:3000/employees", myInit)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
    console.log(this.state);
  }

  componentDidMount() {
    this.fetchData();
  }

  //add employee passing the state.employee object into the body of the POST request
  addEmployee(event) {
    event.preventDefault();
    fetch("http://localhost:3000/employees", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify(this.state.employee)
    }).then(response => response.json());
    console.log(this.state.employee);
    this.fetchData();
  }

  //remove employee passing the stored id/key of the clicked employee div into the DELETE request
  removeEmployee(id) {
    fetch("http://localhost:3000/employees/" + id, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      redirect: "follow",
      referrer: "no-referrer"
    })
      .then(res => res)
      .catch(err => console.error(err));
    this.fetchData();
  }

  //start editing the employee by setting the controlled inputs in the form to the clicked employee
  //also sets the state.id variable
  startEditEmployee(employee) {
    let empl = { ...this.state.employee };
    empl.fullName = employee.fullName;
    empl.DOB = employee.DOB;
    empl.role = employee.role;
    this.setState({ employee: empl, id: employee.id });
  }

  //submits the curently selected employee with any added changes passing in the id and changes
  //to the PATCH request
  submitEditEmployee(id) {
    if (id) {
      fetch("http://localhost:3000/employees/" + id, {
        method: "PATCH",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify(this.state.employee)
      })
        .then(res => res)
        .catch(err => console.error(err));
      this.fetchData();
    }
  }

  handleNameChange(event) {
    let employee = { ...this.state.employee };
    employee.fullName = event.target.value;
    this.setState({ employee: employee });
    console.log(this.state.employee);
  }

  handleDOBChange(event) {
    let employee = { ...this.state.employee };
    employee.DOB = event.target.value;
    this.setState({ employee: employee });
    console.log(this.state.employee);
  }

  handleRoleChange(event) {
    let employee = { ...this.state.employee };
    employee.role = event.target.value;
    this.setState({ employee: employee });
    console.log(this.state.employee);
  }

  //render employee jsx for the table
  renderItems(items) {
    return items.map(item => {
      return (
        <div className="employee" key={item.id}>
          <div className="employee-name">{item.fullName}</div>
          <div className="employee-DOB">{item.DOB}</div>
          <div className="employee-role">{item.role}</div>
          <button
            className="employee-delete"
            data={item.id}
            onClick={() => this.removeEmployee(item.id)}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
          <button
            className="employee-edit"
            data={item.id}
            onClick={() => this.startEditEmployee(item)}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="App">
        <div className="header">Employees</div>
        <div className="table">
          <div className="table-header">
            <div className="table-header_name">Full Name</div>
            <div className="table-header_DOB">DOB</div>
            <div className="table-header_role">Role</div>
            <button
              className="table-header_employee-edit"
              onClick={() => this.submitEditEmployee(this.state.id)}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>
          <form onSubmit={this.addEmployee} className="table-edit">
            <input
              type="text"
              value={this.state.employee.fullName}
              onChange={this.handleNameChange}
              className="table-edit_name"
            />
            <input
              type="text"
              value={this.state.employee.DOB}
              onChange={this.handleDOBChange}
              className="table-edit_DOB"
            />
            <input
              type="text"
              value={this.state.employee.role}
              onChange={this.handleRoleChange}
              className="table-edit_role"
            />
            <button className="table-edit_submit" type="submit" value="Add">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </form>
          <div className="table-body">{this.renderItems(this.state.items)}</div>
        </div>
      </div>
    );
  }
}

export default App;
