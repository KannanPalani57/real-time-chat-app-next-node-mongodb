import express from 'express'
import userSigninRoutes from './userSigninRoute'
import authRoutes from "./authRoutes";

const router = express.Router();

router.get('/healthcheck', (_, res) => res.sendStatus(200));

router.use(userSigninRoutes);

router.use(authRoutes);

export default router;