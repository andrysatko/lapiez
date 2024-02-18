import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const objData = {
    CaloryInfo: {
        Proteins:"170",
        Carbohydrates:2,
        Fats:15,
        CalorieContent:10
    },
    ProductWeight:423,
    description:"description",
    // price:100,
    title:"title",
    typeId:"65ccb2c05250a496c2796bbe",
    categoryId:"65ccb2a95250a496c2796bbd"
}
const filePath = path.join(process.cwd(), 'src', 'burger.jpg');
const filePath2 = path.join(process.cwd(), 'src', 'burger2.jpg');
let readSteam = fs.createReadStream(filePath);
let write = fs.createWriteStream('test.jpg');
readSteam.pipe(write);
console.log(readSteam);
const file = fs.createReadStream(filePath);
const file2 = fs.createReadStream(filePath2);
const form = new FormData();
//Object.keys(objData).map(key => form.append(key, objDa.ta[key]));
form.append('CaloryInfo', JSON.stringify(objData.CaloryInfo));
form.append('ProductWeight', 423.323);
form.append('description', 'description');
form.append('price', "100.231");
form.append('title', 'title');
form.append('typeId', '65ccb2c05250a496c2796bbe');
form.append('categoryId', '65ccb2a95250a496c2796bbd');
form.append('files', readSteam);
form.append('files', readSteam);
console.log(form);
axios.post('http://localhost:3000/admin/create-product', form);
