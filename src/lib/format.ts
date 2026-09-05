function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function formatDateID(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatTimeID(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDateTimeID(dateInput: string | Date): string {
  return `${formatDateID(dateInput)} ${formatTimeID(dateInput)}`;
}
