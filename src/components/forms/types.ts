import { InputHTMLAttributes } from 'react';

/**
 * Input sizes
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input props
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;
  /** Helper text to display below the input */
  helperText?: string;
  /** Error message to display below the input */
  error?: string;
  /** Input size */
  size?: InputSize;
  /** Left icon or element */
  leftElement?: React.ReactNode;
  /** Right icon or element */
  rightElement?: React.ReactNode;
  /** Additional class names to apply to the input container */
  containerClassName?: string;
  /** Additional class names to apply to the input element */
  className?: string;
  /** Whether the input should fill its container */
  fullWidth?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is required */
  required?: boolean;
} 