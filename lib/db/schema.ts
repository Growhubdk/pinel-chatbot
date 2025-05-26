// lib/db/schema.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  json,
  primaryKey,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }),
  password: varchar('password', { length: 64 }),
});
export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdat: timestamp('createdat').notNull(),
  title: text('title').notNull(),
  userid: uuid('userid').notNull().references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});
export type Chat = InferSelectModel<typeof chat>;

export const messageDeprecated = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatid: uuid('chatid').notNull().references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdat: timestamp('createdat').notNull(),
});
export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = pgTable('Message_v2', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatid: uuid('chatid').notNull().references(() => chat.id),
  role: varchar('role').notNull(),
  parts: json('parts').notNull(),
  attachments: json('attachments').notNull(),
  createdat: timestamp('createdat').notNull(),
});
export type DBMessage = InferSelectModel<typeof message>;

export const voteDeprecated = pgTable(
  'Vote',
  {
    chatid: uuid('chatid').notNull().references(() => chat.id),
    messageid: uuid('messageid').notNull().references(() => messageDeprecated.id),
    isupvoted: boolean('isupvoted').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.chatid, table.messageid] }),
  })
);
export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

export const vote = pgTable(
  'Vote_v2',
  {
    chatid: uuid('chatid').notNull().references(() => chat.id),
    messageid: uuid('messageid').notNull().references(() => message.id),
    isupvoted: boolean('isupvoted').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.chatid, table.messageid] }),
  })
);
export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdat: timestamp('createdat').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('kind', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    userid: uuid('userid').notNull().references(() => user.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.createdat] }),
  })
);
export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentid: uuid('documentid').notNull(),
    documentcreatedat: timestamp('documentcreatedat').notNull(),
    originaltext: text('originaltext').notNull(),
    suggestedtext: text('suggestedtext').notNull(),
    description: text('description'),
    isresolved: boolean('isresolved').notNull().default(false),
    userid: uuid('userid').notNull().references(() => user.id),
    createdat: timestamp('createdat').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentid, table.documentcreatedat],
      foreignColumns: [document.id, document.createdat],
    }),
  })
);
export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  'Stream',
  {
    id: uuid('id').notNull().defaultRandom(),
    chatid: uuid('chatid').notNull().references(() => chat.id),
    createdat: timestamp('createdat').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  })
);
export type Stream = InferSelectModel<typeof stream>;
