import { Newable } from 'bwcx-common';
import { inject, tagged } from 'inversify';
import { BwcxTypeormPlugin } from './plugin';
import METADATA_KEY from './metadata-key';
import type { EntityOptions } from 'typeorm';

/**
 * Define an entity model.
 * @decorator {class}
 * @param entityOpts
 */
export function EntityModel(entityOpts?: EntityOptions) {
  return function (target) {
    const lastEntityModels = Reflect.getMetadata(METADATA_KEY.EntityModel, BwcxTypeormPlugin) || [];
    const entityModels = [
      ...lastEntityModels,
      {
        target,
        options: entityOpts,
      },
    ];
    Reflect.defineMetadata(METADATA_KEY.EntityModel, entityModels, BwcxTypeormPlugin);
  };
}

/**
 * Inject a repository.
 * @decorator {property}
 * @decorator {parameter} Can only be used on constructor parameters.
 * @param entity
 * @param connectionName
 */
export function InjectRepository(entity: Newable, connectionName = 'default') {
  return function (target, propertyKey: string, parameterIndex?: number) {
    const identifier = entity;
    inject(identifier)(target, propertyKey, parameterIndex);
    tagged('bwcx:plugin:typeorm:tag:ConnectionName', connectionName)(target, propertyKey, parameterIndex);
  };
}

export const Repository = InjectRepository;
