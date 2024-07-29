import { LokaliseApi } from "@lokalise/node-api";
import { env } from "./env";

export const lokaliseApi = new LokaliseApi({
  apiKey: env.lokalizeToken,
});
