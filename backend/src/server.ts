import { createApp } from "./app";
import { productRepository } from "./repositories/product.repository";

const PORT = Number(process.env.PORT) || 3000;
const app = createApp(productRepository);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
