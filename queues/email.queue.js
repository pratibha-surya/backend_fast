import { Queue } from "bullmq";

const redisUrl = new URL(process.env.REDIS_URL || "redis://127.0.0.1:6379");

export const connection = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port || "6379"),
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  tls: redisUrl.protocol === "rediss:" ? {} : undefined,
  maxRetriesPerRequest: null, // Required by BullMQ
};

export const emailQueue = new Queue("emailQueue", {
  connection,
});

export const addEmailJob = async (to, subject, html) => {
  await emailQueue.add(
    "sendEmailJob",
    { to, subject, html },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    }
  );
};

export default emailQueue;
