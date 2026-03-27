# Supabase SSR Auth Starter（脚手架）

这是一个最小可运行的 Next.js App Router 脚手架，用来演示一个明确的问题：**不要把会话刷新放在 middleware 里，而是放到独立的后台刷新路径里处理**。当前仓库保留了两层能力：

- 一层是本地无状态 token auth seam，用来保证无凭据 QA 也能完整跑通 happy path。
- 一层是真实的 Supabase SSR helper 接线面，放在 `src/lib/supabase/`，方便后续替换到真实环境。

## 面向谁

适合想做 Supabase SSR 鉴权、但不希望把 token 刷新压在请求链路上的开发者。你可以先用这个本地 starter 验证结构，再把 demo auth seam 替换成真实的 Supabase server client 接入。

## 当前能力

- 提供一个最小 Next.js App Router 结构
- 提供 `@supabase/ssr` + `@supabase/supabase-js` 的最小 helper 接线面
- 支持登录 -> 受保护页面 -> 后台刷新 -> 页面刷新后继续访问
- 通过 `POST /api/auth/refresh` 处理刷新，不走 middleware
- 用本地无状态 token auth service 保证 QA 可重复

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:4173/sign-in`，直接提交默认邮箱，进入受保护页面后等待刷新计数变化，再刷新页面并点击“Load protected data”。如果页面仍然可用，就说明刷新链路没有放在 middleware 上。

## Supabase 接线位置

- `src/lib/supabase/server.ts`：Next App Router server-side helper
- `src/lib/supabase/client.ts`：browser helper
- `.env.example`：最小环境变量示例

当你准备接入真实 Supabase 项目时，先复制 `.env.example` 并填入项目值，再把当前 demo seam 逐步替换成真实 server/browser client。

## 发布前检查

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## 当前限制

- 当前 happy path 仍然由本地 demo seam 驱动，不是生产可用的真实 Supabase 登录流程
- 不包含社交登录、跨子域共享、租户权限或后台管理
- 不包含恢复流程、magic link、provider 配置等扩展能力

## 后续再做

- 把当前 demo seam 逐步切到真实 Supabase SSR 登录流程
- 增加真实 Supabase 环境下的验证步骤
- 如果以后需要完整会话刷新支持，再补 proxy/middleware 层说明
