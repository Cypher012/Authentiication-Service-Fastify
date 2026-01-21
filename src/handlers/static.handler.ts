import type { FastifyRequest, FastifyReply } from "fastify";
import { promises } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const { readFile } = promises;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function serveIndex(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const indexHtmlPath = resolve(__dirname, "../public/index.html");
  const indexHtmlContent = await readFile(indexHtmlPath);
  reply.header("Content-Type", "text/html; charset=utf-8").send(indexHtmlContent);
}
