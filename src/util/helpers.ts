export const pickRandom = (list: any[]) => list[Math.floor(Math.random() * list.length)]
import { readFile } from 'fs'
import * as http from 'http'
export const serveUi = async (filePath, port=8080) => {
    return new Promise(resolve => {
        http.createServer((req, res) => {
            readFile(filePath, function (err,data) {
                if (err) {
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }   
                res.writeHead(200);
                res.end(data);
                return true
            });
            }).listen(port, resolve);
    })
}   