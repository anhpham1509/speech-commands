import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { spawn } from "child_process";
import multer from "multer";

type Data = {
  name: string;
};

const apiRoute = nextConnect({
  // Handle any other HTTP method
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req: any, file: any, cb: any) => cb(null, file.originalname),
  }),
});

apiRoute.post(upload.single("file"), (req, res) => {
  console.log((req as any).file);

  const pythonProcess = spawn("python3", [
    "pages/api/predict.py",
    "pages/api/LSTM_model.h5",
    (req as any).file.path,
  ]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(data);
    console.log(data.toString());

    res.status(200).json({ prediction: data.toString().replace("\n", "") });
  });

  pythonProcess.stderr.on("data", (data) => {
    console.log(data);
    console.log(data.toString());
  });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
