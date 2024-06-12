function getCurrentDay(): string {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDayName = daysOfWeek[currentDay];

  return currentDayName;
}

export { getCurrentDay };
