import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { clickTrigger, selectOption } from '../../helpers/paper-basic-dropdown';

moduleForComponent('paper-select', 'Integration | Component | paper select', {
  integration: true
});

test('opens on click', function(assert) {
  assert.expect(1);
  this.set('sizes', ['small (12-inch)', 'medium (14-inch)', 'large (16-inch)', 'insane (42-inch)']);
  this.render(hbs`{{#paper-select
    disabled=disableSelect
    placeholder="Size"
    options=sizes
    selected=selectedSize
    onChange=(action (mut selectedSize))
    as |size|
  }}
    {{size}}
  {{/paper-select}}`);

  return wait()
    .then(() => clickTrigger(document.querySelector('md-input-container')))
    .then(() => assert.ok(!!document.querySelector('md-select-menu'), 'opened menu'));
});

test('backdrop removed if select closed', function(assert) {
  assert.expect(2);
  this.set('sizes', ['small (12-inch)', 'medium (14-inch)', 'large (16-inch)', 'insane (42-inch)']);
  this.render(hbs`{{#paper-select
    disabled=disableSelect
    placeholder="Size"
    options=sizes
    selected=selectedSize
    onChange=(action (mut selectedSize))
    as |size|
  }}
    {{size}}
  {{/paper-select}}`);

  return wait()
    .then(() => clickTrigger(document.querySelector('md-input-container')))
    .then(() => {
      assert.ok(!!document.querySelector('md-select-menu'), 'opened menu');
      return clickTrigger(document.querySelector('md-input-container'));
    })
    .then(() => assert.notOk(!!document.querySelector('.md-backdrop'), 'backdrop removed'));
});

test('can select an option', function(assert) {
  assert.expect(1);

  this.set('sizes', ['small (12-inch)', 'medium (14-inch)', 'large (16-inch)', 'insane (42-inch)']);
  this.set('onChange', (v) => assert.equal(v, 'medium (14-inch)', 'onChange called'));

  this.render(hbs`{{#paper-select
    disabled=disableSelect
    placeholder="Size"
    options=sizes
    selected=selectedSize
    onChange=onChange
    as |size|
  }}
    {{size}}
  {{/paper-select}}`);

  return selectOption(document.querySelector('md-input-container'), 1);
});
