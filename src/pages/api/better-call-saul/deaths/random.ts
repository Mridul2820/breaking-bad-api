import supabase from "@/client/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("deaths-better-call-saul")
        .select("*")
        .eq("id", Math.floor(Math.random() * 56) + 1);

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
