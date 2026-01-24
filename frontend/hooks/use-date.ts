export function useDate(locale: string = "pt-BR") {
  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return {
    formatDateTime,
  };
}
