export async function randomDelay(
  minMs = 1000,
  maxMs = 2000,
): Promise<void> {
  const ms = minMs + Math.floor(Math.random() * (maxMs - minMs + 1));
  await new Promise((resolve) => setTimeout(resolve, ms));
}
