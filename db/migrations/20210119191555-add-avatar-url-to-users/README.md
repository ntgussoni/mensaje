# Migration `20210119191555-add-avatar-url-to-users`

This migration has been generated by Gabriel Chertok at 1/19/2021, 4:15:55 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210119182859-add-message-views..20210119191555-add-avatar-url-to-users
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -21,8 +21,9 @@
   role              String     @default("user")
   slackUserId       String
   slackAccessToken  String     @default("")
   isInstalled       Boolean    @default(false)
+  avatarUrl         String?
   sessions          Session[]
   messages          Message[]
   reactions         Reaction[]
 }
```


