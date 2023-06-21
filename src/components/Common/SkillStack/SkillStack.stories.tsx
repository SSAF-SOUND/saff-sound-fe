import type { SkillStackProps } from './index';
import type { Meta } from '@storybook/react';

import SkillStack from './index';

const stacks = [
  'react',
  'javaScript',
  'typeScript',
  'vue',
  'svelt',
  'nextJs',
  'java',
  'node',
  'spring',
  'django',
  'android',
  'ios',
  'swift',
  'flutter',
  'xd',
  'figma',
];
const meta: Meta<typeof SkillStack> = {
  title: 'SkillStack',
  component: SkillStack,
  tags: ['autodocs'],
  argTypes: {
    stack: {
      options: stacks,
      control: { type: 'select' },
    },
  },
};

export default meta;

export const Single = (props: SkillStackProps) => {
  const { stack = 'react' } = props;
  return <SkillStack stack={stack} />;
};

export const All = () => {
  return (
    <div style={{ display: 'flex', width: '200px', flexWrap: 'wrap' }}>
      {stacks.map((s) => (
        <SkillStack stack={s as SkillStackProps['stack']} key={s} />
      ))}
    </div>
  );
};
