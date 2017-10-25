import { submissionState } from './constants';

function fetchList() {
  var request = new Request('/v1/list', { credentials: 'same-origin' });
  return fetch(request)
      .then((response) => response.json())
      .then(function(response) {
        for (let question of response.questions) {
          question.state = submissionState.STABLE;
        }
        return response;
      });
}

function fetchStatus() {
  var request = new Request('/v1/status', { credentials: 'same-origin' })
  return fetch(request)
      .then(response => response.json())
      .then(function(response) {
        if (response.id) {
          return {
            currentUserId: response.id,
            currentUserName: response.name,
            logoutUrl: response.logoutUrl,
            digestEnabled: response.digestEnabled,
            questionSubmissionEnabled: response.questionSubmissionEnabled,
          };
        } else {
          return { loginUrl: response.loginUrl };
        }
      });
}

function submitQuestion(question) {
  var request = new Request('/v1/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
    credentials: 'same-origin',
  });

  return fetch(request).then(response => response.json());
}

function sendVote(id, vote) {
  var request = new Request('/v1/votes/' + id, {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({ vote: vote }),
  });
  return fetch(request);
}

function deleteQuestion(id) {
  var request = new Request('/v1/question/' + id, {
      method: 'DELETE',
      credentials: 'same-origin',
  });
  return fetch(request);
}

function enableDigest() {
  var request = new Request('/v1/status/digest', {
      method: 'PUT',
      credentials: 'same-origin',
  });
  return fetch(request);
}

function disableDigest() {
  var request = new Request('/v1/status/digest', {
      method: 'DELETE',
      credentials: 'same-origin',
  });
  return fetch(request);
}

export {
  fetchList,
  fetchStatus,
  submitQuestion,
  sendVote,
  deleteQuestion,
  enableDigest,
  disableDigest,
};
