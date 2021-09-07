import DB from "./index";
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

test("read nonexistent file, returns default value", async () => {
  expect(
    await new DB<TestSchema>(
      "./test-data/nonexistent.json",
      TestSchema,
      DefaultTest
    ).read()
  ).toEqual(DefaultTest);
});

test("read existing file, returns file value", async () => {
  expect(
    await new DB<TestSchema>(
      "./test-data/test-data.json",
      TestSchema,
      DefaultTest
    ).read()
  ).toEqual(TestData);
});

test("write file", async () => {
  let TestWriteData = TestData;
  TestWriteData.optional = "Should exist";

  const filename = "./test-data/test-write-data.json";

  const db = new DB<TestSchema>(filename, TestSchema, TestData);
  db.data.optional = TestWriteData.optional;

  await db.write();

  expect(fs.existsSync(filename)).toBeTruthy();
  expect(JSON.parse(await fs.promises.readFile(filename, "utf-8"))).toEqual(
    TestWriteData
  );

  fs.unlinkSync(filename);
});

afterAll(() => {
  if (fs.existsSync("./test-data/test-write-data.json"))
    fs.unlinkSync("./test-data/test-write-data.json");
});
