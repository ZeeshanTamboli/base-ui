import * as React from 'react';
import { expect } from 'chai';
import { screen, waitFor } from '@mui/internal-test-utils';
import { AlertDialog } from '@base-ui-components/react/alert-dialog';
import { createRenderer, isJSDOM } from '#test-utils';
import { spy } from 'sinon';

describe('<AlertDialog.Root />', () => {
  const { render } = createRenderer();

  it('ARIA attributes', async () => {
    const { queryByRole, getByText } = await render(
      <AlertDialog.Root open>
        <AlertDialog.Trigger />
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
            <AlertDialog.Title>title text</AlertDialog.Title>
            <AlertDialog.Description>description text</AlertDialog.Description>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const popup = queryByRole('alertdialog');
    expect(popup).not.to.equal(null);
    expect(popup).to.have.attribute('aria-modal', 'true');

    expect(getByText('title text').getAttribute('id')).to.equal(
      popup?.getAttribute('aria-labelledby'),
    );
    expect(getByText('description text').getAttribute('id')).to.equal(
      popup?.getAttribute('aria-describedby'),
    );
  });

  describe('prop: onOpenChange', () => {
    it('calls onOpenChange with the new open state', async () => {
      const handleOpenChange = spy();

      const { user } = await render(
        <AlertDialog.Root onOpenChange={handleOpenChange}>
          <AlertDialog.Trigger>Open</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Popup>
              <AlertDialog.Close>Close</AlertDialog.Close>
            </AlertDialog.Popup>
          </AlertDialog.Portal>
        </AlertDialog.Root>,
      );

      expect(handleOpenChange.callCount).to.equal(0);

      const openButton = screen.getByText('Open');
      await user.click(openButton);

      expect(handleOpenChange.callCount).to.equal(1);
      expect(handleOpenChange.firstCall.args[0]).to.equal(true);

      const closeButton = screen.getByText('Close');
      await user.click(closeButton);

      expect(handleOpenChange.callCount).to.equal(2);
      expect(handleOpenChange.secondCall.args[0]).to.equal(false);
    });

    it('calls onOpenChange with the reason for change when clicked on trigger and close button', async () => {
      const handleOpenChange = spy();

      const { user } = await render(
        <AlertDialog.Root onOpenChange={handleOpenChange}>
          <AlertDialog.Trigger>Open</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Popup>
              <AlertDialog.Close>Close</AlertDialog.Close>
            </AlertDialog.Popup>
          </AlertDialog.Portal>
        </AlertDialog.Root>,
      );

      const openButton = screen.getByText('Open');
      await user.click(openButton);

      expect(handleOpenChange.callCount).to.equal(1);
      expect(handleOpenChange.firstCall.args[2]).to.equal('click');

      const closeButton = screen.getByText('Close');
      await user.click(closeButton);

      expect(handleOpenChange.callCount).to.equal(2);
      expect(handleOpenChange.secondCall.args[2]).to.equal('click');
    });

    it('calls onOpenChange with the reason for change when pressed Esc while the dialog is open', async () => {
      const handleOpenChange = spy();

      const { user } = await render(
        <AlertDialog.Root defaultOpen onOpenChange={handleOpenChange}>
          <AlertDialog.Trigger>Open</AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Popup>
              <AlertDialog.Close>Close</AlertDialog.Close>
            </AlertDialog.Popup>
          </AlertDialog.Portal>
        </AlertDialog.Root>,
      );

      await user.keyboard('[Escape]');

      expect(handleOpenChange.callCount).to.equal(1);
      expect(handleOpenChange.firstCall.args[2]).to.equal('escape-key');
    });
  });

  describe.skipIf(isJSDOM)('modality', () => {
    it('makes other interactive elements on the page inert when a modal dialog is open and restores them after the dialog is closed', async () => {
      const { user } = await render(
        <div>
          <input data-testid="input" />
          <textarea data-testid="textarea" />

          <AlertDialog.Root>
            <AlertDialog.Trigger>Open Dialog</AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Popup>
                <AlertDialog.Close>Close Dialog</AlertDialog.Close>
              </AlertDialog.Popup>
            </AlertDialog.Portal>
          </AlertDialog.Root>

          <button type="button">Another Button</button>
        </div>,
      );

      const outsideElements = [
        screen.getByTestId('input'),
        screen.getByTestId('textarea'),
        screen.getByRole('button', { name: 'Another Button' }),
      ];

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      await waitFor(() => {
        outsideElements.forEach((element) => {
          // The `inert` attribute can be applied to the element itself or to an ancestor
          expect(element.closest('[inert]')).not.to.equal(null);
        });
      });

      const close = screen.getByRole('button', { name: 'Close Dialog' });
      await user.click(close);

      await waitFor(() => {
        outsideElements.forEach((element) => {
          expect(element.closest('[inert]')).to.equal(null);
        });
      });
    });
  });
});
