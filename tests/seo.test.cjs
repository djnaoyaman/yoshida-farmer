const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const base='https://djnaoyaman.github.io/yoshida-farmer/';
test('production page is indexable with one canonical and one h1',()=>{
  assert(!/noindex|nofollow/i.test(html));
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert(html.includes('rel="canonical" href="'+base+'"'));
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
  assert(html.includes('<html lang="ja">'));
  assert(Buffer.byteLength(html)<60000);
});
test('structured graph references resolve and factual FAQ matches page',()=>{
  const data=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const ids=new Set(data['@graph'].map(n=>n['@id']));
  function visit(n){
    if(!n||typeof n!=='object')return;
    if(n['@id']&&Object.keys(n).length===1)assert(ids.has(n['@id']),n['@id']);
    Object.values(n).forEach(visit);
  }
  visit(data);
  const faq=data['@graph'].find(n=>n['@type']==='FAQPage');
  const body=html.slice(html.indexOf('<body>'));
  faq.mainEntity.forEach(q=>{assert(body.includes(q.name));assert(body.includes(q.acceptedAnswer.text));});
  const product=data['@graph'].find(n=>n['@type']==='Product');
  assert(!product.offers&&!product.aggregateRating);
});
test('images are external, sized, described and lazy except hero',()=>{
  const imgs=[...html.matchAll(/<img\b[^>]+>/g)].map(m=>m[0]);
  assert.equal(imgs.length,14);
  imgs.forEach((tag,i)=>{
    const src=tag.match(/src="([^"]+)"/)[1];
    assert(!src.startsWith('data:'));
    assert(fs.existsSync(path.join(root,src)),src);
    assert(/width="\d+" height="\d+"/.test(tag));
    assert(/alt="[^"]+"/.test(tag));
    if(i===0)assert(tag.includes('fetchpriority="high"')&&!tag.includes('loading="lazy"'));
    else assert(tag.includes('loading="lazy"'));
  });
});
test('social previews and internal links use valid targets',()=>{
  for(const key of ['og:title','og:description','og:url','og:image','og:image:alt','twitter:card','twitter:image','twitter:image:alt']){
    assert.equal((html.match(new RegExp('(?:property|name)="'+key+'"','g'))||[]).length,1,key);
  }
  assert(html.includes(base+'og-image.jpg'));
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for(const m of html.matchAll(/href="#([^"]+)"/g))assert(ids.has(m[1]),m[1]);
});
test('sitemap, robots and AI summary agree on production URL',()=>{
  for(const file of ['sitemap.xml','robots.txt','llms.txt'])assert(fs.readFileSync(path.join(root,file),'utf8').includes(base));
  assert(!fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Disallow: /'));
});
