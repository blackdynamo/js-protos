const extra = require("fs-extra");
const fs = require("fs");
const path = require("path");
const proto = require("protobufjs");
const util = require("util");

const readDir = util.promisify(fs.readdir);

process.on("unhandledRejection", err => {
  throw err;
});

const build = async () => {
  const protoPath = path.dirname(require.resolve("protos/package.json"));
  const files = await readDir(protoPath);

  await Promise.all(files.map(async file => {
    if (file.slice(-6) === ".proto") {
      const root = await proto.load(path.join(protoPath, file));
      const AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");

      await extra.writeJson(file.replace(".proto", ".json"), root.toJSON());
    }
  }));
};

build();
