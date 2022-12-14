const express = require("express");
const router = express.Router();
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA_myu9dLANhpR1FXQXZ_IVqXmRuUR_ahM",
    authDomain: "airbnb-367901.firebaseapp.com",
    projectId: "airbnb-367901",
    storageBucket: "airbnb-367901.appspot.com",
    messagingSenderId: "177736670407",
    appId: "1:177736670407:web:331b6806999205ac50f2e2",
    measurementId: "G-D8BNMV4ZEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

router.post("uploadPhoto", async (req, res) => {

    console.log("uploadPhotos!!!!!!!!!!!!!!!");
    // console.log(req.body);
    const form = formidable({ multiples: true });

    const result =
        await new Promise((resolve, rejsct) => {
            form.parse(req, (err, fields, files) => {
                resolve({
                    itemId: fields.itemId,
                    photos: files.photos
                });
            });
        });
    console.log(result);

    const storage = getStorage(app);
    const dirRef = ref(storage, "hosting/" + result.itemId);
    const photos = [];
    for (let one of result.photos) {
        const fileRef = ref(dirRef, one.newFilename);
        const file = fs.readFileSync(one.filepath);
        await uploadBytes(fileRef, file, {
            //타입지정
            contentType: one.mimetype,
        });
        photos.push({ extraUrl: await getDownloadURL(fileRef) });
    }

    console.log(photos);

    const reaultItem = await HostDB.findByIdAndUpdate(
        result.itemId,
        { picture: photos },
        {
            returnDocument: "after",
        }
    );

    return res.status(200).json(reaultItem);
}

);