# bwcx-plugin-typeorm

bwcx TypeORM 插件。

## 安装

```shell
npm install -S bwcx-plugin-typeorm typeorm
```

## 使用

定义数据库连接配置：

```typescript
import { Config } from 'bwcx-ljsm';
import type { IBwcxTypeormConfig } from 'bwcx-plugin-typeorm';
import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Config()
export default class DbConfig implements IBwcxTypeormConfig {
  connectionOptions: MysqlConnectionOptions[] = [
    {
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'your_user',
      password: 'your_pass',
      database: 'your_db',
      timezone: '+08:00',
      entities: ['/path/to/entities/**/*.ts'],
      logging: true,
    },
  ];
}
```

应用插件：

```typescript
import { BwcxTypeormPlugin } from 'bwcx-plugin-typeorm';
import DbConfig from '/path/to/dbconfig';

class OurApp extends App {
  protected plugins = [this.usePlugin(BwcxTypeormPlugin, DbConfig)];
}
```

定义 Entity：

```typescript
import { EntityModel } from 'bwcx-plugin-typeorm';
import { PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@EntityModel()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

使用 Repository 进行数据库操作：

```typescript
import { Provide } from 'bwcx-core';
import { InjectRepository } from 'bwcx-plugin-typeorm';
import type { Repository } from 'typeorm';
import { User } from '/path/to/entities/user.entity';

@Provide()
export default class UserService {
  @InjectRepository(User)
  /** Or specify connection name */
  // @InjectRepository(User, 'connection2')
  private userRepository: Repository<User>;

  public async createUser(): Promise<User> {
    const user = new User();
    user.firstName = 'John';
    user.lastName = 'Smith';
    user.age = 15;
    await this.userRepository.save(user);
    // select
    const users = await this.userRepository.find();
    console.log('users:', users);
    return user;
  }
}
```
