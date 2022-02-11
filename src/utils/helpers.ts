export const sortByDate = (
  collection: any[],
  order?: "ascending" | "descending"
) => {
  if (order === "descending") {
    return collection.sort(
      (a: any, b: any) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }

  return collection.sort(
    (a: any, b: any) => +new Date(a.createdAt) - +new Date(b.createdAt)
  );
};

export const sortMentionsToTop = (collection: any[], userId: string) => {
  return collection.sort((a: any, b: any) =>
    a.mentions.includes(userId) ? -1 : 1
  );
};

export const getSecondsFromNextWeekend = () => {
  var d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay()) % 6) + 1);

  return (+d - +new Date()) / 1000;
};
