import * as React from 'react';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { Field } from '@base-ui-components/react/field';
import { describeConformance } from '../../../test/describeConformance';

describe('<Field.Error />', () => {
  const { render } = createRenderer();

  describeConformance(<Field.Error forceShow />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<Field.Root invalid>{node}</Field.Root>);
    },
  }));

  it('should set aria-describedby on the control automatically', async () => {
    await render(
      <Field.Root invalid>
        <Field.Control />
        <Field.Error forceShow>Message</Field.Error>
      </Field.Root>,
    );

    expect(screen.getByRole('textbox')).to.have.attribute(
      'aria-describedby',
      screen.getByText('Message').id,
    );
  });

  it('should show error messages by default', async () => {
    await render(
      <Field.Root>
        <Field.Control required />
        <Field.Error>Message</Field.Error>
      </Field.Root>,
    );

    expect(screen.queryByText('Message')).to.equal(null);

    const input = screen.getByRole<HTMLInputElement>('textbox');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.queryByText('Message')).not.to.equal(null);
  });

  describe('prop: match', () => {
    it('should only render when `match` matches constraint validation', async () => {
      await render(
        <Field.Root>
          <Field.Control required />
          <Field.Error match="valueMissing">Message</Field.Error>
        </Field.Root>,
      );

      expect(screen.queryByText('Message')).to.equal(null);

      const input = screen.getByRole<HTMLInputElement>('textbox');

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      expect(screen.queryByText('Message')).not.to.equal(null);
    });

    it('should show custom errors', async () => {
      await render(
        <Field.Root validate={() => 'error'}>
          <Field.Control />
          <Field.Error match="customError">Message</Field.Error>
        </Field.Root>,
      );

      const input = screen.getByRole<HTMLInputElement>('textbox');

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      expect(screen.queryByText('Message')).not.to.equal(null);
    });
  });

  describe('prop: forceShow', () => {
    it('should always render the error message', async () => {
      await render(
        <Field.Root>
          <Field.Control required />
          <Field.Error forceShow>Message</Field.Error>
        </Field.Root>,
      );

      expect(screen.queryByText('Message')).not.to.equal(null);
    });
  });
});
