import { clickTrigger, selectOption } from 'ember-paper/tests/helpers/paper-basic-dropdown';
import wait from 'ember-test-helpers/wait';

test('opens menu', function(assert) {
  return wait()
    .then(() => clickTrigger(document.querySelector('md-menu')))
    .then(() => {
      // menu opened
    });
});

test('selects option index=2', function(assert) {
  return selectOption(document.querySelector('md-input-container'), 2).then(() => {
    // option selected
  });
});
