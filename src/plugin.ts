import { Plugin } from 'bwcx-ljsm';
import type { IBwcxPlugin } from 'bwcx-ljsm';
import { InjectContainer } from 'bwcx-core';
import type { Container } from 'bwcx-core';
import { createConnections } from 'typeorm';
import type { ConnectionOptions, Connection } from 'typeorm';
import CONTAINER_KEY from './container-key';
import { getAndApplyEntityModels } from './utils';

export interface IBwcxTypeormConfig {
  /**
   * TypeORM connection options.
   */
  connectionOptions: ConnectionOptions[];
}

@Plugin()
export class BwcxTypeormPlugin implements IBwcxPlugin {
  @InjectContainer()
  container: Container;

  public async onActivate(config: IBwcxTypeormConfig) {
    const entityModels = getAndApplyEntityModels();
    const connectionOptions = config.connectionOptions;
    const connections = await createConnections(connectionOptions);
    for (const connection of connections) {
      if (this.container.isBoundNamed(CONTAINER_KEY.Connection, connection.name || 'default')) {
        throw new Error(`Duplicated connection name: ${connection.name}`);
      }
      this.container
        .bind(CONTAINER_KEY.Connection)
        .toConstantValue(connection)
        .whenTargetNamed(connection.name || 'default');
    }
    for (const entity of entityModels) {
      const { target, options } = entity;
      const identifier = target;
      const connections = this.container.getAll<any>(CONTAINER_KEY.Connection);
      // TODO Each connection binds only the relevant entities
      for (const connection of connections) {
        this.container
          .bind(identifier)
          .toConstantValue(connection.getRepository(target))
          .whenTargetTagged('bwcx:plugin:typeorm:tag:ConnectionName', connection.name || 'default');
      }
    }
  }

  public async beforeExit() {
    const connections = this.container.getAll<Connection>(CONTAINER_KEY.Connection);
    for (const connection of connections) {
      await connection.close();
    }
  }
}
