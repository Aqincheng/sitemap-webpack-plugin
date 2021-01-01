import webpack from "webpack";
import { sync as clean } from "rimraf";
import directoryContains from "./utils/directory-contains";
import * as cases from "./cases";

const OriginalDate = Date;

describe("Success cases", () => {
  Object.values(cases).forEach(successCase => {
    describe(successCase.label, () => {
      beforeEach(() => {
        if (successCase.key === "global-opts") {
          const mockDate = new Date(1577836800000);
          const FakeDate = class extends Date {
            constructor() {
              super();
              return mockDate;
            }
          } as DateConstructor;
          global.Date = FakeDate;
        } else {
          global.Date = OriginalDate;
        }

        clean(`${__dirname}/cases/${successCase.key}/actual-output`);
      });

      it("generates the expected sitemap", done => {
        webpack(successCase.config, err => {
          if (err) {
            return done(err);
          }

          const caseDir = `${__dirname}/cases/${successCase.key}`;
          const expectedDir = `${caseDir}/expected-output/`;
          const actualDir = `${caseDir}/actual-output/`;

          directoryContains(expectedDir, actualDir).then(result => {
            expect(result).toEqual(true);
            return done();
          });
        });
      });
    });
  });
});