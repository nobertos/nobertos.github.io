import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts";

const PORT = 8080;

Deno.serve({ port: PORT }, (req) => {
  return serveDir(req, {
    fsRoot: "./out/res",
  });
});

console.log(`Server running at http://localhost:${PORT}/`);
