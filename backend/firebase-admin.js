import fs from "fs"
import admin from "firebase-admin"

const serviceKey = JSON.parse(fs.readFileSync("./insta-raw-admin.json", "utf-8"))

admin.initializeApp({
    credential: admin.credential.cert(serviceKey)
})

export default admin