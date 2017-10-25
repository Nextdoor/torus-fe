import React from 'react';

export default class Privacy extends React.Component {
  render() {
    return (
      <div class="container">
        <h1>Privacy</h1>

        <p>When you log in, you're authenticating with Google. The login page is served by Google, and I never see your password.</p>

        <p>If you choose to post a question with your name hidden, I still store the question associated with your account. This is so that you can delete the question later.</p>

        <p>The account is stored as a number that can be used to look up your name. The number itself is otherwise meaningless. I pledge to only look at the questions for debugging and maintenance, and I pledge not to look up the account number to figure out who asked what question.</p>

        <p>Keep in mind that IT (and therefore company leadership) have privileges that let them access this data and figure out who asked what question if they decide they want to do so.</p>

        <p>Similarly, I also store your votes associated with your account.</p>
      </div>
    );
  }
}
