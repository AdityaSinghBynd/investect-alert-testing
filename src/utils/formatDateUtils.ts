export const formatDate = (date: string | Date): string => {
    const now = new Date();
    const givenDate = new Date(date);

    const timeDifference = now.getTime() - givenDate.getTime();

    const daysAgo = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (daysAgo === 0) {
        return "Today";
    } else if (daysAgo === 1) {
        return "1 day ago";
    } else {
        return `${daysAgo} days ago`;
    }
};

export const formatDateUtils = {
  formatISOToCustomDate: (isoString: string): string => {
    try {
      const date = new Date(isoString);
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      // Get day and month name
      const day = date.getDate().toString().padStart(2, '0');
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const month = monthNames[date.getMonth()];

      // Return in DD Month format
      return `${day} ${month}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }
};