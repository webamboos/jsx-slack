/** @jsxImportSource @webamboos/jsx-slack */
import { beforeEach, describe, expect, it } from "vitest";
import {
  Blocks,
  Call,
  File,
  Input,
  JSXSlack,
  Modal,
  Section,
  WorkflowButton,
} from "@webamboos/jsx-slack";

beforeEach(() => JSXSlack.exactMode(false));

describe("validation and error handling", () => {
  describe("<Blocks> validation", () => {
    it("throws when <Blocks> contains unexpected mrkdwn element", () => {
      expect(() => (
        <Blocks>
          <b>unexpected text</b>
        </Blocks>
      )).toThrow();
    });

    it('throws when <Blocks> contains <Input type="hidden">', () => {
      expect(() => (
        <Blocks>
          <Input type="hidden" name="secret" value="val" />
        </Blocks>
      )).toThrow();
    });

    it('throws when <Blocks> contains <input type="submit">', () => {
      expect(() => (
        <Blocks>
          <input type="submit" value="Submit" />
        </Blocks>
      )).toThrow();
    });

    it("throws when <Section> has incompatible accessory in <Blocks>", () => {
      expect(() => (
        <Blocks>
          {
            {
              type: "section",
              accessory: { type: "invalid_element" },
            } as any
          }
        </Blocks>
      )).toThrow(/incompatible/);
    });

    it("throws when <Actions> has incompatible element", () => {
      expect(() => (
        <Blocks>
          {
            {
              type: "actions",
              elements: [{ type: "not_a_real_element" }],
            } as any
          }
        </Blocks>
      )).toThrow(/incompatible/);
    });

    it("ignores falsey values for v1 compatibility", () => {
      let blocks: any;

      expect(() => {
        // @ts-expect-error string is not a valid child
        blocks = <Blocks>Hello</Blocks>;
      }).not.toThrow();
      expect(blocks).toStrictEqual([]);

      expect(() => {
        // @ts-expect-error falsey expression
        // oxlint-disable-next-line no-constant-binary-expression
        blocks = <Blocks>{"" && <Section>test</Section>}</Blocks>;
      }).not.toThrow();
      expect(blocks).toStrictEqual([]);

      expect(() => {
        // @ts-expect-error falsey expression
        // oxlint-disable-next-line no-constant-binary-expression
        blocks = <Blocks>{0 && <Section>test</Section>}</Blocks>;
      }).not.toThrow();
      expect(blocks).toStrictEqual([]);
    });
  });

  describe("<Modal> validation", () => {
    it("throws when <Modal> contains <File>", () => {
      expect(() =>
        JSXSlack(
          <Modal title="My Modal">
            <File externalId="file_123" />
          </Modal>,
        ),
      ).toThrow();
    });

    it("throws when <Modal> contains <Call>", () => {
      expect(() =>
        JSXSlack(
          <Modal title="My Modal">
            <Call callId="R01234567" />
          </Modal>,
        ),
      ).toThrow();
    });

    it("throws when <Modal> contains <WorkflowButton> in a section", () => {
      expect(() =>
        JSXSlack(
          <Modal title="My Modal">
            <Section>
              <WorkflowButton
                workflow={{ trigger: { url: "https://example.com" } }}
              >
                Launch
              </WorkflowButton>
            </Section>
          </Modal>,
        ),
      ).toThrow();
    });
  });
});
