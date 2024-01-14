import { Entity } from 'typeorm';
import METADATA_KEY from './metadata-key';
import { BwcxTypeormPlugin } from './plugin';

export function getAndApplyEntityModels() {
  const entityModels = Reflect.getMetadata(METADATA_KEY.EntityModel, BwcxTypeormPlugin) || [];
  for (const entity of entityModels) {
    const { target, options } = entity;
    // Apply TypeORM @Entity()
    Entity(options)(target);
  }
  return entityModels;
}
