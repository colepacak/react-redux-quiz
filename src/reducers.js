import { last } from 'lodash';

import defaultState from './default-state.js';

function sessionReducer(state = {}, action, test_list) {
  switch(action.type) {
    case 'SESSION_CREATE':
      // todo: To achieve random shuffling of questions, the question order would need to be passed in via the payload.
      let question_order = Object.keys(test_list[action.payload.test].question_list);
      return {
        ...state,
        username: action.payload.username,
        test: action.payload.test,
        timestamp: action.payload.timestamp,
        question_order: question_order,
        question_current: question_order[0],
        response_list: {},
        view_mode: 'testing'
      };

    case 'SESSION_RESPONSE_RECEIVE':
      // Reject invalid responses
      const option_list = Object.keys(test_list[state.test].question_list[state.question_current].option_list);
      if (!option_list.includes(action.payload.response.toString())) { return state; }

      return {
        ...state,
        response_list: {
          ...state.response_list,
          [state.question_current]: action.payload.response
        }
      };

    case 'SESSION_NEXT_QUESTION':
      let index = state.question_order.indexOf(state.question_current);
      // Prevent the advancement to non-existent questions.
      if (state.question_order[index + 1] === undefined) { return state; }

      return {
        ...state,
        question_current: state.question_order[index + 1]
      };

    case 'RESULT_CREATE':
      return {
        ...state,
        view_mode: 'result'
      };

    case 'SESSION_REMOVE':
      return {
        view_mode: 'registration'
      };

    default:
      return state;
  }
}

function resultReducer(state = {}, action) {
  switch (action.type) {
    case 'RESULT_CREATE':
      const session = action.payload.session;
      const test = action.payload.test;
      // Increment result ids
      const result_id = Object.keys(state).length === 0 ? 0 : last(Object.keys(state) + 1);

      // Tally score
      const questions_total = Object.keys(test.question_list).length;

      const questions_correct = Object.keys(session.response_list).reduce(function(accumulator, question) {
        const is_correct = session.response_list[question] === test.question_list[question].answer;
        return is_correct ? accumulator + 1 : accumulator;
      }, 0);

      return {
        ...state,
        [result_id]: {
          username: session.username,
          test: session.test,
          timestamp: session.timestamp,
          score: parseFloat((questions_correct / questions_total).toFixed(3))
        }
      };
    default:
      return state;
  }
}

export default function mainReducer(state = defaultState, action) {
  return {
    test_list: defaultState.test_list,
    session: sessionReducer(state.session, action, state.test_list),
    result_list: resultReducer(state.result_list, action, state.session, state.test_list),
  }
}