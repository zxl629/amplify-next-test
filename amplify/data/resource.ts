import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      type: a.string(),
    })
    .secondaryIndexes((index) => [index("type").queryField("listByType")])
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated("identityPool").to(["create", "read"]),
      allow.groups(["ADMINS"]),
    ]),
  MatrixTest: a
    .model({
      values: a.string().required().array().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Notification: a
    .model({
      messageID: a.id().required(),
      userID: a.id().required(),
      title: a.string().required(),
      message: a.string().required(),
      timestamp: a.string().required(),
      statusRead: a.boolean().required(),
    })
    .identifier(["messageID"])
    .secondaryIndexes((index) => [index("userID")])
    .authorization((allow) => [allow.owner()]),
  DeviceMeasures: a
    .model({
      tenantId: a.string().required(),
      name: a.string(),
      measures: a.customType({
        ts: a.integer(),
        pwr: a.integer(),
        tankPct: a.float(),
        tankRem: a.float(),
        bmsPct: a.float(),
        bmsRem: a.float(),
        flow: a.float(),
        outPsi: a.float(),
        outKpa: a.float(),
      }),
      recentMeasures: a.json(),
    })
    .identifier(["tenantId"])
    .authorization((allow) => [allow.groupDefinedIn('tenantId')]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  name: "SSRClientAPI",
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "identityPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
