import fastJson from "fast-json-stringify";
import fs from "fs";

export default class DB<T> {
  #filename: string;
  #defaultValue: T;
  #stringify: (doc: any) => any;

  data: T;

  /**
   * Instiated a new database on a file, by default will read from the database file
   *
   * @param filename JSON File path as the basis
   * @param schema Schema of the database, based on JSON Schema (https://json-schema.org/)
   * @param defaultValue Default value of the database
   */
  constructor(filename: string, schema: fastJson.AnySchema, defaultValue: T) {
    this.#filename = filename;
    this.#defaultValue = defaultValue;
    this.#stringify = fastJson(schema);

    this.data = defaultValue;
    this.read();
  }

  /**
   * Read from database file
   *
   * @returns Data from database file, in error returns default value
   */
  async read(): Promise<T> {
    try {
      const data = JSON.parse(
        await fs.promises.readFile(this.#filename, "utf8")
      ) as T;

      this.data = data;
    } catch (e) {
      this.data = this.#defaultValue;
    }

    return this.data;
  }

  /**
   * Write file to the database file
   */
  async write() {
    await fs.promises.writeFile(this.#filename, this.#stringify(this.data));
  }
}
