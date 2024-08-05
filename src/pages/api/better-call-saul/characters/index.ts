import supabase from "@/client/supabase";
import {
  rateLimitInterval,
  rateLimitUniqueTokenPerInterval,
  requestLimit,
} from "@/constant";
import rateLimit from "@/lib/rate-limit";

import { NextApiRequest, NextApiResponse } from "next";

const limiter = rateLimit({
  interval: rateLimitInterval,
  uniqueTokenPerInterval: rateLimitUniqueTokenPerInterval,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { name, offset, limit } = req.query;

  if (method === "GET") {
    try {
      await limiter.check(res, requestLimit, "CACHE_TOKEN");
      if (name) {
        let { data, error } = await supabase
          .from("characters-better-call-saul")
          .select("*")
          .eq("name", name || "")
          .range(
            offset ? parseInt(offset as string) : 0,
            limit ? parseInt(limit as string) : 10
          );

        if (error) {
          res.status(400).json({ success: false, message: error.message });
        }

        res.status(200).json({ success: true, data: data });
      } else {
        let { data, error } = await supabase
          .from("characters-better-call-saul")
          .select("*")
          .range(
            offset ? parseInt(offset as string) : 0,
            limit ? parseInt(limit as string) : 10
          );

        if (error) {
          res.status(400).json({ success: false, message: error.message });
        }

        res.status(200).json({ success: true, data: data });
      }
    } catch (error: any) {
      res.status(429).json({ error: "Rate limit exceeded" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};
