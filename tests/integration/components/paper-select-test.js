import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { run } from '@ember/runloop';
import $ from 'jquery';

moduleForComponent('paper-select', 'Integration | Component | paper select', {
  integration: true
});

function focus(el) {
  if (!el) {
    return;
  }
  let $el = $(el);
  if ($el.is(':input, [contenteditable=true]')) {
    let type = $el.prop('type');
    if (type !== 'checkbox' && type !== 'radio' && type !== 'hidden') {
      run(null, function() {
        // Firefox does not trigger the `focusin` event if the window
        // does not have focus. If the document doesn't have focus just
        // use trigger('focusin') instead.

        if (!document.hasFocus || document.hasFocus()) {
          el.focus();
        } else {
          $el.trigger('focusin');
        }
      });
    }
  }
}

function nativeClick(selector, options = {}) {
  let mousedown = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
  let mouseup = new window.Event('mouseup', { bubbles: true, cancelable: true, view: window });
  let click = new window.Event('click', { bubbles: true, cancelable: true, view: window });
  mousedown.button = mouseup.button = click.button = options.button || 0;
  Object.keys(options).forEach((key) => {
    mousedown[key] = options[key];
    mouseup[key] = options[key];
    click[key] = options[key];
  });
  let element = document.querySelector(selector);
  run(() => element.dispatchEvent(mousedown));
  focus(element);
  run(() => element.dispatchEvent(mouseup));
  run(() => element.dispatchEvent(click));
}

function clickTrigger(scope, options = {}) {
  let selector = '.ember-basic-dropdown-trigger';
  nativeClick(selector, options);
}

test('opens on click', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
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
  return wait().then(() => {
    clickTrigger();

    return wait().then(() => {
      let selectors = $('md-select-menu');
      assert.ok(selectors.length, 'opened menu');
      return wait().then(() => {

      });
    });
  });
});

test('backdrop removed if select closed', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
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

  return wait().then(() => {
    clickTrigger();

    return wait().then(() => {

      let selectors = $('md-select-menu');
      assert.ok(selectors.length, 'opened menu');
      clickTrigger();
      return wait().then(() => {
        let selector = $('.md-backdrop');
        assert.ok(!selector.length, 'backdrop removed');
      });
    });
  });
});

test('header is rendered above content', async function(assert) {
  this.set('sizes', ['small (12-inch)', 'medium (14-inch)', 'large (16-inch)', 'insane (42-inch)']);

  this.render(hbs`{{#paper-select
    disabled=disableSelect
    placeholder="Size"
    options=sizes
    searchEnabled=true
    selected=selectedSize
    onChange=(action (mut selectedSize))
    as |size|
  }}
    {{size}}
  {{/paper-select}}`);

  await wait();

  await clickTrigger();

  assert.ok(!!$('md-select-menu > md-select-header'), 'header is a direct child of menu');
  assert.ok(!!$('md-select-menu > md-content'), 'content is a direct child of menu');
});

test('it can search a value', async function(assert) {
  this.set('sizes', ['small (12-inch)', 'medium (14-inch)', 'large (16-inch)', 'insane (42-inch)']);

  this.render(hbs`{{#paper-select
    disabled=disableSelect
    placeholder="Size"
    options=sizes
    searchEnabled=true
    selected=selectedSize
    onChange=(action (mut selectedSize))
    as |size|
  }}
    {{size}}
  {{/paper-select}}`);

  await clickTrigger();

  await wait();

  assert.equal($('md-select-menu md-option').length, 4);

  $('md-select-header input').val('small').trigger('input');

  assert.equal($('md-select-menu md-option').length, 1);
  assert.equal($('md-select-menu md-option').text().trim(), 'small (12-inch)');
});
