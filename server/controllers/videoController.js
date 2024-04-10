import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({});
const S3BUCKET = "test-bucket-1703562676217";

export const videoRetrieval = async (request, reply) => {
  const { link } = request.params;
  console.log(link);
  const range = request.headers.range;

  const headObjectCommand = new HeadObjectCommand({
    Bucket: S3BUCKET,
    Key: `test/${link}.mov`,
  });

  const { ContentLength } = await s3Client.send(headObjectCommand);
  const MEGA_BYTE = 10 ** 6;
  const part = range.replace("bytes=", "").split("-");
  const start = parseInt(part[0], 10);
  let end = Math.min(start + MEGA_BYTE, ContentLength - 1);
  const streamRange = `bytes=${start}-${end}`;
  const header = {
    "Content-Range": `bytes ${start}-${end}/${ContentLength}`,
    "Accept-Ranges": "bytes",
    "Content-Length": `${end - start + 1}`,
    "Content-Type": "video/quicktime",
  };
  //console.log("Content Length: ", ContentLength);
  const getObjectCommand = new GetObjectCommand({
    Bucket: S3BUCKET,
    Key: `test/${link}.mov`,
    Range: streamRange,
  });

  const videoStream = await s3Client.send(getObjectCommand);

  reply
    .code(206)
    .headers(header)
    .type("video/quicktime")
    .send(videoStream.Body);

  return reply;
};

export const uploadVideo = async (request, reply) => {
  const { fileName } = request.params;
  console.log("uploadVideo route");
  console.log(fileName);
  // const data = await request.file();
  // console.log(data);

  try {
    const data = await request.file();
    //console.log(data.file);
    //console.log(data.fields);
    //console.log(data.encoding);
    //console.log(data.mimetype);
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: S3BUCKET,
        Key: `test/${fileName}.mov`,
        Body: data.file,
      },
    });
    await upload.done();
    console.log("Successfully uploaded!");
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
