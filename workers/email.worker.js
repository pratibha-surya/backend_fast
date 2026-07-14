import { Worker } from "bullmq";
import sendEmail from "../utils/sendEmail.js";
import { connection } from "../queues/email.queue.js";

export const startEmailWorker = () => {
  const worker = new Worker(
    "emailQueue",
    async (job) => {
      const { to, subject, html } = job.data;
      console.log(`[Worker] Processing email to ${to}...`);
      await sendEmail({ to, subject, html });
      console.log(`[Worker] Email sent successfully to ${to}`);
    },
    {
      connection,
      concurrency: 1,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
};

export default startEmailWorker;
