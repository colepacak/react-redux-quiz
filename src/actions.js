import { last } from 'lodash';

export function sessionViewModeChange(view_mode) {
  return {
    type: 'SESSION_VIEW_MODE_CHANGE',
    payload: {
      view_mode
    }
  }
}

export function sessionCreate(username, test_id, timestamp) {
  return {
    type: 'SESSION_CREATE',
    payload: {
      username,
      test_id,
      timestamp
    }
  }
}

export function sessionRemove() {
  return {
    type: 'SESSION_REMOVE'
  }
}

// Control flow for adding a response and then determining whether to advance to next question or - if at the end of
// the test - tally the results.
export function sessionResponseSubmit(response) {
  return (dispatch, getState) => {

    dispatch(sessionResponseAdd(response));

    const { session, test_list } = getState();

    if (last(session.question_order) === session.question_current) {
      const test = test_list[session.test_id];
      dispatch(resultCreate(session.username, session.test, session.timestamp, session.response_list, test));
      dispatch(sessionQuestionCurrentUnset(null));
      dispatch(sessionViewModeChange('result'));
    } else {
      dispatch(sessionQuestionCurrentIncrement());
    }
  };
}

export function sessionResponseAdd(response) {
  return {
    type: 'SESSION_RESPONSE_ADD',
    payload: {
      response
    }
  }
}

export function sessionQuestionCurrentIncrement() {
  return {
    type: 'SESSION_QUESTION_CURRENT_INCREMENT'
  }
}

export function sessionQuestionCurrentUnset() {
  return {
    type: 'SESSION_QUESTION_CURRENT_UNSET'
  }
}

export function resultCreate(username, test_id, timestamp, response_list, test) {
  return {
    type: 'RESULT_CREATE',
    payload: {
      username,
      test_id,
      timestamp,
      response_list,
      test
    }
  }
}
