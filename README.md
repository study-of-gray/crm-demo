# CRM Demo

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app),
extended with **Prisma 6**, **PostgreSQL (Neon)** and **shadcn/ui** for a full-stack CRM experience.

---

## 🗄 Database

This project uses **PostgreSQL**, hosted on [Neon](https://neon.tech).

### Why Neon?

- PlanetScale is unavailable in Mainland China
- Neon provides a free, cloud-native PostgreSQL instance with good access stability
- Fully compatible with Prisma + Vercel

### Tech Stack

| Layer      | Tech              |
| ---------- | ----------------- |
| Database   | PostgreSQL (Neon) |
| ORM        | Prisma 6.x (LTS)  |
| Deployment | Vercel + Neon     |

### Environment Variables

Create a `.env` file in the root directory (do **not** commit it):
