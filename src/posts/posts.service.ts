import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CategoriesService from 'src/categories/categories.service';
import User from 'src/users/user.entity';
import { Repository } from 'typeorm';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import PostNotFoundException from './exceptions/postNotFound.exception';
import Post from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly categoriesService: CategoriesService,
  ) {}

  getAllPosts() {
    return this.postRepository.find({ relations: ['author', 'categories'] });
  }

  getPostById(id: number) {
    const post = this.postRepository.findOne(id, {
      relations: ['author', 'categories'],
    });
    if (post) {
      return post;
    }

    throw new PostNotFoundException(id);
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOne(id, {
      relations: ['author', 'categories'],
    });
    if (updatedPost) {
      return updatedPost;
    }

    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const categories = await this.categoriesService.getCategoriesByIds(
      post.categories,
    );
    const newPost = await this.postRepository.create({
      title: post.title,
      content: post.content,
      author: user,
      categories: categories,
    });

    await this.postRepository.save(newPost);

    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
