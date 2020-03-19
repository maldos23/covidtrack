const handler = require('serve-handler');
const http = require('http');
const path = require('path');
const capitalFile = "/index.html";

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let PORT = process.env.PORT;

const server = http.createServer((request, response) => {

  return handler(request, response,{
      cleanUrls:true,
      rewrites:[
        {"source": "/**", "destination": capitalFile }
      ],
      renderSingle:true,
      public:path.join(__dirname,"./build"),
      symlinks:true,
      etag:true
  });
});

server.listen(PORT, () => {
    console.log('\x1b[34m%s\x1b[0m',`\n Server in: \n\n PORT:${PORT} \n\n`);
});