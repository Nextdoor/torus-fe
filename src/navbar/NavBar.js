import React from 'react';
import { section } from '../constants';

function item(name, section, handler, active) {
  let itemClass;
  let readerText;
  let readerSpace;
  if (active) {
    itemClass = 'nav-item active';
    readerText = (<span className="sr-only">(current)</span>);
    readerSpace = ' '
  } else {
    itemClass = 'nav-item';
  }
  return (
    <li className={itemClass} key={section}>
      <button type="button" className="btn-link nav-link" data-section={section} onClick={handler}>{name}{readerSpace}{readerText}</button>
    </li>
  );
}

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.onSectionClick = this.onSectionClick.bind(this);
  }

  onSectionClick(e) {
    e.preventDefault();
    this.props.onNavigate(+e.target.dataset.section);
  }

  render() {
    let items = [
      item('Questions', section.LIST, this.onSectionClick, this.props.section === section.LIST),
      item('Ask a question', section.SUBMIT, this.onSectionClick, this.props.section === section.SUBMIT),
      item('Start presentation', section.PRESENTATION, this.onSectionClick, this.props.section === section.PRESENTATION),
      // item('Privacy information', section.PRIVACY, this.onSectionClick, this.props.section === section.PRIVACY),
    ];
    let logoutLink;
    if (this.props.logoutUrl) {
      logoutLink = <a className="nav-link" href={this.props.logoutUrl}>Log out</a>;
    } else {
      logoutLink = <a className="nav-link" href={this.props.loginUrl}>Log in</a>;
    }
    let className = 'navbar navbar-expand-sm';
    let backstyle;
    if (this.props.section === section.PRESENTATION) {
      className += ' navbar-dark';
      backstyle = {backgroundColor: 'black'};
    } else {
      className += ' navbar-light bg-light';
    }
    return (
      <nav className={className} style={backstyle}>
        <button type="button" className="btn-link navbar-brand" data-section={section.LIST} onClick={this.onSectionClick}>Torus</button>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
           <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {items}
          </ul>

          {logoutLink}
        </div>
      </nav>
    );
  }
}
