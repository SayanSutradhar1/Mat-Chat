type ConvertFormat = "date" | "month" | "year" | "fromNow";

/**
 * Formats a given date into a specific format.
 *
 * @param inputDate - The date to format (ISO string or Date object).
 * @param convertFormat - The desired output format ("date", "month", "year", "fromNow").
 *                        Defaults to "date".
 * @returns A formatted string representing the date.
 * @throws Error if the input date is invalid.
 */
export function formatDate(
  inputDate: string | Date,
  convertFormat: ConvertFormat = "date"
): string {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  switch (convertFormat) {
    case "date":
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    case "month":
      return date.toLocaleDateString("en-GB", { month: "long" });

    case "year":
      return date.getFullYear().toString();

    case "fromNow": {
      const now = Date.now();
      const diffMs = now - date.getTime();
      const isPast = diffMs >= 0;
      const absMs = Math.abs(diffMs);

      const seconds = Math.floor(absMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30); // approximation
      const years = Math.floor(days / 365); // approximation

      const plural = (n: number, unit: string) =>
        `${n} ${unit}${n !== 1 ? "s" : ""}`;

      // Very recent
      if (seconds < 5) return isPast ? "just now" : "in a few seconds";
      if (seconds < 60) return isPast ? `${seconds} sec ago` : `in ${seconds} sec`;
      if (minutes < 60) return isPast ? `${minutes} min ago` : `in ${minutes} min`;
      if (hours < 24) return isPast ? `${plural(hours, "hour")} ago` : `in ${plural(hours, "hour")}`;
      if (days < 30) return isPast ? `${plural(days, "day")} ago` : `in ${plural(days, "day")}`;
      if (months < 12) return isPast ? `${plural(months, "month")} ago` : `in ${plural(months, "month")}`;
      return isPast ? `${plural(years, "year")} ago` : `in ${plural(years, "year")}`;
    }

    default:
      throw new Error("Invalid convertFormat");
  }
}
