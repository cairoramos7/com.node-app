import { Request, Response, NextFunction } from 'express';
import CreatePostUseCase from '../../application/usecases/post/CreatePostUseCase';
import GetPostByIdUseCase from '../../application/usecases/post/GetPostByIdUseCase';
import GetAllPostsUseCase from '../../application/usecases/post/GetAllPostsUseCase';
import UpdatePostUseCase from '../../application/usecases/post/UpdatePostUseCase';
import DeletePostUseCase from '../../application/usecases/post/DeletePostUseCase';

// Define request with user property
interface AuthRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

export default class PostController {
  private createPostUseCase: CreatePostUseCase;
  private getPostByIdUseCase: GetPostByIdUseCase;
  private getAllPostsUseCase: GetAllPostsUseCase;
  private updatePostUseCase: UpdatePostUseCase;
  private deletePostUseCase: DeletePostUseCase;

  constructor(
    createPostUseCase: CreatePostUseCase,
    getPostByIdUseCase: GetPostByIdUseCase,
    getAllPostsUseCase: GetAllPostsUseCase,
    updatePostUseCase: UpdatePostUseCase,
    deletePostUseCase: DeletePostUseCase
  ) {
    this.createPostUseCase = createPostUseCase;
    this.getPostByIdUseCase = getPostByIdUseCase;
    this.getAllPostsUseCase = getAllPostsUseCase;
    this.updatePostUseCase = updatePostUseCase;
    this.deletePostUseCase = deletePostUseCase;
  }

  createPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
         res.status(401).json({ error: 'User not authenticated' });
         return;
      }
      const { title, content, tags } = req.body;
      const authorId = req.user.id;
      const post = await this.createPostUseCase.execute(title, content, tags, authorId);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  };

  getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const posts = await this.getAllPostsUseCase.execute();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const post = await this.getPostByIdUseCase.execute(id as string);
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.status(200).json(post);
    } catch (error) {
       next(error);
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, content, tags } = req.body;
      const updatedPost = await this.updatePostUseCase.execute(id as string, title, content, tags);
      res.status(200).json(updatedPost);
    } catch (error) {
       next(error);
    }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deletePostUseCase.execute(id as string);
      res.status(204).send();
    } catch (error) {
       next(error);
    }
  };
}
