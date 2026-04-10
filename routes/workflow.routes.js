// import { Router } from "express";
// import { sendReminders } from "../controllers/workflow.controller";

// const workflowRouter = Router()

// workflowRouter.post('/subscription/reminder', sendReminders)

// export default workflowRouter

//==================== IF SAVED APPLICATION BREAKS ====================//

import { Router } from "express";

const workflowRouter = Router()

workflowRouter.get('/subscription/reminder', (req, res) => {})


export default workflowRouter

// I just have to export the router for now, otherwise it will break the application. I will implement the actual workflow logic later.