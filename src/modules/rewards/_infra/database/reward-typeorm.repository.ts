import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRewardRepository } from '../../interfaces/reward.repository';
import { Reward } from '../../entities/reward.entity';
import { CreateRewardDto } from '../http/dtos/create-reward.dto';

@Injectable()
export class RewardRepository implements IRewardRepository {
    constructor(
        @InjectRepository(Reward) private rewardRepository: Repository<Reward>,
    ) { }
    create(data: CreateRewardDto, tenantId: string): Promise<Reward> {
        const reward = this.rewardRepository.create({
            name: data.name,
            tenant_id: tenantId,
            description: data.description,
            point_value: data.pointValue,
        });

        return this.rewardRepository.save(reward);
    }
}
