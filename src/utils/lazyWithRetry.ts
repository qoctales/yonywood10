import { ComponentType, lazy } from 'react';

export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
      return await factory();
    }
  });
}
