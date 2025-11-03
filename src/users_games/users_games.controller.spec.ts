import { Test, TestingModule } from '@nestjs/testing';
import { UsersGamesController } from './users_games.controller';
import { UsersGamesService } from './users_games.service';

describe('UsersGamesController', () => {
  let controller: UsersGamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersGamesController],
      providers: [UsersGamesService],
    }).compile();

    controller = module.get<UsersGamesController>(UsersGamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
