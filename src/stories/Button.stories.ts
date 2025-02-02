import type { Meta, StoryObj } from '@storybook/react';

import { Button, ButtonStyle } from '@/components/formElements';

const meta = {
  component: Button
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example = {
  args: {
    label: 'Register',
    style: ButtonStyle.DARK,
    disabled: false,
    loading: false
  }
} satisfies Story;
