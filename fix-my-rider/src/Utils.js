export const getUserName = () => {
  return localStorage.getItem("username");
};

export const getDateAndTime = (timestamp) => {
  const date = new Date(timestamp);

  const formattedDate = `${date.getFullYear()}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  const formattedTime = `${date.getHours()}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;

  return `${formattedDate} at ${formattedTime}`;
};

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  // Helper to format time
  const formatTime = (date) =>
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // Helper to get abbreviated month
  const getMonthAbbreviation = (date) =>
    date.toLocaleString(undefined, { month: "short" }); // e.g., "Nov"

  // Check if the date is today
  if (date.toDateString() === now.toDateString()) {
    return `Today, ${formatTime(date)}`;
  }

  // Check if the date is yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${formatTime(date)}`;
  }

  // Determine if the year should be shown
  const showYear = date.getFullYear() !== now.getFullYear();

  // Return a formatted date for other days
  return (
    `${getMonthAbbreviation(date)} ${date.getDate()}` +
    (showYear ? `, ${date.getFullYear()}` : "") +
    `, ${formatTime(date)}`
  );
}
