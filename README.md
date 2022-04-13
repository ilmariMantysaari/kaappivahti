Scans barcodes with camera, checks the product info from Finnish grocery stores with the barcode.
Only works with products bought from Finnish stores, probably won't work at all at the time you're reading this.
My intention was to create an app that lets you just scan the barcode of a product you've bought,
so that you can keep a database of everything you have in your pantry so that you know what to buy and what to not buy.
As always with hobby projects, it's very unpolished.

### How does this work

There's no free to use barcode databases for Finnish products, but what I found out during making this, is that you can just google the number string in the barcode, and you'll find the product from k-ruoka or foodie, the sites of large Finnish grocery chains.
So what this does is it scans the barcode with quagga lib, and then google searches that barcode (:D), then scrapes the product info from the site.
This of course means that it's very prone to breaking, but hey, at least I didn't have to pay anything.

## Run dev env

```sh
# frontend
cd frontend
npm run serve

# backend
cd src
npm run start-watch

# seed db
docker-compose exec -T database psql -U pantrywatch pantrywatch < seed.sql
```
