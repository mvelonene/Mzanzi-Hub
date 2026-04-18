import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "MzansiHub API is running" });
  });

  // Localized Payment Example Endpoint (PayFast/Ozow would use something like this)
  app.post("/api/payments/initiate", (req, res) => {
    // In a real app, you would generate a payment signature here using server-side keys
    res.json({ 
      success: true, 
      paymentUrl: "https://sandbox.payfast.co.za/eng/process", // Mock sandbox URL
      merchantId: "10000100",
      amount: req.body.amount,
      itemName: req.body.itemName
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MzansiHub Server running on http://localhost:${PORT}`);
  });
}

startServer();
