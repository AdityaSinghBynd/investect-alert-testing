import cronParser from "cron-parser";

interface Collection {
  id: string;
  collectionName: string;
  schedule: string;
  alerts?: unknown[];
}

interface ExecutionTime {
  id: string;
  title: string;
  nextDate: string;
  willDeliveryHappen: boolean;
}

// Constants
const CRON_FIELD_COUNT = 5;
const ALL_POSITIONS = '*';

type Schedule = "Daily" | "Weekly" | "Monthly";

export type CronFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Instant' | 'Custom' | 'Invalid';

/**
 * Normalize schedule value to handle different input formats
 * @param schedule - The schedule value to normalize
 */
const normalizeSchedule = (schedule: unknown): string | null => {
  // If schedule is "Daily", "Weekly", etc. convert to corresponding cron pattern
  const scheduleMap: Record<string, string> = {
    'Daily': '0 0 * * *',
    'Weekly': '0 0 * * 1',
    'Monthly': '0 0 1 * *',
    'Instant': '* * * * *'
  };

  if (typeof schedule === 'string') {
    // If it's already a cron pattern, return as is
    if (schedule.includes('*') || /^\d/.test(schedule)) {
      return schedule;
    }
    // If it's a named schedule, convert it
    return scheduleMap[schedule] || null;
  }

  return null;
};

/**
 * Classifies a cron pattern into a human-readable frequency
 */
export const classifyCron = (cronPattern: string): CronFrequency => {
  // Handle empty or invalid patterns
  if (!cronPattern?.trim()) {
    return 'Invalid';
  }

  const fields = cronPattern.trim().split(' ');
  
  if (fields.length !== CRON_FIELD_COUNT) {
    console.debug('Invalid field count:', fields.length, fields);
    return 'Invalid';
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = fields;

  // Frequency classification rules with debugging
  const rules: Array<[boolean, CronFrequency]> = [
    [
      dayOfMonth === ALL_POSITIONS && 
      dayOfWeek === ALL_POSITIONS && 
      month === ALL_POSITIONS,
      'Daily'
    ],
    [
      dayOfWeek !== ALL_POSITIONS && 
      dayOfMonth === ALL_POSITIONS && 
      minute !== ALL_POSITIONS && 
      hour !== ALL_POSITIONS,
      'Weekly'
    ],
    [
      dayOfMonth !== ALL_POSITIONS && 
      minute !== ALL_POSITIONS && 
      hour !== ALL_POSITIONS && 
      dayOfWeek === ALL_POSITIONS,
      'Monthly'
    ],
    [
      minute !== ALL_POSITIONS && 
      dayOfWeek === ALL_POSITIONS,
      'Instant'
    ]
  ];

  const matchedRule = rules.find(([condition]) => condition);
  console.debug('Matched rule:', matchedRule?.[1] || 'Custom');

  return matchedRule?.[1] ?? 'Custom';
};

/**
 * Safe wrapper for classifyCron that handles all possible schedule inputs
 */
export const getCollectionScheduleFrequency = (schedule?: unknown): CronFrequency => {
  console.debug('Original schedule value:', schedule);
  
  const normalizedSchedule = normalizeSchedule(schedule);
  console.debug('Normalized schedule:', normalizedSchedule);

  if (!normalizedSchedule) {
    return 'Custom';
  }
  
  try {
    const frequency = classifyCron(normalizedSchedule);
    console.debug('Classified frequency:', frequency);
    return frequency;
  } catch (error) {
    console.error('Error classifying schedule:', error);
    return 'Custom';
  }
};

/**
 * Calculates the next execution time for a collection
 * @param collection - The collection to calculate for
 * @returns The execution time details
 */
const calculateNextExecutionForCollection = (
  collection: Collection,
): ExecutionTime => {
  try {
    const interval = cronParser.parseExpression(collection.schedule, {
      currentDate: new Date(),
      tz: "GMT",
    });

    const nextOccurrenceUTC = interval.next().toDate();
    const localNextOccurrence = new Date(nextOccurrenceUTC);

    return {
      id: collection.id,
      title: collection.collectionName,
      nextDate: localNextOccurrence.toString(),
      willDeliveryHappen:
        Array.isArray(collection.alerts) && collection.alerts.length > 0,
    };
  } catch (error) {
    console.error(
      `Error parsing cron expression for collection ${collection.id}:`,
      error,
    );
    return {
      id: collection.id,
      title: collection.collectionName,
      nextDate: "Error calculating next execution time",
      willDeliveryHappen: false,
    };
  }
};

/**
 * Converts a user-friendly schedule to a cron expression or validates an existing cron
 * @param schedule - The schedule type (Daily, Weekly, Monthly) or cron expression
 * @returns The corresponding cron expression
 */
export const scheduleFormatToCron = (schedule: Schedule | string): string => {
  // If it's already a cron pattern, validate and return it
  if (typeof schedule === 'string' && schedule.includes('*')) {
    try {
      // Validate the cron pattern
      cronParser.parseExpression(schedule);
      return schedule;
    } catch (error) {
      console.error('Invalid cron pattern:', error);
      return "0 0 * * *"; // Default to daily at midnight
    }
  }

  // Handle schedule types
  switch (schedule) {
    case "Daily":
      return "30 3 * * *";
    case "Weekly":
      return "30 3 * * 1";
    case "Monthly":
      return "30 3 15 * *";
    default:
      console.error(`Unrecognized schedule format: ${schedule}, defaulting to daily`);
      return "0 0 * * *"; // Default to daily at midnight
  }
};

/**
 * Calculates next executions for multiple collections
 * @param collections - Array of collections to process
 * @returns Array of execution times or null if no collections
 */
export const calculateNextExecutions = (
  collections?: Collection[],
): ExecutionTime[] | null => {
  if (!Array.isArray(collections) || collections.length === 0) {
    return null;
  }

  return collections.map(calculateNextExecutionForCollection);
};

/**
 * Gets the next occurrence time from a cron expression in a formatted string
 * @param cronExpression - The cron expression to parse
 * @returns Formatted string of next occurrence time
 */
export const getNextOccurrenceFormatted = (cronExpression: string): string => {
  try {
    // Parse the cron expression in UTC
    const interval = cronParser.parseExpression(cronExpression);
    const nextDateUTC = interval.next().toDate();
    
    // Convert UTC to IST by adding 5 hours and 30 minutes
    const nextDateIST = new Date(nextDateUTC.getTime() + (5.5 * 60 * 60 * 1000));
    
    // Format the date in IST
    return nextDateIST.toLocaleString('en-US', {
      // hour: 'numeric',
      // minute: 'numeric',
      weekday: 'long',
      // hour12: true
    });
  } catch (error) {
    console.error('Error parsing cron expression:', error);
    return 'Invalid schedule';
  }
};



