import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find, click } from 'ember-native-dom-helpers';

moduleForComponent('paper-toaster', 'Integration | Component | paper toaster', {
  integration: true,

  beforeEach() {
    this.set('paperToaster', {
      cancelToast() {
      }
    });
  }

});

test('it can shows an action', async function(assert) {
  assert.expect(2);

  this.set('paperToaster.activeToast', {
    show: true,
    position: 'bottom left',
    action: {
      label: 'label',
      primary: true,
      onClick() {
        assert.ok(true, 'onClick is called');
      }
    }
  });

  this.render(hbs`
    {{paper-toaster paperToaster=paperToaster}}
  `);

  assert.equal(find('md-toast .md-button').textContent.trim(), 'label');
  await click('md-toast .md-button');
});

test('it shows a primary action', function(assert) {
  this.set('paperToaster.activeToast', {
    show: true,
    position: 'bottom left',
    action: {
      label: 'label',
      primary: true,
      onClick: () => {}
    }
  });

  this.render(hbs`
    {{paper-toaster paperToaster=paperToaster}}
  `);

  assert.ok(find('md-toast .md-button').classList.contains('md-primary'));
});

test('it shows a accent action', function(assert) {
  this.set('paperToaster.activeToast', {
    show: true,
    position: 'bottom left',
    action: {
      label: 'label',
      accent: true,
      onClick: () => {}
    }
  });

  this.render(hbs`
    {{paper-toaster paperToaster=paperToaster}}
  `);

  assert.ok(find('md-toast .md-button').classList.contains('md-accent'));
});

test('it shows a warn action', function(assert) {
  this.set('paperToaster.activeToast', {
    show: true,
    position: 'bottom left',
    action: {
      label: 'label',
      warn: true,
      onClick: () => {}
    }
  });

  this.render(hbs`
    {{paper-toaster paperToaster=paperToaster}}
  `);

  assert.ok(find('md-toast .md-button').classList.contains('md-warn'));
});
