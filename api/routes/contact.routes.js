import express from 'express';
import { createContact } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/submit', createContact);

export default router;
