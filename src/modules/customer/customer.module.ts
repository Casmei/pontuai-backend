import { forwardRef, Module, Provider } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EVENT_DISPATCHER,
  EventDispatcher,
} from '../common/interfaces/event-dispatcher';
import { CustomerMemoryRepository } from './_infra/database/memory/customer-memory.repository';
import { CustomerController } from './_infra/http/customer.controller';
import { NotifyCustomerEvent } from './events/notify-customer.event';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from './interfaces/customer.repository';
import { CreateCustomerUseCase } from './usecases/create-customer.usecase';
import { CustomerRepository } from './_infra/database/typeorm/customer-typeorm.repository';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetAllCustomersUseCase } from './usecases/get-all-customer.usecase';
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../transaction/interfaces/transaction.repository';
import { TransactionModule } from '../transaction/transaction.module';

const otherProviders: Provider[] = [
  {
    provide: EVENT_DISPATCHER,
    useExisting: EventEmitter2,
  },
];

const events: Provider[] = [
  {
    provide: NotifyCustomerEvent,
    useFactory: (eventDispatcher: EventDispatcher) =>
      new NotifyCustomerEvent(eventDispatcher),
    inject: [EVENT_DISPATCHER],
  },
];

const repositories: Provider[] = [
  {
    provide: CUSTOMER_REPOSITORY,
    useClass: CustomerRepository,
  },
];

const useCases: Provider[] = [
  {
    provide: CreateCustomerUseCase,
    useFactory: (repository: ICustomerRepository, dispatcher: EventDispatcher) =>
      new CreateCustomerUseCase(repository, dispatcher),
    inject: [CUSTOMER_REPOSITORY, EVENT_DISPATCHER],
  },
  {
    provide: GetAllCustomersUseCase,
    useFactory: (customerRepository: ICustomerRepository, transactionRepository: ITransactionRepository) =>
      new GetAllCustomersUseCase(customerRepository, transactionRepository),
    inject: [CUSTOMER_REPOSITORY, TRANSACTION_REPOSITORY],
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), forwardRef(() => TransactionModule)],
  exports: [CUSTOMER_REPOSITORY],
  controllers: [CustomerController],
  providers: [...otherProviders, ...repositories, ...useCases, ...events],
})
export class CustomerModule { }
