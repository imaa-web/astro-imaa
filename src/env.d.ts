declare namespace App {
  interface Locals {
    siteSettings: import("@/lib/sanity.types").SITE_SETTINGS_QUERY_RESULT | null;
    cfContext?: import("@cloudflare/workers-types").ExecutionContext;
  }
}
