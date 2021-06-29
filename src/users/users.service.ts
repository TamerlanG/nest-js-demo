import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from '../files/files.service';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import User from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly filesService: FilesService,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });

    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);

    return newUser;
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const user = await this.getById(userId);
    if (user.avatar) {
      await this.filesService.deletePublicFile(user.avatar.id);

      user.avatar = null;
      this.usersRepository.save(user);
    }

    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );

    user.avatar = avatar;
    this.usersRepository.save(user);

    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.filesService.deletePublicFile(fileId);
      user.avatar = null;
      this.usersRepository.save(user);
    }
  }
}
