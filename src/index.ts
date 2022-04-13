
// https://www.google.com/search?&ei=Q0bjX--vM-7GrgS2sKa4DA&q=6438428934388+site%3Ak-ruoka.fi&oq=6438428934388+site%3Ak-ruoka.fi&gs_lcp=CgZwc3ktYWIQA1D9E1jXZGCYamgBcAB4AIABWogBwwiSAQIxNpgBAKABAaoBB2d3cy13aXrAAQE&sclient=psy-ab&ved=0ahUKEwiv3aL3muTtAhVuo4sKHTaYCccQ4dUDCAw&uact=5
// https://www.google.com/search?&oq=6438428934388+site%3Ak-ruoka.fi

// https://duckduckgo.com/?q=6438428934388+site%3Ak-ruoka.fi&ia=web

import * as koa from 'koa';
import * as router from 'koa-router';
import { search } from './productSearch';
import * as knex from 'knex';
import * as bodyParser from 'koa-bodyparser';
import { insertProduct, insertToPantry, listPantry, removeFromPantry } from './db';
const cors = require('@koa/cors');


const APP_PORT = 3000;
const app = new koa();


app.use(bodyParser({}));
app.use(cors());

console.log('db conf', process.env.DB_HOST, process.env.DB_PORT );


export const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
});

const appRouter = new router();
appRouter.get('/api/query', async (ctx) => {
  console.log(ctx.query);
  console.log('barcode', ctx.query.barcode);
  console.log('barcode type', typeof ctx.query.barcode);

  if (!ctx.query.barcode) {
    ctx.status = 400
    return ctx.body = "barcode not defined"
  }

  // TODO Search from own
  const productDetails = await search(ctx.query.barcode);
  console.log('res', productDetails);
  if (productDetails) {
    // Save all found barcodes to products
    // We dont need to wait this
    insertProduct(productDetails);
  }
  return ctx.body = productDetails
})

appRouter.post('/api/products', async (ctx) => {
  console.log(ctx.request.body);
  const insertRes = await insertProduct({
    name: ctx.request.body.name,
    barcode: ctx.request.body.barcode,
    picUrl: ctx.request.body.picUrl
  });
  return ctx.body = { inserted: insertRes };
});
appRouter.get('/api/products', async (ctx) => {
  console.log(ctx.request.body);
  const res = await db('products').where('active', '=', true);
  console.log('products', res);
  return ctx.body = res;
});


appRouter.delete('/api/pantry/:id', async (ctx) => {
  console.log(ctx.params);
  return removeFromPantry(ctx.params.id);
});
appRouter.post('/api/pantry', async (ctx) => {
  console.log(ctx.request.body);
  const insertRes = await insertToPantry(
    ctx.request.body.barcode
  );
  // TODO return something real
  return ctx.body = insertRes;
});
appRouter.get('/api/pantry', async (ctx) => {
  return ctx.body = await listPantry();
});



app.use(appRouter.routes());
app.listen(APP_PORT, () => {
  console.log(`Server running in ${APP_PORT}`);

});

