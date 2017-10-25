import React from 'react';

import './Presentation.css';

export default class Presentation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionIndex: 0,
    }

    this.onPrevious = this.onPrevious.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  componentWillMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    switch (e.key) {
      case 'PageDown':
        this.onNext(e);
        break;
      case 'PageUp':
        this.onPrevious(e);
        break;
      default:
        break;
    }
  }

  onPrevious(e) {
    e.preventDefault();
    if (this.state.questionIndex <= 0) {
      return;
    }
    this.setState({ questionIndex: this.state.questionIndex - 1 });
  }

  onNext(e) {
    e.preventDefault();
    if (this.state.questionIndex >= this.props.questions.length - 1) {
      return;
    }
    this.setState({ questionIndex: this.state.questionIndex + 1 });
  }

  previousItem() {
    if (this.state.questionIndex <= 0) {
      return (
        <li className="page-item disabled">
          <span className="page-link">Previous</span>
        </li>
      );
    } else {
      return (
        <li className="page-item">
          <button
              type="button"
              className="page-link"
              onClick={this.onPrevious}>
            Previous
          </button>
        </li>
      );
    }
  }

  nextItem() {
    if (this.state.questionIndex >= this.props.questions.length - 1) {
      return (
        <li className="page-item disabled">
          <span className="page-link">Next</span>
        </li>
      );
    } else {
      return (
        <li className="page-item">
          <button
              type="button"
              className="page-link"
              onClick={this.onNext}>
            Next
          </button>
        </li>
      );
    }
  }

  render() {
    let q = this.props.questions[this.state.questionIndex];
    let byline;
    if (q.anonymous) {
      byline = "An anonymous neighbor";
    } else {
      byline = q.authorName;
    }

    return (
      <div className="Presentation">
        <div className="container">
          <nav aria-label="Question navigation">
            <ul className="pagination">
              {this.previousItem()}
              {this.nextItem()}
            </ul>
          </nav>
          <h1 className="display-4 text-light">{q.content}</h1>
          <div className="text-secondary">{byline}</div>
          <div className="text-secondary">Score: {q.score}</div>
        </div>
      </div>
    );
  }
}
