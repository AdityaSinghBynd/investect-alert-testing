export type FrequencyType = 'daily' | 'bi-weekly' | 'weekly' | 'monthly';

export const getCronFrequency = (cronExpression: string): FrequencyType => {
    if (!cronExpression) return 'daily';

    // Split cron expression into its components
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpression.split(' ');

    // Daily: runs every day at a specific time
    // Format: "MM HH * * *"
    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return 'daily';
    }

    // Weekly: runs once a week
    // Format: "MM HH * * D" where D is a specific day (0-6)
    if (dayOfMonth === '*' && month === '*' && /^[0-6]$/.test(dayOfWeek)) {
        return 'weekly';
    }

    // Bi-weekly: runs every other week
    // Format: "MM HH * * D/2" where D is a specific day (0-6)
    if (dayOfMonth === '*' && month === '*' && dayOfWeek.includes('/2')) {
        return 'bi-weekly';
    }

    // Monthly: runs once a month on a specific day
    // Format: "MM HH D * *" where D is a specific day of month (1-31)
    if (/^([1-9]|[12][0-9]|3[01])$/.test(dayOfMonth) && month === '*') {
        return 'monthly';
    }

    // Default to daily if pattern doesn't match any known frequency
    return 'daily';
};

interface GenerateCronOptions {
    frequency: FrequencyType;
    hour?: number;    // 0-23
    minute?: number;  // 0-59
    dayOfWeek?: number; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
}

export const generateCronExpression = ({
    frequency,
    hour = 3,
    minute = 30,
    dayOfWeek = 1, // Monday
    dayOfMonth = 1
}: GenerateCronOptions): string => {
    // Ensure values are within valid ranges
    const safeHour = Math.min(Math.max(hour, 0), 23);
    const safeMinute = Math.min(Math.max(minute, 0), 59);
    const safeDayOfWeek = Math.min(Math.max(dayOfWeek, 0), 6);
    const safeDayOfMonth = Math.min(Math.max(dayOfMonth, 1), 31);

    switch (frequency) {
        case 'daily':
            return `${safeMinute} ${safeHour} * * *`;
        case 'weekly':
            return `${safeMinute} ${safeHour} * * ${safeDayOfWeek}`;
        case 'bi-weekly':
            return `${safeMinute} ${safeHour} * * ${safeDayOfWeek}/2`;
        case 'monthly':
            return `${safeMinute} ${safeHour} ${safeDayOfMonth} * *`;
        default:
            return `${safeMinute} ${safeHour} * * *`; // Default to daily
    }
}; 