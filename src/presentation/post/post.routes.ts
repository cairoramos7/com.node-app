import { Router } from 'express';
import PostController from './post.controller';
import authMiddleware from '../auth/auth.middleware';

const createPostRoutes = (postController: PostController): Router => {
    const router = Router();

    // Cast authMiddleware because of Request type mismatch, or accept it if compatible
    // cast to any for express routing simplicity
    router.post('/', authMiddleware as any, postController.createPost as any);
    router.get('/', postController.getPosts);
    router.get('/:id', postController.getPostById);
    router.put('/:id', authMiddleware as any, postController.updatePost);
    router.delete('/:id', authMiddleware as any, postController.deletePost);

    return router;
};

export default createPostRoutes;
