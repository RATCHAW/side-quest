import { env } from "@/env";
import { getUploadAuthParams } from "@imagekit/next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  //TODO: Protect the route

  const currentUnixTime = Math.floor(Date.now() / 1000);
  const futureUnixTime = currentUnixTime + 60;
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: env.IMAGEKIT_PRIVATE_KEY,
    publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    token: uuidv4(),
    expire: futureUnixTime, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
  });

  return Response.json({ token, expire, signature });
}
