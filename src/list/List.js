import React from 'react';
import { submissionState } from '../constants';
import './List.css';

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = { areYouSure: false };

    this.onUpClick = this.onUpClick.bind(this);
    this.onStartDelete = this.onStartDelete.bind(this);
    this.onCancelDelete = this.onCancelDelete.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onUpClick() {
    if (this.props.item.myVote === 'up') {
      this.props.onVote(this.props.item.id, 'none')
    } else {
      this.props.onVote(this.props.item.id, 'up')
    }
  }

  onDelete() {
    this.props.onDelete(this.props.item.id)
    this.setState({ areYouSure: false });
  }

  onStartDelete() {
    this.setState({ areYouSure: !this.state.areYouSure });
  }

  onCancelDelete() {
    this.setState({ areYouSure: false });
  }

  render() {
    let byline;
    if (this.props.item.anonymous) {
      byline = "An anonymous neighbor";
    } else {
      byline = this.props.item.authorName;
    }
    let state = 'col order-sm-2 ' + (!this.props.currentUserId || this.props.item.state === submissionState.PENDING ? 'pending' : 'stable')
    let disabled = !this.props.currentUserId || this.props.item.state === submissionState.PENDING ? 'disabled' : null
    let upClasses = ['btn'];
    switch (this.props.item.myVote) {
      case 'up':
        upClasses.push('btn-success');
        break;
      case 'down':
        upClasses.push('btn-secondary');
        break;
      default:
        upClasses.push('btn-secondary');
        break;
    }

    let myControls;
    let areYouSure;
    if (this.props.item.myQuestion) {
      if (this.state.areYouSure) {
        areYouSure = (
          <div>
            Delete question?
            <button type="button" className="btn btn-danger" onClick={this.onDelete}>Yes</button>
            <button type="button" className="btn btn-link" onClick={this.onCancelDelete}>No</button>
          </div>
        )
      } else {
        areYouSure = (
          <button type="button" className="btn btn-danger" onClick={this.onStartDelete} disabled={disabled}>×</button>
        );
      }
      myControls = (
        <div className="col-sm-1 col-lg-1 order-sm-3">
          {areYouSure}
        </div>
      )
    }

    return (
      <li className="row question">
        <div className={state}>
          <h5>{this.props.item.content}</h5>
          <div className="byline">{byline}</div>
        </div>
        <div className="col-sm-3 col-lg-2 order-sm-1">
          <div className="btn-group" data-toggle="buttons">
            <button type="button" className={upClasses.join(' ')} onClick={this.onUpClick} disabled={disabled}>⬆</button>
            <button type="button" className="btn btn-secondary score-display" disabled="disabled">{this.props.item.score}</button>
          </div>
        </div>
        {myControls}
      </li>
    );
  }
}

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.compareFuncs = {
      'new': this.dateCompare,
      'top': this.scoreCompare,
    }

    let order = [];
    for (var i = 0; i < props.questions.length; i++) {
      order.push(i);
    }
    order.sort(this.scoreCompare);

    this.state = { sortOrder: 'top', order: order };
  }

  dateCompare = (a, b) => {
    return new Date(this.props.questions[b].timestamp) - new Date(this.props.questions[a].timestamp);
  }

  scoreCompare = (a, b) => {
    return this.props.questions[b].score - this.props.questions[a].score;
  }

  onSortChange = (e) => {
    let order = this.state.order.slice();
    order.sort(this.compareFuncs[e.target.value]);
    this.setState({ sortOrder: e.target.value, order: order });
  }

  render() {
    let questions = []
    for (let j of this.state.order) {
      questions.push(this.props.questions[j]);
    }

    let itemEls = questions.map((item) => (
      <Item key={item.id}
        item={item}
        onVote={this.props.onVote}
        onDelete={this.props.onDelete}
        currentUserId={this.props.currentUserId}/>
    ));
    return (
      <div className="container">
        <h1>Questions</h1>
        <button type="button" className="btn btn-primary" onClick={this.props.onSubmit}>Ask a question</button>
        {' '}
        <button type="button" className="btn btn-secondary" onClick={this.props.onRefresh}>Refresh</button>
        <div className="form-group">
          <label className="form-check-label">
            <input type="checkbox" className="form-check-input" id="showName" value={this.props.digestEnabled} checked={this.props.digestEnabled} onChange={this.props.onDigestToggle} disabled={!this.props.currentUserId || this.props.digestRequest ? 'disabled' : null}/>
            {' '}
            Send me an email digest of new questions
          </label>
        </div>
        <select className="custom-select" id="sortBy" value={this.state.sortOrder} onChange={this.onSortChange}>
          <option value="top">Most highly voted</option>
          <option value="new">Newest</option>
        </select>
        <ol className="list-unstyled">
          {itemEls}
        </ol>
      </div>
    );
  }
}
