import express from "express";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Determine the absolute path to the dist directory
    // Since server.cjs is compiled into dist/, __dirname represents the dist/ directory.
    const distPath = __dirname;
    app.use(express.static(distPath));
    
    // Catch-all for SPA routing, compatible with all Express versions
    app.use((req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
