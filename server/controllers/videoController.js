import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import { createClient } from "@libsql/client";

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

const client = createClient({
  url: process.env.PAUL_TURSO_URL,
  authToken: process.env.PAUL_TURSO_TOKEN,
});

export const addRoomID = async (request, reply) => {
  console.log(request.body + request.body.roomID);
  client
    .execute({
      sql: "insert into room (roomID) values (?)",
      args: [request.body],
    })
    .then(() => {
      console.log("Added Room Hooray!");
      reply.code(200).send("success");
    })
    .catch((error) => {
      console.error(error);
      reply.code(400).send("error");
    });
};

export const checkIfYTRoomExist = async (request, reply) => {
  const { date, ytID } = request.params;
  const url = `video-${date}-https://www.youtube.com/watch?v=${ytID}`;
  let result = 0;
  const res = await client.execute({
    sql: "select count(*) from room where roomID = ?",
    args: [url],
  });

  reply.code(200).send({ result: res["rows"][0]["count (*)"] });
  //return { result: res["rows"][0]["count (*)"] };
};

export const checkIfRoomExist = async (request, reply) => {
  const { roomID } = request.params;
  console.log("Not youtube check");
  console.log(roomID);
  let result = 0;
  const res = await client.execute({
    sql: "select count(*) from room where roomID = ?",
    args: [roomID],
  });
  console.log(res["rows"][0]["count (*)"]);
  reply.code(200).send({ result: res["rows"][0]["count (*)"] });
  //return { result: res["rows"][0]["count (*)"] };
};

export const getVideos = async (request, reply) => {
  let ret = [];
  console.log("Get Videos!");
  const command = new ListObjectsV2Command({
    Bucket: `${S3BUCKET}`,
    Prefix: "test/",
    // The default and maximum number of keys returned is 1000. This limits it to
    // one for demonstration purposes.
    MaxKeys: 1,
  });
  let contents = "";
  let isTruncated = true;
  while (isTruncated) {
    const { Contents, IsTruncated, NextContinuationToken } =
      await s3Client.send(command);
    const filename = Contents.map((c) => {
      const key = c.Key;
      const prefixRemoved = key.replace("test/", "");
      const lastIndex = prefixRemoved.lastIndexOf(".");
      return lastIndex !== -1
        ? prefixRemoved.substring(0, lastIndex)
        : prefixRemoved;
    });
    ret.push(filename[0]);
    isTruncated = IsTruncated;
    command.input.ContinuationToken = NextContinuationToken;
  }
  reply.code(200).header("Content-Type", "application/json").send(ret);
  // const data = await s3Client.listObjectsV2({ Bucket: S3BUCKET });
  // console.log("hi");
};
