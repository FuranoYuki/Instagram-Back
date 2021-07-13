import { Storage } from "@google-cloud/storage";
import path from "path";

const googleStorage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: `${
    path.resolve(__dirname, "..") + process.env.GCLOUD_APPLICATION_CREDENTIALS
  }`,
});

export default googleStorage.bucket(
  process.env.GCLOUD_STORAGE_BUCKET_URL as string
);
