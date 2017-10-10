import React from 'react';
import PropTypes from 'prop-types';
import { transform } from 'lodash';

import Registration from './Registration.js';
import Meta from './Meta.js';
import Question from './Question.js';

class Session extends React.Component {

  static propTypes = {
    // Properties
    username: PropTypes.string,
    timestamp: PropTypes.number,
    question_current: PropTypes.string,
    view_mode: PropTypes.string.isRequired,
    test_option_list: PropTypes.array.isRequired,
    test: PropTypes.object,
    // Actions
    sessionCreate: PropTypes.func.isRequired,
    sessionResponseSubmit: PropTypes.func.isRequired
  };

  _getViewModeTest() {
    const question_current = this.props.test.question_list[this.props.question_current];
    return (
      <div className="session--view-mode--test">
        <Meta
          username={this.props.username}
          test_name={this.props.test.name}
          timestamp={this.props.timestamp}
        />
        <Question
          text={question_current.text}
          option_list={transform(question_current.option_list, function(result, value, key) {
            result.push({ id: key, value: value });
          },[])}
          onSubmit={this.props.sessionResponseSubmit}
        />
      </div>
    );
  }

  _getViewModeRegistration() {
    return (
      <div className="session--view-mode--registration">
        <Registration
          test_option_list={this.props.test_option_list}
          handleSubmit={this.props.sessionCreate}
        />
      </div>
    );
  }

  render() {
    let view;
    switch (this.props.view_mode) {
      case 'test':
        view = this._getViewModeTest();
        break;
      case 'registration':
      default:
        view = this._getViewModeRegistration();
        break;
    }

    return (
      <div>{view}</div>
    )
  }
}

export default Session;