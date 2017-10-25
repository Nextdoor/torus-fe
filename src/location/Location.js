import React from 'react';
import { section } from '../constants';

function parseLocation(location) {
  switch (window.location.pathname) {
    case '/':
    case '/questions':
    default:
      return section.LIST;
    case '/submit':
      return section.SUBMIT;
    case '/presentation':
      return section.PRESENTATION;
    case '/privacy':
      return section.PRIVACY;
  }
}

class Location extends React.Component {
  constructor(props) {
    super(props);

    this.onPopState = this.onPopState.bind(this);
  }

  componentDidMount() {
    window.addEventListener('popstate', this.onPopState);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.onPopState);
  }

  render() {
    switch (this.props.section) {
      case section.LIST:
      default:
        if (window.location.pathname === '/') {
          window.history.replaceState(null, '', '/questions');
        } else if (window.location.pathname !== '/questions') {
          window.history.pushState(null, '', '/questions');
        }
        break;
      case section.SUBMIT:
        if (window.location.pathname !== '/submit') {
          window.history.pushState(null, '', '/submit');
        }
        break;
      case section.PRESENTATION:
        if (window.location.pathname !== '/presentation') {
          window.history.pushState(null, '', '/presentation');
        }
        break;
      case section.PRIVACY:
        if (window.location.pathname !== '/privacy') {
          window.history.pushState(null, '', '/privacy');
        }
        break;
    }
    return null;
  }

  onPopState(e) {
    this.props.onSectionChanged(parseLocation(window.location.pathname));
  }
}

export { Location as default, parseLocation }
