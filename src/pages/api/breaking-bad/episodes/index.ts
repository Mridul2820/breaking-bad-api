import supabase from "@/client/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { season } = req.query;

  if (method === "GET") {
    try {
      if (season) {
        let { data, error } = await supabase
          .from("episodes-breaking-bad")
          .select("*")
          .eq("season", season);

        if (error) {
          res.status(400).json({ success: false, message: error.message });
        }

        res.status(200).json({ success: true, data: data });
      } else {
        let { data, error } = await supabase
          .from("episodes-breaking-bad")
          .select("*");

        if (error) {
          res.status(400).json({ success: false, message: error.message });
        }

        res.status(200).json({ success: true, data: data });
      }
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};
