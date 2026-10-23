import { Router } from 'express';
import TaskController from './task.controller';
import authMiddleware from '../auth/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createTaskSchema, updateTaskSchema } from './task.schemas';

const createTaskRoutes = (taskController: TaskController): Router => {
    const router = Router();

    /**
     * @swagger
     * /api/tasks:
     *   post:
     *     summary: Create a new task
     *     tags: [Tasks]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateTaskRequest'
     *     responses:
     *       201:
     *         description: Task created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *       401:
     *         description: Unauthorized
     *       400:
     *         description: Bad request
     */
    router.post(
        '/',
        authMiddleware as any,
        validate(createTaskSchema),
        taskController.createTask as any
    );

    /**
     * @swagger
     * /api/tasks:
     *   get:
     *     summary: Get all tasks
     *     tags: [Tasks]
     *     responses:
     *       200:
     *         description: List of tasks
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Task'
     */
    router.get('/', taskController.getTasks);

    /**
     * @swagger
     * /api/tasks/{id}:
     *   get:
     *     summary: Get task by ID
     *     tags: [Tasks]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Task ID
     *     responses:
     *       200:
     *         description: Task details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *       404:
     *         description: Task not found
     */
    router.get('/:id', taskController.getTaskById);

    /**
     * @swagger
     * /api/tasks/{id}:
     *   put:
     *     summary: Update a task
     *     tags: [Tasks]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Task ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Task'
     *     responses:
     *       200:
     *         description: Task updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *       404:
     *         description: Task not found
     */
    router.put(
        '/:id',
        authMiddleware as any,
        validate(updateTaskSchema),
        taskController.updateTask
    );

    /**
     * @swagger
     * /api/tasks/{id}:
     *   delete:
     *     summary: Delete a task
     *     tags: [Tasks]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: Task ID
     *     responses:
     *       204:
     *         description: Task deleted
     *       404:
     *         description: Task not found
     */
    router.delete('/:id', authMiddleware as any, taskController.deleteTask);

    return router;
};

export default createTaskRoutes;
