const express = require('express')
const app = express()
const port = 9000

app.use('/s3', require('react-s3-uploader/s3router')({
  bucket: "nfh-nonprod-audio",
  region: 'us-east-2', //optional
  signatureVersion: 'v4', //optional (use for some amazon regions: frankfurt and others)
  signatureExpires: 60, //optional, number of seconds the upload signed URL should be valid for (defaults to 60)
  headers: {'Access-Control-Allow-Origin': '*'}, // optional
  ACL: 'private', // this is default
  uniquePrefix: true // (4.0.2 and above) default is true, setting the attribute to false preserves the original filename in S3
}));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
