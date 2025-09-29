import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/chat", "routes/api.chat.ts"),
  route("api/upload", "routes/api.upload.ts"),
] satisfies RouteConfig;
