import DB from "./index.js";
import fs from "fs";
import { Type, Static } from "@sinclair/typebox";

const TestSchema = Type.Object({
  string: Type.String(),
  number: Type.Number(),
  array: Type.Array(Type.String()),
  optional: Type.Optional(Type.String()),
});
type TestSchema = Static<typeof TestSchema>;

const DefaultTest: TestSchema = {
  string: "AAAAAAAAA!!!!!!",
  number: 69,
  array: ["AAAAAAAAAAAA", "Nope!"],
};

const TestData: TestSchema = {
  string: "AAAAAAAAAAAAAAAAAAAA!!!!!!!!!",
  number: 420,
  array: ["TEST", "NOT TEST", "YEA?"],
};

const testing = async () => {
  let TestWriteData = TestData;
  TestWriteData.optional = "Should exist";

  const filename = "./test-data/test-write-data.json";

  const db = new DB<TestSchema>(filename, TestSchema, DefaultTest);
  db.data.optional = TestWriteData.optional;

  await db.write();

  const data = JSON.parse(await fs.promises.readFile(filename, "utf-8"));
  fs.unlinkSync(filename);

  return data;
};

testing()
  .then((val) => {
    console.log(val);
  })
  .catch((err) => {
    console.error(err);
  });
