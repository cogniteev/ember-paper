import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { clickTrigger } from '../../helpers/paper-basic-dropdown';
import $ from 'jquery';

moduleForComponent('paper-menu', 'Integration | Component | paper menu', {
  integration: true
});

test('opens on click', function(assert) {
  assert.expect(1);
  this.render(hbs`{{#paper-menu as |menu|}}
    {{#menu.trigger}}
      {{#paper-button iconButton=true}}
        {{paper-icon "local_phone"}}
      {{/paper-button}}
    {{/menu.trigger}}
    {{#menu.content width=4 as |content|}}
        {{#content.menu-item onClick="openSomething"}}
          <span id="menu-item">Test</span>
        {{/content.menu-item}}
    {{/menu.content}}
  {{/paper-menu}}`);

  return wait().then(() => {
    clickTrigger(document.querySelector('md-menu'));

    return wait().then(() => {
      let selectors = $('.md-open-menu-container');
      assert.ok(selectors.length, 'opened menu');
      return wait().then(() => {

      });
    });
  });
});

test('backdrop removed if menu closed', function(assert) {
  assert.expect(2);
  this.render(hbs`{{#paper-menu as |menu|}}
    {{#menu.trigger}}
      {{#paper-button iconButton=true}}
        {{paper-icon "local_phone"}}
      {{/paper-button}}
    {{/menu.trigger}}
    {{#menu.content width=4 as |content|}}
        {{#content.menu-item onClick="openSomething"}}
          <span id="menu-item">Test</span>
        {{/content.menu-item}}
    {{/menu.content}}
  {{/paper-menu}}`);

  return wait().then(() => {
    clickTrigger(document.querySelector('md-menu'));

    return wait().then(() => {

      let selectors = $('.md-open-menu-container');
      assert.ok(selectors.length, 'opened menu');
      clickTrigger(document.querySelector('md-menu'));
      return wait().then(() => {
        let selector = $('.md-backdrop');
        assert.ok(!selector.length, 'backdrop removed');
      });
    });
  });
});

test('backdrop removed if backdrop clicked', function(assert) {
  assert.expect(2);
  this.render(hbs`{{#paper-menu as |menu|}}
    {{#menu.trigger}}
      {{#paper-button iconButton=true}}
        {{paper-icon "local_phone"}}
      {{/paper-button}}
    {{/menu.trigger}}
    {{#menu.content width=4 as |content|}}
        {{#content.menu-item onClick="openSomething"}}
          <span id="menu-item">Test</span>
        {{/content.menu-item}}
    {{/menu.content}}
  {{/paper-menu}}`);

  return wait().then(() => {
    clickTrigger(document.querySelector('md-menu'));

    return wait().then(() => {

      let selectors = $('.md-open-menu-container');
      assert.ok(selectors.length, 'opened menu');
      $('md-backdrop').click();
      return wait().then(() => {
        let selector = $('.md-backdrop');
        assert.ok(!selector.length, 'backdrop removed');
      });
    });
  });
});

test('keydown changes focused element', function(assert) {
  assert.expect(3);
  this.render(hbs`{{#paper-menu as |menu|}}
    {{#menu.trigger}}
      {{#paper-button iconButton=true}}
        {{paper-icon "local_phone"}}
      {{/paper-button}}
    {{/menu.trigger}}
    {{#menu.content width=4 as |content|}}
        {{#content.menu-item onClick="openSomething"}}
          <span id="menu-item">Test</span>
        {{/content.menu-item}}
        {{#content.menu-item onClick="openSomething"}}
          <span id="menu-item2">Test 2</span>
        {{/content.menu-item}}
    {{/menu.content}}
  {{/paper-menu}}`);

  return wait().then(() => {
    clickTrigger(document.querySelector('md-menu'));

    return wait().then(() => {

      let selectors = $('md-menu-item');
      assert.ok($(selectors[0].firstElementChild).hasClass('md-focused'), 'first menu item given focus');
      let e = new $.Event('keydown');
      let menu = $('md-menu-content');
      e.which = 40;
      e.target = menu[0].firstElementChild;

      $(menu[0].firstElementChild).trigger(e);

      return wait().then(() => {
        let first = $(selectors[0].firstElementChild);
        let second = $(selectors[1].firstElementChild);
        assert.ok(second.hasClass('md-focused') && !first.hasClass('md-focused'), 'focus has changed to second item');
        let e = new $.Event('keydown');
        e.which = 38;
        e.target = selectors[1];
        $(selectors[1]).trigger(e);
        return wait().then(() => {
          let first = $(selectors[0].firstElementChild);
          let second = $(selectors[1].firstElementChild);
          assert.ok(!second.hasClass('md-focused') && first.hasClass('md-focused'), 'focus has changed to first item');

        });
      });
    });
  });
});
