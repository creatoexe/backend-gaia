import express from 'express';
import { sendRequestToAI } from '../AI/aiController.js';

const aiApp = express();
aiApp.post('/request/ai', sendRequestToAI);

export default aiApp;