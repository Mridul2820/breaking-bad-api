import supabase from "@/client/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { id } = req.query;

  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("episodes-better-call-saul")
        .select("*")
        .eq("id", id);

      if (error) {
        res.status(400).json({ success: false, message: error.message });
      }

      res.status(200).json({ success: true, data: data![0] });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};
