export const countLastNDays = (items, days = 7) => {
  if (!Array.isArray(items)) return 0;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return items.filter((item) => {
    const dateValue = typeof item === "string" ? item : item?.date;
    if (!dateValue) return false;

    const itemDate = new Date(dateValue);
    itemDate.setHours(0, 0, 0, 0);

    return itemDate >= startDate;
  }).length;
};

export const countWeeklyItems = (items) => countLastNDays(items, 7);
