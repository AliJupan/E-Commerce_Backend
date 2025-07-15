import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileUploadLib {
  constructor(localFileStoragePath, logger) {
    this.localFileStoragePath = localFileStoragePath;
    this.log = logger;
  }

  async upload(attachment) {
    try {
      if (!attachment) {
        throw new Error("Invalid attachment");
      }

      const fileID = uuidv4();

      const fileParts = attachment.name.split(".");
      const fileType = fileParts.pop();

      const fileName = `${fileID}.${fileType}`;
      const filePath = path.join(
        __dirname,
        "..",
        "static",
        "uploads",
        fileName
      );

      await new Promise((resolve, reject) => {
        attachment.mv(filePath, function (err) {
          if (err) {
            console.log(err);
            reject();
          }
          resolve();
        });
      });
      this.log.info({
        module: "FileUploadLib",
        fn: "upload",
        message: "File uploaded successfully",
        filePath,
      });

      return { filePath, fileName, fileID };
    } catch (err) {
      this.log.error({
        module: "FileUploadLib",
        fn: "upload",
        err,
      });
      return Promise.reject(err);
    }
  }

  async delete(fileName) {
    try {
      const filePath = path.join(
        __dirname,
        "..",
        "static",
        "uploads",
        fileName
      );

      const fileExists = await new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
          resolve(!err);
        });
      });

      if (!fileExists) {
        this.log.error("File does not exist");
        return null;
      }

      await new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });

      this.log.info({
        module: "FileUploadLib",
        fn: "delete",
        message: "File deleted successfully",
        filePath,
      });

      return { message: "File deleted successfully", filePath };
    } catch (err) {
      this.log.error({
        module: "FileUploadLib",
        fn: "delete",
        err,
      });
      return Promise.reject(err);
    }
  }

  async get(fileName) {
    try {
      const filePath = path.join(
        __dirname,
        "..",
        "static",
        "uploads",
        fileName
      );

      const fileExists = await new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
          resolve(!err);
        });
      });

      if (!fileExists) {
        this.log.error("File does not exist");
        return null;
      }

      const stats = await new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            reject(err);
          }
          resolve(stats);
        });
      });

      this.log.info({
        module: "FileUploadLib",
        fn: "get",
        message: "File retrieved successfully",
        filePath,
      });

      return { filePath, fileName, stats };
    } catch (err) {
      this.log.error({
        module: "FileUploadLib",
        fn: "get",
        err,
      });
      return Promise.reject(err);
    }
  }
}

export default FileUploadLib;
