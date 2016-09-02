import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router';
import { IImportState, Back, Next, storage } from './common';

export default class File extends Component<{},IImportState> {

  fileInput: any;

  constructor() {
    super();
    this.state = Object.assign({}, storage.load());
  }

  handleFileSelect = (event) => {
    let file = event.target.files[0];
    if(file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.setState({
          file: {
            name: file.name,
            content: e.target.result
          }
        }, () => storage.save(this.state));
      };
      reader.readAsText(file);
    }
  };

  handleStartOver = () => {
    this.setState({
      file: undefined,
      delimiter: undefined,
      hasHeader: undefined,
      rows: undefined,
      filename: undefined,
      columns: undefined,
      teams: undefined,
      locations: undefined
    }, () => storage.save(this.state));

  }

  get canMoveNext(): boolean {
    return !this.state.file;
  }

  file() {
    if(this.state.file) {
      return (
        <div>
          <h3>File</h3>
          <div className="form-group">
            <input className="form-control" disabled value={this.state.file.name} />
          </div>
          <pre>{this.state.file.content}</pre>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div style={{display: 'none'}}>
        <input type="file"
          ref={(ref) => this.fileInput = ref}
          onChange={this.handleFileSelect}></input>
        </div>
        <div>
          <button
            className="btn btn-default"
            onClick={() => this.fileInput.click()}>
            <i className="fa fa-upload"/>
            {" "}Upload File
          </button>
          {" "}
          <button
            className="btn btn-default"
            onClick={this.handleStartOver}>
            <i className="fa fa-refresh"/>
            {" "}Start Over
          </button>
        </div>
        <hr/>
        <Back disabled={true}/>
        {" "}
        <Next
          disabled={this.canMoveNext}
          to="/games/import/data"/>
        {this.file()}
      </div>
    );
  }

}
