import fs from "fs";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const input = path.resolve(__dirname, "dist");

function zipDirectory(outPath) {
  const output = fs.createWriteStream(outPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", function () {
    const totalBytes = archive.pointer();
    const totalKilobytes = (totalBytes / 1024).toFixed(2); // バイトをキロバイトに変換
    console.log(`${totalKilobytes} KB total bytes`);
    console.log(
      "archiver has been finalized and the output file descriptor has closed!"
    );
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.pipe(output);

  archive.directory(input, false);

  archive.finalize();
}

// 使用例
zipDirectory(path.resolve(__dirname, "app.zip"));
