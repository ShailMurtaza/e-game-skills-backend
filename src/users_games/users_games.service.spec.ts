import { Test, TestingModule } from '@nestjs/testing';
import { UsersGamesService } from './users_games.service';

describe('UsersGamesService', () => {
  let service: UsersGamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersGamesService],
    }).compile();

    service = module.get<UsersGamesService>(UsersGamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
