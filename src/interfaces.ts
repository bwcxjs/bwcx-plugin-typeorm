import type { Newable } from 'bwcx-common';
import type { EntityOptions } from 'typeorm';

export interface BwcxTypeormEntityModelMetadata {
  target: Newable,
  options?: EntityOptions,
}
