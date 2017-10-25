import React, { Component } from 'react';
import './Submit.css';

export default class Submit extends Component {
  constructor(props) {
    super(props);

    this.state = { questionText: '', showName: true };
    this.handleQuestionTextChange = this.handleQuestionTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowNameCheck = this.handleShowNameCheck.bind(this);
  }

  handleQuestionTextChange(e) {
    this.setState({ questionText: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    let q = {
      content: this.state.questionText,
      anonymous: !this.state.showName,
    }

    this.props.onQuestionAdded(q)
  }

  handleShowNameCheck(e) {
    this.setState({ showName: !this.state.showName });
  }

  questionSubmission() {
    if (!this.props.questionSubmissionEnabled) {
      return (
        <div className="alert alert-primary" role="alert">
          Question submission is now closed.
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <h1>Ask a question</h1>
        {this.questionSubmissionEnabled}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="questionText">Question</label>
            <textarea className="form-control"
                id="questionText"
                value={this.state.questionText}
                onChange={this.handleQuestionTextChange}
                disabled={!this.props.questionSubmissionEnabled}/>
          </div>
          <div className="form-group">
            <label className="form-check-label">
              <input type="checkbox"
                  className="form-check-input"
                  id="showName"
                  aria-describedby="showNameHelp"
                  value={this.state.showName}
                  checked={this.state.showName}
                  onChange={this.handleShowNameCheck}
                  disabled={!this.props.questionSubmissionEnabled} />
              {' '}Show my name
            </label>
            <small id="showNameHelp" className="form-text text-muted">
              Remember our core value: “Communicate openly”. Please only hide
              your name if truly necessary. Having anonymous questions depends
              on all of us using this privilege responsibly.
            </small>
          </div>
          <button type="submit"
              className="btn btn-primary"
              disabled={!this.props.questionSubmissionEnabled}>Ask</button>
        </form>
      </div>
    );
  }
}
