import React from 'react';
import List from './list/List';
import Submit from './submit/Submit';
import Presentation from './presentation/Presentation';
import NavBar from './navbar/NavBar';
import Privacy from './privacy/Privacy';
import Location, { parseLocation } from './location/Location';
import {
  fetchList,
  fetchStatus,
  submitQuestion,
  sendVote,
  deleteQuestion,
  enableDigest,
  disableDigest,
} from './network';
import { section, submissionState } from './constants';
import './App.css';

function calculateDifference(oldVote, newVote) {
  let lookup = {
    'down': -1,
    'none': 0,
    'up': 1,
  };

  return lookup[newVote] - lookup[oldVote];
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.bindMethods();

    let listRequest = fetchList();
    listRequest.then(this.onQuestionsRetrieved);

    this.state = {
      listRequest: listRequest,
      questions: [],
      section: parseLocation(window.location.pathname),
    };

    fetchStatus().then((response) => this.setState(response));
    this.lastClientId = 0;
  }

  bindMethods() {
    this.onQuestionConfirmed = this.onQuestionConfirmed.bind(this);
    this.onQuestionAdded = this.onQuestionAdded.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onVote = this.onVote.bind(this);
    this.onPresent = this.onPresent.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onSectionChanged = this.onSectionChanged.bind(this);
    this.onQuestionsRetrieved = this.onQuestionsRetrieved.bind(this);
    this.onDigestToggle = this.onDigestToggle.bind(this);
  }

  onQuestionConfirmed(q) {
    let questions = this.state.questions.slice();
    for (let question of questions) {
      if (question.clientId === q.clientId) {
        question.id = q.id;
        question.authorId = q.authorId;
        question.timestamp = q.timestamp;
        question.state = submissionState.STABLE;
      }
    }
    this.setState({ questions: questions });
    // TODO: handle errors
    // TODO: assign ID
  }

  onQuestionAdded(q) {
    q.clientId = ++this.lastClientId;

    submitQuestion(q).then(this.onQuestionConfirmed);

    q.state = submissionState.PENDING;
    q.score = 0;
    q.timestamp = new Date().toISOString();
    q.authorName = this.state.currentUserName;
    q.authorId = this.state.currentUserId;
    q.myQuestion = true;
    q.myVote = 'none';
    this.setState({
      questions: [q].concat(this.state.questions),
      section: section.LIST,
    });
  }

  onSubmit() {
    if (!this.state.currentUserId) {
      window.location = this.state.loginUrl;
    }
    this.setState({ section: section.SUBMIT });
  }

  onVote(id, vote) {
    let questions = this.state.questions.slice();
    for (let question of questions) {
      if (question.id === id) {
        question.score += calculateDifference(question.myVote, vote)
        question.myVote = vote;
        question.state = submissionState.PENDING;
      }
    }
    this.setState({ questions: questions });

    sendVote(id, vote).then(function() {
      let questions = this.state.questions.slice();
      for (let question of questions) {
        if (question.id === id) {
          question.state = submissionState.STABLE;
        }
      }
      this.setState({ questions: questions })
    }.bind(this));
  }

  onDelete(id) {
    let questions = this.state.questions.slice();
    for (let question of questions) {
      if (question.id === id) {
        question.state = submissionState.PENDING;
      }
    }
    this.setState({ questions: questions });

    deleteQuestion(id).then(function(response) {
      let questions = this.state.questions.slice();
      for (var i = 0; i < questions.length; i++) {
        if (questions[i].id === id) {
          questions.splice(i, 1);
          i--;
        }
      }
      this.setState({ questions: questions })
    }.bind(this));
  }

  onPresent() {
    this.setState({ section: section.PRESENTATION });
  }

  onNavigate(section) {
    this.setState({ section: section });
  }

  onQuestionsRetrieved(response) {
    this.setState({
      questions: response.questions,
      listRequest: null,
    });
  }

  onRefresh() {
    if (this.state.listRequest) {
      return;
    }

    let listRequest = fetchList();
    listRequest.then(this.onQuestionsRetrieved);
    this.setState({ listRequest: listRequest });
  }

  onSectionChanged(section) {
    this.setState({ section: section });
  }

  onDigestToggle(e) {
    if (!this.state.currentUserId) {
      window.location = this.state.loginUrl;
    }
    if (e.target.checked) {
      this.setState({ digestEnabled: true });
      enableDigest();
    } else {
      this.setState({ digestEnabled: false });
      disableDigest();
    }
  }

  getContent() {
    if (this.state.listRequest &&
      (this.state.section === section.LIST ||
        this.state.section === section.PRESENTATION)) {
      return <div className="container">Loading…</div>;
    }

    switch (this.state.section) {
      case section.LIST:
      default:
        return (
          <div className="container">
            <List
              questions={this.state.questions}
              onVote={this.onVote}
              currentUserId={this.state.currentUserId}
              digestEnabled={this.state.digestEnabled}
              digestRequest={this.state.digestRequest}
              listRequest={this.state.listRequest}
              onDelete={this.onDelete}
              onSubmit={this.onSubmit}
              onRefresh={this.onRefresh}
              onDigestToggle={this.onDigestToggle}/>
        </div>
        );
      case section.SUBMIT:
        return (
          <div className="container">
            <Submit
              onQuestionAdded={this.onQuestionAdded}
              currentUserId={this.state.currentUserId}
              loginUrl={this.state.loginUrl}
              questionSubmissionEnabled={this.state.questionSubmissionEnabled}/>
          </div>
        );
      case section.PRESENTATION:
        return <Presentation questions={this.state.questions}/>;
      case section.PRIVACY:
        return <div className="container"><Privacy/></div>;
    }
  }

  render() {
    return (
      <div className="App">
        <Location
          section={this.state.section}
          onSectionChanged={this.onSectionChanged}/>
        <NavBar
          section={this.state.section}
          onNavigate={this.onNavigate}
          loginUrl={this.state.loginUrl}
          logoutUrl={this.state.logoutUrl}/>
        {this.getContent()}
      </div>
    );
  }
}

export default App;
