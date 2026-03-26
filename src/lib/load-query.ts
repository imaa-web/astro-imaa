import { sanityClient } from "@/lib/sanity-client";
import type { QueryParams } from "@sanity/client";

export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}) {
  const result = await sanityClient.fetch<QueryResponse>(query, params ?? {}, {
    perspective: "published",
  });

  return { data: result };
}
