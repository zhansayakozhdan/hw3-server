import cron from 'node-cron';

export function startCronJobs() {
    cron.schedule("* * * * *", () => {
        console.log('running task every one minutes')
    });
}
