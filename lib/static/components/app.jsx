import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Report from './report.jsx';

export default class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          isLoading: true,
          data: null,
          error: null,
      };
  }

  componentDidMount() {
      fetch('./data.json')
          .then(res => res.json())
          .then(
              ({root: data}) => this.setState({isLoading: false, data}),
              (error) => this.setState({isLoading: false, error})
          );
  }

  render() {
      if (this.state.isLoading) {
          return (<div>Loading...</div>);
      }

      if (this.state.error) {
          return (<div>Error: {this.state.error}</div>);
      }

      const {data} = this.state;

      return (
          <MuiThemeProvider>
              <Report data={data} />
          </MuiThemeProvider>
      );
  }
}
