import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {

    let data = new FormData()
    let params = {
      type: 'post',
      text: this.state.value
    }

    data.append('json', JSON.stringify(params));

    fetch(`http://mainframe.fraction.io:3000/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
			console.log(json.data)
		})
		.then(() => {
      let params = {
        id: this.state.id
      };

      let queryString = new URLSearchParams()

      for (var p in params) {
        queryString.append(p, params[p])
      }

			fetch(`http://mainframe.fraction.io:3000/create-user-stream?${queryString}`)
				.then(function(response) {
				return response.json();
			})
			.then((json) => {
				console.log(json.data)
				return this.setState({userStream: [].concat(json.data).map((x) => x && x.value && x.value.content && x.value.content.text && <div>{x.value.content.text}</div>)})
			});
		})
		event.preventDefault();
	}

	componentDidMount() {
		fetch('http://mainframe.fraction.io:3000/whoami')
		.then(function(response) {
			return response.json();
		})
		.then((json) => {
			this.setState({id: json.data.id})
			return json.data.id
		})
		.then(() => {
      let params = {
        id: this.state.id
      };

      let queryString = new URLSearchParams()

      for (var p in params) {
        queryString.append(p, params[p])
      }

			fetch(`http://mainframe.fraction.io:3000/create-user-stream?${queryString}`)
				.then(function(response) {
				return response.json();
			})
			.then((json) => {
				console.log(json.data)
				return this.setState({userStream: [].concat(json.data).map((x) => x && x.value && x.value.content && x.value.content.text && <div>{x.value.content.text}</div>)})
			});
		})
  }

	render() {
		return (
			<div className="App">
			<header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			<h1 className="App-title">{this.state.id}</h1>
			</header>
			<br />
			<form onSubmit={this.handleSubmit}>
			<label>
			<input type="text" value={this.state.value} onChange={this.handleChange} />
			</label>
			<input type="submit" value="Submit" />
			</form>
			<center>
			<div>{this.state.userStream}</div>
			</center>
			</div>
		);
	}
}

export default App;
