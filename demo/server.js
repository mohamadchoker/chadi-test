// Simple HTTP server to serve the demo client
const express = require("express")
const path = require("path")

const app = express()
const PORT = 8080

// Serve static files from demo directory
app.use(express.static(__dirname))

// Serve the client.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client.html"))
})

app.listen(PORT, () => {
  console.log(`Demo client server running at http://localhost:${PORT}`)
  console.log("Open your browser and go to: http://localhost:8080")
})
