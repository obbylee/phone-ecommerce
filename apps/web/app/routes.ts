import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("components/layouts/main.tsx", [
    index("routes/onboard.tsx"),
    route("product", "./routes/product.tsx"),
    route("product/:slug", "./routes/productDetails.tsx"),
  ]),
] satisfies RouteConfig;
